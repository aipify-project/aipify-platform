import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCollaborationResult } from "@/lib/aipify/agents/parse";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { scenario?: string };
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("coordinate_agent_collaboration", {
      p_scenario: body.scenario ?? "support_low_confidence",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCollaborationResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to coordinate agents" }, { status: 500 });
  }
}
