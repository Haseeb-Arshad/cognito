import { supabaseClient, supabaseAdmin } from './supabase';
import {
  MonitoringProfile,
  DataSource,
  RawExtractedContent,
  AIProcessedInsight,
  Alert,
  AlertSeverity,
  AlertStatus
} from '../types';
import { createHash } from 'crypto';

// Monitoring Profiles
export const monitoringProfiles = {
  // Get all profiles for a user
  async getByUserId(userId: string): Promise<MonitoringProfile[]> {
    const { data, error } = await supabaseClient
      .from('monitoring_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as MonitoringProfile[];
  },

  // Get a single profile by ID
  async getById(id: string): Promise<MonitoringProfile | null> {
    const { data, error } = await supabaseClient
      .from('monitoring_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data as MonitoringProfile;
  },

  // Create a new profile
  async create(profile: Omit<MonitoringProfile, 'id' | 'created_at' | 'updated_at'>): Promise<MonitoringProfile> {
    const { data, error } = await supabaseClient
      .from('monitoring_profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data as MonitoringProfile;
  },

  // Update a profile
  async update(id: string, updates: Partial<MonitoringProfile>): Promise<MonitoringProfile> {
    const { data, error } = await supabaseClient
      .from('monitoring_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as MonitoringProfile;
  },

  // Delete a profile
  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from('monitoring_profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get profiles that are due for monitoring
  async getDueForMonitoring(): Promise<MonitoringProfile[]> {
    const { data, error } = await supabaseAdmin
      .from('monitoring_profiles')
      .select('*')
      .eq('status', 'active')
      .or('last_run_at.is.null,last_run_at.lt.now()-interval:interval')
      .order('last_run_at', { ascending: true })
      .limit(10)
      .parameters({ interval: '15 minutes' });

    if (error) throw error;
    return data as MonitoringProfile[];
  }
};

// Data Sources
export const dataSources = {
  // Get all sources for a profile
  async getByProfileId(profileId: string): Promise<DataSource[]> {
    const { data, error } = await supabaseClient
      .from('data_sources')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as DataSource[];
  },

  // Get a single source by ID
  async getById(id: string): Promise<DataSource | null> {
    const { data, error } = await supabaseClient
      .from('data_sources')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data as DataSource;
  },

  // Create a new source
  async create(source: Omit<DataSource, 'id' | 'created_at' | 'updated_at'>): Promise<DataSource> {
    const { data, error } = await supabaseClient
      .from('data_sources')
      .insert(source)
      .select()
      .single();

    if (error) throw error;
    return data as DataSource;
  },

  // Update a source
  async update(id: string, updates: Partial<DataSource>): Promise<DataSource> {
    const { data, error } = await supabaseClient
      .from('data_sources')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as DataSource;
  },

  // Delete a source
  async delete(id: string): Promise<void> {
    const { error } = await supabaseClient
      .from('data_sources')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get sources due for scraping
  async getDueForScraping(limit: number = 20): Promise<DataSource[]> {
    const { data, error } = await supabaseAdmin
      .from('data_sources')
      .select('*')
      .eq('status', 'active')
      .or('next_scrape_due_at.is.null,next_scrape_due_at.lt.now()')
      .order('next_scrape_due_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data as DataSource[];
  }
};

// Raw Extracted Content
export const rawContent = {
  // Get content by ID
  async getById(id: string): Promise<RawExtractedContent | null> {
    const { data, error } = await supabaseClient
      .from('raw_extracted_content')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data as RawExtractedContent;
  },

  // Get content for a profile
  async getByProfileId(profileId: string, limit: number = 20): Promise<RawExtractedContent[]> {
    const { data, error } = await supabaseClient
      .from('raw_extracted_content')
      .select('*')
      .eq('profile_id', profileId)
      .order('scraped_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as RawExtractedContent[];
  },

  // Create new content
  async create(content: Omit<RawExtractedContent, 'id' | 'created_at'>): Promise<RawExtractedContent> {
    // Generate content hash if not provided
    if (!content.content_hash) {
      content.content_hash = createHash('md5')
        .update(content.extracted_text_content)
        .digest('hex');
    }

    const { data, error } = await supabaseClient
      .from('raw_extracted_content')
      .insert(content)
      .select()
      .single();

    if (error) throw error;
    return data as RawExtractedContent;
  },

  // Check if content with the same hash exists
  async contentExists(contentHash: string): Promise<boolean> {
    const { count, error } = await supabaseClient
      .from('raw_extracted_content')
      .select('*', { count: 'exact', head: true })
      .eq('content_hash', contentHash);

    if (error) throw error;
    return count !== null && count > 0;
  },

  // Get unprocessed content
  async getUnprocessed(limit: number = 20): Promise<RawExtractedContent[]> {
    const { data, error } = await supabaseAdmin.rpc('get_unprocessed_content', { limit_count: limit });

    if (error) throw error;
    return data as RawExtractedContent[];
  }
};

// AI Processed Insights
export const insights = {
  // Get by ID
  async getById(id: string): Promise<AIProcessedInsight | null> {
    const { data, error } = await supabaseClient
      .from('ai_processed_insights')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data as AIProcessedInsight;
  },

  // Get insights for a profile
  async getByProfileId(profileId: string, limit: number = 20): Promise<AIProcessedInsight[]> {
    const { data, error } = await supabaseClient
      .from('ai_processed_insights')
      .select('*')
      .eq('profile_id', profileId)
      .order('processed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as AIProcessedInsight[];
  },

  // Create new insight
  async create(insight: Omit<AIProcessedInsight, 'id' | 'created_at'>): Promise<AIProcessedInsight> {
    const { data, error } = await supabaseClient
      .from('ai_processed_insights')
      .insert(insight)
      .select()
      .single();

    if (error) throw error;
    return data as AIProcessedInsight;
  },

  // Similar insights using vector search
  async getSimilarInsights(embedding: number[], profileId: string, limit: number = 5): Promise<AIProcessedInsight[]> {
    const { data, error } = await supabaseClient.rpc('match_insights', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: limit,
      p_profile_id: profileId
    });

    if (error) throw error;
    return data as AIProcessedInsight[];
  }
};

// Alerts
export const alerts = {
  // Get by ID
  async getById(id: string): Promise<Alert | null> {
    const { data, error } = await supabaseClient
      .from('alerts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data as Alert;
  },

  // Get alerts for a profile
  async getByProfileId(profileId: string, status?: AlertStatus, limit: number = 20): Promise<Alert[]> {
    let query = supabaseClient
      .from('alerts')
      .select('*, ai_processed_insights(*)')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as unknown as Alert[];
  },

  // Create new alert
  async create(alert: Omit<Alert, 'id' | 'created_at' | 'updated_at'>): Promise<Alert> {
    const { data, error } = await supabaseClient
      .from('alerts')
      .insert(alert)
      .select()
      .single();

    if (error) throw error;
    return data as Alert;
  },

  // Update alert status
  async updateStatus(id: string, status: AlertStatus, userNotes?: string): Promise<Alert> {
    const updates: Partial<Alert> = { status };
    if (userNotes !== undefined) {
      updates.user_notes = userNotes;
    }

    const { data, error } = await supabaseClient
      .from('alerts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Alert;
  },

  // Get alert counts by severity
  async getCountsBySeverity(profileId: string): Promise<Record<AlertSeverity, number>> {
    const { data, error } = await supabaseClient
      .from('alerts')
      .select('severity')
      .eq('profile_id', profileId)
      .eq('status', 'new');

    if (error) throw error;

    const counts: Record<AlertSeverity, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0
    };

    data.forEach(alert => {
      counts[alert.severity as AlertSeverity]++;
    });

    return counts;
  }
};
