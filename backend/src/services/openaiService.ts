import OpenAI from 'openai';
import dotenv from 'dotenv';
import { AIProcessingRequest, AIProcessingResponse, CrisisOpportunityFlag } from '../types';

dotenv.config();

// Environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}

export class OpenAIService {
  private openai: OpenAI;
  
  constructor(apiKey = OPENAI_API_KEY) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  /**
   * Process text content with AI to extract insights
   */
  async processContent(request: AIProcessingRequest): Promise<AIProcessingResponse> {
    const { text, targetEntity, keywords, context } = request;
    
    if (!text) {
      throw new Error('Text content is required for AI processing');
    }
    
    try {
      // Create a system prompt that explains the task
      const systemPrompt = `You are an AI assistant specialized in analyzing web content for brand monitoring. 
You analyze text to extract insights about entities (companies, people, products) mentioned in the content.
Provide a concise analysis with the following components:
1. A brief summary of the content (2-3 sentences)
2. Sentiment analysis regarding the target entity (positive, negative, neutral)
3. Important entities mentioned
4. Main topics discussed
5. Assessment of whether this represents a crisis, opportunity, or neutral information for the target entity
6. Potential impact assessment`;

      // Create a user prompt with the content and context
      const userPrompt = `Please analyze the following content${targetEntity ? ` regarding ${targetEntity}` : ''}:
${context ? `Context: ${context}\n` : ''}
${keywords && keywords.length > 0 ? `Relevant keywords: ${keywords.join(', ')}\n` : ''}
Content: ${text}`;

      // Call the OpenAI API
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      });

      // Extract the response
      const responseContent = completion.choices[0].message.content;
      if (!responseContent) {
        throw new Error('Empty response from OpenAI');
      }

      // Parse the JSON response
      const parsedResponse = JSON.parse(responseContent);

      // Map the response to our expected format
      return {
        summary: parsedResponse.summary || 'No summary provided',
        sentiment: {
          label: parsedResponse.sentiment?.label || 'neutral',
          score: parsedResponse.sentiment?.score || 0.5
        },
        entities: parsedResponse.entities || [],
        topics: parsedResponse.topics || [],
        crisisOpportunityFlag: (parsedResponse.crisisOpportunityFlag as CrisisOpportunityFlag) || 'neutral',
        crisisOpportunityScore: parsedResponse.crisisOpportunityScore || 0,
        potentialImpact: parsedResponse.potentialImpact || 'No impact assessment provided'
      };
    } catch (error) {
      console.error('Error processing content with OpenAI:', error);
      throw new Error(`AI processing failed: ${(error as Error).message}`);
    }
  }

  /**
   * Generate embeddings for vector search
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float'
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error(`Failed to generate embedding: ${(error as Error).message}`);
    }
  }

  /**
   * Determine relevance of a source to a target entity
   */
  async evaluateSourceRelevance(
    sourceUrl: string, 
    sourceContent: string, 
    targetEntity: string, 
    industryTags: string[]
  ): Promise<{ isRelevant: boolean; confidence: number; reasoning: string }> {
    try {
      const prompt = `Evaluate if the following source is relevant to monitoring "${targetEntity}" in the ${industryTags.join(', ')} industry.
Source URL: ${sourceUrl}
Source Content: ${sourceContent.substring(0, 1000)}... (truncated)

Please respond with a JSON object containing:
1. isRelevant: boolean (true/false)
2. confidence: number (0-1)
3. reasoning: string (brief explanation)`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an AI that evaluates the relevance of web sources to specific entities and industries.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      });

      const responseContent = completion.choices[0].message.content;
      if (!responseContent) {
        throw new Error('Empty response from OpenAI');
      }

      // Parse the JSON response
      const parsedResponse = JSON.parse(responseContent);
      
      return {
        isRelevant: parsedResponse.isRelevant || false,
        confidence: parsedResponse.confidence || 0.5,
        reasoning: parsedResponse.reasoning || 'No reasoning provided'
      };
    } catch (error) {
      console.error('Error evaluating source relevance:', error);
      throw new Error(`Failed to evaluate source relevance: ${(error as Error).message}`);
    }
  }
}

// Export singleton instance
export const openaiService = new OpenAIService();
