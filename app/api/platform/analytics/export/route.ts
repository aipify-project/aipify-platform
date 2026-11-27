import { NextRequest, NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { callCspRpc } from "@/lib/certified-sales-partner";
import { buildPlatformAnalyticsBundleCsv } from "@/lib/platform-analytics/export-csv";
import { buildPlatformAnalyticsJourney } from "@/lib/platform-analytics/journey";
import { buildPlatformAnalyticsOverview } from "@/lib/platform-analytics/overview";
import { parseAnalyticsPeriod } from "@/lib/platform-analytics/period";
import { buildPlatformProductAnalytics } from "@/lib/platform-analytics/products";
import { buildPlatformAnalyticsSalesPartners } from "@/lib/platform-analytics/sales-partners";
import { resolveGaMeasurementId } from "@/lib/product-analytics/ga4";
import { createClient } from "@/lib/supabase/server";

/** CSV export — same Platform Admin privilege gate as overview. */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const period = parseAnalyticsPeriod(request.nextUrl.searchParams.get("period"));
    const [{ data: metrics, error: metricsError }, csp] = await Promise.all([
      supabase.rpc("get_platform_metrics"),
      callCspRpc(supabase, "csp_get_platform_overview"),
    ]);

    const measurementIdConfigured = Boolean(resolveGaMeasurementId());
    const overview = buildPlatformAnalyticsOverview({
      metrics: metricsError ? null : metrics,
      metricsError: metricsError?.message ?? null,
      cspOverview: csp.ready ? csp.data : null,
      cspError: csp.ready ? null : csp.error ?? "csp_unavailable",
      measurementIdConfigured,
      period,
    });
    const journey = buildPlatformAnalyticsJourney({
      metrics: metricsError ? null : metrics,
      metricsError: metricsError?.message ?? null,
      period,
      measurementConfigured: measurementIdConfigured,
    });
    const products = buildPlatformProductAnalytics({
      metrics: metricsError ? null : metrics,
      metricsError: metricsError?.message ?? null,
      cspOverview: csp.ready ? csp.data : null,
      cspError: csp.ready ? null : csp.error ?? "csp_unavailable",
    });
    const salesPartners = buildPlatformAnalyticsSalesPartners({
      cspOverview: csp.ready ? csp.data : null,
      cspError: csp.ready ? null : csp.error ?? "csp_unavailable",
    });

    const csv = buildPlatformAnalyticsBundleCsv({
      overview,
      journey,
      products,
      salesPartners,
    });

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="aipify-platform-analytics-${period.key}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "analytics_export_failed" }, { status: 500 });
  }
}
