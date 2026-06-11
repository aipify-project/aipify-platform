import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      decision_title?: string;
      decision_category?: string;
      recommendation?: string;
      confidence_level?: string;
      rationale?: string;
      expected_benefits?: string;
      potential_risks?: string;
      dependencies?: string;
      alternatives?: unknown[];
      scenarios?: unknown[];
      decision_id?: string;
      outcome_summary?: string;
      lessons_learned_metadata?: Record<string, unknown>;
      capture_memory?: boolean;
    };

    if (body.action === "record_outcome") {
      if (!body.decision_id || !body.outcome_summary) {
        return NextResponse.json({ error: "decision_id and outcome_summary required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("record_decision_outcome", {
        p_decision_id: body.decision_id,
        p_outcome_summary: body.outcome_summary,
        p_lessons_learned_metadata: body.lessons_learned_metadata ?? {},
        p_capture_memory: body.capture_memory ?? false,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "mark_implemented") {
      if (!body.decision_id) {
        return NextResponse.json({ error: "decision_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("mark_decision_implemented", {
        p_decision_id: body.decision_id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.decision_title || !body.recommendation) {
      return NextResponse.json({ error: "decision_title and recommendation required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("propose_decision_recommendation", {
      p_decision_title: body.decision_title,
      p_decision_category: body.decision_category ?? "operational",
      p_recommendation: body.recommendation,
      p_confidence_level: body.confidence_level ?? "medium",
      p_rationale: body.rationale ?? null,
      p_expected_benefits: body.expected_benefits ?? null,
      p_potential_risks: body.potential_risks ?? null,
      p_dependencies: body.dependencies ?? null,
      p_alternatives: body.alternatives ?? [],
      p_scenarios: body.scenarios ?? [],
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process decision action" }, { status: 500 });
  }
}
