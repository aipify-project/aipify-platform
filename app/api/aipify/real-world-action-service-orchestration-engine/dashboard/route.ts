import { NextResponse } from "next/server";
import { parseRealWorldActionServiceOrchestrationCenter } from "@/lib/aipify/real-world-action-service-orchestration-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_real_world_action_service_orchestration_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseRealWorldActionServiceOrchestrationCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load real-world actions center" }, { status: 500 });
  }
}
