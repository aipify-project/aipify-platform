import type { PublicCompanionVisitorContext } from "@/lib/marketing/public-companion-tenant-faq";
import type {
  WebsiteKompisLicensedAvailability,
  WebsiteKompisLicenseUnavailableReason,
} from "@/lib/marketing/website-kompis-licensed-availability";

export const WEBSITE_KOMPIS_POSITIVE_AVAILABILITY_TTL_MS = 60_000;

const HARD_UNAVAILABLE_REASONS = new Set<WebsiteKompisLicenseUnavailableReason>([
  "license_inactive",
  "entitlement_missing",
]);

export function isWebsiteKompisHardUnavailableReason(
  reason: WebsiteKompisLicenseUnavailableReason,
): boolean {
  return HARD_UNAVAILABLE_REASONS.has(reason);
}

/** Transient lookup failures when the widget sends a full install + domain binding. */
export function isWebsiteKompisTransientPublicAvailabilityFailure(
  availability: WebsiteKompisLicensedAvailability,
  visitorContext: Pick<PublicCompanionVisitorContext, "installId" | "domain">,
): boolean {
  if (availability.available || isWebsiteKompisHardUnavailableReason(availability.reason)) {
    return false;
  }

  const installId = visitorContext.installId?.trim();
  const domain = visitorContext.domain?.trim();
  if (!installId || !domain) {
    return false;
  }

  return (
    availability.reason === "license_unknown" ||
    availability.reason === "domain_unverified" ||
    availability.reason === "install_missing"
  );
}

export function buildWebsiteKompisPublicAvailabilityCacheKey(
  visitorContext: Pick<PublicCompanionVisitorContext, "installId" | "domain">,
): string | null {
  const installId = visitorContext.installId?.trim();
  const domain = visitorContext.domain?.trim().toLowerCase();
  if (!installId || !domain) {
    return null;
  }

  return `${installId}|${domain}`;
}

export class WebsiteKompisPositiveAvailabilityCache {
  private readonly store = new Map<
    string,
    { expiresAt: number; result: WebsiteKompisLicensedAvailability }
  >();

  constructor(private readonly ttlMs = WEBSITE_KOMPIS_POSITIVE_AVAILABILITY_TTL_MS) {}

  get(key: string): WebsiteKompisLicensedAvailability | null {
    const entry = this.store.get(key);
    if (!entry || entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.result.available ? entry.result : null;
  }

  set(key: string, result: WebsiteKompisLicensedAvailability): void {
    if (!result.available) {
      return;
    }

    this.store.set(key, {
      expiresAt: Date.now() + this.ttlMs,
      result,
    });
  }

  clear(): void {
    this.store.clear();
  }
}

export async function resolveWebsiteKompisPublicAvailabilityWithResilience(input: {
  visitorContext: PublicCompanionVisitorContext;
  resolveOnce: () => Promise<WebsiteKompisLicensedAvailability>;
  cache: WebsiteKompisPositiveAvailabilityCache;
}): Promise<WebsiteKompisLicensedAvailability> {
  const cacheKey = buildWebsiteKompisPublicAvailabilityCacheKey(input.visitorContext);
  if (cacheKey) {
    const cached = input.cache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  let result = await input.resolveOnce();

  if (result.available) {
    if (cacheKey) {
      input.cache.set(cacheKey, result);
    }
    return result;
  }

  if (
    cacheKey &&
    isWebsiteKompisTransientPublicAvailabilityFailure(result, input.visitorContext)
  ) {
    const retry = await input.resolveOnce();
    if (retry.available) {
      input.cache.set(cacheKey, retry);
      return retry;
    }

    const cached = input.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    return retry;
  }

  return result;
}
