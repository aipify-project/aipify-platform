import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseOrchestrationFlows } from "@/lib/aipify/orchestration/parse";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_orchestration_flows", {
      p_status: searchParams.get("status"),
      p_limit: Number(searchParams.get("limit") ?? 50),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ flows: parseOrchestrationFlows(data) });
  } catch {
    return NextResponse.json({ error: "Failed to list flows" }, { status: 500 });
  }
}
