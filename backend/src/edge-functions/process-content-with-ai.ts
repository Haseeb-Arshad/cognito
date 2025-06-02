// Supabase Edge Function: process-content-with-ai
// This function processes raw content with AI to extract insights

import { openaiService } from '../services/openaiService';
import { rawContent, insights, monitoringProfiles, alerts } from '../db/models';
import { AlertSeverity, CrisisOpportunityFlag } from '../types';
import { generateAlert } from './generate-alert';

interface ProcessContentParams {
  rawContentId: string;
  generateEmbedding?: boolean;
}

export async function processContentWithAI(params: ProcessContentParams) {
  const { rawContentId, generateEmbedding = true } = params;
  
  try {
    // 1. Get the raw content to process
    const content = await rawContent.getById(rawContentId);
    if (!content) {
      throw new Error(`Raw content not found: ${rawContentId}`);
    }
    
    // 2. Get the monitoring profile to access entity and config
    const profile = await monitoringProfiles.getById(content.profile_id);
    if (!profile) {
      throw new Error(`Profile not found: ${content.profile_id}`);
    }
    
    console.log(`Processing content ${rawContentId} with AI for profile ${profile.id}`);
    
    // 3. Prepare the AI processing request
    const text = content.extracted_text_content;
    const promptTemplate = `
    Analyze the following text regarding ${profile.target_entity_description}.
    Consider these keywords: ${profile.keywords.join(', ')}.
    Industry context: ${profile.industry_tags.join(', ')}.
    Source URL: ${content.content_url}
    `;
    
    // 4. Process the content with OpenAI
    const aiResult = await openaiService.processContent({
      text,
      targetEntity: profile.target_entity_description,
      keywords: profile.keywords,
      context: promptTemplate
    });
    
    // 5. Generate embedding for vector search if requested
    let embedding = undefined;
    if (generateEmbedding) {
      try {
        // Generate embedding from the summary text for more efficient storage
        embedding = await openaiService.generateEmbedding(aiResult.summary);
      } catch (error) {
        console.error('Error generating embedding:', error);
        // Continue without embedding if it fails
      }
    }
    
    // 6. Save the AI insights to the database
    const aiInsight = await insights.create({
      raw_content_id: rawContentId,
      profile_id: profile.id,
      processed_at: new Date().toISOString(),
      summary_text: aiResult.summary,
      sentiment_analysis: {
        label: aiResult.sentiment.label,
        score: aiResult.sentiment.score,
        details: {} // Additional details could be added here
      },
      identified_entities: aiResult.entities,
      topic_classification: aiResult.topics,
      crisis_opportunity_flag: aiResult.crisisOpportunityFlag,
      crisis_opportunity_score: aiResult.crisisOpportunityScore,
      potential_impact_assessment: aiResult.potentialImpact,
      llm_prompt_used: promptTemplate,
      llm_response_raw: aiResult,
      vector_embedding: embedding
    });
    
    console.log(`Saved AI insight: ${aiInsight.id}`);
    
    // 7. Determine if an alert should be generated
    const shouldGenerateAlert = determineAlertNecessity(
      aiResult.crisisOpportunityFlag,
      aiResult.crisisOpportunityScore,
      aiResult.sentiment.label,
      aiResult.sentiment.score,
      profile.alert_config.sensitivity
    );
    
    if (shouldGenerateAlert) {
      // 8. Generate and save alert
      try {
        const alertSeverity = determineAlertSeverity(
          aiResult.crisisOpportunityFlag,
          aiResult.crisisOpportunityScore
        );
        
        await generateAlert({
          insightId: aiInsight.id,
          profileId: profile.id,
          severity: alertSeverity,
          title: `${aiResult.crisisOpportunityFlag === 'crisis' ? '⚠️ ' : aiResult.crisisOpportunityFlag === 'opportunity' ? '✅ ' : ''}${aiResult.summary.substring(0, 100)}...`
        });
      } catch (error) {
        console.error('Error generating alert:', error);
        // Continue even if alert generation fails
      }
    }
    
    return {
      success: true,
      message: 'Content processed successfully with AI',
      insightId: aiInsight.id,
      generatedAlert: shouldGenerateAlert
    };
  } catch (error) {
    console.error('Error processing content with AI:', error);
    throw error;
  }
}

// Helper function to determine if an alert should be generated
function determineAlertNecessity(
  crisisOpportunityFlag: CrisisOpportunityFlag,
  crisisOpportunityScore: number,
  sentimentLabel: string,
  sentimentScore: number,
  sensitivity: string
): boolean {
  // Convert sensitivity to a threshold value
  let threshold: number;
  switch (sensitivity) {
    case 'low':
      threshold = 0.7; // Only high-impact events trigger alerts
      break;
    case 'medium':
      threshold = 0.5; // Moderate-impact events trigger alerts
      break;
    case 'high':
      threshold = 0.3; // Most events trigger alerts
      break;
    default:
      threshold = 0.5; // Default to medium
  }
  
  // Crisis events
  if (crisisOpportunityFlag === 'crisis' && Math.abs(crisisOpportunityScore) >= threshold) {
    return true;
  }
  
  // Opportunity events
  if (crisisOpportunityFlag === 'opportunity' && crisisOpportunityScore >= threshold) {
    return true;
  }
  
  // Strongly negative sentiment might trigger alert even for neutral events
  if (sentimentLabel === 'negative' && sentimentScore >= threshold + 0.2) {
    return true;
  }
  
  // Mixed events are handled based on sensitivity
  if (crisisOpportunityFlag === 'mixed' && Math.abs(crisisOpportunityScore) >= threshold) {
    return true;
  }
  
  return false;
}

// Helper function to determine alert severity
function determineAlertSeverity(
  crisisOpportunityFlag: CrisisOpportunityFlag,
  crisisOpportunityScore: number
): AlertSeverity {
  // Crisis events
  if (crisisOpportunityFlag === 'crisis') {
    if (Math.abs(crisisOpportunityScore) >= 0.8) return 'critical';
    if (Math.abs(crisisOpportunityScore) >= 0.6) return 'high';
    if (Math.abs(crisisOpportunityScore) >= 0.4) return 'medium';
    return 'low';
  }
  
  // Opportunity events
  if (crisisOpportunityFlag === 'opportunity') {
    if (crisisOpportunityScore >= 0.8) return 'high';
    if (crisisOpportunityScore >= 0.6) return 'medium';
    return 'low';
  }
  
  // Mixed events
  if (crisisOpportunityFlag === 'mixed') {
    if (Math.abs(crisisOpportunityScore) >= 0.6) return 'medium';
    return 'low';
  }
  
  // Neutral events
  return 'info';
}

// Export handler for Supabase Edge Function
export default async function handler(req: Request) {
  try {
    // Parse request body
    const { rawContentId, generateEmbedding } = await req.json();
    
    if (!rawContentId) {
      return new Response(JSON.stringify({ 
        error: 'Invalid request. Required: rawContentId' 
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    const result = await processContentWithAI({
      rawContentId,
      generateEmbedding
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
