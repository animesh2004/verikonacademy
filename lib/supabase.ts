import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client for the registration API route.
 *
 * Accepts either naming convention so this can point at a fresh project or reuse the
 * one the main Verikon site already uses:
 *   NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY   (this project's default)
 *   SUPABASE_URL             / SUPABASE_SECRET_KEY         (main Verikon site's names)
 *
 * The key must be a secret/service-role key, not an anon key — the registrations table
 * has RLS on with no public write policy, so an anon key will be rejected.
 *
 * Returns null when nothing is configured, which lets the site run (and the form fail
 * loudly rather than silently) before Supabase is wired up.
 */

const url = () => process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? null;

const secretKey = () =>
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY ?? null;

export function getServiceClient(): SupabaseClient | null {
  const u = url();
  const k = secretKey();

  if (!u || !k) return null;

  return createClient(u, k, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const isSupabaseConfigured = () => Boolean(url() && secretKey());
