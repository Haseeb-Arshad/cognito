// Supabase Edge Function: scrape-source-content
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

// Create a Supabase client with the Auth context of the function
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Generate MD5 hash for content deduplication
async function generateContentHash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("MD5", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  try {
    // Parse request
    const { sourceId } = await req.json();
    
    if (!sourceId) {
      return new Response(
        JSON.stringify({ error: "Missing sourceId parameter" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log(`Scraping content for source: ${sourceId}`);
    
    // Get source details
    const { data: source, error: sourceError } = await supabaseClient
      .from("data_sources")
      .select("id, name, url, source_type, scrape_config, profile_id")
      .eq("id", sourceId)
      .single();
    
    if (sourceError || !source) {
      return new Response(
        JSON.stringify({ error: `Source not found: ${sourceError?.message}` }),
        { headers: { "Content-Type": "application/json" }, status: 404 }
      );
    }
    
    // Get profile details to know user settings
    const { data: profile, error: profileError } = await supabaseClient
      .from("monitoring_profiles")
      .select("id, user_id")
      .eq("id", source.profile_id)
      .single();
    
    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: `Profile not found: ${profileError?.message}` }),
        { headers: { "Content-Type": "application/json" }, status: 404 }
      );
    }
    
    // Mock Bright Data API call for scraping
    // In production, this would be a real API call to Bright Data's web scraping services
    async function scrapeContent(url: string, config: any) {
      console.log(`Scraping URL: ${url} with config: ${JSON.stringify(config)}`);
      
      // Simulate a delay for the scraping operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This is a simulated response for demonstration
      // In production, this would be actual scraped content from Bright Data
      const mockResponse = {
        success: true,
        htmlContent: `
          <html>
            <head>
              <title>Sample Scraped Page - ${new Date().toISOString()}</title>
            </head>
            <body>
              <h1>Breaking News: Important Update</h1>
              <p>This is a simulated scraped content for demonstration purposes.</p>
              <p>URL: ${url}</p>
              <p>Timestamp: ${new Date().toISOString()}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. 
                 Maecenas euismod, nisi vel ultricies lacinia, nisl nunc ultricies nisi, 
                 vitae ultricies nisl nunc eget nisi.</p>
              <p>This content contains keywords that might trigger alerts about industry changes,
                 product launches, market shifts, and competitive intelligence.</p>
            </body>
          </html>
        `,
        textContent: `
          Breaking News: Important Update
          
          This is a simulated scraped content for demonstration purposes.
          URL: ${url}
          Timestamp: ${new Date().toISOString()}
          
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.
          Maecenas euismod, nisi vel ultricies lacinia, nisl nunc ultricies nisi,
          vitae ultricies nisl nunc eget nisi.
          
          This content contains keywords that might trigger alerts about industry changes,
          product launches, market shifts, and competitive intelligence.
        `,
        screenshot: config.capture_screenshot ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" : null,
        timestamp: new Date().toISOString()
      };
      
      return mockResponse;
    }
    
    // Scrape the content
    const scrapeConfig = source.scrape_config || {
      selectors: [],
      capture_screenshot: true,
      save_html: true
    };
    
    const scrapedContent = await scrapeContent(source.url, scrapeConfig);
    
    // Generate content hash for deduplication
    const contentHash = await generateContentHash(scrapedContent.textContent);
    
    // Check if content with this hash already exists
    const { data: existingContent, error: existingContentError } = await supabaseClient
      .from("raw_extracted_content")
      .select("id")
      .eq("content_hash", contentHash)
      .eq("source_id", sourceId)
      .limit(1);
    
    if (existingContentError) {
      console.error(`Error checking for existing content: ${existingContentError.message}`);
    }
    
    // Save snapshot to storage if enabled
    let snapshotUrl = null;
    if (scrapeConfig.save_html) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `${source.id}_${timestamp}.html`;
      const filePath = `${profile.user_id}/${source.id}/${fileName}`;
      
      const { error: storageError } = await supabaseClient
        .storage
        .from('html-snapshots')
        .upload(filePath, scrapedContent.htmlContent, {
          contentType: 'text/html',
          cacheControl: '3600'
        });
      
      if (storageError) {
        console.error(`Error saving HTML snapshot: ${storageError.message}`);
      } else {
        snapshotUrl = filePath;
      }
    }
    
    // Save screenshot if captured
    let screenshotUrl = null;
    if (scrapeConfig.capture_screenshot && scrapedContent.screenshot) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `${source.id}_${timestamp}.png`;
      const filePath = `${profile.user_id}/${source.id}/${fileName}`;
      
      // Remove the data:image/png;base64, prefix
      const base64Data = scrapedContent.screenshot.split(',')[1];
      const binaryData = base64Encode(base64Data);
      
      const { error: storageError } = await supabaseClient
        .storage
        .from('screenshots')
        .upload(filePath, binaryData, {
          contentType: 'image/png',
          cacheControl: '3600'
        });
      
      if (storageError) {
        console.error(`Error saving screenshot: ${storageError.message}`);
      } else {
        screenshotUrl = filePath;
      }
    }
    
    // Only store content if it's new (doesn't exist with same hash)
    let contentId = null;
    if (!existingContent || existingContent.length === 0) {
      const { data: newContent, error: insertError } = await supabaseClient
        .from("raw_extracted_content")
        .insert({
          source_id: sourceId,
          profile_id: source.profile_id,
          content: scrapedContent.textContent,
          content_hash: contentHash,
          extracted_at: new Date().toISOString(),
          html_snapshot_url: snapshotUrl,
          screenshot_url: screenshotUrl,
          metadata: {
            url: source.url,
            source_type: source.source_type,
            scrape_config: scrapeConfig
          },
          ai_processed: false
        })
        .select()
        .single();
      
      if (insertError) {
        console.error(`Error inserting new content: ${insertError.message}`);
      } else {
        contentId = newContent.id;
        console.log(`Stored new content with ID: ${contentId}`);
        
        // Trigger AI processing
        try {
          const processResp = await fetch(
            `${Deno.env.get("SUPABASE_URL")}/functions/v1/process-content-with-ai`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
              },
              body: JSON.stringify({ 
                rawContentId: contentId,
                generateEmbedding: true
              }),
            }
          );
          
          if (!processResp.ok) {
            console.error(`Error triggering AI processing: ${await processResp.text()}`);
          }
        } catch (processError) {
          console.error(`Error triggering AI processing: ${processError}`);
        }
      }
    } else {
      console.log(`Content with hash ${contentHash} already exists, skipping storage`);
      contentId = existingContent[0].id;
    }
    
    // Update source's last_scraped_at and next_scrape_at
    const nextScrapeAt = new Date();
    nextScrapeAt.setHours(nextScrapeAt.getHours() + (source.frequency_hours || 24));
    
    await supabaseClient
      .from("data_sources")
      .update({
        last_scraped_at: new Date().toISOString(),
        next_scrape_at: nextScrapeAt.toISOString()
      })
      .eq("id", sourceId);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: existingContent && existingContent.length > 0 
          ? "Content already exists, skipped storage" 
          : "Content scraped and stored successfully",
        contentId,
        contentHash,
        snapshotUrl,
        screenshotUrl
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in scrape-source-content function:", error);
    
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
