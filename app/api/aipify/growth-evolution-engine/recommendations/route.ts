import { NextResponse } from "next/server";
import { parseGrowthEvolutionRecommendations } from "@/lib/aipify/growth-evolution-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? "pending";

    const { data, error } = await supabase.rpc("list_growth_evolution_recommendations", {
      p_status: status,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseGrowthEvolutionRecommendations(data));
  } catch {
    return NextResponse.json({ error: "Failed to list recommendations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: "accept" | "dismiss" | "defer";
      recommendation_id?: string;
      notes?: string;
    };

    if (!body.recommendation_id || !body.action) {
      return NextResponse.json({ error: "recommendation_id and action required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("review_growth_evolution_recommendation", {
      p_recommendation_id: body.recommendation_id,
      p_action: body.action,
      p_notes: body.notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to review recommendation" }, { status: 500 });
  }
}
