import { NextResponse } from "next/server";
import { parsePredictiveOverview } from "@/lib/app-portal/predictive-intelligence";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_predictive_intelligence", {
      p_category: searchParams.get("category") || null,
      p_confidence_level: searchParams.get("confidence_level") || null,
      p_time_horizon: searchParams.get("time_horizon") || null,
      p_organizational_area: searchParams.get("organizational_area") || null,
      p_potential_impact: searchParams.get("potential_impact") || null,
      p_review_status: searchParams.get("review_status") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parsePredictiveOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load predictive intelligence center" }, { status: 500 });
  }
}
