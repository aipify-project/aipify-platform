import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseConstitutionActionResult } from "@/lib/aipify/constitution";

type RouteContext = { params: Promise<{ reviewId: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { reviewId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("complete_constitution_review", {
      p_review_id: reviewId,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseConstitutionActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to complete review" }, { status: 500 });
  }
}
