import { NextResponse } from "next/server";
import { parsePackRecommendationOverview } from "@/lib/app-portal/business-pack-recommendations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_business_pack_recommendation_engine", {
      p_industry: searchParams.get("industry") || null,
      p_category: searchParams.get("category") || null,
      p_complexity: searchParams.get("complexity") || null,
      p_business_impact: searchParams.get("business_impact") || null,
      p_confidence_level: searchParams.get("confidence_level") || null,
      p_installed_status: searchParams.get("installed_status") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parsePackRecommendationOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load business pack recommendations" }, { status: 500 });
  }
}
