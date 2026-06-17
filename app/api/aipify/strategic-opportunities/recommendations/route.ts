import { NextResponse } from "next/server";
import { parseStrategicOpportunitiesOverview } from "@/lib/app-portal/strategic-opportunities";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("list_app_portal_strategic_opportunities", {
      p_category: null, p_status: null, p_department: null,
      p_strategic_priority: null, p_executive_owner: null,
      p_time_horizon: null, p_period_from: null, p_search: null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const overview = parseStrategicOpportunitiesOverview(data);
    return NextResponse.json({ recommendations: overview.recommendations ?? [] });
  } catch {
    return NextResponse.json({ error: "Failed to load recommendations" }, { status: 500 });
  }
}
