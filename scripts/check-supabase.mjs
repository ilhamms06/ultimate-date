#!/usr/bin/env node
// Verifies your Supabase + admin env is wired correctly.
// Usage: node scripts/check-supabase.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// --- load env from .env.local then .env (no dependency) ---
function loadEnv(file) {
  try {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      let v = m[2].trim().replace(/^["']|["']$/g, "");
      if (process.env[m[1]] == null || process.env[m[1]] === "")
        process.env[m[1]] = v;
    }
  } catch {
    /* file may not exist */
  }
}
loadEnv(".env.local");
loadEnv(".env");

const ok = (b) => (b ? "✅" : "❌");
let hardFail = false;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
const pwHash = process.env.ADMIN_PASSWORD_HASH;
const secret = process.env.ADMIN_SESSION_SECRET;

console.log("\n1) Environment variables");
console.log(`   ${ok(!!url)} NEXT_PUBLIC_SUPABASE_URL ${url ? `(${url})` : "MISSING"}`);
console.log(`   ${ok(!!anon)} NEXT_PUBLIC_SUPABASE_ANON_KEY ${anon ? "(set)" : "MISSING"}`);
console.log(`   ${ok(!!service)} SUPABASE_SERVICE_ROLE_KEY ${service ? "(set)" : "MISSING"}`);
console.log(`   ${ok(!!pwHash)} ADMIN_PASSWORD_HASH ${pwHash ? "(set)" : "MISSING"}`);
console.log(`   ${ok(!!secret)} ADMIN_SESSION_SECRET ${secret ? "(set)" : "MISSING"}`);
if (pwHash && !/^[0-9a-f]{64}$/.test(pwHash))
  console.log("   ⚠️  ADMIN_PASSWORD_HASH doesn't look like a sha256 hex — run scripts/hash-password.mjs");
if (secret && secret.length < 16)
  console.log("   ⚠️  ADMIN_SESSION_SECRET is short — use `openssl rand -hex 32`");

if (!url || !anon) {
  console.log("\nStop: URL/anon key missing — fill .env.local first.\n");
  process.exit(1);
}

async function main() {
  console.log("\n2) Public reads (anon key — what visitors use)");
  const pub = createClient(url, anon, { auth: { persistSession: false } });

  const c = await pub.from("content").select("key", { count: "exact", head: false });
  if (c.error) {
    hardFail = true;
    console.log(`   ❌ content: ${c.error.message}`);
    if (/does not exist|schema/i.test(c.error.message))
      console.log("      → Looks like the schema hasn't been run. Run supabase/schema.sql in the SQL Editor.");
  } else {
    console.log(`   ✅ content rows readable: ${c.data.length}`);
  }

  const a = await pub.from("activities").select("id,label").eq("active", true);
  if (a.error) {
    hardFail = true;
    console.log(`   ❌ activities: ${a.error.message}`);
  } else {
    console.log(`   ✅ active activities: ${a.data.length} (${a.data.map((x) => x.id).join(", ") || "none"})`);
  }

  if (service) {
    console.log("\n3) Admin access (service role)");
    const svc = createClient(url, service, { auth: { persistSession: false } });
    const inv = await svc.from("invites").select("id", { head: true, count: "exact" });
    console.log(`   ${ok(!inv.error)} invites table ${inv.error ? "→ " + inv.error.message : "reachable"}`);
    const ev = await svc.from("invite_events").select("id", { head: true, count: "exact" });
    console.log(`   ${ok(!ev.error)} invite_events table ${ev.error ? "→ " + ev.error.message : "reachable"}`);
    const buckets = await svc.storage.listBuckets();
    const hasBucket = !buckets.error && buckets.data?.some((b) => b.id === "activity-art");
    console.log(`   ${ok(hasBucket)} storage bucket "activity-art" ${hasBucket ? "exists" : "NOT found"}`);
  }

  console.log(
    hardFail
      ? "\nResult: ❌ Something's off above — fix it, then re-run.\n"
      : "\nResult: ✅ All good. Run `npm run dev` and open /admin.\n"
  );
  process.exit(hardFail ? 1 : 0);
}

main().catch((e) => {
  console.log("\n❌ Unexpected error:", e.message, "\n");
  process.exit(1);
});
