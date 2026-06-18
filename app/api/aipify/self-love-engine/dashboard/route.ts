import { NextResponse } from "next/server";
import { parseSelfLoveEngineDashboard } from "@/lib/aipify/self-love-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_self_love_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseSelfLoveEngineDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { recommendation_id?: string };
    if (!body.recommendation_id) {
      return NextResponse.json({ error: "recommendation_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("acknowledge_self_love_recommendation", {
      p_recommendation_id: body.recommendation_id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to acknowledge recommendation" }, { status: 500 });
  }
}
