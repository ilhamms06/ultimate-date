import { NextResponse } from "next/server";
import {
  sha256hex,
  signSession,
  SESSION_COOKIE,
  SESSION_TTL_MS,
} from "@/lib/adminAuth";

export async function POST(request) {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!hash || !secret) {
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  const { password } = await request.json().catch(() => ({}));
  if (!password) {
    return NextResponse.json({ error: "missing_password" }, { status: 400 });
  }

  const inputHash = await sha256hex(password);
  if (inputHash !== hash) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  const token = await signSession(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
  return res;
}
