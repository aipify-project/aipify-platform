import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseEvolutionActionResult } from "@/lib/aipify/evolution-governance";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json().catch(() => ({}));
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("review_evolution_proposal", {
      p_proposal_id: id,
      p_decision: body.decision ?? "approve_review",
      p_notes: body.notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseEvolutionActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to review proposal" }, { status: 500 });
  }
}
