import { NextResponse } from "next/server";
import { parseExecutivePortfolioOverview } from "@/lib/app-portal/business-pack-executive-portfolio";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_business_pack_executive_portfolio", {
      p_portfolio_status: searchParams.get("portfolio_status") || null,
      p_pack_key: searchParams.get("pack_key") || null,
      p_maturity_level: searchParams.get("maturity_level") || null,
      p_executive_sponsor: searchParams.get("executive_sponsor") || null,
      p_priority_level: searchParams.get("priority_level") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseExecutivePortfolioOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load executive portfolio" }, { status: 500 });
  }
}
