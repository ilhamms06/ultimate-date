import { createClient } from "@supabase/supabase-js";

/**
 * Browser (anon) Supabase client — safe to use in client components.
 * Guarded so the app still renders when env vars are absent (falls back
 * to bundled defaults everywhere it's consumed).
 */
let cached = null;

export function getBrowserClient() {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  cached = createClient(url, key, {
    auth: { persistSession: false },
  });
  return cached;
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
