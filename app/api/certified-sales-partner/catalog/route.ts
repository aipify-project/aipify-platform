import { NextResponse } from "next/server";
import { callCspRpc, failClosedJson, parsePartnerOverview } from "@/lib/certified-sales-partner";
import { loadPartnerSaleVariantCommissions } from "@/lib/product-catalog/partner-variant-commission-read";
import { createClient } from "@/lib/supabase/server";

/**
 * Partner catalog facts from Core (published products only):
 * - product-level fixed commission + certification (overview)
 * - variant × interval commission slots from get_csp_product_variants_bundle
 *
 * Never invents rates. Null slot = not configured (≠ explicit 0).
 * Does not activate settlement, Stripe, or checkout.
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
    const productKeys = parsed.products
      .map((p) => p.productKey)
      .filter((k): k is string => typeof k === "string" && k.length > 0);

    const { variantsByProductKey, slots, failedKeys } = await loadPartnerSaleVariantCommissions(
      supabase,
      productKeys,
    );

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
      commissions: slots,
      variants_by_key: variantsByProductKey,
      variants_failed_keys: failedKeys,
    });
  } catch {
    return NextResponse.json({ error: "catalog_load_failed" }, { status: 500 });
  }
}
