import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseAgentActionPrecheck } from "@/lib/aipify/agents/parse";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as { action_key?: string; context?: Record<string, unknown> };
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("evaluate_agent_action", {
      p_agent_key: id,
      p_action_key: body.action_key ?? "recommend",
      p_context: body.context ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAgentActionPrecheck(data));
  } catch {
    return NextResponse.json({ error: "Failed to evaluate agent action" }, { status: 500 });
  }
}
