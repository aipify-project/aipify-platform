import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import {
  buildCustomerPriceHints,
  type CustomerPriceHint,
  customerPriceLookupKey,
} from "@/lib/product-catalog/commission-rates-presentation";
import {
  listVariantCommissionRatesFromCore,
  loadProductVariantsBundle,
} from "@/lib/product-catalog/variant-commission-core";
import { resolveVariantCommissionPersistCapability } from "@/lib/product-catalog/variant-commission-core-gate";
import { createClient } from "@/lib/supabase/server";

/**
 * Shared variant commission list for Provisjonspriser.
 * Same Core source as product editor. Includes customer price hints from variants bundle when available.
 * Production fail-closed until activation flag. Never invents prices.
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const capability = resolveVariantCommissionPersistCapability();
    if (!capability.canAttemptPersist) {
      return NextResponse.json(
        {
          found: false,
          persist_enabled: false,
          error: capability.productionBound ? "production_fail_closed" : "persist_env_disabled",
          reason: capability.reason,
          rows: [],
          price_hints: {},
          settlement_activated: false,
        },
        { status: capability.productionBound ? 403 : 503 },
      );
    }

    const url = new URL(request.url);
    const productIdRaw = (url.searchParams.get("product_id") ?? "").trim();
    const productId = productIdRaw || null;

    const listed = await listVariantCommissionRatesFromCore(supabase, productId);
    if (!listed.ok) {
      const status =
        listed.error === "production_fail_closed"
          ? 403
          : listed.error === "forbidden"
            ? 403
            : listed.error === "unauthorized"
              ? 401
              : 503;
      return NextResponse.json(
        {
          found: false,
          persist_enabled: false,
          error: listed.error,
          detail: listed.detail ?? null,
          rows: [],
          price_hints: {},
          settlement_activated: false,
        },
        { status },
      );
    }

    const priceHints: Record<string, CustomerPriceHint> = {};
    const productKeys = [
      ...new Set(
        listed.rows
          .map((r) => (r.productKey ?? "").trim())
          .filter((k) => k.length > 0),
      ),
    ];
    for (const productKey of productKeys) {
      const loaded = await loadProductVariantsBundle(supabase, productKey);
      if (!loaded.ok) continue;
      Object.assign(priceHints, buildCustomerPriceHints(productKey, loaded.variants));
    }

    return NextResponse.json({
      found: true,
      persist_enabled: true,
      rows: listed.rows,
      price_hints: priceHints,
      settlement_activated: false,
      // Expose key helper for clients that rebuild lookups.
      lookup_key_example: customerPriceLookupKey("product_key", "variant_key", "month"),
    });
  } catch {
    return NextResponse.json(
      { found: false, error: "variant_commission_rates_load_failed", rows: [], price_hints: {} },
      { status: 500 },
    );
  }
}
