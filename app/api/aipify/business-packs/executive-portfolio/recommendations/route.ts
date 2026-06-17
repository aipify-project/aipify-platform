import { NextResponse } from "next/server";
import { parseExecutivePortfolioRecommendations } from "@/lib/app-portal/business-pack-executive-portfolio";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_business_pack_executive_portfolio_recommendations");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ recommendations: parseExecutivePortfolioRecommendations(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load recommendations" }, { status: 500 });
  }
}
