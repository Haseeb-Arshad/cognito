import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate required env vars
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error('Missing required Supabase environment variables');
}

// Create Supabase clients
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Service role client for admin operations (use with caution)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Helper function to get authenticated client for a user
export const getAuthenticatedClient = (jwt: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  });
};

// Export Supabase storage bucket names
export const STORAGE_BUCKETS = {
  HTML_SNAPSHOTS: 'html-snapshots',
};

// Initialize storage buckets if they don't exist
export const initializeStorage = async () => {
  try {
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketNames = buckets?.map(bucket => bucket.name) || [];
    
    for (const bucketName of Object.values(STORAGE_BUCKETS)) {
      if (!bucketNames.includes(bucketName)) {
        await supabaseAdmin.storage.createBucket(bucketName, {
          public: false,
          fileSizeLimit: 10485760, // 10MB
        });
        console.log(`Created storage bucket: ${bucketName}`);
      }
    }
  } catch (error) {
    console.error('Error initializing storage buckets:', error);
  }
};
