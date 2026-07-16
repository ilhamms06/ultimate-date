import { getBrowserClient } from "./supabase/browser";

const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/** Short URL-safe random id (base62). */
export function shortId(len = 10) {
  const bytes = new Uint8Array(len);
  (globalThis.crypto || window.crypto).getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < len; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

/**
 * Persist an invite. Returns its id, or null if Supabase isn't configured
 * (caller then falls back to a self-contained ?d= link).
 */
export async function createInvite(config) {
  const sb = getBrowserClient();
  if (!sb) return null;
  const id = shortId();
  const { error } = await sb.from("invites").insert({
    id,
    to_name: config.to ?? "",
    config,
  });
  if (error) return null;
  return id;
}

/** Fetch an invite's stored config by id (via the get_invite RPC). */
export async function fetchInvite(id) {
  const sb = getBrowserClient();
  if (!sb) return null;
  const { data, error } = await sb.rpc("get_invite", { p_id: id });
  if (error || !data || !data.length) return null;
  const row = data[0];
  return { to_name: row.to_name, config: row.config };
}

/** Best-effort event log (open / answer). Never throws. */
export async function logInviteEvent(inviteId, type, payload = {}) {
  const sb = getBrowserClient();
  if (!sb || !inviteId) return;
  try {
    await sb.from("invite_events").insert({ invite_id: inviteId, type, payload });
  } catch {
    /* ignore */
  }
}
