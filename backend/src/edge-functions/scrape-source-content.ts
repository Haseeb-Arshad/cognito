// Supabase Edge Function: scrape-source-content
// This function scrapes content from a data source

import { brightDataService } from '../services/brightDataService';
import { dataSources, rawContent } from '../db/models';
import { createHash } from 'crypto';
import { processContentWithAI } from './process-content-with-ai';
import { STORAGE_BUCKETS, supabaseAdmin } from '../db/supabase';

interface ScrapeSourceParams {
  dataSourceId: string;
  profileId: string;
  url: string;
  keywords: string[];
}

export async function scrapeSourceContent(params: ScrapeSourceParams) {
  const { dataSourceId, profileId, url, keywords } = params;
  
  try {
    // 1. Get the data source to update its scrape stats
    const source = await dataSources.getById(dataSourceId);
    if (!source) {
      throw new Error(`Data source not found: ${dataSourceId}`);
    }
    
    console.log(`Scraping content from ${url} for profile ${profileId}`);
    
    // 2. Use Bright Data to scrape the content
    const scrapeJob = await brightDataService.scrapeUrl(url, keywords, {
      takeScreenshot: true,
      saveHtml: true,
      interactWithPage: true // Enable browser interactions
    });
    
    // 3. Update data source with job ID
    await dataSources.update(dataSourceId, {
      last_scraped_at: new Date().toISOString(),
    });
    
    // 4. Wait for job to complete (in real implementation, would use an async pattern)
    // This is simplified for demonstration
    const jobStatus = await brightDataService.checkJobStatus(scrapeJob.jobId);
    
    if (jobStatus.status !== 'completed' || !jobStatus.result) {
      throw new Error(`Scrape job failed or timed out: ${scrapeJob.jobId}`);
    }
    
    const result = jobStatus.result;
    
    // 5. Generate content hash to detect duplicates
    const contentHash = createHash('md5')
      .update(result.text || '')
      .digest('hex');
    
    // 6. Check if we already have this content
    const contentExists = await rawContent.contentExists(contentHash);
    if (contentExists) {
      console.log(`Skipping duplicate content: ${contentHash}`);
      
      // 7. Update next scrape time based on source type
      updateNextScrapeTime(dataSourceId, source.source_type);
      
      return {
        success: true,
        message: 'Content already exists, skipped',
        contentHash
      };
    }
    
    // 8. Store HTML snapshot in Storage if available
    let htmlSnapshotUrl = null;
    if (result.html) {
      const filename = `${scrapeJob.jobId}.html`;
      
      const { data, error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKETS.HTML_SNAPSHOTS)
        .upload(filename, Buffer.from(result.html), {
          contentType: 'text/html',
          upsert: true
        });
      
      if (data) {
        htmlSnapshotUrl = data.path;
      } else if (error) {
        console.error('Error saving HTML snapshot:', error);
      }
    }
    
    // 9. Save extracted content to database
    const extractedContent = await rawContent.create({
      data_source_id: dataSourceId,
      profile_id: profileId,
      content_url: url,
      content_hash: contentHash,
      html_snapshot_url: htmlSnapshotUrl,
      extracted_text_content: result.text || '',
      extracted_metadata: result.metadata || {},
      brightdata_job_id: scrapeJob.jobId,
      scraped_at: new Date().toISOString()
    });
    
    console.log(`Saved extracted content: ${extractedContent.id}`);
    
    // 10. Update next scrape time based on source type
    updateNextScrapeTime(dataSourceId, source.source_type);
    
    // 11. Trigger AI processing for the new content
    try {
      await processContentWithAI({
        rawContentId: extractedContent.id,
        generateEmbedding: true
      });
    } catch (error) {
      console.error('Error processing content with AI:', error);
      // Continue even if AI processing fails
    }
    
    return {
      success: true,
      message: 'Content scraped and processed successfully',
      contentId: extractedContent.id
    };
  } catch (error) {
    console.error('Error scraping source content:', error);
    throw error;
  }
}

// Helper function to update next scrape time based on source type
async function updateNextScrapeTime(dataSourceId: string, sourceType: string) {
  let nextScrapeDelay: number;
  
  // Set different scrape frequencies based on source type
  switch (sourceType) {
    case 'news':
      // News sites change frequently - check every 2 hours
      nextScrapeDelay = 2 * 60 * 60 * 1000;
      break;
    case 'social':
      // Social media - check every 4 hours
      nextScrapeDelay = 4 * 60 * 60 * 1000;
      break;
    case 'blog':
      // Blogs - check once per day
      nextScrapeDelay = 24 * 60 * 60 * 1000;
      break;
    case 'forum':
      // Forums - check every 6 hours
      nextScrapeDelay = 6 * 60 * 60 * 1000;
      break;
    default:
      // Default - check once per day
      nextScrapeDelay = 24 * 60 * 60 * 1000;
  }
  
  const nextScrapeDate = new Date(Date.now() + nextScrapeDelay).toISOString();
  
  await dataSources.update(dataSourceId, {
    next_scrape_due_at: nextScrapeDate
  });
}

// Export handler for Supabase Edge Function
export default async function handler(req: Request) {
  try {
    // Parse request body
    const { dataSourceId, profileId, url, keywords } = await req.json();
    
    if (!dataSourceId || !profileId || !url) {
      return new Response(JSON.stringify({ 
        error: 'Invalid request. Required: dataSourceId, profileId, url' 
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    const result = await scrapeSourceContent({
      dataSourceId,
      profileId,
      url,
      keywords: Array.isArray(keywords) ? keywords : []
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
