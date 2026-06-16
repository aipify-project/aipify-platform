import { NextResponse } from "next/server";
import { parseExecutiveBriefingDetail } from "@/lib/executive-strategic-decision-cockpit";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_executive_strategic_decision_briefing", {
      p_action_id: id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseExecutiveBriefingDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load executive briefing" }, { status: 500 });
  }
}
