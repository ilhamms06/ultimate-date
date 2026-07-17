#!/usr/bin/env node
// One-off: push refreshed copy into the Supabase `content` table.
// Usage: node scripts/update-copy.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv(file) {
  try {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const v = m[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
  } catch {}
}
loadEnv(".env.local");
loadEnv(".env");

const COPY = {
  "meta.title": "Maukah Kamu Kencan Denganku?",
  "meta.description": "Undangan kecil yang manis, khusus buat kamu",

  "opening.greeting": "Hai, *{name}!*",
  "opening.subtitle": "Ada sesuatu yang mau aku tanyakan...",
  "opening.promise": "Jangan pergi dulu sebelum jawab, ya",
  "opening.ctaButton": "Buka Pertanyaannya",

  "question.title": "Maukah {name} pergi *kencan* denganku?",
  "question.subtitle": "Satu jawaban aja, kok.",
  "question.yesButton": "YA",
  "question.noButton": "TIDAK",

  "activity.title": "Kencan seperti apa yang *seru*?",
  "activity.subtitle": "Pilih yang paling pas sama mood kamu.",
  "activity.nextButton": "Lanjut",

  "location.title": "Mau *ke mana* kita?",
  "location.subtitle": "Pilih tempat buat kencan kita.",
  "location.nextButton": "Lanjut",

  "datetime.title": "Kapan kita *ketemu*?",
  "datetime.subtitle": "Pilih hari, lalu jamnya.",
  "datetime.nextButton": "Jadi Kencan!",

  "final.title": "Yeay, kita *jadi* kencan!",
  "final.subtitle": "Tinggal datang pas harinya, sisanya udah beres.",
  "final.saveButton": "Simpan ke Kalender",

  "setup.title": "Bikin undangan *kencan*",
  "setup.subtitle": "Atur pilihannya, lalu kirim link ke dia.",
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !service) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(url, service, { auth: { persistSession: false } });
const rows = Object.entries(COPY).map(([key, value]) => ({
  key,
  value,
  updated_at: new Date().toISOString(),
}));

const { error } = await sb.from("content").upsert(rows, { onConflict: "key" });
if (error) {
  console.error("❌", error.message);
  process.exit(1);
}
console.log(`✅ Updated ${rows.length} copy entries.`);
