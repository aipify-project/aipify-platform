import { isAppCommerceCheckoutEnabled } from "./checkout-policy";
import type {
  AppCommerceCatalog,
  CommerceBillingInterval,
  PublishedCommercePrice,
  PublishedCommerceProduct,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function finiteAmount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
    const amount = Number(value);
    return amount >= 0 ? amount : null;
  }
  return null;
}

function intervalOf(value: unknown): CommerceBillingInterval | null {
  if (value === "month" || value === "monthly") return "month";
  if (value === "year" || value === "yearly" || value === "annual") return "year";
  return null;
}

function publishedPriceFromRow(
  row: Record<string, unknown>,
  productKey: string,
  fallbackInterval?: CommerceBillingInterval
): PublishedCommercePrice | null {
  const status = String(row.price_status ?? row.publication_status ?? row.status ?? "").toLowerCase();
  if (status && status !== "published") return null;
  if (row.published === false) return null;

  const amount = finiteAmount(row.amount ?? row.price_amount);
  const currency = typeof row.currency === "string" ? row.currency.trim().toUpperCase() : "";
  const interval = intervalOf(row.interval ?? row.billing_interval) ?? fallbackInterval ?? null;
  const stripePriceId =
    typeof row.stripe_price_id === "string"
      ? row.stripe_price_id.trim()
      : typeof row.stripePriceId === "string"
        ? row.stripePriceId.trim()
        : "";
  const offerIdRaw = row.offer_id ?? row.offerId ?? row.id ?? `${productKey}:${interval ?? "month"}:${currency}`;
  const offerId = typeof offerIdRaw === "string" ? offerIdRaw.trim() : "";
  const market =
    typeof row.market === "string" && row.market.trim()
      ? row.market.trim().toUpperCase()
      : typeof row.market_code === "string"
        ? row.market_code.trim().toUpperCase()
        : "DEFAULT";

  if (amount == null || !/^[A-Z]{3}$/.test(currency) || !interval || !offerId) return null;
  // Stripe price may be absent in read-only catalog display; checkout still requires it later.
  const trialRaw = row.trial_days ?? row.trialDays;
  const trialDays =
    typeof trialRaw === "number" && Number.isInteger(trialRaw) && trialRaw >= 0 ? trialRaw : 0;

  return {
    offerId,
    productKey,
    amount,
    currency,
    interval,
    market,
    stripePriceId,
    trialDays,
    publicationStatus: "published",
    locales: {},
  };
}

function productKeyOf(row: Record<string, unknown>): string | null {
  const raw = row.product_key ?? row.productKey ?? row.id ?? row.package_key ?? row.key;
  if (typeof raw !== "string") return null;
  const id = raw.trim().toLowerCase();
  if (!/^[a-z0-9_-]{1,64}$/.test(id)) return null;
  return id;
}

function humanText(value: unknown, max = 240): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  if (text.length < 2 || text.length > max) return null;
  if (text.includes("customerApp.")) return null;
  return text;
}

function featuresOf(row: Record<string, unknown>): string[] {
  if (!Array.isArray(row.features)) return [];
  return row.features
    .map((feature) => humanText(feature, 120))
    .filter((feature): feature is string => Boolean(feature))
    .slice(0, 12);
}

function parseProductRow(row: Record<string, unknown>): PublishedCommerceProduct | null {
  const productKey = productKeyOf(row);
  if (!productKey) return null;
  const published =
    row.published === true ||
    row.catalog_status === "published" ||
    row.publication_status === "published";
  if (!published) return null;

  const prices: PublishedCommercePrice[] = [];
  const direct = publishedPriceFromRow(row, productKey);
  if (direct) prices.push(direct);
  const monthly = asRecord(row.monthly);
  const annual = asRecord(row.annual ?? row.yearly);
  if (monthly) {
    const price = publishedPriceFromRow(
      { ...monthly, price_status: monthly.price_status ?? row.price_status ?? "published" },
      productKey,
      "month"
    );
    if (price) prices.push(price);
  }
  if (annual) {
    const price = publishedPriceFromRow(
      { ...annual, price_status: annual.price_status ?? row.price_status ?? "published" },
      productKey,
      "year"
    );
    if (price) prices.push(price);
  }

  const seen = new Set<string>();
  const uniquePrices = prices.filter((price) => {
    const key = `${price.offerId}:${price.interval}:${price.currency}:${price.amount}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    productKey,
    categoryId:
      typeof row.category === "string" && /^[a-z0-9_-]{1,40}$/i.test(row.category.trim())
        ? row.category.trim().toLowerCase()
        : "other",
    publicationStatus: "published",
    purchasable: row.purchasable !== false && row.availability !== "coming_later",
    title: humanText(row.name ?? row.title),
    description: humanText(row.description),
    imagePath:
      typeof row.image_path === "string" && row.image_path.startsWith("/brand/")
        ? row.image_path
        : typeof row.imagePath === "string" && row.imagePath.startsWith("/brand/")
          ? row.imagePath
          : null,
    features: featuresOf(row),
    prices: uniquePrices,
  };
}

function rowsFromBillingPayload(billing: unknown): Record<string, unknown>[] {
  const root = asRecord(billing);
  if (!root) return [];
  const rows: Record<string, unknown>[] = [];
  for (const key of ["catalog_products", "published_products", "offers", "commerce_offers"]) {
    const value = root[key];
    if (!Array.isArray(value)) continue;
    for (const item of value) {
      const row = asRecord(item);
      if (row) rows.push(row);
    }
  }
  return rows;
}

function rowsFromRpcPayload(payload: unknown): Record<string, unknown>[] {
  const root = asRecord(payload);
  if (!root) return [];
  const products = root.products ?? root.catalog_products ?? root.offers;
  if (!Array.isArray(products)) return [];
  return products.map(asRecord).filter((row): row is Record<string, unknown> => Boolean(row));
}

export function buildAppCommerceCatalog(input: {
  billing?: unknown;
  coreCatalog?: unknown;
  env?: Record<string, string | undefined>;
}): AppCommerceCatalog {
  const blockers: string[] = [];
  const checkoutEnabled = isAppCommerceCheckoutEnabled(input.env);

  let source: AppCommerceCatalog["source"] = "empty";
  let rows = rowsFromRpcPayload(input.coreCatalog);
  if (rows.length > 0) {
    source = "core_rpc";
  } else {
    rows = rowsFromBillingPayload(input.billing);
    if (rows.length > 0) source = "billing_payload";
  }

  const products = rows
    .map(parseProductRow)
    .filter((product): product is PublishedCommerceProduct => Boolean(product));

  if (products.length === 0) {
    blockers.push("no_published_commerce_offers");
  }
  if (!checkoutEnabled) {
    blockers.push("checkout_closed");
  }

  return {
    source,
    checkoutEnabled,
    productionCheckoutClosed: true,
    products,
    blockers,
  };
}

export function findPublishedOffer(
  catalog: AppCommerceCatalog,
  offerId: string
): { product: PublishedCommerceProduct; price: PublishedCommercePrice } | null {
  const id = offerId.trim();
  if (!id) return null;
  for (const product of catalog.products) {
    const price = product.prices.find((entry) => entry.offerId === id);
    if (price) return { product, price };
  }
  return null;
}

/** Merge published commerce prices into legacy explore billing payload shape. */
export function toBillingCatalogPayload(catalog: AppCommerceCatalog): Record<string, unknown> {
  return {
    catalog_products: catalog.products.map((product) => ({
      id: product.productKey,
      product_key: product.productKey,
      category: product.categoryId,
      name: product.title,
      description: product.description,
      image_path: product.imagePath,
      features: product.features,
      published: true,
      publication_status: "published",
      purchasable: product.purchasable,
      monthly: product.prices
        .filter((price) => price.interval === "month")
        .map((price) => ({
          offer_id: price.offerId,
          amount: price.amount,
          currency: price.currency,
          interval: "month",
          market: price.market,
          stripe_price_id: price.stripePriceId,
          trial_days: price.trialDays,
          price_status: "published",
        }))[0],
      annual: product.prices
        .filter((price) => price.interval === "year")
        .map((price) => ({
          offer_id: price.offerId,
          amount: price.amount,
          currency: price.currency,
          interval: "year",
          market: price.market,
          stripe_price_id: price.stripePriceId,
          trial_days: price.trialDays,
          price_status: "published",
        }))[0],
    })),
  };
}
