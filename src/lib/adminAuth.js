// Runtime-agnostic admin session helpers (Web Crypto — works in Node & Edge).
// A session token is `<payloadB64url>.<hmacB64url>` where payload = {exp}.

export const SESSION_COOKIE = "admin_session";
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const enc = new TextEncoder();
const dec = new TextDecoder();

function bytesToB64url(bytes) {
  const arr = bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : bytes;
  let bin = "";
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlToBytes(s) {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(padded);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function sha256hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(str));
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signSession(secret, ttlMs = SESSION_TTL_MS) {
  const payloadB64 = bytesToB64url(
    enc.encode(JSON.stringify({ exp: Date.now() + ttlMs }))
  );
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64));
  return `${payloadB64}.${bytesToB64url(sig)}`;
}

export async function verifySession(secret, token) {
  if (!secret || !token) return false;
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return false;
  try {
    const key = await hmacKey(secret);
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      b64urlToBytes(sigB64),
      enc.encode(payloadB64)
    );
    if (!ok) return false;
    const payload = JSON.parse(dec.decode(b64urlToBytes(payloadB64)));
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

/** For route handlers: is the request carrying a valid admin session? */
export async function isAdminRequest(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return verifySession(process.env.ADMIN_SESSION_SECRET, token);
}
