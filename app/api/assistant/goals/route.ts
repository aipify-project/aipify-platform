import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_goals_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Goals center request failed" }, { status: 500 });
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

    const { data, error } = await supabase.rpc("update_gde_settings", {
      p_default_accountability: body.default_accountability ?? null,
      p_proactive_suggestions_enabled: body.proactive_suggestions_enabled ?? null,
      p_celebration_enabled: body.celebration_enabled ?? null,
      p_setback_support_enabled: body.setback_support_enabled ?? null,
      p_check_in_frequency_days: body.check_in_frequency_days ?? null,
      p_privacy_settings: body.privacy_settings ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Goals settings update failed" }, { status: 500 });
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
      description?: string;
      why_matters?: string;
      category?: string;
      timeframe?: string;
      accountability_level?: string;
      target_date?: string;
      goal_id?: string;
      milestone_id?: string;
      action_id?: string;
      status?: string;
      response?: string;
    };

    if (body.action === "create_goal" && body.title) {
      const { data, error } = await supabase.rpc("create_user_goal", {
        p_title: body.title,
        p_description: body.description ?? "",
        p_why_matters: body.why_matters ?? "",
        p_category: body.category ?? "personal_development",
        p_timeframe: body.timeframe ?? "medium_term",
        p_accountability_level: body.accountability_level ?? null,
        p_target_date: body.target_date ?? null,
        p_auto_milestones: true,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ id: data, created: true });
    }

    if (body.action === "update_goal" && body.goal_id) {
      const { data, error } = await supabase.rpc("update_user_goal", {
        p_goal_id: body.goal_id,
        p_title: body.title ?? null,
        p_description: body.description ?? null,
        p_why_matters: body.why_matters ?? null,
        p_category: body.category ?? null,
        p_timeframe: body.timeframe ?? null,
        p_accountability_level: body.accountability_level ?? null,
        p_status: body.status ?? null,
        p_target_date: body.target_date ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "complete_milestone" && body.milestone_id) {
      const { data, error } = await supabase.rpc("update_goal_milestone", {
        p_milestone_id: body.milestone_id,
        p_status: "completed",
        p_progress_percent: 100,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "create_action" && body.goal_id && body.title) {
      const { data, error } = await supabase.rpc("create_goal_action", {
        p_goal_id: body.goal_id,
        p_title: body.title,
        p_milestone_id: body.milestone_id ?? null,
        p_due_date: body.target_date ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ id: data, created: true });
    }

    if (body.action === "toggle_action" && body.action_id) {
      const { data, error } = await supabase.rpc("toggle_goal_action", {
        p_action_id: body.action_id,
        p_status: body.status ?? "completed",
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "check_in" && body.goal_id) {
      const { data, error } = await supabase.rpc("record_goal_check_in", {
        p_goal_id: body.goal_id,
        p_response: body.response ?? "acknowledged",
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Goals action failed" }, { status: 500 });
  }
}
