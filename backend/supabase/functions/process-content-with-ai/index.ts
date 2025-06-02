// Supabase Edge Function: process-content-with-ai
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
    const { rawContentId, generateEmbedding = true } = await req.json();
    
    if (!rawContentId) {
      return new Response(
        JSON.stringify({ error: "Missing rawContentId parameter" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log(`Processing content with AI for raw content ID: ${rawContentId}`);
    
    // Get raw content details
    const { data: rawContent, error: contentError } = await supabaseClient
      .from("raw_extracted_content")
      .select("id, content, source_id, profile_id, ai_processed")
      .eq("id", rawContentId)
      .single();
    
    if (contentError || !rawContent) {
      return new Response(
        JSON.stringify({ error: `Raw content not found: ${contentError?.message}` }),
        { headers: { "Content-Type": "application/json" }, status: 404 }
      );
    }
    
    // Check if already processed
    if (rawContent.ai_processed) {
      console.log(`Content ${rawContentId} already processed, skipping`);
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Content already processed",
          rawContentId
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Get source details
    const { data: source, error: sourceError } = await supabaseClient
      .from("data_sources")
      .select("id, name, url, source_type")
      .eq("id", rawContent.source_id)
      .single();
    
    if (sourceError || !source) {
      console.error(`Error fetching source: ${sourceError?.message}`);
      // Continue processing even if source details aren't available
    }
    
    // Get profile details for alert configuration
    const { data: profile, error: profileError } = await supabaseClient
      .from("monitoring_profiles")
      .select("id, name, alert_config, keywords")
      .eq("id", rawContent.profile_id)
      .single();
    
    if (profileError || !profile) {
      console.error(`Error fetching profile: ${profileError?.message}`);
      // Continue processing even if profile details aren't available
    }
    
    // Process content with OpenAI
    async function processWithAI(content: string, context: any) {
      try {
        console.log(`Processing content of length ${content.length} with AI`);
        
        // Limit content length to avoid token limits
        const truncatedContent = content.length > 8000 
          ? content.substring(0, 8000) + "... (content truncated)"
          : content;
        
        const prompt = `
          Analyze the following content from a monitoring source:
          
          SOURCE URL: ${context.url || 'Unknown'}
          SOURCE TYPE: ${context.sourceType || 'Unknown'}
          MONITORING KEYWORDS: ${context.keywords?.join(", ") || 'None provided'}
          
          CONTENT:
          ${truncatedContent}
          
          Provide a comprehensive analysis in the following JSON format:
          {
            "summary": "A concise 2-3 sentence summary of the content",
            "sentiment": "positive/neutral/negative",
            "sentiment_score": <number between -1 and 1>,
            "entities": [
              {"name": "Entity Name", "type": "person/organization/product/location/other", "importance": <1-5>}
            ],
            "topics": ["Topic 1", "Topic 2"],
            "is_crisis": <boolean>,
            "is_opportunity": <boolean>,
            "crisis_explanation": "Explanation if a crisis is detected",
            "opportunity_explanation": "Explanation if an opportunity is detected",
            "impact_assessment": {
              "business": <1-5>,
              "market": <1-5>,
              "reputation": <1-5>
            },
            "key_insights": ["Insight 1", "Insight 2"]
          }
          
          Respond ONLY with the JSON object, no other text.
        `;
        
        const response = await openai.createChatCompletion({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are an AI that analyzes content and extracts insights." },
            { role: "user", content: prompt }
          ],
          temperature: 0.2,
          response_format: { type: "json_object" }
        });
        
        const content = response.data.choices[0]?.message?.content || "{}";
        return JSON.parse(content);
      } catch (error) {
        console.error(`Error processing with AI: ${error}`);
        throw new Error(`AI processing error: ${error}`);
      }
    }
    
    // Generate embeddings for vector search
    async function generateEmbeddings(content: string) {
      try {
        console.log(`Generating embeddings for content`);
        
        // Limit content length for embedding
        const truncatedContent = content.length > 8000 
          ? content.substring(0, 8000)
          : content;
        
        const response = await openai.createEmbedding({
          model: "text-embedding-3-small",
          input: truncatedContent
        });
        
        return response.data.data[0].embedding;
      } catch (error) {
        console.error(`Error generating embeddings: ${error}`);
        return null;
      }
    }
    
    // Process the content
    const aiResult = await processWithAI(rawContent.content, {
      url: source?.url,
      sourceType: source?.source_type,
      keywords: profile?.keywords
    });
    
    // Generate embeddings if requested
    let embedding = null;
    if (generateEmbedding) {
      embedding = await generateEmbeddings(rawContent.content);
    }
    
    // Store AI insights
    const { data: insight, error: insightError } = await supabaseClient
      .from("ai_processed_insights")
      .insert({
        raw_content_id: rawContentId,
        source_id: rawContent.source_id,
        profile_id: rawContent.profile_id,
        summary: aiResult.summary,
        sentiment: aiResult.sentiment,
        sentiment_score: aiResult.sentiment_score,
        entities: aiResult.entities,
        topics: aiResult.topics,
        is_crisis: aiResult.is_crisis,
        is_opportunity: aiResult.is_opportunity,
        crisis_explanation: aiResult.crisis_explanation,
        opportunity_explanation: aiResult.opportunity_explanation,
        impact_assessment: aiResult.impact_assessment,
        key_insights: aiResult.key_insights,
        content_embedding: embedding,
        processed_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (insightError) {
      console.error(`Error storing AI insights: ${insightError.message}`);
      throw new Error(`Error storing AI insights: ${insightError.message}`);
    }
    
    console.log(`Stored AI insights with ID: ${insight.id}`);
    
    // Mark raw content as processed
    await supabaseClient
      .from("raw_extracted_content")
      .update({ ai_processed: true })
      .eq("id", rawContentId);
    
    // Generate alerts if crisis or opportunity detected
    let alertId = null;
    
    // Get the alert sensitivity threshold from profile
    const alertSensitivity = profile?.alert_config?.sensitivity || 'medium';
    const shouldGenerateAlert = (
      (aiResult.is_crisis && (alertSensitivity === 'low' || alertSensitivity === 'medium' || alertSensitivity === 'high')) ||
      (aiResult.is_opportunity && (alertSensitivity === 'medium' || alertSensitivity === 'high')) ||
      (aiResult.sentiment === 'negative' && aiResult.sentiment_score < -0.7 && (alertSensitivity === 'medium' || alertSensitivity === 'high')) ||
      (aiResult.impact_assessment?.business > 3 && alertSensitivity === 'high')
    );
    
    if (shouldGenerateAlert) {
      // Determine alert severity
      let severity = 'info';
      let title = '';
      
      if (aiResult.is_crisis) {
        severity = 'critical';
        title = `CRISIS ALERT: ${aiResult.summary.substring(0, 100)}`;
      } else if (aiResult.is_opportunity) {
        severity = 'medium';
        title = `OPPORTUNITY: ${aiResult.summary.substring(0, 100)}`;
      } else if (aiResult.sentiment === 'negative' && aiResult.sentiment_score < -0.7) {
        severity = 'high';
        title = `NEGATIVE SENTIMENT: ${aiResult.summary.substring(0, 100)}`;
      } else {
        severity = 'low';
        title = `INSIGHT: ${aiResult.summary.substring(0, 100)}`;
      }
      
      try {
        // Generate alert
        const alertResp = await fetch(
          `${Deno.env.get("SUPABASE_URL")}/functions/v1/generate-alert`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
            },
            body: JSON.stringify({ 
              insightId: insight.id,
              profileId: rawContent.profile_id,
              severity,
              title
            }),
          }
        );
        
        if (alertResp.ok) {
          const alertResult = await alertResp.json();
          alertId = alertResult.alertId;
          console.log(`Generated alert with ID: ${alertId}`);
        } else {
          console.error(`Error generating alert: ${await alertResp.text()}`);
        }
      } catch (alertError) {
        console.error(`Error generating alert: ${alertError}`);
      }
    } else {
      console.log(`No alert generated based on sensitivity settings: ${alertSensitivity}`);
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Content processed successfully",
        insightId: insight.id,
        alertId,
        alertGenerated: alertId !== null,
        summary: aiResult.summary
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in process-content-with-ai function:", error);
    
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
