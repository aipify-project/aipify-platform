import { NextResponse } from "next/server";
import { parseContinuityDetail, parseContinuityPlanItem } from "@/lib/app-portal/continuity";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_continuity_plan", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseContinuityDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load continuity plan" }, { status: 500 });
  }
}

type UpdateBody = {
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  criticality_level?: string;
  review_frequency?: string;
  last_reviewed_date?: string;
  next_review_date?: string;
  recovery_objectives?: string;
  critical_dependencies?: string[];
  alternative_procedures?: string;
  escalation_paths?: string;
  minimum_operational_requirements?: string;
  notes?: string;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as UpdateBody;
    const { data, error } = await supabase.rpc("update_app_portal_continuity_plan", {
      p_id: id,
      p_title: body.title ?? null,
      p_description: body.description ?? null,
      p_category: body.category ?? null,
      p_status: body.status ?? null,
      p_criticality_level: body.criticality_level ?? null,
      p_review_frequency: body.review_frequency ?? null,
      p_last_reviewed_date: body.last_reviewed_date ?? null,
      p_next_review_date: body.next_review_date ?? null,
      p_recovery_objectives: body.recovery_objectives ?? null,
      p_critical_dependencies: body.critical_dependencies ?? null,
      p_alternative_procedures: body.alternative_procedures ?? null,
      p_escalation_paths: body.escalation_paths ?? null,
      p_minimum_operational_requirements: body.minimum_operational_requirements ?? null,
      p_notes: body.notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ updated: true, plan: parseContinuityPlanItem(data) });
  } catch {
    return NextResponse.json({ error: "Failed to update continuity plan" }, { status: 500 });
  }
}
