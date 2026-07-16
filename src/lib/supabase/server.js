import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the SERVICE-ROLE key. Bypasses RLS.
 * MUST only be imported from server code (API routes, server components).
 * Never ship this to the browser.
 */
let cached = null;

export function getServiceClient() {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

/** Anon-key client for server-side public reads (e.g. generateMetadata). */
let cachedAnon = null;

export function getServerAnonClient() {
  if (cachedAnon) return cachedAnon;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  cachedAnon = createClient(url, key, {
    auth: { persistSession: false },
  });
  return cachedAnon;
}
