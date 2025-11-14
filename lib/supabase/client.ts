/**
 * Supabase browser client
 * Use this in Client Components
 */

import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/lib/env';

export function createClient() {
  return createBrowserClient(
    env.supabaseUrl,
    env.supabaseAnonKey
  );
}
