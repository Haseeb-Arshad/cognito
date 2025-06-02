// Global types for the backend

export type MonitoringProfileStatus = 'active' | 'paused' | 'error';
export type AlertSensitivity = 'low' | 'medium' | 'high';
export type NotificationChannel = 'in_app' | 'email' | 'webhook';
export type SourceType = 'news' | 'social' | 'forum' | 'blog' | 'other';
export type SourceStatus = 'active' | 'unreachable' | 'requires_attention';
export type CrisisOpportunityFlag = 'crisis' | 'opportunity' | 'neutral' | 'mixed';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type AlertStatus = 'new' | 'acknowledged' | 'in_progress' | 'resolved' | 'dismissed';

// Database models
export interface MonitoringProfile {
  id: string;
  user_id: string;
  name: string;
  target_entity_description: string;
  keywords: string[];
  industry_tags: string[];
  source_config: {
    initial_seed_urls: string[];
    auto_discover_sources: boolean;
    discovery_keywords: string[];
    excluded_urls: string[];
    source_credibility_preferences: {
      high_trust: string[];
      low_trust: string[];
    };
  };
  alert_config: {
    sensitivity: AlertSensitivity;
    notification_channels: NotificationChannel[];
  };
  status: MonitoringProfileStatus;
  last_run_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DataSource {
  id: string;
  profile_id: string | null;
  url: string;
  source_type: SourceType;
  discovered_by_agent: boolean;
  last_scraped_at: string | null;
  next_scrape_due_at: string | null;
  credibility_score: number;
  status: SourceStatus;
  created_at: string;
  updated_at: string;
}

export interface RawExtractedContent {
  id: string;
  data_source_id: string;
  profile_id: string;
  scraped_at: string;
  content_url: string;
  content_hash: string;
  html_snapshot_url: string | null;
  extracted_text_content: string;
  extracted_metadata: Record<string, any>;
  brightdata_job_id: string | null;
  created_at: string;
}

export interface AIProcessedInsight {
  id: string;
  raw_content_id: string;
  profile_id: string;
  processed_at: string;
  summary_text: string;
  sentiment_analysis: {
    label: string;
    score: number;
    details?: Record<string, any>;
  };
  identified_entities: Array<{
    text: string;
    type: string;
    relevance?: number;
  }>;
  topic_classification: string[];
  crisis_opportunity_flag: CrisisOpportunityFlag;
  crisis_opportunity_score: number;
  potential_impact_assessment: string | null;
  llm_prompt_used: string | null;
  llm_response_raw: Record<string, any> | null;
  vector_embedding?: number[];
  created_at: string;
}

export interface Alert {
  id: string;
  profile_id: string;
  insight_id: string;
  severity: AlertSeverity;
  title: string;
  status: AlertStatus;
  user_notes: string | null;
  created_at: string;
  updated_at: string;
}

// Bright Data types
export interface BrightDataScrapingJob {
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: BrightDataScrapingResult;
  error?: string;
}

export interface BrightDataScrapingResult {
  url: string;
  html?: string;
  text?: string;
  metadata?: Record<string, any>;
  screenshot?: string;
  elements?: Record<string, any>[];
}

// OpenAI types
export interface AIProcessingRequest {
  text: string;
  targetEntity?: string;
  keywords?: string[];
  context?: string;
}

export interface AIProcessingResponse {
  summary: string;
  sentiment: {
    label: string;
    score: number;
  };
  entities: Array<{
    text: string;
    type: string;
  }>;
  topics: string[];
  crisisOpportunityFlag: CrisisOpportunityFlag;
  crisisOpportunityScore: number;
  potentialImpact: string;
}
