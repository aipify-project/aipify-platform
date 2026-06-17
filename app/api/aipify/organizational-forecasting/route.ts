import { NextResponse } from "next/server";
import { parseOrgForecastingOverview } from "@/lib/app-portal/organizational-forecasting";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_org_forecasting", {
      p_category:          searchParams.get("category")           || null,
      p_department:        searchParams.get("department")         || null,
      p_time_horizon:      searchParams.get("time_horizon")       || null,
      p_confidence_level:  searchParams.get("confidence_level")   || null,
      p_executive_owner:   searchParams.get("executive_owner")    || null,
      p_review_status:     searchParams.get("review_status")      || null,
      p_period_from:       searchParams.get("period_from")        || null,
      p_search:            searchParams.get("search")             || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseOrgForecastingOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load organizational forecasting" }, { status: 500 });
  }
}
