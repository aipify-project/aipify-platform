import { NextResponse } from "next/server";
import { parseAbosCommandCenterRecommendations } from "@/lib/app-portal/abos-command-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_command_center_recommendations", {
      p_priority: searchParams.get("priority") || null,
      p_recommendation_type: searchParams.get("recommendation_type") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ recommendations: parseAbosCommandCenterRecommendations(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load recommendations" }, { status: 500 });
  }
}
