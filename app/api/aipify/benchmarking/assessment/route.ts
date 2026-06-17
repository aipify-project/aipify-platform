import { NextResponse } from "next/server";
import { parseBenchmarkAssessmentResult } from "@/lib/app-portal/enterprise-benchmarking";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      dimension_key?: string;
      assessment_notes?: string;
      maturity_level?: number;
    };

    const { data, error } = await supabase.rpc("assess_app_portal_enterprise_benchmarking", {
      p_dimension_key: body.dimension_key ?? "",
      p_assessment_notes: body.assessment_notes ?? null,
      p_maturity_level: body.maturity_level ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseBenchmarkAssessmentResult(data));
  } catch {
    return NextResponse.json({ error: "Maturity assessment failed" }, { status: 500 });
  }
}
