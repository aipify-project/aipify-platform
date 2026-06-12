import { NextResponse } from "next/server";
import { parseFocusRecommendations } from "@/lib/aipify/priority-focus-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? "pending";
    const { data, error } = await supabase.rpc("list_priority_focus_recommendations", {
      p_status: status,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseFocusRecommendations(data));
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
      recommendation_id?: string;
      action?: string;
    };

    if (!body.recommendation_id) {
      return NextResponse.json({ error: "recommendation_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("resolve_priority_focus_recommendation", {
      p_recommendation_id: body.recommendation_id,
      p_action: body.action ?? "resolve",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to resolve recommendation" }, { status: 500 });
  }
}
