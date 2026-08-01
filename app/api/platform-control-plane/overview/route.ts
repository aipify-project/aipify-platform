import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePlatformControlPlaneOverview } from "@/lib/platform-control-plane";

/**
 * Compose control-plane overview with authoritative finance from get_platform_metrics
 * when the overview RPC still returns null for MRR / outstanding invoices.
 */
function mergeAuthoritativeFinance(
  overviewRaw: unknown,
  metricsRaw: unknown,
): unknown {
  const overview =
    overviewRaw && typeof overviewRaw === "object"
      ? ({ ...(overviewRaw as Record<string, unknown>) } as Record<string, unknown>)
      : {};
  const finance =
    overview.finance && typeof overview.finance === "object"
      ? ({ ...(overview.finance as Record<string, unknown>) } as Record<string, unknown>)
      : {};
  const metrics =
    metricsRaw && typeof metricsRaw === "object"
      ? (metricsRaw as Record<string, unknown>)
      : {};
  const revenue =
    metrics.revenue && typeof metrics.revenue === "object"
      ? (metrics.revenue as Record<string, unknown>)
      : {};

  const outstandingNull =
    finance.outstanding_invoices == null && finance.outstandingInvoices == null;
  const mrrNull =
    finance.monthly_recurring_revenue == null && finance.monthlyRecurringRevenue == null;

  if (outstandingNull && revenue.outstanding_invoice_amount != null) {
    finance.outstanding_invoices = revenue.outstanding_invoice_amount;
    finance.outstanding_invoice_currency = "NOK";
  }
  if (mrrNull && revenue.mrr != null) {
    finance.monthly_recurring_revenue = revenue.mrr;
    finance.mrr_currency = "NOK";
  }
  if (outstandingNull || mrrNull) {
    finance.source_note = "composed_with_get_platform_metrics";
    finance.drill_down = {
      outstanding_invoices: "/platform/billing/invoices",
      monthly_recurring_revenue: "/platform/billing",
      payment_past_due: "/platform/billing/payment-operations",
    };
  }

  overview.finance = finance;
  return overview;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_platform_control_plane_overview");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    const { data: metrics } = await supabase.rpc("get_platform_metrics");
    const composed = mergeAuthoritativeFinance(data, metrics);

    return NextResponse.json({
      data: parsePlatformControlPlaneOverview(composed),
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to load platform control-plane overview." },
      { status: 500 },
    );
  }
}
