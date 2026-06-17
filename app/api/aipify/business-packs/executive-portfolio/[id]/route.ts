import { NextResponse } from "next/server";
import { parseExecutivePortfolioDetail } from "@/lib/app-portal/business-pack-executive-portfolio";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { data, error } = await supabase.rpc("get_app_portal_business_pack_executive_portfolio_detail", {
      p_pack_key: id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseExecutivePortfolioDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load portfolio detail" }, { status: 500 });
  }
}
