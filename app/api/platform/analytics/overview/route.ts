import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { callCspRpc } from "@/lib/certified-sales-partner";
import { buildPlatformAnalyticsOverview } from "@/lib/platform-analytics/overview";
import { resolveGaMeasurementId } from "@/lib/product-analytics/ga4";
import { createClient } from "@/lib/supabase/server";

/**
 * Platform Admin analytics overview — Core aggregates only.
 * Does not call Google Analytics Data API (would require new secrets).
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const { data: metrics, error: metricsError } = await supabase.rpc("get_platform_metrics");
    const csp = await callCspRpc(supabase, "csp_get_platform_overview");

    const overview = buildPlatformAnalyticsOverview({
      metrics: metricsError ? null : metrics,
      metricsError: metricsError?.message ?? null,
      cspOverview: csp.ready ? csp.data : null,
      cspError: csp.ready ? null : csp.error ?? "csp_unavailable",
      measurementIdConfigured: Boolean(resolveGaMeasurementId()),
    });

    return NextResponse.json(overview, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ error: "analytics_overview_failed" }, { status: 500 });
  }
}
