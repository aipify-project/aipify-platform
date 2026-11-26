import { resolveAppCommerceCheckoutGate } from "@/lib/app-commerce/checkout-policy";
import { loadAppCommerceCatalog } from "@/lib/app-commerce/load-catalog";
import { getCustomerBillingCenter } from "@/lib/commercial-packages/client";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Authenticated published commerce catalog — never returns Stripe secrets. */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    let billing: unknown = null;
    try {
      billing = await getCustomerBillingCenter(supabase);
    } catch {
      billing = null;
    }

    const catalog = await loadAppCommerceCatalog({ supabase, billing });
    const gate = resolveAppCommerceCheckoutGate();

    return NextResponse.json({
      checkoutEnabled: catalog.checkoutEnabled,
      productionCheckoutClosed: true,
      environment: gate.environment,
      source: catalog.source,
      blockers: catalog.blockers,
      products: catalog.products.map((product) => ({
        productKey: product.productKey,
        categoryId: product.categoryId,
        publicationStatus: product.publicationStatus,
        purchasable: product.purchasable,
        title: product.title,
        description: product.description,
        imagePath: product.imagePath,
        features: product.features,
        prices: product.prices.map((price) => ({
          offerId: price.offerId,
          amount: price.amount,
          currency: price.currency,
          interval: price.interval,
          market: price.market,
          trialDays: price.trialDays,
          // Never expose stripePriceId to the browser.
          hasStripePrice: Boolean(price.stripePriceId),
        })),
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Catalog unavailable";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
