import { NextResponse } from "next/server";
import { parseCompanionPriorityRecommendations } from "@/lib/aipify/companion-recommendation-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const limit = Number(new URL(request.url).searchParams.get("limit") ?? 10);
    const { data, error } = await supabase.rpc("list_companion_priority_recommendations", {
      p_limit: Number.isFinite(limit) ? limit : 10,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseCompanionPriorityRecommendations(data));
  } catch {
    return NextResponse.json({ error: "Failed to load priority recommendations" }, { status: 500 });
  }
}
