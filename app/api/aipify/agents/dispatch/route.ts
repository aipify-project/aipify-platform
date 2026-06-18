import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCollaborationResult } from "@/lib/aipify/agents/parse";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      source_agent?: string;
      target_agent?: string;
      message_type?: string;
      payload?: Record<string, unknown>;
    };
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("dispatch_agent_message", {
      p_source_agent: body.source_agent ?? "support",
      p_target_agent: body.target_agent ?? null,
      p_message_type: body.message_type ?? "request_information",
      p_payload: body.payload ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCollaborationResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to dispatch agent message" }, { status: 500 });
  }
}
