import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      assessment_id?: string;
      domain?: string;
      maturity_level?: number;
      assessment_summary?: string;
      criteria_scores?: Record<string, unknown>;
      capture_memory?: boolean;
    };

    if (body.action === "update") {
      if (!body.assessment_id) {
        return NextResponse.json({ error: "assessment_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("update_maturity_assessment", {
        p_assessment_id: body.assessment_id,
        p_maturity_level: body.maturity_level ?? null,
        p_assessment_summary: body.assessment_summary ?? null,
        p_criteria_scores: body.criteria_scores ?? null,
        p_capture_memory: body.capture_memory ?? false,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.domain) {
      return NextResponse.json({ error: "domain required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_maturity_assessment", {
      p_domain: body.domain,
      p_maturity_level: body.maturity_level ?? 1,
      p_assessment_summary: body.assessment_summary ?? null,
      p_criteria_scores: body.criteria_scores ?? {},
      p_capture_memory: body.capture_memory ?? false,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process assessment action" }, { status: 500 });
  }
}
