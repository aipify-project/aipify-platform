import type { AppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";

/** APP license entitlement key for Website Kompis (tenant_modules / plan gate). */
export const WEBSITE_KOMPIS_CAPABILITY_KEY = "website_kompis" as const;

export const WEBSITE_KOMPIS_LICENSE_UNAVAILABLE_REASONS = [
  "available",
  "license_inactive",
  "entitlement_missing",
  "license_unknown",
  "domain_unverified",
  "install_missing",
] as const;

export type WebsiteKompisLicenseUnavailableReason =
  (typeof WEBSITE_KOMPIS_LICENSE_UNAVAILABLE_REASONS)[number];

export type WebsiteKompisLicensedAvailability = {
  available: boolean;
  reason: WebsiteKompisLicenseUnavailableReason;
  capabilityKey?: string;
};

export type WebsiteKompisLicenseEvaluationInput = {
  licenseServiceStatus?: string | null;
  subscriptionStatus?: string | null;
  appLicenseStatus?: string | null;
  entitlementEnabled?: boolean | null;
  domainVerified?: boolean;
  installTrusted?: boolean;
  licenseResolvable?: boolean;
};

/** Resolved public install/domain binding inputs for fail-closed trust evaluation. */
export type WebsiteKompisPublicInstallDomainTrustResolution = {
  requestedInstallId?: string | null;
  requestedDomain?: string | null;
  tenantId?: string | null;
  resolvedInstallId?: string | null;
  resolvedDomain?: string | null;
  hasVerifiedActiveBinding?: boolean;
};

export type WebsiteKompisPublicInstallDomainTrustResult = {
  trusted: boolean;
  reason: WebsiteKompisLicenseUnavailableReason;
  /** Internal resolution — never expose in public metadata. */
  tenantId?: string;
  installId?: string;
  domain?: string;
};

function normalizeTrustDomain(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return normalized || null;
}

/** Pure fail-closed trust check for public Website Kompis install/domain binding. */
export function evaluateWebsiteKompisPublicInstallDomainTrust(
  input: WebsiteKompisPublicInstallDomainTrustResolution,
): WebsiteKompisPublicInstallDomainTrustResult {
  const requestedInstallId = input.requestedInstallId?.trim() || null;
  const requestedDomain = normalizeTrustDomain(input.requestedDomain);

  if (!requestedInstallId && !requestedDomain) {
    return { trusted: false, reason: "install_missing" };
  }

  if (!input.hasVerifiedActiveBinding) {
    if (requestedInstallId && !requestedDomain) {
      return { trusted: false, reason: "domain_unverified" };
    }
    if (requestedDomain && !input.resolvedInstallId) {
      return { trusted: false, reason: "install_missing" };
    }
    return { trusted: false, reason: "domain_unverified" };
  }

  const resolvedInstallId = input.resolvedInstallId?.trim() || null;
  const resolvedDomain = normalizeTrustDomain(input.resolvedDomain);
  const tenantId = input.tenantId?.trim() || null;

  if (!tenantId) {
    return { trusted: false, reason: "license_unknown" };
  }

  if (!resolvedInstallId || !resolvedDomain) {
    return { trusted: false, reason: "install_missing" };
  }

  if (requestedInstallId && requestedInstallId !== resolvedInstallId) {
    return { trusted: false, reason: "domain_unverified" };
  }

  if (requestedDomain && requestedDomain !== resolvedDomain) {
    return { trusted: false, reason: "domain_unverified" };
  }

  return {
    trusted: true,
    reason: "available",
    tenantId,
    installId: resolvedInstallId,
    domain: resolvedDomain,
  };
}

const INACTIVE_LICENSE_SERVICE_STATUSES = new Set(["paused", "suspended", "cancelled"]);
const INACTIVE_SUBSCRIPTION_STATUSES = new Set([
  "cancelled",
  "paused",
  "past_due",
  "unpaid",
  "incomplete_expired",
]);
const ACTIVE_LICENSE_SERVICE_STATUSES = new Set(["active", "grace_period"]);
const ACTIVE_SUBSCRIPTION_STATUSES = new Set(["active", "trialing", "trial"]);
const ACTIVE_APP_LICENSE_STATUSES = new Set(["active", "trial", "grace_period"]);

export function isWebsiteKompisLicenseServiceActive(
  status: string | null | undefined,
): boolean {
  if (!status) return false;
  return ACTIVE_LICENSE_SERVICE_STATUSES.has(status);
}

export function isWebsiteKompisSubscriptionActive(
  status: string | null | undefined,
): boolean {
  if (!status) return false;
  return ACTIVE_SUBSCRIPTION_STATUSES.has(status);
}

export function isWebsiteKompisAppLicenseActive(
  status: string | null | undefined,
): boolean {
  if (!status) return false;
  return ACTIVE_APP_LICENSE_STATUSES.has(status);
}

export function isWebsiteKompisLicenseServiceInactive(
  status: string | null | undefined,
): boolean {
  if (!status) return false;
  return INACTIVE_LICENSE_SERVICE_STATUSES.has(status);
}

export function isWebsiteKompisSubscriptionInactive(
  status: string | null | undefined,
): boolean {
  if (!status) return false;
  return INACTIVE_SUBSCRIPTION_STATUSES.has(status);
}

export function evaluateWebsiteKompisLicensedAvailability(
  input: WebsiteKompisLicenseEvaluationInput,
): WebsiteKompisLicensedAvailability {
  const capabilityKey = WEBSITE_KOMPIS_CAPABILITY_KEY;

  if (input.installTrusted === false) {
    return { available: false, reason: "install_missing", capabilityKey };
  }

  if (input.domainVerified === false) {
    return { available: false, reason: "domain_unverified", capabilityKey };
  }

  if (input.licenseResolvable === false) {
    return { available: false, reason: "license_unknown", capabilityKey };
  }

  const licenseInactive =
    isWebsiteKompisLicenseServiceInactive(input.licenseServiceStatus) ||
    isWebsiteKompisSubscriptionInactive(input.subscriptionStatus) ||
    (input.appLicenseStatus != null &&
      !isWebsiteKompisAppLicenseActive(input.appLicenseStatus));

  if (licenseInactive) {
    return { available: false, reason: "license_inactive", capabilityKey };
  }

  const licenseActive =
    isWebsiteKompisLicenseServiceActive(input.licenseServiceStatus) ||
    isWebsiteKompisSubscriptionActive(input.subscriptionStatus) ||
    isWebsiteKompisAppLicenseActive(input.appLicenseStatus);

  if (!licenseActive) {
    return { available: false, reason: "license_unknown", capabilityKey };
  }

  if (input.entitlementEnabled === false) {
    return { available: false, reason: "entitlement_missing", capabilityKey };
  }

  if (input.entitlementEnabled !== true) {
    return { available: false, reason: "license_unknown", capabilityKey };
  }

  return { available: true, reason: "available", capabilityKey };
}

export function evaluateWebsiteKompisLicensedAvailabilityFromAppContext(input: {
  context: Pick<
    AppOrganizationContext,
    "state" | "license_status" | "customer_id" | "organization_role" | "user_role"
  >;
  entitlementEnabled: boolean | null;
  domainVerified?: boolean;
  installTrusted?: boolean;
}): WebsiteKompisLicensedAvailability {
  if (input.context.state !== "ready") {
    if (input.context.state === "license_inactive" || input.context.state === "subscription_inactive") {
      return {
        available: false,
        reason: "license_inactive",
        capabilityKey: WEBSITE_KOMPIS_CAPABILITY_KEY,
      };
    }
    if (input.context.state === "entitlement_missing") {
      return {
        available: false,
        reason: "entitlement_missing",
        capabilityKey: WEBSITE_KOMPIS_CAPABILITY_KEY,
      };
    }
    return {
      available: false,
      reason: "license_unknown",
      capabilityKey: WEBSITE_KOMPIS_CAPABILITY_KEY,
    };
  }

  return evaluateWebsiteKompisLicensedAvailability({
    appLicenseStatus: input.context.license_status,
    entitlementEnabled: input.entitlementEnabled,
    domainVerified: input.domainVerified,
    installTrusted: input.installTrusted,
    licenseResolvable: input.context.customer_id != null,
  });
}

export function canManageWebsiteKompisDomainSettings(
  context: Pick<AppOrganizationContext, "organization_role" | "user_role">,
): boolean {
  const role = context.organization_role ?? context.user_role;
  return role === "owner" || role === "admin";
}

export function mapWebsiteKompisAvailabilityToPublicReason(
  reason: WebsiteKompisLicenseUnavailableReason,
): "license_required" | "not_available" {
  if (reason === "license_inactive" || reason === "entitlement_missing") {
    return "license_required";
  }
  return "not_available";
}
