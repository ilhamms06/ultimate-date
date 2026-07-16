import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { getServiceClient } from "@/lib/supabase/server";

export async function GET(request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const sb = getServiceClient();
  if (!sb) {
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  const [invitesRes, eventsRes] = await Promise.all([
    sb.from("invites").select("*").order("created_at", { ascending: false }).limit(500),
    sb.from("invite_events").select("*").order("created_at", { ascending: true }).limit(5000),
  ]);
  if (invitesRes.error)
    return NextResponse.json({ error: invitesRes.error.message }, { status: 500 });

  const eventsByInvite = {};
  (eventsRes.data ?? []).forEach((e) => {
    (eventsByInvite[e.invite_id] ??= []).push(e);
  });

  const users = (invitesRes.data ?? []).map((inv) => {
    const events = eventsByInvite[inv.id] ?? [];
    const opens = events.filter((e) => e.type === "open");
    const answer = events.find((e) => e.type === "answer");
    return {
      id: inv.id,
      to_name: inv.to_name,
      config: inv.config,
      created_at: inv.created_at,
      opened: opens.length > 0,
      open_count: opens.length,
      opened_at: opens[0]?.created_at ?? null,
      answered: Boolean(answer),
      answered_at: answer?.created_at ?? null,
      answer: answer?.payload ?? null,
    };
  });

  return NextResponse.json({ users });
}
