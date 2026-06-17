import { NextResponse } from "next/server";
import {
  parseFutureStatePlanDetail,
  parseFutureStateActionResult,
} from "@/lib/app-portal/future-state-planning";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_future_state_plan", {
      p_plan_id: id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseFutureStatePlanDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load future-state plan" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      title?: string;
      description?: string;
      category?: string;
      status?: string;
      time_horizon?: string;
      custom_horizon_label?: string;
      current_state?: string;
      desired_future_state?: string;
      vision_statement?: string;
      executive_owner?: string;
      department?: string;
      strategic_priority?: string;
      estimated_timeline?: string;
      review_notes?: string;
    };

    const { data, error } = await supabase.rpc("upsert_app_portal_future_state_plan", {
      p_plan_id:            id,
      p_title:              body.title              ?? null,
      p_description:        body.description        ?? null,
      p_category:           body.category           ?? null,
      p_status:             body.status             ?? null,
      p_time_horizon:       body.time_horizon       ?? null,
      p_custom_horizon:     body.custom_horizon_label ?? null,
      p_current_state:      body.current_state      ?? null,
      p_desired_future:     body.desired_future_state ?? null,
      p_vision_statement:   body.vision_statement   ?? null,
      p_executive_owner:    body.executive_owner    ?? null,
      p_department:         body.department         ?? null,
      p_strategic_priority: body.strategic_priority ?? null,
      p_estimated_timeline: body.estimated_timeline ?? null,
      p_review_notes:       body.review_notes       ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseFutureStateActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to update future-state plan" }, { status: 500 });
  }
}
