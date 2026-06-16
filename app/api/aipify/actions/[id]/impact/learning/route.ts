import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

type LearningBody = {
  actual_outcome?: string;
  user_satisfaction?: string;
  goal_achievement?: string;
  lessons_learned?: string;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as LearningBody;
    if (!body.actual_outcome?.trim()) {
      return NextResponse.json({ error: "actual_outcome required" }, { status: 400 });
    }

    const { data: impactData, error: impactError } = await supabase.rpc(
      "get_action_center_impact_analysis",
      { p_action_id: id }
    );
    if (impactError) return NextResponse.json({ error: impactError.message }, { status: 400 });
    if (!impactData || typeof impactData !== "object" || (impactData as { found?: boolean }).found !== true) {
      return NextResponse.json({ error: "Action not found" }, { status: 404 });
    }

    const { data, error } = await supabase.rpc("record_action_center_impact_learning", {
      p_action_id: id,
      p_actual_outcome: body.actual_outcome.trim(),
      p_user_satisfaction: body.user_satisfaction ?? "neutral",
      p_goal_achievement: body.goal_achievement ?? "partially",
      p_lessons_learned: body.lessons_learned?.trim() ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data ?? { recorded: true });
  } catch {
    return NextResponse.json({ error: "Failed to record impact learning" }, { status: 500 });
  }
}
