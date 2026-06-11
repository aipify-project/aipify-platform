import { NextResponse } from "next/server";
import { buildWeekPlanRecommendations } from "@/lib/life-os/planning";
import { parseLifeCenter } from "@/lib/life-os/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_life_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Life center request failed" }, { status: 500 });
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

    const { data, error } = await supabase.rpc("update_life_os_settings", {
      p_proactivity_level: body.proactivity_level ?? null,
      p_notification_frequency: body.notification_frequency ?? null,
      p_personality: body.personality ?? null,
      p_life_areas_enabled: body.life_areas_enabled ?? null,
      p_daily_briefing_enabled: body.daily_briefing_enabled ?? null,
      p_evening_review_enabled: body.evening_review_enabled ?? null,
      p_quiet_hours_start: body.quiet_hours_start ?? null,
      p_quiet_hours_end: body.quiet_hours_end ?? null,
      p_energy_aware_enabled: body.energy_aware_enabled ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Settings update failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { action?: string; message?: string };

    if (body.action === "plan_week") {
      const { data, error } = await supabase.rpc("get_customer_life_center");
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });

      const center = parseLifeCenter(data);
      const items = [
        ...(center.priority_tasks ?? []),
        ...(center.upcoming_events ?? []),
        ...(center.today_overview ?? []),
      ];
      const recommendations = buildWeekPlanRecommendations(items);

      return NextResponse.json({
        reply: recommendations.join(" "),
        recommendations,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Life action failed" }, { status: 500 });
  }
}
