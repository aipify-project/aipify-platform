import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseFutureTechnologiesActionResult } from "@/lib/aipify/future-technologies/parse";

type RouteContext = { params: Promise<{ initiativeId: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { initiativeId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("advance_emerging_initiative", {
      p_initiative_id: initiativeId,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseFutureTechnologiesActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to advance initiative" }, { status: 500 });
  }
}
