import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseFutureTechnologiesActionResult } from "@/lib/aipify/future-technologies";

type RouteContext = { params: Promise<{ recommendationId: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { recommendationId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("dismiss_future_recommendation", {
      p_recommendation_id: recommendationId,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseFutureTechnologiesActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to dismiss recommendation" }, { status: 500 });
  }
}
