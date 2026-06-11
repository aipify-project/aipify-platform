import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseBlueprintRecommendations } from "@/lib/aipify/industry-blueprints";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const status = request.nextUrl.searchParams.get("status");
    const { data, error } = await supabase.rpc("list_blueprint_recommendations", {
      p_status: status,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ recommendations: parseBlueprintRecommendations(data) });
  } catch {
    return NextResponse.json({ error: "Failed to list recommendations" }, { status: 500 });
  }
}
