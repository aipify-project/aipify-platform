import { NextResponse } from "next/server";
import { parseDecisionDetail, parseDecisionItem } from "@/lib/app-portal/decision-center";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_decision", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const parsed = parseDecisionDetail(data);
    if (!parsed.found) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load decision" }, { status: 500 });
  }
}

type PatchBody = {
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  impact_level?: string;
  expected_outcome?: string;
  supporting_evidence?: unknown[];
  outcome_rating?: number;
  lessons_learned?: string;
  unexpected_consequences?: string;
  would_repeat?: string;
  linked_follow_up_ids?: unknown[];
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as PatchBody;
    const { data, error } = await supabase.rpc("update_app_portal_decision", {
      p_id: id,
      p_title: body.title ?? null,
      p_description: body.description ?? null,
      p_category: body.category ?? null,
      p_status: body.status ?? null,
      p_impact_level: body.impact_level ?? null,
      p_expected_outcome: body.expected_outcome ?? null,
      p_supporting_evidence: body.supporting_evidence ?? null,
      p_outcome_rating: body.outcome_rating ?? null,
      p_lessons_learned: body.lessons_learned ?? null,
      p_unexpected_consequences: body.unexpected_consequences ?? null,
      p_would_repeat: body.would_repeat ?? null,
      p_linked_follow_up_ids: body.linked_follow_up_ids ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseDecisionItem(data);
    return NextResponse.json({ updated: true, decision: item });
  } catch {
    return NextResponse.json({ error: "Failed to update decision" }, { status: 500 });
  }
}
