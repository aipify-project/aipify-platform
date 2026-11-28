/**
 * APP product-dependency purchase gate — contract for later checkout wiring.
 *
 * AUTHORING_ONLY for AIPIFY_APP_PRODUCT_DEPENDENCY_CORE_FOUNDATION_V1.
 * Do NOT import from live createAppCommerceCheckout in this job.
 *
 * Semantics: ALL — every depends_on_product_keys entry must be actively entitled
 * in the same authorized organization workspace.
 *
 * Fail-closed: missing/unknown taxonomy or entitlement → deny purchase.
 */

export const PRODUCT_DEPENDENCY_SEMANTICS = "all" as const;

export type ProductDependencyProductType =
  | "primary"
  | "addon"
  | "voice"
  | "sales_growth"
  | "other"
  | null;

export type ProductDependencyCatalogRow = {
  productKey: string;
  productType?: ProductDependencyProductType;
  dependsOnProductKeys?: string[] | null;
};

export type WorkspaceEntitlementSnapshot = {
  organizationId: string;
  /** product_key → active entitlement in THIS organization only */
  activeProductKeys: ReadonlySet<string> | readonly string[];
};

export type DependencyPurchaseDecision =
  | { ok: true; productKey: string; requires: string[] }
  | {
      ok: false;
      productKey: string;
      error:
        | "tenant_unresolved"
        | "product_key_invalid"
        | "dependency_data_unknown"
        | "dependency_unsatisfied"
        | "self_dependency"
        | "foreign_tenant";
      missingKeys?: string[];
      message: string;
    };

function asKeySet(input: WorkspaceEntitlementSnapshot["activeProductKeys"]): Set<string> {
  const values = Array.from(input as Iterable<string>);
  return new Set(
    values
      .map((k) => k.trim().toLowerCase())
      .filter((k) => Boolean(k)),
  );
}

export function normalizeDependencyKeys(keys: string[] | null | undefined): string[] {
  if (!Array.isArray(keys)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of keys) {
    if (typeof item !== "string") continue;
    const key = item.trim().toLowerCase();
    if (!/^[a-z0-9_-]{1,64}$/.test(key) || seen.has(key)) continue;
    seen.add(key);
    out.push(key);
    if (out.length >= 12) break;
  }
  return out;
}

/**
 * Evaluate whether a product may be purchased given Core-declared dependencies
 * and the caller’s entitled keys in one organization.
 *
 * Rules:
 * - Empty depends_on → allowed (no declared barrier).
 * - productType null with non-empty depends_on → still enforce ALL deps.
 * - productType "addon" with empty depends_on → deny (unknown dependency data).
 * - Any required key missing/expired/other-tenant → deny.
 * - Self-dependency → deny.
 */
export function evaluateDependencyPurchaseGate(input: {
  organizationId: string | null | undefined;
  expectedOrganizationId: string | null | undefined;
  product: ProductDependencyCatalogRow;
  entitlements: WorkspaceEntitlementSnapshot;
}): DependencyPurchaseDecision {
  const productKey = (input.product.productKey ?? "").trim().toLowerCase();
  if (!productKey || !/^[a-z0-9_-]{1,64}$/.test(productKey)) {
    return {
      ok: false,
      productKey: productKey || "",
      error: "product_key_invalid",
      message: "Product key is invalid.",
    };
  }

  const orgId = (input.organizationId ?? "").trim();
  const expectedOrg = (input.expectedOrganizationId ?? "").trim();
  if (!orgId || !expectedOrg) {
    return {
      ok: false,
      productKey,
      error: "tenant_unresolved",
      message: "Organization could not be resolved for dependency check.",
    };
  }
  if (orgId !== expectedOrg || input.entitlements.organizationId !== orgId) {
    return {
      ok: false,
      productKey,
      error: "foreign_tenant",
      message: "Entitlements are not scoped to the authorized workspace.",
    };
  }

  const requires = normalizeDependencyKeys(input.product.dependsOnProductKeys ?? null);
  if (requires.includes(productKey)) {
    return {
      ok: false,
      productKey,
      error: "self_dependency",
      message: "Product cannot depend on itself.",
      missingKeys: [productKey],
    };
  }

  if (input.product.productType === "addon" && requires.length === 0) {
    return {
      ok: false,
      productKey,
      error: "dependency_data_unknown",
      message: "Addon is missing required primary-product dependency data.",
    };
  }

  if (requires.length === 0) {
    return { ok: true, productKey, requires: [] };
  }

  const active = asKeySet(input.entitlements.activeProductKeys);
  const missing = requires.filter((key) => !active.has(key));
  if (missing.length > 0) {
    return {
      ok: false,
      productKey,
      error: "dependency_unsatisfied",
      missingKeys: missing,
      message: "Required primary product entitlements are not active in this workspace.",
    };
  }

  return { ok: true, productKey, requires };
}

/**
 * Later wiring proposal (NOT applied in this job):
 * In createAppCommerceCheckout, after offer match and before Stripe:
 *   1) Load Core product taxonomy (product_type + depends_on_product_keys) for offer.productKey
 *   2) Load active entitlements for input.organizationId only
 *   3) Call evaluateDependencyPurchaseGate(...)
 *   4) On ok:false → return error without Stripe
 * Keep resolveAppCommerceCheckoutGate production-closed until owner opens checkout.
 */
export const DEPENDENCY_PURCHASE_GATE_LATER_WIRING = {
  liveCheckoutFile: "lib/app-commerce/create-commerce-checkout.ts",
  insertAfter: "findPublishedOffer",
  keepCheckoutClosed: true,
  noStripeOnDeny: true,
} as const;
