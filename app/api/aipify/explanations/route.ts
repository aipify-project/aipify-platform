import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseDecisionExplanations } from "@/lib/aipify/trust-engine/parse";

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("list_decision_explanations", {
      p_decision_type: type,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ explanations: parseDecisionExplanations(data) });
  } catch {
    return NextResponse.json({ error: "Failed to list explanations" }, { status: 500 });
  }
}
