import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ jobId: string }> };

function agentKey(request: Request) {
  return request.headers.get("x-aipify-agent-key") ?? "";
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { jobId } = await context.params;
    const key = agentKey(request);
    if (!key) return NextResponse.json({ error: "Agent key required" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("agent_fail_job", {
      p_agent_key: key,
      p_job_id: jobId,
      p_error_message: body.error_message ?? body.error ?? "Job failed",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fail job" }, { status: 500 });
  }
}
