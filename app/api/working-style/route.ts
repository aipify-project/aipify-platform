import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_working_style_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Working style request failed" }, { status: 500 });
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

    const { data, error } = await supabase.rpc("update_customer_working_preferences", {
      p_working_profile: body.working_profile ?? null,
      p_detail_level: body.detail_level ?? null,
      p_reminder_frequency: body.reminder_frequency ?? null,
      p_preferred_summary_time: body.preferred_summary_time ?? null,
      p_preferred_notification_categories: body.preferred_notification_categories ?? null,
      p_preferred_dashboard_layout: body.preferred_dashboard_layout ?? null,
      p_focus_mode_enabled: body.focus_mode_enabled ?? null,
      p_adaptive_learning_enabled: body.adaptive_learning_enabled ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Working style update failed" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("reset_customer_working_preferences");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Working style reset failed" }, { status: 500 });
  }
}
