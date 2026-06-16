import { NextResponse } from "next/server";
import { parseRiskItem } from "@/lib/app-portal/risks";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

type MitigationBody = {
  action_taken?: string;
  effectiveness_review?: string;
  residual_likelihood?: string;
  residual_impact?: string;
  next_review_date?: string;
  escalation_required?: boolean;
};

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as MitigationBody;
    if (!body.action_taken?.trim()) return NextResponse.json({ error: "action_taken required" }, { status: 400 });

    const { data, error } = await supabase.rpc("add_app_portal_risk_mitigation", {
      p_risk_id: id,
      p_action_taken: body.action_taken,
      p_effectiveness_review: body.effectiveness_review ?? "",
      p_residual_likelihood: body.residual_likelihood ?? null,
      p_residual_impact: body.residual_impact ?? null,
      p_next_review_date: body.next_review_date ?? null,
      p_escalation_required: body.escalation_required ?? false,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseRiskItem(data);
    return NextResponse.json({ created: true, risk: item });
  } catch {
    return NextResponse.json({ error: "Failed to record mitigation" }, { status: 500 });
  }
}
