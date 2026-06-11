import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseEvolutionActionResult } from "@/lib/aipify/evolution-governance";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("schedule_evolution_proposal", { p_proposal_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseEvolutionActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to schedule proposal" }, { status: 500 });
  }
}
