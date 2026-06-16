import { NextResponse } from "next/server";
import { parseGoalDetail } from "@/lib/app-portal/organizational-goals";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

type Body = {
  update_type?: string;
  progress_percent?: number;
  milestone_title?: string;
  notes?: string;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Body;
    if (!body.update_type) return NextResponse.json({ error: "update_type required" }, { status: 400 });

    const { data, error } = await supabase.rpc("add_app_portal_goal_progress", {
      p_goal_id: id,
      p_update_type: body.update_type,
      p_progress_percent: body.progress_percent ?? null,
      p_milestone_title: body.milestone_title ?? null,
      p_notes: body.notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseGoalDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to record progress" }, { status: 500 });
  }
}
