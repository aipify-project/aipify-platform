import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCommunityActionResult } from "@/lib/aipify/community-intelligence/parse";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as { decision?: string; notes?: string };
    if (!body.decision) {
      return NextResponse.json({ error: "decision is required" }, { status: 400 });
    }
    const { data, error } = await supabase.rpc("review_community_contribution", {
      p_contribution_id: id,
      p_decision: body.decision,
      p_notes: body.notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCommunityActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to review contribution" }, { status: 500 });
  }
}
