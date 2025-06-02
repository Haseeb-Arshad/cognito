// Supabase Edge Function: discover-new-sources
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@4.20.1";

// Create a Supabase client with the Auth context of the function
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Initialize OpenAI client
const openai = new OpenAIApi(new Configuration({
  apiKey: Deno.env.get("OPENAI_API_KEY") ?? "",
}));

serve(async (req) => {
  try {
    // Parse request
    const { profileId } = await req.json();
    
    if (!profileId) {
      return new Response(
        JSON.stringify({ error: "Missing profileId parameter" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log(`Discovering new sources for profile: ${profileId}`);
    
    // Get profile details
    const { data: profile, error: profileError } = await supabaseClient
      .from("monitoring_profiles")
      .select("id, name, keywords, user_id")
      .eq("id", profileId)
      .single();
    
    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: `Profile not found: ${profileError?.message}` }),
        { headers: { "Content-Type": "application/json" }, status: 404 }
      );
    }
    
    // Get existing sources to avoid duplicates
    const { data: existingSources, error: sourcesError } = await supabaseClient
      .from("data_sources")
      .select("url")
      .eq("profile_id", profileId);
    
    if (sourcesError) {
      console.error(`Error fetching existing sources: ${sourcesError.message}`);
    }
    
    const existingUrls = new Set((existingSources || []).map(s => s.url.toLowerCase()));
    console.log(`Found ${existingUrls.size} existing sources`);
    
    // Mock Bright Data API call for discovery
    // In production, this would be a real API call to Bright Data's web scraping services
    async function discoverSourcesFromKeywords(keywords: string[]) {
      console.log(`Searching for sources with keywords: ${keywords.join(", ")}`);
      
      // In production, replace with actual Bright Data API call
      // This is a simulated response for demonstration
      const mockResults = [
        {
          url: "https://example.com/industry-news",
          title: "Industry News Hub",
          description: "Latest updates on industry trends and news",
          sourceType: "website"
        },
        {
          url: "https://blog.competitor.com/insights",
          title: "Competitor Insights Blog",
          description: "Strategic analysis and market insights",
          sourceType: "website"
        },
        {
          url: "https://news.domain.com/tech",
          title: "Technology News",
          description: "Breaking news in technology sector",
          sourceType: "news"
        },
        {
          url: "https://reddit.com/r/industrytrends",
          title: "Industry Trends Subreddit",
          description: "Community discussions on industry trends",
          sourceType: "reddit"
        },
        {
          url: "https://rss.news.com/industry.xml",
          title: "Industry News RSS Feed",
          description: "RSS feed for industry news",
          sourceType: "rss"
        }
      ];
      
      // Filter out existing sources
      return mockResults.filter(source => !existingUrls.has(source.url.toLowerCase()));
    }
    
    // Evaluate source relevance with OpenAI
    async function evaluateSourceRelevance(source: any, keywords: string[]) {
      try {
        const prompt = `
          Evaluate the relevance of the following source to the keywords: ${keywords.join(", ")}
          
          Source URL: ${source.url}
          Source Title: ${source.title}
          Source Description: ${source.description}
          
          Respond with a JSON object containing:
          1. relevanceScore - a number between 0 and 1, where 1 is highly relevant
          2. reasoning - a brief explanation of the score
        `;
        
        const response = await openai.createChatCompletion({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are an AI that evaluates the relevance of sources to keywords." },
            { role: "user", content: prompt }
          ],
          temperature: 0.3
        });
        
        const content = response.data.choices[0]?.message?.content || "";
        const result = JSON.parse(content);
        
        return {
          ...source,
          relevanceScore: result.relevanceScore,
          relevanceReasoning: result.reasoning
        };
      } catch (error) {
        console.error(`Error evaluating source relevance: ${error}`);
        // Return a default medium relevance if evaluation fails
        return {
          ...source,
          relevanceScore: 0.5,
          relevanceReasoning: "Error evaluating source. Assigned medium relevance by default."
        };
      }
    }
    
    // Discover new sources
    const discoveredSources = await discoverSourcesFromKeywords(profile.keywords);
    console.log(`Discovered ${discoveredSources.length} new potential sources`);
    
    // Evaluate and filter sources for relevance
    const evaluatedSources = [];
    for (const source of discoveredSources) {
      const evaluatedSource = await evaluateSourceRelevance(source, profile.keywords);
      
      // Only keep sources with relevance score above 0.6
      if (evaluatedSource.relevanceScore >= 0.6) {
        evaluatedSources.push(evaluatedSource);
      }
    }
    
    console.log(`After relevance filtering, keeping ${evaluatedSources.length} sources`);
    
    // Add new sources to the database
    const addedSources = [];
    for (const source of evaluatedSources) {
      // Calculate next scrape time
      const nextScrapeAt = new Date();
      nextScrapeAt.setHours(nextScrapeAt.getHours() + 24); // Default to 24 hours for new sources
      
      const { data, error } = await supabaseClient
        .from("data_sources")
        .insert({
          profile_id: profileId,
          name: source.title,
          url: source.url,
          source_type: source.sourceType,
          scrape_config: {
            selectors: [],
            capture_screenshot: true,
            save_html: true
          },
          frequency_hours: 24,
          enabled: true,
          discovered_at: new Date().toISOString(),
          relevance_score: source.relevanceScore,
          relevance_notes: source.relevanceReasoning,
          next_scrape_at: nextScrapeAt.toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error(`Error adding source ${source.url}: ${error.message}`);
      } else {
        addedSources.push(data);
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Discovered and added ${addedSources.length} new sources`,
        addedSources
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in discover-new-sources function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: (error instanceof Error) ? error.message : String(error)
      }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
