/**
 * APP buy/upgrade readiness — fail-closed until provider price + entitlement contracts are live.
 */

import type { ProductVariantDefinition } from "./variants";
import { priceForInterval } from "./variants";
import type { ProductCatalogPurchaseReadiness, UnifiedCatalogProduct } from "./types";

export type CatalogCheckoutCta =
  | { kind: "buy"; enabled: false; reason: "checkout_not_live" }
  | { kind: "upgrade"; enabled: false; reason: "checkout_not_live" }
  | { kind: "open"; href: string }
  | { kind: "contact" }
  | { kind: "info_only" }
  | { kind: "not_for_purchase" };

/**
 * Never enable Buy/Upgrade from display prices alone.
 * Requires purchasable provider price id + purchaseReadiness checkout_ready.
 */
export function resolveAppCheckoutCta(input: {
  product: UnifiedCatalogProduct;
  variant: ProductVariantDefinition | null;
  interval: "month" | "year";
}): CatalogCheckoutCta {
  const { product, variant, interval } = input;

  if (product.purchaseReadiness === "active_open" && product.openHref) {
    return { kind: "open", href: product.openHref };
  }

  if (product.purchaseReadiness === "contact") {
    return { kind: "contact" };
  }

  if (product.purchaseReadiness === "info_only") {
    return { kind: "info_only" };
  }

  if (product.purchaseReadiness === "checkout_ready") {
    const price = variant ? priceForInterval(variant, interval) : null;
    const mapped =
      price?.purchasable === true &&
      typeof price.providerPriceId === "string" &&
      price.providerPriceId.length > 0;
    if (!mapped) {
      return { kind: "buy", enabled: false, reason: "checkout_not_live" };
    }
    // Production still fail-closed: no live checkout session creator in this job.
    return { kind: "buy", enabled: false, reason: "checkout_not_live" };
  }

  return { kind: "not_for_purchase" };
}

export function isVariantIntervalPurchasable(
  variant: ProductVariantDefinition,
  interval: "month" | "year",
): boolean {
  const price = priceForInterval(variant, interval);
  return (
    price != null &&
    price.purchasable === true &&
    typeof price.providerPriceId === "string" &&
    price.providerPriceId.length > 0
  );
}

export function purchaseReadinessLabelKey(
  readiness: ProductCatalogPurchaseReadiness,
): string {
  switch (readiness) {
    case "active_open":
      return "activeOpen";
    case "checkout_ready":
      return "checkoutReady";
    case "contact":
      return "contact";
    case "info_only":
      return "infoOnly";
    default:
      return "notForPurchase";
  }
}
