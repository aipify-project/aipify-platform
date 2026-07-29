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

export type DomainRoleCode =
  | "customer"
  | "runtime"
  | "license"
  | "historical"
  | "unknown";

export function hasAuthoritativeTrial(input: {
  subscriptionStatus?: string | null;
  trialStartsAt?: string | null;
  trialEndsAt?: string | null;
  now?: number;
}): boolean {
  const status = (input.subscriptionStatus ?? "").trim().toLowerCase();
  if (status === "trialing") return true;

  const now = input.now ?? Date.now();
  const startRaw = (input.trialStartsAt ?? "").trim();
  const endRaw = (input.trialEndsAt ?? "").trim();
  const startMs = startRaw ? Date.parse(startRaw) : Number.NaN;
  const endMs = endRaw ? Date.parse(endRaw) : Number.NaN;

  if (!Number.isNaN(endMs)) {
    return endMs >= now;
  }
  if (!Number.isNaN(startMs)) {
    return startMs <= now;
  }
  return false;
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
  if (status === "canceled") {
    return input.map.cancelled ?? input.map.canceled ?? input.unknownFallback;
  }
  return mapLookupLabel(status, input.map, input.unknownFallback);
}

/**
 * Customer lifecycle status must never invent a trial badge.
 * `customers.status = trial` is not authoritative trial evidence.
 */
export function mapCustomerLifecycleStatus(input: {
  customerStatus: string | null | undefined;
  subscriptionStatus?: string | null;
  trialStartsAt?: string | null;
  trialEndsAt?: string | null;
  map: Record<string, string>;
  agreementMap?: Record<string, string>;
  unknownFallback: string;
}): string {
  const customerStatus = (input.customerStatus ?? "").trim().toLowerCase();
  const subscriptionStatus = (input.subscriptionStatus ?? "").trim().toLowerCase();
  const authoritativeTrial = hasAuthoritativeTrial({
    subscriptionStatus: input.subscriptionStatus,
    trialStartsAt: input.trialStartsAt,
    trialEndsAt: input.trialEndsAt,
  });

  if (customerStatus === "trial" || customerStatus === "trialing") {
    if (authoritativeTrial) {
      return (
        input.agreementMap?.trialing ??
        input.map.trial ??
        input.unknownFallback
      );
    }
    if (subscriptionStatus === "active") {
      return input.map.active ?? input.agreementMap?.active ?? input.unknownFallback;
    }
    if (subscriptionStatus) {
      return mapAgreementStatus({
        status: subscriptionStatus,
        trialStartsAt: input.trialStartsAt,
        trialEndsAt: input.trialEndsAt,
        map: input.agreementMap ?? input.map,
        unknownFallback: input.unknownFallback,
      });
    }
    return input.map.active ?? input.unknownFallback;
  }

  return mapLookupLabel(customerStatus, input.map, input.unknownFallback);
}

export function shouldShowTrialBadge(input: {
  subscriptionStatus?: string | null;
  trialStartsAt?: string | null;
  trialEndsAt?: string | null;
  customerStatus?: string | null;
}): boolean {
  return hasAuthoritativeTrial(input);
}

/**
 * Prefer localized business names over raw seeded plan_name values.
 * Unonight Lifetime is the known Customer Zero pilot agreement identity.
 */
export function mapAgreementDisplayName(input: {
  planName?: string | null;
  planKey?: string | null;
  planType?: string | null;
  lifetime?: boolean;
  customerName?: string | null;
  labels: {
    unonightPilotAgreement: string;
    unonightUnlimitedAgreement: string;
    lifetimeAgreement?: string;
  };
}): string {
  const rawName = (input.planName ?? "").trim();
  const planKey = (input.planKey ?? "").trim().toLowerCase();
  const planType = (input.planType ?? "").trim().toLowerCase();
  const lifetime =
    Boolean(input.lifetime) ||
    planKey === "lifetime" ||
    planType === "lifetime" ||
    /lifetime/i.test(rawName);

  const lowerName = rawName.toLowerCase();
  if (lowerName === "unonight lifetime" || /^unonight\s+lifetime$/i.test(rawName)) {
    return input.labels.unonightPilotAgreement;
  }

  if (lifetime && /unonight/i.test(rawName)) {
    return input.labels.unonightPilotAgreement;
  }

  if (lifetime && (!rawName || /lifetime/i.test(rawName))) {
    const customer = (input.customerName ?? "").trim();
    if (/^unonight$/i.test(customer)) {
      return input.labels.unonightPilotAgreement;
    }
    if (customer && input.labels.lifetimeAgreement) {
      return input.labels.lifetimeAgreement.replace("{name}", customer);
    }
  }

  if (rawName) return rawName;
  return input.labels.unonightUnlimitedAgreement;
}

export function deriveLicenseProvisioningStatus(input: {
  domain?: string | null;
  installId?: string | null;
  installationId?: string | null;
  installationStatus?: string | null;
  storedStatus?: string | null;
}): string {
  const domain = (input.domain ?? "").trim();
  const installId = (input.installId ?? input.installationId ?? "").trim();
  const installationStatus = (input.installationStatus ?? "").trim().toLowerCase();
  const stored = (input.storedStatus ?? "").trim().toLowerCase();

  if (!domain) return "requires_domain";
  if (!installId) return "requires_installation";
  if (installationStatus === "failed" || stored === "failed") return "failed";
  if (stored === "active" || stored === "provisioned") return stored;
  if (stored === "ready_for_activation") return stored;
  return "ready_for_activation";
}

export function canShowCreateLicenseAction(input: {
  hasQualifiedAgreement: boolean;
  licenses: Array<{ status?: string | null; productCode?: string | null }>;
}): boolean {
  if (!input.hasQualifiedAgreement) return false;
  const blocking = input.licenses.some((license) => {
    const status = (license.status ?? "").trim().toLowerCase();
    const code = (license.productCode ?? "").trim().toLowerCase();
    if (code && code !== "app_subscription") return false;
    return status === "active" || status === "pending";
  });
  return !blocking;
}

export function canShowDomainInstallationAction(input: {
  licenses: Array<{
    status?: string | null;
    productCode?: string | null;
    domain?: string | null;
    provisioningStatus?: string | null;
  }>;
}): boolean {
  return input.licenses.some((license) => {
    const status = (license.status ?? "").trim().toLowerCase();
    const code = (license.productCode ?? "").trim().toLowerCase();
    if (code && code !== "app_subscription") return false;
    if (status !== "active" && status !== "pending") return false;
    const domain = (license.domain ?? "").trim();
    const provisioning = (license.provisioningStatus ?? "").trim().toLowerCase();
    return !domain || provisioning === "requires_domain";
  });
}

export function formatDomainInstallationKpi(input: {
  domainCount: number;
  installationCount: number;
  domainLabel: string;
  installationLabel: string;
  domainsLabel: string;
  installationsLabel: string;
}): { domains: { label: string; value: number }; installations: { label: string; value: number } } {
  return {
    domains: {
      label: input.domainsLabel || input.domainLabel,
      value: input.domainCount,
    },
    installations: {
      label: input.installationsLabel || input.installationLabel,
      value: input.installationCount,
    },
  };
}

export function formatCountWithNoun(
  count: number,
  singular: string,
  plural: string,
): string {
  const noun = count === 1 ? singular : plural;
  return `${count} ${noun}`;
}

export function mapDomainRole(input: {
  hostname?: string | null;
  status?: string | null;
  installId?: string | null;
  isPrimary?: boolean | null;
  licenseDomain?: string | null;
  role?: string | null;
}): DomainRoleCode {
  const explicit = (input.role ?? "").trim().toLowerCase();
  if (
    explicit === "customer" ||
    explicit === "runtime" ||
    explicit === "license" ||
    explicit === "historical"
  ) {
    return explicit;
  }

  const status = (input.status ?? "").trim().toLowerCase();
  if (status === "removed" || status === "disabled" || status === "revoked") {
    return "historical";
  }

  const hostname = (input.hostname ?? "").trim().toLowerCase();
  const licenseDomain = (input.licenseDomain ?? "").trim().toLowerCase();
  if (hostname && licenseDomain && hostname === licenseDomain) {
    return "license";
  }
  if ((input.installId ?? "").trim()) {
    return "runtime";
  }
  if (input.isPrimary) {
    return "customer";
  }
  return "unknown";
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
