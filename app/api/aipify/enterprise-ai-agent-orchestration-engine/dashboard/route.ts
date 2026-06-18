import { NextResponse } from "next/server";
import { parseEnterpriseAiAgentOrchestrationCenter } from "@/lib/aipify/enterprise-ai-agent-orchestration-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_enterprise_ai_agent_orchestration_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseEnterpriseAiAgentOrchestrationCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load agent orchestration center" }, { status: 500 });
  }
}
