import { supabaseClient } from '../db/supabase';

/**
 * Verify a JWT token from Supabase Auth
 * @param token JWT token from client
 * @returns User data if valid, null if invalid
 */
export async function verifyToken(token: string) {
  try {
    const { data, error } = await supabaseClient.auth.getUser(token);
    
    if (error) {
      console.error('Token verification error:', error);
      return null;
    }
    
    return data.user;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Generate a signed URL for accessing private storage files
 * @param bucket Storage bucket name
 * @param path File path within the bucket
 * @param expiresIn Expiration in seconds (default 1 hour)
 * @returns Signed URL or null if error
 */
export async function generateSignedUrl(bucket: string, path: string, expiresIn = 3600) {
  try {
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
    
    if (error) {
      console.error('Error generating signed URL:', error);
      return null;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
}
