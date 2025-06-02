-- Enable the necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- For vector similarity searches (bonus)
CREATE EXTENSION IF NOT EXISTS "vector";
-- For scheduled jobs
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Schema: Define Tables

-- monitoring_profiles table
CREATE TABLE monitoring_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_entity_description TEXT NOT NULL,
  keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  industry_tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  source_config JSONB NOT NULL DEFAULT '{
    "initial_seed_urls": [],
    "auto_discover_sources": true,
    "discovery_keywords": [],
    "excluded_urls": [],
    "source_credibility_preferences": {
      "high_trust": [],
      "low_trust": []
    }
  }'::jsonb,
  alert_config JSONB NOT NULL DEFAULT '{
    "sensitivity": "medium",
    "notification_channels": ["in_app"]
  }'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error')),
  last_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- data_sources table
CREATE TABLE data_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES monitoring_profiles(id) ON DELETE SET NULL,
  url TEXT NOT NULL UNIQUE,
  source_type TEXT NOT NULL CHECK (source_type IN ('news', 'social', 'forum', 'blog', 'other')),
  discovered_by_agent BOOLEAN NOT NULL DEFAULT false,
  last_scraped_at TIMESTAMPTZ,
  next_scrape_due_at TIMESTAMPTZ,
  credibility_score FLOAT NOT NULL DEFAULT 0.5 CHECK (credibility_score >= 0.0 AND credibility_score <= 1.0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unreachable', 'requires_attention')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- raw_extracted_content table
CREATE TABLE raw_extracted_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data_source_id UUID NOT NULL REFERENCES data_sources(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES monitoring_profiles(id) ON DELETE CASCADE,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  content_url TEXT NOT NULL,
  content_hash TEXT NOT NULL UNIQUE,
  html_snapshot_url TEXT,
  extracted_text_content TEXT NOT NULL,
  extracted_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  brightdata_job_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ai_processed_insights table
CREATE TABLE ai_processed_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  raw_content_id UUID NOT NULL REFERENCES raw_extracted_content(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES monitoring_profiles(id) ON DELETE CASCADE,
  processed_at TIMESTAMPTZ DEFAULT now(),
  summary_text TEXT NOT NULL,
  sentiment_analysis JSONB NOT NULL,
  identified_entities JSONB NOT NULL DEFAULT '[]'::jsonb,
  topic_classification JSONB NOT NULL DEFAULT '[]'::jsonb,
  crisis_opportunity_flag TEXT NOT NULL CHECK (crisis_opportunity_flag IN ('crisis', 'opportunity', 'neutral', 'mixed')),
  crisis_opportunity_score FLOAT NOT NULL CHECK (crisis_opportunity_score >= -1.0 AND crisis_opportunity_score <= 1.0),
  potential_impact_assessment TEXT,
  llm_prompt_used TEXT,
  llm_response_raw JSONB,
  vector_embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- alerts table
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES monitoring_profiles(id) ON DELETE CASCADE,
  insight_id UUID NOT NULL REFERENCES ai_processed_insights(id) ON DELETE CASCADE,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'acknowledged', 'in_progress', 'resolved', 'dismissed')),
  user_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS) Policies

-- RLS for monitoring_profiles
ALTER TABLE monitoring_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profiles" 
  ON monitoring_profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profiles" 
  ON monitoring_profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profiles" 
  ON monitoring_profiles FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profiles" 
  ON monitoring_profiles FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS for data_sources
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view data sources linked to their profiles" 
  ON data_sources FOR SELECT 
  USING (
    profile_id IS NULL OR 
    profile_id IN (
      SELECT id FROM monitoring_profiles 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert data sources linked to their profiles" 
  ON data_sources FOR INSERT 
  WITH CHECK (
    profile_id IS NULL OR 
    profile_id IN (
      SELECT id FROM monitoring_profiles 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update data sources linked to their profiles" 
  ON data_sources FOR UPDATE 
  USING (
    profile_id IS NULL OR 
    profile_id IN (
      SELECT id FROM monitoring_profiles 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete data sources linked to their profiles" 
  ON data_sources FOR DELETE 
  USING (
    profile_id IS NULL OR 
    profile_id IN (
      SELECT id FROM monitoring_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- RLS for raw_extracted_content
ALTER TABLE raw_extracted_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view content from their profiles" 
  ON raw_extracted_content FOR SELECT 
  USING (
    profile_id IN (
      SELECT id FROM monitoring_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- RLS for ai_processed_insights
ALTER TABLE ai_processed_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view insights from their profiles" 
  ON ai_processed_insights FOR SELECT 
  USING (
    profile_id IN (
      SELECT id FROM monitoring_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- RLS for alerts
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view alerts from their profiles" 
  ON alerts FOR SELECT 
  USING (
    profile_id IN (
      SELECT id FROM monitoring_profiles 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own alerts" 
  ON alerts FOR UPDATE 
  USING (
    profile_id IN (
      SELECT id FROM monitoring_profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Setup scheduled jobs with pg_cron (commented out for safety - enable in production)
-- SELECT cron.schedule('monitoring_cycle', '*/15 * * * *', 'SELECT run_monitoring_cycle()');

-- Create functions
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id)
  VALUES (NEW.id, NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update_timestamp trigger to tables
CREATE TRIGGER update_monitoring_profiles_timestamp
  BEFORE UPDATE ON monitoring_profiles
  FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_data_sources_timestamp
  BEFORE UPDATE ON data_sources
  FOR EACH ROW EXECUTE PROCEDURE update_timestamp();

CREATE TRIGGER update_alerts_timestamp
  BEFORE UPDATE ON alerts
  FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
