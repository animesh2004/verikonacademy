import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client for the registration API route.
 *
 * Accepts either naming convention:
 *   NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY   (this project's default)
 *   SUPABASE_URL             / SUPABASE_SECRET_KEY         (main Verikon site's names)
 */

const url = () =>
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL ??
  null;

const secretKey = () =>
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_SECRET_KEY ??
  null;

export function getServiceClient(): SupabaseClient | null {
  const u = url();
  const k = secretKey();

  if (!u || !k) return null;

  return createClient(u, k, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const isSupabaseConfigured = () => Boolean(url() && secretKey());
