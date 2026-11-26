/**
 * APP Abonnement Premium V3 — internal tab contract (?tab=).
 * Sidebar keeps a single Abonnement entry; deep-links land on the matching tab.
 */

export const SUBSCRIPTION_TAB_IDS = [
  "overview",
  "products",
  "store",
  "addons",
  "capacity",
  "license",
  "invoices",
] as const;

export type SubscriptionTabId = (typeof SUBSCRIPTION_TAB_IDS)[number];

export const DEFAULT_SUBSCRIPTION_TAB: SubscriptionTabId = "overview";

export const SUBSCRIPTION_ROUTE = "/app/account/subscription";

const ALIASES: Record<string, SubscriptionTabId> = {
  overview: "overview",
  oversigt: "overview",
  products: "products",
  mine: "products",
  "my-products": "products",
  store: "store",
  shop: "store",
  catalog: "store",
  packages: "store",
  addons: "addons",
  modules: "addons",
  tilleggsmoduler: "addons",
  capacity: "capacity",
  usage: "capacity",
  kapasitet: "capacity",
  license: "license",
  licence: "license",
  lisens: "license",
  invoices: "invoices",
  fakturaer: "invoices",
  billing: "invoices",
};

export function isSubscriptionTabId(value: unknown): value is SubscriptionTabId {
  return typeof value === "string" && (SUBSCRIPTION_TAB_IDS as readonly string[]).includes(value);
}

/** Invalid / missing → overview. Safe for SSR + client. */
export function parseSubscriptionTab(raw: string | null | undefined): SubscriptionTabId {
  if (!raw) return DEFAULT_SUBSCRIPTION_TAB;
  const key = raw.trim().toLowerCase();
  if (isSubscriptionTabId(key)) return key;
  return ALIASES[key] ?? DEFAULT_SUBSCRIPTION_TAB;
}

export function subscriptionTabHref(tab: SubscriptionTabId): string {
  if (tab === DEFAULT_SUBSCRIPTION_TAB) return SUBSCRIPTION_ROUTE;
  return `${SUBSCRIPTION_ROUTE}?tab=${tab}`;
}

/** Map legacy APP destinations onto the subscription tab surface. */
export function legacyPathToSubscriptionTab(pathname: string): SubscriptionTabId | null {
  if (pathname.startsWith("/app/account/invoices")) return "invoices";
  if (pathname.startsWith("/app/settings/billing/invoice-details")) return "invoices";
  if (pathname.startsWith("/app/settings/modules")) return "addons";
  if (pathname.startsWith("/app/license") || pathname.startsWith("/app/licenses")) return "license";
  if (pathname.startsWith("/app/settings/billing/packages")) return "store";
  if (pathname.startsWith("/app/settings/billing") && !pathname.includes("payment-providers")) {
    return "overview";
  }
  return null;
}
