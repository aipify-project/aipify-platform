import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_business_dna_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const center = data as { escalation_rules?: unknown[] };
    return NextResponse.json({ escalation_rules: center.escalation_rules ?? [] });
  } catch {
    return NextResponse.json({ error: "Escalation rules request failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      rule_name?: string;
      condition?: string;
      risk_level?: string;
      escalate_to?: string;
      approval_required?: boolean;
    };

    if (!body.rule_name || !body.condition) {
      return NextResponse.json({ error: "rule_name and condition required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_business_escalation_rule", {
      p_rule_name: body.rule_name,
      p_condition: body.condition,
      p_risk_level: body.risk_level ?? "high",
      p_escalate_to: body.escalate_to ?? "admin",
      p_approval_required: body.approval_required ?? true,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: data, created: true });
  } catch {
    return NextResponse.json({ error: "Escalation rule create failed" }, { status: 500 });
  }
}
