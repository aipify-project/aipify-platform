import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseExplanationDetail } from "@/lib/aipify/trust-engine/parse";

type RouteContext = { params: Promise<{ decisionId: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { decisionId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_decision_explanation_by_decision", {
      p_decision_id: decisionId,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const detail = parseExplanationDetail(data);
    if (!detail) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(detail);
  } catch {
    return NextResponse.json({ error: "Failed to load explanation" }, { status: 500 });
  }
}
