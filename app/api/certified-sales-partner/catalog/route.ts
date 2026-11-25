import { NextResponse } from "next/server";
import { callCspRpc, failClosedJson, parsePartnerOverview } from "@/lib/certified-sales-partner";
import { createClient } from "@/lib/supabase/server";

/**
 * Partner catalog facts from Core (published products only): fixed one-time commission and the
 * partner's own certification status per product. Nothing is hardcoded here — when Core is not
 * ready the route fails closed and the UI shows "commission after Platform publish".
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const overview = await callCspRpc(supabase, "csp_get_partner_overview");
    if (!overview.ready) {
      const closed = failClosedJson(overview);
      return NextResponse.json(closed.body, { status: closed.status });
    }

    const parsed = parsePartnerOverview(overview.data);
    return NextResponse.json({
      found: true,
      backend_ready: true,
      partner_status: parsed.partnerStatus,
      products: parsed.products.map((p) => ({
        product_key: p.productKey,
        fixed_commission_amount: p.fixedCommissionAmount,
        currency: p.currency,
        certification_status: p.certificationStatus,
      })),
    });
  } catch {
    return NextResponse.json({ error: "catalog_load_failed" }, { status: 500 });
  }
}
