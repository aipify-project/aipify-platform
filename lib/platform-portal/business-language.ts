/**
 * Authoritative Platform Portal UI mapping for business language.
 * Raw DB codes stay in data contracts; only visible labels are mapped here.
 */

export type AgreementDurationCode = "lifetime" | "monthly" | "yearly" | "annual";

export type BusinessLanguageMaps = {
  duration: Record<string, string>;
  agreementStatus: Record<string, string>;
  licenseStatus: Record<string, string>;
  setupStatus: Record<string, string>;
  licenseProducts: Record<string, { name: string; description?: string }>;
  unknownStatus: string;
};

export function hasAuthoritativeTrial(input: {
  subscriptionStatus?: string | null;
  trialStartsAt?: string | null;
  trialEndsAt?: string | null;
}): boolean {
  const status = (input.subscriptionStatus ?? "").trim().toLowerCase();
  if (status === "trialing") return true;
  return Boolean(
    (input.trialStartsAt && input.trialStartsAt.trim()) ||
      (input.trialEndsAt && input.trialEndsAt.trim()),
  );
}

export function mapLookupLabel(
  value: string | null | undefined,
  map: Record<string, string>,
  unknownFallback: string,
): string {
  if (!value || !value.trim()) return unknownFallback;
  const key = value.trim().toLowerCase();
  return map[key] ?? map[value.trim()] ?? unknownFallback;
}

export function mapAgreementDuration(
  code: string | null | undefined,
  map: Record<string, string>,
  unknownFallback: string,
): string {
  const normalized = (code ?? "").trim().toLowerCase();
  if (normalized === "annual") {
    return map.yearly ?? map.annual ?? unknownFallback;
  }
  return mapLookupLabel(normalized, map, unknownFallback);
}

export function mapAgreementStatus(input: {
  status: string | null | undefined;
  lifetime?: boolean;
  trialStartsAt?: string | null;
  trialEndsAt?: string | null;
  map: Record<string, string>;
  unknownFallback: string;
}): string {
  const status = (input.status ?? "").trim().toLowerCase();
  if (input.lifetime && !hasAuthoritativeTrial(input) && status === "trialing") {
    return input.map.active ?? input.unknownFallback;
  }
  return mapLookupLabel(status, input.map, input.unknownFallback);
}

export function mapLicenseProductName(
  productCode: string | null | undefined,
  productName: string | null | undefined,
  products: Record<string, { name: string; description?: string }>,
  unknownFallback: string,
): string {
  const code = (productCode ?? "").trim().toLowerCase();
  if (code && products[code]?.name) return products[code].name;

  const rawName = (productName ?? "").trim();
  if (!rawName) return unknownFallback;

  const lower = rawName.toLowerCase();
  if (lower === "lifetime" || lower === "app_subscription") {
    return products.app_subscription?.name ?? unknownFallback;
  }
  if (lower.includes("app subscription")) {
    return products.app_subscription?.name ?? unknownFallback;
  }
  return rawName;
}

export function mapLicenseProductDescription(
  productCode: string | null | undefined,
  productDescription: string | null | undefined,
  products: Record<string, { name: string; description?: string }>,
): string | null {
  const code = (productCode ?? "").trim().toLowerCase();
  if (code && products[code]?.description) return products[code].description ?? null;

  const raw = (productDescription ?? "").trim();
  if (!raw) return null;
  if (/organization app subscription/i.test(raw) || /app subscription license/i.test(raw)) {
    return products.app_subscription?.description ?? raw;
  }
  return raw;
}

export function shouldShowRawProductCode(productCode: string | null | undefined): boolean {
  const code = (productCode ?? "").trim().toLowerCase();
  if (!code) return false;
  // Never surface known internal codes as primary text; secondary technical section only.
  return code !== "app_subscription";
}
