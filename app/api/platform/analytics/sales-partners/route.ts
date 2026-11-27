import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { callCspRpc } from "@/lib/certified-sales-partner";
import { buildPlatformAnalyticsSalesPartners } from "@/lib/platform-analytics/sales-partners";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const csp = await callCspRpc(supabase, "csp_get_platform_overview");
    const payload = buildPlatformAnalyticsSalesPartners({
      cspOverview: csp.ready ? csp.data : null,
      cspError: csp.ready ? null : csp.error ?? "csp_unavailable",
    });

    return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "analytics_sales_partners_failed" }, { status: 500 });
  }
}
