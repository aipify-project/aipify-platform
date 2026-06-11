import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseEscalationResult } from "@/lib/aipify/digital-twin";

type RouteContext = { params: Promise<{ processKey: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { processKey } = await context.params;
    const step = Number(req.nextUrl.searchParams.get("step") ?? "1");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("resolve_digital_twin_escalation", {
      p_process_key: processKey,
      p_current_step: step,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseEscalationResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to resolve escalation" }, { status: 500 });
  }
}
