import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseRecommendationActionResult } from "@/lib/aipify/customer-lifecycle/parse";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("dismiss_customer_recommendation", {
      p_recommendation_id: id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseRecommendationActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to dismiss recommendation" }, { status: 500 });
  }
}
