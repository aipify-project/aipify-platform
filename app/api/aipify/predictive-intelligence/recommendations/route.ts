import { NextResponse } from "next/server";
import { parsePredictiveOverview } from "@/lib/app-portal/predictive-intelligence";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_predictive_intelligence_recommendations");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const overview = parsePredictiveOverview(data);
    return NextResponse.json({ found: overview.found, recommendations: overview.recommendations ?? [] });
  } catch {
    return NextResponse.json({ error: "Failed to load recommendations" }, { status: 500 });
  }
}
