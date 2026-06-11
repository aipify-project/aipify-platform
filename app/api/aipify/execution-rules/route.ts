import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      rule_name?: string;
      description?: string;
      trigger_type?: string;
      conditions_json?: Record<string, unknown>;
      action_template_json?: Record<string, unknown>;
      risk_level?: string;
      execution_level?: string;
      requires_approval?: boolean;
      max_runs_per_day?: number;
    };

    if (!body.rule_name) {
      return NextResponse.json({ error: "rule_name required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_aipify_execution_rule", {
      p_rule_name: body.rule_name,
      p_description: body.description ?? "",
      p_trigger_type: body.trigger_type ?? "manual",
      p_conditions_json: body.conditions_json ?? {},
      p_action_template_json: body.action_template_json ?? {},
      p_risk_level: body.risk_level ?? "low",
      p_execution_level: body.execution_level ?? "assistant",
      p_requires_approval: body.requires_approval ?? true,
      p_max_runs_per_day: body.max_runs_per_day ?? 50,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: data, created: true });
  } catch {
    return NextResponse.json({ error: "Failed to create rule" }, { status: 500 });
  }
}
