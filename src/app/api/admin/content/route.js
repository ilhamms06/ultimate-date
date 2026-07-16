import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { getServiceClient } from "@/lib/supabase/server";

async function guard(request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const sb = getServiceClient();
  if (!sb) {
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }
  return sb;
}

export async function GET(request) {
  const sb = await guard(request);
  if (sb instanceof NextResponse) return sb;
  const { data, error } = await sb.from("content").select("*").order("key");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ content: data });
}

export async function PUT(request) {
  const sb = await guard(request);
  if (sb instanceof NextResponse) return sb;
  const { updates } = await request.json().catch(() => ({}));
  if (!updates || typeof updates !== "object") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const rows = Object.entries(updates).map(([key, value]) => ({
    key,
    value: String(value ?? ""),
    updated_at: new Date().toISOString(),
  }));
  const { error } = await sb.from("content").upsert(rows, { onConflict: "key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, count: rows.length });
}
