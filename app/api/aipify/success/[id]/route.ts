import { NextResponse } from "next/server";
import { parseSuccessDetail, parseSuccessInitiativeItem } from "@/lib/app-portal/success-value";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_success_initiative", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseSuccessDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load success initiative" }, { status: 500 });
  }
}

type UpdateBody = {
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  value_level?: string;
  expected_outcomes?: string;
  actual_outcomes?: string;
  value_hypothesis?: string;
  measurement_method?: string;
  completion_date?: string;
  review_date?: string;
  goals_achieved?: string;
  goals_missed?: string;
  unexpected_benefits?: string;
  unexpected_consequences?: string;
  recommended_adjustments?: string;
  replication_opportunities?: string;
  lessons_learned?: string;
  notes?: string;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as UpdateBody;
    const { data, error } = await supabase.rpc("update_app_portal_success_initiative", {
      p_id: id,
      p_title: body.title ?? null,
      p_description: body.description ?? null,
      p_category: body.category ?? null,
      p_status: body.status ?? null,
      p_value_level: body.value_level ?? null,
      p_expected_outcomes: body.expected_outcomes ?? null,
      p_actual_outcomes: body.actual_outcomes ?? null,
      p_value_hypothesis: body.value_hypothesis ?? null,
      p_measurement_method: body.measurement_method ?? null,
      p_completion_date: body.completion_date ?? null,
      p_review_date: body.review_date ?? null,
      p_goals_achieved: body.goals_achieved ?? null,
      p_goals_missed: body.goals_missed ?? null,
      p_unexpected_benefits: body.unexpected_benefits ?? null,
      p_unexpected_consequences: body.unexpected_consequences ?? null,
      p_recommended_adjustments: body.recommended_adjustments ?? null,
      p_replication_opportunities: body.replication_opportunities ?? null,
      p_lessons_learned: body.lessons_learned ?? null,
      p_notes: body.notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ updated: true, initiative: parseSuccessInitiativeItem(data) });
  } catch {
    return NextResponse.json({ error: "Failed to update success initiative" }, { status: 500 });
  }
}
