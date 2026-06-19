import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_EVENTS = new Set([
  "page_view",
  "page_exit",
  "scroll_depth",
  "cta_click",
  "cta_view",
  "navigation",
  "early_access_submit",
  "book_demo_submit",
  "growth_partner_signup",
  "knowledge_view",
  "business_pack_view",
  "demo_step_view",
  "conversion",
]);

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const eventType = String(body.event_type ?? "");

    if (!ALLOWED_EVENTS.has(eventType)) {
      return NextResponse.json({ error: "Invalid event_type" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("record_marketing_website_event", {
      p_payload: body,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data ?? { ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }
}
