import { NextRequest, NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { buildPlatformAnalyticsJourney } from "@/lib/platform-analytics/journey";
import { parseAnalyticsPeriod } from "@/lib/platform-analytics/period";
import { resolveGaMeasurementId } from "@/lib/product-analytics/ga4";
import { createClient } from "@/lib/supabase/server";

/** Authoritative funnel steps from Core aggregates — never seeded demo conversion rates. */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const period = parseAnalyticsPeriod(request.nextUrl.searchParams.get("period"));
    const { data: metrics, error: metricsError } = await supabase.rpc("get_platform_metrics");

    const journey = buildPlatformAnalyticsJourney({
      metrics: metricsError ? null : metrics,
      metricsError: metricsError?.message ?? null,
      period,
      measurementConfigured: Boolean(resolveGaMeasurementId()),
    });

    return NextResponse.json(journey, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "analytics_journey_failed" }, { status: 500 });
  }
}
