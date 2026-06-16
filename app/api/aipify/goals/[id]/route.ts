import { NextResponse } from "next/server";
import { parseGoalDetail, parseGoalItem } from "@/lib/app-portal/organizational-goals";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_goal", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const parsed = parseGoalDetail(data);
    if (!parsed.found) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load goal" }, { status: 500 });
  }
}

type PatchBody = {
  title?: string;
  description?: string;
  goal_type?: string;
  status?: string;
  priority?: string;
  start_date?: string;
  target_date?: string;
  success_criteria?: string;
  progress_percent?: number;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as PatchBody;
    const { data, error } = await supabase.rpc("update_app_portal_goal", {
      p_id: id,
      p_title: body.title ?? null,
      p_description: body.description ?? null,
      p_goal_type: body.goal_type ?? null,
      p_status: body.status ?? null,
      p_priority: body.priority ?? null,
      p_start_date: body.start_date ?? null,
      p_target_date: body.target_date ?? null,
      p_success_criteria: body.success_criteria ?? null,
      p_progress_percent: body.progress_percent ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const goal = parseGoalItem(data);
    return NextResponse.json({ updated: true, goal });
  } catch {
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
  }
}
