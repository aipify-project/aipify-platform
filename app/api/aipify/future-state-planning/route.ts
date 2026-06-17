import { NextResponse } from "next/server";
import {
  parseFutureStatePlanningOverview,
  parseFutureStateActionResult,
} from "@/lib/app-portal/future-state-planning";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_future_state_planning", {
      p_category:           searchParams.get("category")            || null,
      p_department:         searchParams.get("department")          || null,
      p_strategic_priority: searchParams.get("strategic_priority")  || null,
      p_time_horizon:       searchParams.get("time_horizon")        || null,
      p_executive_owner:    searchParams.get("executive_owner")     || null,
      p_status:             searchParams.get("status")              || null,
      p_search:             searchParams.get("search")              || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseFutureStatePlanningOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load future-state planning" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      title?: string;
      description?: string;
      category?: string;
      time_horizon?: string;
      vision_statement?: string;
      current_state?: string;
      desired_future_state?: string;
      executive_owner?: string;
      department?: string;
      strategic_priority?: string;
      estimated_timeline?: string;
    };

    const { data, error } = await supabase.rpc("upsert_app_portal_future_state_plan", {
      p_plan_id:            null,
      p_title:              body.title              ?? null,
      p_description:        body.description        ?? null,
      p_category:           body.category           ?? null,
      p_status:             "draft",
      p_time_horizon:       body.time_horizon       ?? null,
      p_custom_horizon:     null,
      p_current_state:      body.current_state      ?? null,
      p_desired_future:     body.desired_future_state ?? null,
      p_vision_statement:   body.vision_statement   ?? null,
      p_executive_owner:    body.executive_owner    ?? null,
      p_department:         body.department         ?? null,
      p_strategic_priority: body.strategic_priority ?? null,
      p_estimated_timeline: body.estimated_timeline ?? null,
      p_review_notes:       null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseFutureStateActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to create future-state plan" }, { status: 500 });
  }
}
