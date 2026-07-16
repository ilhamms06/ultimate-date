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

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);
}

export async function GET(request) {
  const sb = await guard(request);
  if (sb instanceof NextResponse) return sb;
  const { data, error } = await sb
    .from("activities")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ activities: data });
}

export async function POST(request) {
  const sb = await guard(request);
  if (sb instanceof NextResponse) return sb;
  const body = await request.json().catch(() => ({}));
  if (!body.label) {
    return NextResponse.json({ error: "label_required" }, { status: 400 });
  }
  const id = body.id ? slugify(body.id) : `${slugify(body.label)}-${Date.now().toString(36).slice(-4)}`;
  const row = {
    id,
    label: body.label,
    icon_name: body.icon_name || "Heart",
    image_url: body.image_url || null,
    bg: body.bg || "bg-linear-to-br from-pink-100 via-white to-rose-100",
    sort_order: body.sort_order ?? 99,
    active: body.active ?? true,
  };
  const { data, error } = await sb.from("activities").insert(row).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ activity: data });
}

export async function PUT(request) {
  const sb = await guard(request);
  if (sb instanceof NextResponse) return sb;
  const body = await request.json().catch(() => ({}));
  if (!body.id) {
    return NextResponse.json({ error: "id_required" }, { status: 400 });
  }
  const patch = {};
  for (const k of ["label", "icon_name", "image_url", "bg", "sort_order", "active"]) {
    if (k in body) patch[k] = body[k];
  }
  const { data, error } = await sb
    .from("activities")
    .update(patch)
    .eq("id", body.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ activity: data });
}

export async function DELETE(request) {
  const sb = await guard(request);
  if (sb instanceof NextResponse) return sb;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id_required" }, { status: 400 });
  const { error } = await sb.from("activities").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
