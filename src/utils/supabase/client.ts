import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Singleton instance
let supabaseInstance: SupabaseClient | null = null;

/**
 * Get or create a single Supabase client instance
 * This prevents multiple instances from being created which can cause auth issues
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          storageKey: `sb-${projectId}-auth-token`,
        },
      }
    );
  }
  
  return supabaseInstance;
}

/**
 * Reset the client instance (useful for testing or logout)
 */
export function resetSupabaseClient(): void {
  supabaseInstance = null;
}
