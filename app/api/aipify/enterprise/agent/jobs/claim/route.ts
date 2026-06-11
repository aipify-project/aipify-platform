import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function agentKey(request: Request) {
  return request.headers.get("x-aipify-agent-key") ?? "";
}

export async function POST(request: Request) {
  try {
    const key = agentKey(request);
    if (!key) return NextResponse.json({ error: "Agent key required" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("agent_claim_jobs", {
      p_agent_key: key,
      p_limit: body.limit ?? 5,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to claim jobs" }, { status: 500 });
  }
}
