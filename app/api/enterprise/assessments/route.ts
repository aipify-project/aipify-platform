import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      assessment_dimension: string;
      score: number;
      health_overview?: Record<string, unknown>;
    };

    const { data, error } = await supabase.rpc("record_enterprise_readiness_assessment", {
      p_assessment_dimension: body.assessment_dimension,
      p_score: body.score,
      p_health_overview: body.health_overview ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to record assessment" }, { status: 500 });
  }
}
