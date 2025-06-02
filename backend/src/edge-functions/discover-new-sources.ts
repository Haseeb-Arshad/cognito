// Supabase Edge Function: discover-new-sources
// This function discovers new sources for monitoring based on keywords

import { brightDataService } from '../services/brightDataService';
import { openaiService } from '../services/openaiService';
import { dataSources, monitoringProfiles } from '../db/models';
import { SourceType } from '../types';

interface DiscoverSourcesParams {
  profileId: string;
  discoveryKeywords: string[];
  excludedUrls: string[];
}

export async function discoverNewSources(params: DiscoverSourcesParams) {
  const { profileId, discoveryKeywords, excludedUrls } = params;
  
  try {
    // 1. Get the profile to access its configuration
    const profile = await monitoringProfiles.getById(profileId);
    if (!profile) {
      throw new Error(`Profile not found: ${profileId}`);
    }
    
    // 2. Get existing sources to avoid duplicates
    const existingSources = await dataSources.getByProfileId(profileId);
    const existingUrls = existingSources.map(source => source.url);
    
    // Combine excluded URLs and existing URLs to avoid duplicates
    const allExcludedUrls = [...new Set([...excludedUrls, ...existingUrls])];
    
    // 3. Use Bright Data to discover new sources based on keywords
    const discoveredUrls = await brightDataService.discoverSources(
      discoveryKeywords,
      allExcludedUrls
    );
    
    console.log(`Discovered ${discoveredUrls.length} potential new sources`);
    
    // 4. Process each discovered URL
    const newSources = [];
    
    for (const url of discoveredUrls) {
      try {
        // 5. Perform a quick scrape to get content for relevance evaluation
        const scrapeJob = await brightDataService.scrapeUrl(url, discoveryKeywords, {
          saveHtml: false,
          takeScreenshot: false
        });
        
        // Wait for job to complete (in real implementation, would use an async pattern)
        // This is simplified for demonstration
        const jobStatus = await brightDataService.checkJobStatus(scrapeJob.jobId);
        
        if (jobStatus.status !== 'completed' || !jobStatus.result) {
          console.log(`Skipping ${url}: Scrape job not completed`);
          continue;
        }
        
        const content = jobStatus.result.text || '';
        
        // 6. Use AI to evaluate if the source is relevant
        const relevanceEvaluation = await openaiService.evaluateSourceRelevance(
          url,
          content,
          profile.target_entity_description,
          profile.industry_tags
        );
        
        if (!relevanceEvaluation.isRelevant) {
          console.log(`Skipping ${url}: Not relevant (confidence: ${relevanceEvaluation.confidence})`);
          continue;
        }
        
        // 7. Determine source type based on URL and content
        const sourceType = determineSourceType(url);
        
        // 8. Add new source to database
        const newSource = await dataSources.create({
          profile_id: profileId,
          url,
          source_type: sourceType,
          discovered_by_agent: true,
          credibility_score: 0.5, // Default initial score
          status: 'active',
          next_scrape_due_at: new Date().toISOString() // Scrape immediately
        });
        
        console.log(`Added new source: ${newSource.id} - ${url}`);
        newSources.push(newSource);
      } catch (error) {
        console.error(`Error processing discovered URL ${url}:`, error);
        // Continue with other URLs
      }
    }
    
    return {
      success: true,
      message: `Discovered and added ${newSources.length} new sources`,
      newSources
    };
  } catch (error) {
    console.error('Error discovering new sources:', error);
    throw error;
  }
}

// Helper function to determine source type based on URL
function determineSourceType(url: string): SourceType {
  const domain = new URL(url).hostname.toLowerCase();
  
  if (domain.includes('news') || domain.includes('cnn') || domain.includes('bbc') || 
      domain.includes('reuters') || domain.includes('nytimes')) {
    return 'news';
  }
  
  if (domain.includes('twitter') || domain.includes('facebook') || 
      domain.includes('instagram') || domain.includes('linkedin') ||
      domain.includes('tiktok') || domain.includes('youtube')) {
    return 'social';
  }
  
  if (domain.includes('forum') || domain.includes('reddit') || 
      domain.includes('discussion') || domain.includes('community')) {
    return 'forum';
  }
  
  if (domain.includes('blog') || domain.includes('medium') || 
      domain.includes('wordpress') || domain.includes('substack')) {
    return 'blog';
  }
  
  return 'other';
}

// Export handler for Supabase Edge Function
export default async function handler(req: Request) {
  try {
    // Parse request body
    const { profileId, discoveryKeywords, excludedUrls } = await req.json();
    
    if (!profileId || !Array.isArray(discoveryKeywords)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid request. Required: profileId, discoveryKeywords (array)' 
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    const result = await discoverNewSources({
      profileId,
      discoveryKeywords,
      excludedUrls: Array.isArray(excludedUrls) ? excludedUrls : []
    });
    
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
