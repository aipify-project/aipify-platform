import {
  getMarketingBusinessPackRegistryEntry,
  isMarketingBusinessPackSlug,
  type MarketingBusinessPackSlug,
} from "./registry";

const EARLY_ACCESS_PATH = "/early-access";
const CONTACT_PATH = "/contact";

/** Registration / sales URL with optional validated `businessPack` query param. */
export function buildMarketingRegistrationUrl(businessPack?: string | null): string {
  if (!businessPack) return EARLY_ACCESS_PATH;
  const normalized = businessPack.trim().toLowerCase();
  if (!isMarketingBusinessPackSlug(normalized)) return EARLY_ACCESS_PATH;
  return `${EARLY_ACCESS_PATH}?businessPack=${normalized}`;
}

export function buildMarketingBusinessPackPrimaryCtaHref(slug: MarketingBusinessPackSlug): string {
  const entry = getMarketingBusinessPackRegistryEntry(slug);
  if (!entry) return EARLY_ACCESS_PATH;
  if (entry.registrationMode === "contact") {
    return `${CONTACT_PATH}?businessPack=${slug}`;
  }
  return buildMarketingRegistrationUrl(slug);
}

export function parseMarketingBusinessPackFromSearchParam(
  value: string | string[] | undefined | null,
): MarketingBusinessPackSlug | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const normalized = raw.trim().toLowerCase();
  return isMarketingBusinessPackSlug(normalized) ? normalized : null;
}
