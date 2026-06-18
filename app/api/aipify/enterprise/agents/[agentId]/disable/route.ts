import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseAipifyAgents } from "@/lib/aipify/enterprise/parse";

type RouteContext = { params: Promise<{ agentId: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { agentId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("disable_aipify_agent", { p_agent_id: agentId });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ agents: parseAipifyAgents(data) });
  } catch {
    return NextResponse.json({ error: "Failed to disable agent" }, { status: 500 });
  }
}
