import { NextResponse } from "next/server";
import { parseGoalItem, parseGoalList } from "@/lib/app-portal/organizational-goals";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const progressMin = searchParams.get("progress_min");
    const { data, error } = await supabase.rpc("list_app_portal_goals", {
      p_goal_type: searchParams.get("goal_type") || null,
      p_status: searchParams.get("status") || null,
      p_priority: searchParams.get("priority") || null,
      p_owner_id: searchParams.get("owner_id") || null,
      p_target_before: searchParams.get("target_before") || null,
      p_progress_min: progressMin ? Number(progressMin) : null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseGoalList(data));
  } catch {
    return NextResponse.json({ error: "Failed to load goals" }, { status: 500 });
  }
}

type CreateBody = {
  title?: string;
  description?: string;
  goal_type?: string;
  priority?: string;
  status?: string;
  start_date?: string;
  target_date?: string;
  success_criteria?: string;
  progress_percent?: number;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_goal", {
      p_title: body.title,
      p_description: body.description ?? "",
      p_goal_type: body.goal_type ?? "operational",
      p_priority: body.priority ?? "medium",
      p_status: body.status ?? "draft",
      p_start_date: body.start_date ?? null,
      p_target_date: body.target_date ?? null,
      p_success_criteria: body.success_criteria ?? "",
      p_progress_percent: body.progress_percent ?? 0,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const goal = parseGoalItem(data);
    return NextResponse.json({ created: true, goal });
  } catch {
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
  }
}
