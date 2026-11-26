import type { KompisProductAccessRead } from "@/lib/commercial-packages/portfolio-presentation";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";

/**
 * Customer storefront read model.
 * Prices and purchase actions come only from a published Platform payload.
 * Kompis Web and Kompis Bedrift cards always reflect the live entitlement read.
 * Missing prices stay unpublished. Checkout stays closed in this adapter.
 */

export const CUSTOMER_CATALOG_ROUTE = "/app/explore";

const KNOWN_IMAGES: Record<string, string> = {
  website_kompis: "/brand/kompis-web-product-visual.png",
  kompis_bedrift: "/brand/kompis-bedrift-product-visual.png",
};

const FAMILY_IDS = {
  website_kompis: ["website_kompis", "kompis_web", "kompis-web"],
  kompis_bedrift: ["kompis_bedrift", "kompis-bedrift"],
} as const;

export type CatalogInterval = "month" | "year";

export type CatalogProductState =
  | "active"
  | "not_licensed"
  | "unknown"
  | "coming_later";

export type CatalogPrice = {
  amount: number;
  currency: string;
  interval: CatalogInterval;
};

export type CatalogProduct = {
  id: string;
  categoryId: string;
  /** Locale title key. Null when the title comes from Platform text. */
  titleKey: "kompisWeb" | "kompisBedrift" | null;
  title: string | null;
  descriptionKey: "kompisWeb" | "kompisBedrift" | null;
  description: string | null;
  imagePath: string | null;
  state: CatalogProductState;
  /** Published prices only. Empty means the price is not published. */
  prices: CatalogPrice[];
  features: string[];
  /** Product workspace. Null when the product is not an active entitlement. */
  openHref: string | null;
  /** Always false until a catalog-scoped checkout path exists. The trial checkout route is not used. */
  checkoutEnabled: false;
};

export type CatalogCategory = {
  id: string;
  labelKey: "all" | "kompis" | "voice" | null;
  label: string | null;
  count: number;
};

export type CustomerCatalog = {
  billingUnavailable: boolean;
  categories: CatalogCategory[];
  products: CatalogProduct[];
};

export type CustomerCatalogInput = {
  billing: unknown;
  access: KompisProductAccessRead;
  billingUnavailable: boolean;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function humanText(value: unknown, max = 180): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  if (text.length < 2 || text.length > max) return null;
  if (/^[a-z0-9_.:/-]+$/i.test(text) && !text.includes(" ")) return null;
  if (text.includes("customerApp.")) return null;
  return text;
}

function categoryId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const id = value.trim().toLowerCase();
  if (!/^[a-z0-9_-]{1,40}$/.test(id)) return null;
  return id;
}

function finiteAmount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
    const amount = Number(value);
    return amount >= 0 ? amount : null;
  }
  return null;
}

function isPublished(row: Record<string, unknown>): boolean {
  return (
    row.published === true ||
    row.catalog_status === "published" ||
    row.publication_status === "published"
  );
}

function publishedPrice(row: Record<string, unknown>, interval: CatalogInterval): CatalogPrice | null {
  if (row.price_status !== "published") return null;
  const amount = finiteAmount(row.amount ?? row.price_amount);
  const currency = typeof row.currency === "string" ? row.currency.trim().toUpperCase() : "";
  if (amount == null || !/^[A-Z]{3}$/.test(currency)) return null;
  return { amount, currency, interval };
}

function pricesFromRow(row: Record<string, unknown>): CatalogPrice[] {
  const prices: CatalogPrice[] = [];
  const directInterval = row.interval === "year" || row.interval === "month" ? row.interval : null;
  if (directInterval) {
    const price = publishedPrice(row, directInterval);
    if (price) prices.push(price);
  }
  const month = asRecord(row.monthly);
  const year = asRecord(row.annual);
  if (month) {
    const price = publishedPrice({ ...month, price_status: month.price_status ?? row.price_status }, "month");
    if (price) prices.push(price);
  }
  if (year) {
    const price = publishedPrice({ ...year, price_status: year.price_status ?? row.price_status }, "year");
    if (price) prices.push(price);
  }
  const seen = new Set<string>();
  return prices.filter((price) => {
    const key = `${price.interval}:${price.currency}:${price.amount}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function featuresFromRow(row: Record<string, unknown>): string[] {
  if (!Array.isArray(row.features)) return [];
  return row.features.map((feature) => humanText(feature, 120)).filter((feature): feature is string => Boolean(feature)).slice(0, 12);
}

function safeImage(value: unknown, fallbackId: string): string | null {
  if (typeof value === "string" && value.startsWith("/brand/") && !value.includes("..")) return value;
  return KNOWN_IMAGES[fallbackId] ?? null;
}

function offerRows(billing: unknown): Record<string, unknown>[] {
  const root = asRecord(billing);
  if (!root) return [];
  const rows: Record<string, unknown>[] = [];
  for (const key of ["catalog_products", "published_products", "offers"]) {
    const value = root[key];
    if (!Array.isArray(value)) continue;
    for (const item of value) {
      const row = asRecord(item);
      if (row && isPublished(row)) rows.push(row);
    }
  }
  return rows;
}

function rowId(row: Record<string, unknown>): string | null {
  const raw = row.id ?? row.product_key ?? row.package_key ?? row.key;
  if (typeof raw !== "string") return null;
  const id = raw.trim().toLowerCase();
  if (!/^[a-z0-9_-]{1,64}$/.test(id)) return null;
  return id;
}

function matchesFamily(id: string, family: keyof typeof FAMILY_IDS): boolean {
  return (FAMILY_IDS[family] as readonly string[]).includes(id);
}

function webState(access: KompisProductAccessRead): CatalogProductState {
  if (access.webKind === "known_plan" && access.webPlan) return "active";
  if (access.webKind === "no_module") return "not_licensed";
  return "unknown";
}

function bedriftState(access: KompisProductAccessRead): CatalogProductState {
  if (access.bedrift === "licensed") return "active";
  if (access.bedrift === "not_licensed") return "not_licensed";
  return "unknown";
}

function mergeOffer(product: CatalogProduct, row: Record<string, unknown>): CatalogProduct {
  const description = humanText(row.description);
  const features = featuresFromRow(row);
  const prices = pricesFromRow(row);
  const comingLater = row.availability === "coming_later" || row.purchasable === false;
  return {
    ...product,
    description: description ?? product.description,
    imagePath: safeImage(row.image_path ?? row.imagePath, product.id),
    features: features.length > 0 ? features : product.features,
    prices: prices.length > 0 ? prices : product.prices,
    state: comingLater && product.state !== "active" ? "coming_later" : product.state,
  };
}

function dynamicProduct(row: Record<string, unknown>): CatalogProduct | null {
  const id = rowId(row);
  if (!id) return null;
  if (matchesFamily(id, "website_kompis") || matchesFamily(id, "kompis_bedrift")) return null;
  const category = categoryId(row.category) ?? "other";
  const title = humanText(row.name ?? row.title);
  if (!title) return null;
  const comingLater = row.availability === "coming_later" || row.purchasable === false;
  return {
    id,
    categoryId: category,
    titleKey: null,
    title,
    descriptionKey: null,
    description: humanText(row.description),
    imagePath: safeImage(row.image_path ?? row.imagePath, id),
    state: comingLater ? "coming_later" : "not_licensed",
    prices: pricesFromRow(row),
    features: featuresFromRow(row),
    openHref: null,
    checkoutEnabled: false,
  };
}

function categoryLabelKey(id: string): CatalogCategory["labelKey"] {
  if (id === "all" || id === "kompis" || id === "voice") return id;
  return null;
}

export function buildCustomerCatalog(input: CustomerCatalogInput): CustomerCatalog {
  const offers = offerRows(input.billing);
  const webOffer = offers.find((row) => {
    const id = rowId(row);
    return id ? matchesFamily(id, "website_kompis") : false;
  });
  const bedriftOffer = offers.find((row) => {
    const id = rowId(row);
    return id ? matchesFamily(id, "kompis_bedrift") : false;
  });

  const webStateValue = webState(input.access);
  let web: CatalogProduct = {
    id: "website_kompis",
    categoryId: "kompis",
    titleKey: "kompisWeb",
    title: null,
    descriptionKey: "kompisWeb",
    description: null,
    imagePath: KNOWN_IMAGES.website_kompis,
    state: webStateValue,
    prices: [],
    features: [],
    openHref: webStateValue === "active" ? FOUNDATION_NAV_BINDINGS.kompisWebDashboard : null,
    checkoutEnabled: false,
  };
  if (webOffer) web = mergeOffer(web, webOffer);

  const bedriftStateValue = bedriftState(input.access);
  let bedrift: CatalogProduct = {
    id: "kompis_bedrift",
    categoryId: "kompis",
    titleKey: "kompisBedrift",
    title: null,
    descriptionKey: "kompisBedrift",
    description: null,
    imagePath: KNOWN_IMAGES.kompis_bedrift,
    state: bedriftStateValue,
    prices: [],
    features: [],
    openHref: bedriftStateValue === "active" ? FOUNDATION_NAV_BINDINGS.kompisBedriftDashboard : null,
    checkoutEnabled: false,
  };
  if (bedriftOffer) bedrift = mergeOffer(bedrift, bedriftOffer);

  const dynamic = offers
    .map(dynamicProduct)
    .filter((product): product is CatalogProduct => Boolean(product));

  const products = [web, bedrift, ...dynamic];
  const categoryIds = ["all", ...new Set(products.map((product) => product.categoryId))];
  const categories: CatalogCategory[] = categoryIds.map((id) => {
    const sample = products.find((product) => product.categoryId === id);
    const offer = offers.find((row) => categoryId(row.category) === id);
    return {
      id,
      labelKey: categoryLabelKey(id),
      label: id === "all" || categoryLabelKey(id) ? null : humanText(offer?.category_label) ?? sample?.title ?? null,
      count: id === "all" ? products.length : products.filter((product) => product.categoryId === id).length,
    };
  });

  return {
    billingUnavailable: input.billingUnavailable,
    categories: categories.filter((category) => category.count > 0),
    products,
  };
}

export function selectCatalogProducts(
  catalog: CustomerCatalog,
  categoryId: string | null | undefined
): CatalogProduct[] {
  const category = categoryId && catalog.categories.some((item) => item.id === categoryId) ? categoryId : "all";
  if (category === "all") return catalog.products;
  return catalog.products.filter((product) => product.categoryId === category);
}

export function catalogHasBothIntervals(products: CatalogProduct[]): boolean {
  return products.some(
    (product) =>
      product.prices.some((price) => price.interval === "month") &&
      product.prices.some((price) => price.interval === "year")
  );
}
