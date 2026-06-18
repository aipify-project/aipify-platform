import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseInnovationLabActionResult } from "@/lib/aipify/innovation-lab/parse";

type RouteContext = { params: Promise<{ ideaId: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { ideaId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("approve_innovation_idea", { p_idea_id: ideaId });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseInnovationLabActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to approve idea" }, { status: 500 });
  }
}
