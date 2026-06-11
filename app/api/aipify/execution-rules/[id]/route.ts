import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      rule_name?: string;
      description?: string;
      is_active?: boolean;
      conditions_json?: Record<string, unknown>;
      action_template_json?: Record<string, unknown>;
    };

    const { data, error } = await supabase.rpc("update_aipify_execution_rule", {
      p_rule_id: id,
      p_rule_name: body.rule_name ?? null,
      p_description: body.description ?? null,
      p_is_active: body.is_active ?? null,
      p_conditions_json: body.conditions_json ?? null,
      p_action_template_json: body.action_template_json ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update rule" }, { status: 500 });
  }
}
