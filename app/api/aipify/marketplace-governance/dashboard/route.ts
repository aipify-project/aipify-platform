import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseMarketplaceGovernanceDashboard } from "@/lib/aipify/marketplace-governance";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_marketplace_governance_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseMarketplaceGovernanceDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load marketplace governance dashboard" }, { status: 500 });
  }
}
