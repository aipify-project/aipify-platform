import { NextResponse } from "next/server";
import { parseAnalyticsInsightsEngineDashboard } from "@/lib/aipify/analytics-insights-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_analytics_insights_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAnalyticsInsightsEngineDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load analytics dashboard" }, { status: 500 });
  }
}
