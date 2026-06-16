import { NextResponse } from "next/server";
import { parseExecutiveCompanionRecommendations } from "@/lib/app-portal/executive-companion";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_executive_companion_recommendations", {
      p_priority: searchParams.get("priority") || null,
      p_strategic_area: searchParams.get("strategic_area") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ found: true, recommendations: parseExecutiveCompanionRecommendations(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load recommendations" }, { status: 500 });
  }
}
