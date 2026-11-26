import { createAppCommerceCheckout } from "@/lib/app-commerce/create-commerce-checkout";
import { loadAppCommerceCatalog } from "@/lib/app-commerce/load-catalog";
import { resolveCommerceTenantContext } from "@/lib/app-commerce/resolve-tenant";
import { getCustomerBillingCenter } from "@/lib/commercial-packages/client";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Server-bound commerce checkout.
 * Accepts only a published offerId. Never trusts client amount, Stripe price, tenant, or partner IDs.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { offerId?: unknown; offer_id?: unknown };
    const offerId =
      typeof body.offerId === "string"
        ? body.offerId.trim()
        : typeof body.offer_id === "string"
          ? body.offer_id.trim()
          : "";
    if (!offerId) {
      return NextResponse.json({ error: "offer_required" }, { status: 400 });
    }

    const supabase = await createClient();
    const tenant = await resolveCommerceTenantContext(supabase);
    if (!tenant) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    if (!tenant.customerId) {
      return NextResponse.json(
        { error: "tenant_unresolved", message: "Customer record is required before checkout." },
        { status: 409 }
      );
    }

    let billing: unknown = null;
    try {
      billing = await getCustomerBillingCenter(supabase);
    } catch {
      billing = null;
    }

    const catalog = await loadAppCommerceCatalog({ supabase, billing });
    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const result = await createAppCommerceCheckout({
      catalog,
      offerId,
      customerId: tenant.customerId,
      organizationId: tenant.organizationId,
      customerEmail: tenant.email,
      successUrl: `${origin}/app/settings/billing?checkout=success`,
      cancelUrl: `${origin}/app/explore?checkout=cancelled`,
      hasActivePaidSubscription: tenant.hasActivePaidSubscription,
    });

    if (!result.ok) {
      const status =
        result.error === "unauthorized"
          ? 401
          : result.error === "checkout_closed"
            ? 403
            : result.error === "active_subscription_exists"
              ? 409
              : result.error === "offer_not_found" || result.error === "offer_not_purchasable"
                ? 404
                : 400;
      return NextResponse.json(result, { status });
    }

    if (result.demoMode) {
      return NextResponse.json({
        ...result,
        blocked: true,
        message: "Stripe TEST credentials are not configured. Checkout contract is ready but external E2E is blocked.",
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: "stripe_error", message }, { status: 500 });
  }
}
