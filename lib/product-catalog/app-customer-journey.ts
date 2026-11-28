/**
 * APP customer experience journey — Product Center → catalog → detail → entitlement → product use.
 * Feature owner: CUSTOMER APP. No Stripe / financial writes here.
 */

import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { resolveAppCheckoutCta, type CatalogCheckoutCta } from "./checkout-readiness";
import type { UnifiedCatalogProduct } from "./types";
import type { ProductVariantDefinition } from "./variants";

export const APP_SOFTWARE_STORE_ROUTE = "/app/software" as const;
export const APP_SUBSCRIPTION_ROUTE = "/app/account/subscription" as const;
export const APP_BILLING_ROUTE = "/app/settings/billing" as const;
export const APP_LICENSE_ROUTE = "/app/license" as const;

export const APP_CUSTOMER_JOURNEY_OWNERS = {
  productCenterLocaleMedia: "PLATFORM ADMIN",
  appCatalogAndDetail: "CUSTOMER APP",
  variantCommissionWriters: "Agent 1 — do not edit without coordination",
  supportWebsite: "Agent 3 — integrate only; do not rewrite",
  checkoutStripe: "blocked_needs_owner_contract",
  productionMediaUpload: "fail_closed_until_exact_YES",
} as const;

export function appSoftwareDetailHref(productKey: string): string {
  const key = productKey.trim().toLowerCase();
  return `${APP_SOFTWARE_STORE_ROUTE}/${encodeURIComponent(key)}`;
}

export function isValidAppProductKeyParam(value: string): boolean {
  return /^[a-z0-9_-]{1,64}$/.test(value.trim().toLowerCase());
}

/** Map explore / family catalog ids onto unified software detail keys. */
export function exploreProductIdToSoftwareKey(productId: string): string | null {
  const key = productId.trim().toLowerCase();
  if (!key) return null;
  if (key === "website_kompis" || key === "kompis-web" || key === "kompis_web") return "kompis_web";
  if (key === "kompis_bedrift" || key === "kompis-bedrift") return "kompis_bedrift";
  if (!isValidAppProductKeyParam(key)) return null;
  return key;
}

/** Entitlement presentation — never invent active from client alone. */
export type AppProductAccessState =
  | "active"
  | "not_purchased"
  | "expired_or_inactive"
  | "unknown"
  | "dependency_blocked";

export function resolveAppProductAccessState(input: {
  product: UnifiedCatalogProduct;
  /** When known, other product keys that are active for this workspace. */
  activeProductKeys?: ReadonlySet<string> | readonly string[];
}): AppProductAccessState {
  const { product } = input;
  const activeSet =
    input.activeProductKeys instanceof Set
      ? input.activeProductKeys
      : new Set((input.activeProductKeys ?? []).map((k) => k.toLowerCase()));

  if (product.dependsOnProductKeys.length > 0) {
    const unmet = product.dependsOnProductKeys.some((dep) => !activeSet.has(dep.toLowerCase()));
    if (unmet && !product.entitlementActive) {
      return "dependency_blocked";
    }
  }

  if (product.entitlementActive) return "active";
  if (product.purchaseReadiness === "active_open") return "active";
  return "not_purchased";
}

export function resolveAppProductPrimaryAction(input: {
  product: UnifiedCatalogProduct;
  variant: ProductVariantDefinition | null;
  interval: "month" | "year";
  accessState: AppProductAccessState;
}): CatalogCheckoutCta | { kind: "open"; href: string } | { kind: "subscription" } {
  if (input.accessState === "active") {
    if (input.product.openHref) {
      return { kind: "open", href: input.product.openHref };
    }
    return { kind: "subscription" };
  }
  return resolveAppCheckoutCta({
    product: input.product,
    variant: input.variant,
    interval: input.interval,
  });
}

/** Kompis product open targets — reuse Core/APP bindings; no local runtime patches. */
export const KOMPIS_PRODUCT_OPEN_HREFS = {
  kompis_web: FOUNDATION_NAV_BINDINGS.kompisWebDashboard,
  kompis_bedrift: FOUNDATION_NAV_BINDINGS.kompisBedriftDashboard,
} as const;

export const APP_CUSTOMER_JOURNEY_STEPS = [
  "product_center_locale_media",
  "core_channel_catalog",
  "app_software_store",
  "app_software_detail",
  "entitlement_or_fail_closed_checkout",
  "open_kompis_or_subscription",
] as const;
