import { NextResponse } from "next/server";
import { parseRiskDetail, parseRiskItem } from "@/lib/app-portal/risks";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_risk", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseRiskDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load risk" }, { status: 500 });
  }
}

type UpdateBody = {
  title?: string;
  description?: string;
  category?: string;
  owner_id?: string | null;
  status?: string;
  likelihood?: string;
  impact?: string;
  review_frequency?: string;
  next_review_date?: string;
  mitigation_strategy?: string;
  contingency_plan?: string;
  notes?: string;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as UpdateBody;
    const { data, error } = await supabase.rpc("update_app_portal_risk", {
      p_id: id,
      p_title: body.title ?? null,
      p_description: body.description ?? null,
      p_category: body.category ?? null,
      p_owner_id: body.owner_id === null ? null : body.owner_id ?? null,
      p_status: body.status ?? null,
      p_likelihood: body.likelihood ?? null,
      p_impact: body.impact ?? null,
      p_review_frequency: body.review_frequency ?? null,
      p_next_review_date: body.next_review_date ?? null,
      p_mitigation_strategy: body.mitigation_strategy ?? null,
      p_contingency_plan: body.contingency_plan ?? null,
      p_notes: body.notes ?? null,
      p_clear_owner: body.owner_id === null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseRiskItem(data);
    return NextResponse.json({ updated: true, risk: item });
  } catch {
    return NextResponse.json({ error: "Failed to update risk" }, { status: 500 });
  }
}
