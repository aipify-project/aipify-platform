import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_attention_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Attention center request failed" }, { status: 500 });
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

    const { data, error } = await supabase.rpc("update_tag_settings", {
      p_focus_protection_enabled: body.focus_protection_enabled ?? null,
      p_proactivity_level: body.proactivity_level ?? null,
      p_interruption_handling: body.interruption_handling ?? null,
      p_energy_management_enabled: body.energy_management_enabled ?? null,
      p_goal_alignment_enabled: body.goal_alignment_enabled ?? null,
      p_meeting_protection_enabled: body.meeting_protection_enabled ?? null,
      p_recovery_protection_enabled: body.recovery_protection_enabled ?? null,
      p_daily_focus_briefing_enabled: body.daily_focus_briefing_enabled ?? null,
      p_end_of_day_review_enabled: body.end_of_day_review_enabled ?? null,
      p_attention_tracking_enabled: body.attention_tracking_enabled ?? null,
      p_quiet_hours_start: body.quiet_hours_start ?? null,
      p_quiet_hours_end: body.quiet_hours_end ?? null,
      p_preferred_focus_period: body.preferred_focus_period ?? null,
      p_protected_priorities: body.protected_priorities ?? null,
      p_privacy_settings: body.privacy_settings ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Attention settings update failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      title?: string;
      session_type?: string;
      ends_at?: string;
      block_type?: string;
      starts_at?: string;
      linked_goal_id?: string;
    };

    if (body.action === "activate_focus") {
      const { data, error } = await supabase.rpc("activate_focus_mode", {
        p_title: body.title ?? "Focus session",
        p_session_type: body.session_type ?? "deep_work",
        p_ends_at: body.ends_at ?? null,
        p_linked_goal_id: body.linked_goal_id ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ id: data, activated: true });
    }

    if (body.action === "deactivate_focus") {
      const { data, error } = await supabase.rpc("deactivate_focus_mode");
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "create_block" && body.title) {
      const { data, error } = await supabase.rpc("create_protected_time_block", {
        p_title: body.title,
        p_block_type: body.block_type ?? "deep_work",
        p_starts_at: body.starts_at ?? null,
        p_ends_at: body.ends_at ?? null,
        p_linked_goal_id: body.linked_goal_id ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ id: data, created: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Attention action failed" }, { status: 500 });
  }
}
