import { NextResponse } from "next/server";
import { parseRealEstatePortfolioOperationsCenter } from "@/lib/aipify/real-estate-portfolio-operations-pack";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_real_estate_portfolio_operations_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseRealEstatePortfolioOperationsCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load real estate center" }, { status: 500 });
  }
}
