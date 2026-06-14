import { NextResponse } from "next/server";
import { parseActionImpactAnalysis } from "@/lib/action-center-impact";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_action_center_impact_analysis", {
      p_action_id: id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseActionImpactAnalysis(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load impact analysis" }, { status: 500 });
  }
}
