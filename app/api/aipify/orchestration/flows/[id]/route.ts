import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseOrchestrationFlowDetail } from "@/lib/aipify/orchestration";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_orchestration_flow", { p_flow_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseOrchestrationFlowDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load flow" }, { status: 500 });
  }
}
