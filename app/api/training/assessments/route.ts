import { NextResponse } from "next/server";
import { parseTrainingAssessments } from "@/lib/aipify/learning-training-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const moduleId = new URL(request.url).searchParams.get("module_id");

    const { data, error } = await supabase.rpc("list_training_assessments", {
      p_module_id: moduleId ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseTrainingAssessments(data));
  } catch {
    return NextResponse.json({ error: "Failed to list assessments" }, { status: 500 });
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
      assessment_id: string;
      score: number;
      passed?: boolean;
    };

    const { data, error } = await supabase.rpc("submit_training_assessment", {
      p_assessment_id: body.assessment_id,
      p_score: body.score,
      p_passed: body.passed ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to submit assessment" }, { status: 500 });
  }
}
