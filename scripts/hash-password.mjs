#!/usr/bin/env node
// Usage: node scripts/hash-password.mjs "your-admin-password"
// Prints the SHA-256 hex hash to put in ADMIN_PASSWORD_HASH.
import { createHash } from "node:crypto";

const pw = process.argv[2];
if (!pw) {
  console.error('Usage: node scripts/hash-password.mjs "your-password"');
  process.exit(1);
}
const hash = createHash("sha256").update(pw, "utf8").digest("hex");
console.log(hash);
