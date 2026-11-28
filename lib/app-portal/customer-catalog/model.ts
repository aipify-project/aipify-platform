import type { KompisProductAccessRead } from "@/lib/commercial-packages/portfolio-presentation";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import {
  parseDeclaredDependencies,
  resolveStoreCategoryId,
  sortStoreCategoryIds,
  storeCategoryLabelKey,
} from "@/lib/app-portal/customer-catalog/categories";

/**
 * Customer storefront read model.
 * Prices and purchase actions come only from a published Platform payload.
 * Family cards for web/bedrift reflect live entitlement reads — technical keys unchanged.
 * Missing prices stay unpublished. Checkout stays closed unless the commerce gate is on.
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
  /** Server-published offer id for commerce checkout. Never a raw Stripe price. */
  offerId?: string;
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
  /** Core-declared product keys this add-on depends on. Empty when undeclared. */
  dependsOnProductKeys: string[];
  /** Product workspace. Null when the product is not an active entitlement. */
  openHref: string | null;
  /**
   * Purchase CTA for catalog-scoped commerce checkout.
   * Remains false in Production; TEST requires AIPIFY_APP_COMMERCE_TEST_CHECKOUT=1.
   */
  checkoutEnabled: boolean;
};

export type CatalogCategory = {
  id: string;
  labelKey: ReturnType<typeof storeCategoryLabelKey>;
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
  /** When false (default), purchase CTAs stay closed even if published prices exist. */
  commerceCheckoutEnabled?: boolean;
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
  const offerRaw = row.offer_id ?? row.offerId;
  const offerId =
    typeof offerRaw === "string" && offerRaw.trim().length > 0 ? offerRaw.trim() : undefined;
  return { amount, currency, interval, ...(offerId ? { offerId } : {}) };
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
  return row.features
    .map((feature) => humanText(feature, 120))
    .filter((feature): feature is string => Boolean(feature))
    .slice(0, 12);
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

function mergeOffer(
  product: CatalogProduct,
  row: Record<string, unknown>,
  commerceCheckoutEnabled: boolean
): CatalogProduct {
  const description = humanText(row.description);
  const features = featuresFromRow(row);
  const prices = pricesFromRow(row);
  const dependsOn = parseDeclaredDependencies(row);
  const comingLater = row.availability === "coming_later" || row.purchasable === false;
  const mergedPrices = prices.length > 0 ? prices : product.prices;
  const canPurchase =
    commerceCheckoutEnabled &&
    !comingLater &&
    product.state !== "active" &&
    mergedPrices.some((price) => Boolean(price.offerId));
  return {
    ...product,
    categoryId: resolveStoreCategoryId({ productKey: product.id, category: row.category }),
    description: description ?? product.description,
    imagePath: safeImage(row.image_path ?? row.imagePath, product.id),
    features: features.length > 0 ? features : product.features,
    prices: mergedPrices,
    dependsOnProductKeys: dependsOn.length > 0 ? dependsOn : product.dependsOnProductKeys,
    state: comingLater && product.state !== "active" ? "coming_later" : product.state,
    checkoutEnabled: canPurchase,
  };
}

function dynamicProduct(
  row: Record<string, unknown>,
  commerceCheckoutEnabled: boolean
): CatalogProduct | null {
  const id = rowId(row);
  if (!id) return null;
  if (matchesFamily(id, "website_kompis") || matchesFamily(id, "kompis_bedrift")) return null;
  const title = humanText(row.name ?? row.title);
  if (!title) return null;
  const comingLater = row.availability === "coming_later" || row.purchasable === false;
  const prices = pricesFromRow(row);
  return {
    id,
    categoryId: resolveStoreCategoryId({ productKey: id, category: row.category }),
    titleKey: null,
    title,
    descriptionKey: null,
    description: humanText(row.description),
    imagePath: safeImage(row.image_path ?? row.imagePath, id),
    state: comingLater ? "coming_later" : "not_licensed",
    prices,
    features: featuresFromRow(row),
    dependsOnProductKeys: parseDeclaredDependencies(row),
    openHref: null,
    checkoutEnabled:
      commerceCheckoutEnabled &&
      !comingLater &&
      prices.some((price) => Boolean(price.offerId)),
  };
}

export function buildCustomerCatalog(input: CustomerCatalogInput): CustomerCatalog {
  const commerceCheckoutEnabled = input.commerceCheckoutEnabled === true;
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
    categoryId: resolveStoreCategoryId({
      productKey: "website_kompis",
      category: webOffer?.category ?? "kompis",
    }),
    titleKey: "kompisWeb",
    title: null,
    descriptionKey: "kompisWeb",
    description: null,
    imagePath: KNOWN_IMAGES.website_kompis,
    state: webStateValue,
    prices: [],
    features: [],
    dependsOnProductKeys: [],
    openHref: webStateValue === "active" ? FOUNDATION_NAV_BINDINGS.kompisWebDashboard : null,
    checkoutEnabled: false,
  };
  if (webOffer) web = mergeOffer(web, webOffer, commerceCheckoutEnabled);

  const bedriftStateValue = bedriftState(input.access);
  let bedrift: CatalogProduct = {
    id: "kompis_bedrift",
    categoryId: resolveStoreCategoryId({
      productKey: "kompis_bedrift",
      category: bedriftOffer?.category ?? "kompis",
    }),
    titleKey: "kompisBedrift",
    title: null,
    descriptionKey: "kompisBedrift",
    description: null,
    imagePath: KNOWN_IMAGES.kompis_bedrift,
    state: bedriftStateValue,
    prices: [],
    features: [],
    dependsOnProductKeys: [],
    openHref: bedriftStateValue === "active" ? FOUNDATION_NAV_BINDINGS.kompisBedriftDashboard : null,
    checkoutEnabled: false,
  };
  if (bedriftOffer) bedrift = mergeOffer(bedrift, bedriftOffer, commerceCheckoutEnabled);

  const dynamic = offers
    .map((row) => dynamicProduct(row, commerceCheckoutEnabled))
    .filter((product): product is CatalogProduct => Boolean(product));

  const products = [web, bedrift, ...dynamic];
  const categoryIds = sortStoreCategoryIds(["all", ...products.map((product) => product.categoryId)]);
  const categories: CatalogCategory[] = categoryIds.map((id) => {
    const sample = products.find((product) => product.categoryId === id);
    const offer = offers.find(
      (row) => resolveStoreCategoryId({ productKey: rowId(row), category: row.category }) === id
    );
    return {
      id,
      labelKey: storeCategoryLabelKey(id),
      label:
        id === "all" || storeCategoryLabelKey(id)
          ? null
          : humanText(offer?.category_label) ?? sample?.title ?? null,
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
