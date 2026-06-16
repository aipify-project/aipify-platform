import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

type ExerciseBody = {
  title?: string;
  exercise_type?: string;
  exercise_date?: string;
  lessons_learned?: string;
  improvement_actions?: string;
  notes?: string;
};

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as ExerciseBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_continuity_exercise", {
      p_plan_id: id,
      p_title: body.title,
      p_exercise_type: body.exercise_type ?? "tabletop",
      p_exercise_date: body.exercise_date ?? null,
      p_lessons_learned: body.lessons_learned ?? "",
      p_improvement_actions: body.improvement_actions ?? "",
      p_notes: body.notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to record exercise" }, { status: 500 });
  }
}
