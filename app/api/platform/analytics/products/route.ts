import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { callCspRpc } from "@/lib/certified-sales-partner";
import { buildPlatformProductAnalytics } from "@/lib/platform-analytics/products";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const [{ data: metrics, error: metricsError }, csp] = await Promise.all([
      supabase.rpc("get_platform_metrics"),
      callCspRpc(supabase, "csp_get_platform_overview"),
    ]);

    const products = buildPlatformProductAnalytics({
      metrics: metricsError ? null : metrics,
      metricsError: metricsError?.message ?? null,
      cspOverview: csp.ready ? csp.data : null,
      cspError: csp.ready ? null : csp.error ?? "csp_unavailable",
    });

    return NextResponse.json(products, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "analytics_products_failed" }, { status: 500 });
  }
}
