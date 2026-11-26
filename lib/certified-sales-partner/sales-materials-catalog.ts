/**
 * Curated, read-only sales materials registry for Certified Sales Partners (PLATFORM ADMIN view).
 *
 * Only assets that already ship in `public/` are registered. Nothing is invented: categories with
 * no published asset stay empty and the UI says so. Admin publish / upload mutations are gated
 * until the materials SQL candidate is applied by the owner (see
 * `docs/platform/csp-selgere-complete-sql-candidate-v2.md`).
 */

export const CSP_SALES_MATERIAL_CATEGORIES = [
  "product_images",
  "logos",
  "pdf_sheets",
  "social",
  "email_templates",
  "signatures",
] as const;
export type CspSalesMaterialCategory = (typeof CSP_SALES_MATERIAL_CATEGORIES)[number];

export type CspSalesMaterialItem = {
  id: string;
  category: CspSalesMaterialCategory;
  /** i18n key suffix under `platform.sellers.ops.materials.items.*`. */
  labelKey: string;
  /** Public asset path served from `public/`. */
  href: string;
  /** File extension shown as a small format tag (not a raw status code). */
  format: "png" | "svg" | "pdf";
  /** Same as `href` — kept for panels that address assets by path. */
  assetPath: string;
  version: number;
  mimeHint: string;
  /** Always true for registered assets; unpublished assets are simply not registered. */
  published: boolean;
  /** Product keys this asset belongs to; empty = applies to every product. */
  productKeys: readonly string[];
};

export const CSP_SALES_MATERIALS_REGISTRY: readonly CspSalesMaterialItem[] = [
  {
    id: "kompis-web-product-visual",
    category: "product_images",
    labelKey: "kompisWebVisual",
    href: "/brand/kompis-web-product-visual.png",
    assetPath: "/brand/kompis-web-product-visual.png",
    format: "png",
    version: 1,
    mimeHint: "image/png",
    published: true,
    productKeys: ["kompis_web"],
  },
  {
    id: "kompis-bedrift-product-visual",
    category: "product_images",
    labelKey: "kompisBedriftVisual",
    href: "/brand/kompis-bedrift-product-visual.png",
    assetPath: "/brand/kompis-bedrift-product-visual.png",
    format: "png",
    version: 1,
    mimeHint: "image/png",
    published: true,
    productKeys: ["kompis_bedrift"],
  },
  {
    id: "aipify-companion-icon-light",
    category: "logos",
    labelKey: "companionIconLight",
    href: "/aipify-companion-launcher-icon-light.svg",
    assetPath: "/aipify-companion-launcher-icon-light.svg",
    format: "svg",
    version: 1,
    mimeHint: "image/svg+xml",
    published: true,
    productKeys: [],
  },
  {
    id: "aipify-companion-icon-dark",
    category: "logos",
    labelKey: "companionIconDark",
    href: "/aipify-companion-launcher-icon-dark.svg",
    assetPath: "/aipify-companion-launcher-icon-dark.svg",
    format: "svg",
    version: 1,
    mimeHint: "image/svg+xml",
    published: true,
    productKeys: [],
  },
];

export function listSalesMaterialsByCategory(
  category: CspSalesMaterialCategory,
  registry: readonly CspSalesMaterialItem[] = CSP_SALES_MATERIALS_REGISTRY,
): CspSalesMaterialItem[] {
  return registry.filter((item) => item.category === category);
}

/** Categories that currently hold no published asset — rendered as honest empty groups. */
export function listEmptySalesMaterialCategories(
  registry: readonly CspSalesMaterialItem[] = CSP_SALES_MATERIALS_REGISTRY,
): CspSalesMaterialCategory[] {
  return CSP_SALES_MATERIAL_CATEGORIES.filter((c) => !registry.some((i) => i.category === c));
}

/** Alias used by earlier panel/test code. */
export const CSP_SALES_MATERIALS_CATALOG = CSP_SALES_MATERIALS_REGISTRY;

/** Published assets only, optionally narrowed by product. Never returns invented assets. */
export function listPublishedSalesMaterials(
  opts: { productKey?: string; locale?: string } = {},
  registry: readonly CspSalesMaterialItem[] = CSP_SALES_MATERIALS_REGISTRY,
): CspSalesMaterialItem[] {
  return registry.filter(
    (item) =>
      item.published &&
      (!opts.productKey || item.productKeys.length === 0 || item.productKeys.includes(opts.productKey)),
  );
}
