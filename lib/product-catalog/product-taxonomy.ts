/**
 * Product Center ↔ Core taxonomy contract.
 * Source of truth: public.csp_sales_products + csp_set_app_store_product_taxonomy
 * (app_store_product_dependency_core_foundation_v1).
 *
 * Semantics: ALL — every depends_on_product_keys entry must be entitled later at checkout.
 * Unconfigured = null / empty — never invent backfill.
 */

import { STORE_CATEGORY_ORDER } from "@/lib/app-portal/customer-catalog/categories";

export const PRODUCT_TAXONOMY_TYPES = [
  "primary",
  "addon",
  "voice",
  "sales_growth",
  "other",
] as const;

export type ProductTaxonomyType = (typeof PRODUCT_TAXONOMY_TYPES)[number];

export const PRODUCT_DEPENDENCY_SEMANTICS = "all" as const;

/** Category options for Product Center (no "all" filter id). */
export const PRODUCT_TAXONOMY_CATEGORY_OPTIONS = STORE_CATEGORY_ORDER.filter(
  (id) => id !== "all",
) as ReadonlyArray<Exclude<(typeof STORE_CATEGORY_ORDER)[number], "all">>;

export type ProductTaxonomySnapshot = {
  productKey: string;
  productType: ProductTaxonomyType | null;
  categoryId: string | null;
  dependsOnProductKeys: string[];
  /** True when Core returned null/empty for all taxonomy fields. */
  unconfigured: boolean;
};

export type ProductTaxonomyInput = {
  productKey: unknown;
  productType: unknown;
  categoryId: unknown;
  dependsOnProductKeys: unknown;
};

export type ProductTaxonomyValidation =
  | { ok: true; payload: ProductTaxonomySnapshot }
  | {
      ok: false;
      error:
        | "product_key_invalid"
        | "product_type_invalid"
        | "category_id_invalid"
        | "depends_on_invalid"
        | "self_dependency"
        | "addon_requires_dependency";
      field?: string;
    };

const KEY_RE = /^[a-z0-9_-]{1,64}$/;
const CATEGORY_RE = /^[a-z0-9_]{1,40}$/;

export function normalizeProductKey(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const key = raw.trim().toLowerCase();
  return KEY_RE.test(key) ? key : null;
}

export function normalizeDependencyKeys(keys: unknown): string[] {
  if (!Array.isArray(keys)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of keys) {
    if (typeof item !== "string") continue;
    const key = item.trim().toLowerCase();
    if (!KEY_RE.test(key) || seen.has(key)) continue;
    seen.add(key);
    out.push(key);
    if (out.length >= 12) break;
  }
  return out;
}

export function parseProductType(raw: unknown): ProductTaxonomyType | null | "invalid" {
  if (raw === null || raw === undefined) return null;
  if (typeof raw !== "string") return "invalid";
  const v = raw.trim().toLowerCase();
  if (v === "" || v === "unset" || v === "unconfigured") return null;
  if ((PRODUCT_TAXONOMY_TYPES as readonly string[]).includes(v)) {
    return v as ProductTaxonomyType;
  }
  return "invalid";
}

export function parseCategoryId(raw: unknown): string | null | "invalid" {
  if (raw === null || raw === undefined) return null;
  if (typeof raw !== "string") return "invalid";
  const v = raw.trim().toLowerCase();
  if (v === "") return null;
  if (!CATEGORY_RE.test(v) || v === "all") return "invalid";
  return v;
}

export function taxonomyShowsDependencyPicker(productType: ProductTaxonomyType | null): boolean {
  return productType === "addon";
}

export function validateProductTaxonomyInput(input: ProductTaxonomyInput): ProductTaxonomyValidation {
  const productKey = normalizeProductKey(input.productKey);
  if (!productKey) {
    return { ok: false, error: "product_key_invalid", field: "product_key" };
  }

  const productType = parseProductType(input.productType);
  if (productType === "invalid") {
    return { ok: false, error: "product_type_invalid", field: "product_type" };
  }

  const categoryId = parseCategoryId(input.categoryId);
  if (categoryId === "invalid") {
    return { ok: false, error: "category_id_invalid", field: "category_id" };
  }

  const dependsOnProductKeys = normalizeDependencyKeys(input.dependsOnProductKeys);
  if (dependsOnProductKeys.includes(productKey)) {
    return { ok: false, error: "self_dependency", field: "depends_on_product_keys" };
  }

  // Addon with empty deps is allowed to save as incomplete — purchase gate fail-closes later.
  // Product Center may warn; Core trigger does not require deps for addon type alone.

  const unconfigured =
    productType === null && categoryId === null && dependsOnProductKeys.length === 0;

  return {
    ok: true,
    payload: {
      productKey,
      productType,
      categoryId,
      dependsOnProductKeys,
      unconfigured,
    },
  };
}

export function parseTaxonomyFromCoreRow(row: Record<string, unknown>): ProductTaxonomySnapshot | null {
  const productKey = normalizeProductKey(row.product_key ?? row.productKey);
  if (!productKey) return null;
  const productType = parseProductType(row.product_type ?? row.productType);
  const categoryId = parseCategoryId(row.category_id ?? row.categoryId ?? row.category);
  if (productType === "invalid" || categoryId === "invalid") {
    return {
      productKey,
      productType: null,
      categoryId: null,
      dependsOnProductKeys: [],
      unconfigured: true,
    };
  }
  const dependsOnProductKeys = normalizeDependencyKeys(
    row.depends_on_product_keys ?? row.dependsOnProductKeys ?? row.depends_on,
  );
  return {
    productKey,
    productType,
    categoryId,
    dependsOnProductKeys,
    unconfigured: productType === null && categoryId === null && dependsOnProductKeys.length === 0,
  };
}

/** RPC args for csp_set_app_store_product_taxonomy — empty string clears type/category. */
export function toTaxonomyRpcArgs(snapshot: ProductTaxonomySnapshot): Record<string, unknown> {
  return {
    p_product_key: snapshot.productKey,
    p_product_type: snapshot.productType ?? "",
    p_category_id: snapshot.categoryId ?? "",
    p_depends_on_product_keys: snapshot.dependsOnProductKeys,
  };
}
