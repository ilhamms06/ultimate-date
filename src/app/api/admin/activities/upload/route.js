import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { getServiceClient } from "@/lib/supabase/server";

const BUCKET = "activity-art";

export async function POST(request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const sb = getServiceClient();
  if (!sb) {
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }

  const ext = (file.name?.split(".").pop() || "png").toLowerCase();
  const path = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = new Uint8Array(await file.arrayBuffer());

  const { error } = await sb.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: file.type || "image/png",
      upsert: false,
    });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
