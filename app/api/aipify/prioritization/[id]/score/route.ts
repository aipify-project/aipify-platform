import { NextResponse } from "next/server";
import { parsePrioritizationItem } from "@/lib/app-portal/prioritization-engine";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

type ScoreBody = {
  priority_status?: string;
  strategic_alignment_score?: number;
  impact_score?: number;
  urgency_score?: number;
  effort_estimate?: number;
  capacity_requirement?: number;
  scoring_factors?: Record<string, unknown>;
  scoring_weights?: Record<string, unknown>;
  notes?: string;
};

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as ScoreBody;
    const { data, error } = await supabase.rpc("record_app_portal_prioritization_score", {
      p_id: id,
      p_priority_status: body.priority_status ?? null,
      p_strategic_alignment_score: body.strategic_alignment_score ?? null,
      p_impact_score: body.impact_score ?? null,
      p_urgency_score: body.urgency_score ?? null,
      p_effort_estimate: body.effort_estimate ?? null,
      p_capacity_requirement: body.capacity_requirement ?? null,
      p_scoring_factors: body.scoring_factors ?? null,
      p_scoring_weights: body.scoring_weights ?? null,
      p_notes: body.notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ scored: true, item: parsePrioritizationItem(data) });
  } catch {
    return NextResponse.json({ error: "Failed to record prioritization score" }, { status: 500 });
  }
}
