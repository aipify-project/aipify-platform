/** Nav keys aligned with MarketingNavbar primary items */
export type MarketingNavKey =
  | "platform"
  | "businessPacks"
  | "solutions"
  | "enterprise"
  | "partners"
  | "resources"
  | "company";

const NAV_ROUTE_PREFIXES: Record<MarketingNavKey, string[]> = {
  platform: [
    "/product",
    "/modules",
    "/why-aipify",
    "/security",
    "/companion",
    "/how-aipify-works",
    "/get-started",
  ],
  businessPacks: ["/pricing", "/business-packs"],
  solutions: ["/customer-stories", "/solutions"],
  enterprise: ["/enterprise"],
  partners: [
    "/growth-partners",
    "/growth-partner-terms",
    "/become-a-partner",
    "/sell-aipify",
    "/start-selling",
  ],
  resources: ["/knowledge", "/resources"],
  company: [
    "/company",
    "/careers",
    "/media",
    "/investors",
    "/contact",
    "/book-demo",
    "/early-access",
    "/pilot",
    "/terms",
    "/privacy",
  ],
};

const NAV_HREF_TO_KEY: Record<string, MarketingNavKey> = {
  "/product": "platform",
  "/pricing#business-packs": "businessPacks",
  "/customer-stories": "solutions",
  "/enterprise": "enterprise",
  "/growth-partners": "partners",
  "/knowledge": "resources",
  "/company": "company",
};

/** Resolve active nav item from pathname (client-safe). */
export function resolveActiveNavKey(pathname: string): MarketingNavKey | null {
  for (const [key, prefixes] of Object.entries(NAV_ROUTE_PREFIXES) as [MarketingNavKey, string[]][]) {
    if (prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
      return key;
    }
  }
  return null;
}

export function isNavHrefActive(href: string, pathname: string): boolean {
  const key = NAV_HREF_TO_KEY[href];
  if (!key) return false;
  return resolveActiveNavKey(pathname) === key;
}
