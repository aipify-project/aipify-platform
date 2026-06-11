import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_context_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Context center request failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;

    const { data, error } = await supabase.rpc("update_context_settings", {
      p_context_mode: body.context_mode ?? null,
      p_proactive_assistance: body.proactive_assistance ?? null,
      p_notification_frequency: body.notification_frequency ?? null,
      p_daily_briefing_enabled: body.daily_briefing_enabled ?? null,
      p_evening_review_enabled: body.evening_review_enabled ?? null,
      p_conflict_detection_enabled: body.conflict_detection_enabled ?? null,
      p_cognitive_load_alerts_enabled: body.cognitive_load_alerts_enabled ?? null,
      p_privacy_settings: body.privacy_settings ?? null,
      p_planning_preferences: body.planning_preferences ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Context update failed" }, { status: 500 });
  }
}
