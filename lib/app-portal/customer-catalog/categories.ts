/**
 * APP product-store category taxonomy.
 * Category ids are stable technical keys. Display names come from i18n (Kompis vs Buddy).
 * Never invent products — only classify rows already present from entitlement or published Core.
 */

export const STORE_CATEGORY_ORDER = [
  "all",
  "kompis",
  "sales_growth",
  "voice",
  "addons",
  "other",
] as const;

export type StoreCategoryId = (typeof STORE_CATEGORY_ORDER)[number];

export type StoreCategoryLabelKey =
  | "all"
  | "kompis"
  | "salesGrowth"
  | "voice"
  | "addons"
  | null;

const CATEGORY_ALIASES: Record<string, Exclude<StoreCategoryId, "all">> = {
  kompis: "kompis",
  buddy: "kompis",
  sales_growth: "sales_growth",
  sales: "sales_growth",
  growth: "sales_growth",
  partners: "sales_growth",
  sales_partner: "sales_growth",
  growth_partner: "sales_growth",
  voice: "voice",
  aipify_voice: "voice",
  addons: "addons",
  add_ons: "addons",
  addon: "addons",
  design: "addons",
  design_pack: "addons",
  other: "other",
};

const PRODUCT_KEY_CATEGORY: Record<string, Exclude<StoreCategoryId, "all">> = {
  website_kompis: "kompis",
  kompis_web: "kompis",
  "kompis-web": "kompis",
  kompis_bedrift: "kompis",
  "kompis-bedrift": "kompis",
  aipify_voice: "voice",
  sales_partner: "sales_growth",
  growth_partner: "sales_growth",
  design_pack: "addons",
  designpakken: "addons",
};

/** Prefer Core category; fall back to known product-key families; else other. */
export function resolveStoreCategoryId(input: {
  productKey: string | null | undefined;
  category: unknown;
}): string {
  if (typeof input.category === "string") {
    const open = input.category.trim().toLowerCase();
    if (/^[a-z0-9_-]{1,40}$/.test(open) && open !== "all") {
      return CATEGORY_ALIASES[open] ?? open;
    }
  }
  const key = (input.productKey ?? "").trim().toLowerCase();
  if (key && PRODUCT_KEY_CATEGORY[key]) return PRODUCT_KEY_CATEGORY[key];
  return "other";
}

export function storeCategoryLabelKey(id: string): StoreCategoryLabelKey {
  if (id === "all") return "all";
  if (id === "kompis") return "kompis";
  if (id === "sales_growth") return "salesGrowth";
  if (id === "voice") return "voice";
  if (id === "addons") return "addons";
  return null;
}

export function sortStoreCategoryIds(ids: Iterable<string>): string[] {
  const set = new Set(ids);
  const ordered: string[] = [];
  for (const id of STORE_CATEGORY_ORDER) {
    if (set.has(id)) {
      ordered.push(id);
      set.delete(id);
    }
  }
  for (const id of [...set].sort()) {
    if (id !== "all") ordered.push(id);
  }
  return ordered;
}

/** Parse Core-declared product dependencies only — never invent barriers. */
export function parseDeclaredDependencies(row: Record<string, unknown>): string[] {
  const raw =
    row.depends_on_product_keys ??
    row.dependsOnProductKeys ??
    row.depends_on ??
    row.dependsOn ??
    row.requires_product_keys ??
    row.requiresProductKeys ??
    row.dependency_product_keys;
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const key = item.trim().toLowerCase();
    if (!/^[a-z0-9_-]{1,64}$/.test(key) || seen.has(key)) continue;
    seen.add(key);
    out.push(key);
    if (out.length >= 12) break;
  }
  return out;
}
