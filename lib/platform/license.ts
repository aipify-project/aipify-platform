export type CustomerDomainStatus = "active" | "pending" | "disabled" | "removed";

export type DomainVerificationStatus = "unverified" | "pending" | "verified" | "failed";

export type LicenseCheckType =
  | "domain_limit"
  | "installation_limit"
  | "module_access"
  | "subscription_status"
  | "payment_status"
  | "domain_verification"
  | "domain_lock";

export type LicenseCheckResult = "allowed" | "blocked" | "warning";

export type CustomerDomain = {
  id: string;
  customer_id: string;
  installation_id: string | null;
  domain: string;
  status: CustomerDomainStatus;
  verification_status: DomainVerificationStatus;
  verification_method: string | null;
  verified_at: string | null;
  added_at: string;
  created_at: string;
  updated_at: string;
};

export type LicenseCheck = {
  id: string;
  customer_id: string;
  domain: string | null;
  installation_id: string | null;
  check_type: LicenseCheckType;
  result: LicenseCheckResult;
  reason: string;
  created_at: string;
};

export type LicenseLimits = {
  has_subscription: boolean;
  subscription_status?: string;
  plan_key?: string;
  plan_name?: string;
  max_users?: number | null;
  max_installations?: number | null;
  max_domains?: number | null;
  used_users?: number;
  used_installations?: number;
  used_domains?: number;
  allowed_modules?: string[];
  features?: string[];
  subscription_active?: boolean;
};

export type CustomerDomainsOverview = {
  license: LicenseLimits;
  domains: CustomerDomain[];
};

export function isUnlimited(value: number | null | undefined): boolean {
  return value == null;
}

export function formatLimitUsage(
  used: number,
  max: number | null | undefined,
  unlimitedLabel: string
): string {
  if (isUnlimited(max)) return `${used} · ${unlimitedLabel}`;
  return `${used} of ${max}`;
}

export function canAddDomain(license: LicenseLimits): boolean {
  if (!license.has_subscription || !license.subscription_active) return false;
  if (isUnlimited(license.max_domains)) return true;
  return (license.used_domains ?? 0) < (license.max_domains ?? 0);
}

export function canAddInstallation(license: LicenseLimits): boolean {
  if (!license.has_subscription || !license.subscription_active) return false;
  if (isUnlimited(license.max_installations)) return true;
  return (license.used_installations ?? 0) < (license.max_installations ?? 0);
}

export function parseLicenseLimits(data: unknown): LicenseLimits {
  const raw = (data ?? {}) as Record<string, unknown>;
  return {
    has_subscription: Boolean(raw.has_subscription),
    subscription_status: raw.subscription_status as string | undefined,
    plan_key: raw.plan_key as string | undefined,
    plan_name: raw.plan_name as string | undefined,
    max_users: raw.max_users as number | null | undefined,
    max_installations: raw.max_installations as number | null | undefined,
    max_domains: raw.max_domains as number | null | undefined,
    used_users: raw.used_users as number | undefined,
    used_installations: raw.used_installations as number | undefined,
    used_domains: raw.used_domains as number | undefined,
    allowed_modules: Array.isArray(raw.allowed_modules)
      ? (raw.allowed_modules as string[])
      : [],
    features: Array.isArray(raw.features) ? (raw.features as string[]) : [],
    subscription_active: raw.subscription_active as boolean | undefined,
  };
}

export function parseCustomerDomainsOverview(data: unknown): CustomerDomainsOverview {
  const raw = (data ?? {}) as Record<string, unknown>;
  return {
    license: parseLicenseLimits(raw.license),
    domains: Array.isArray(raw.domains) ? (raw.domains as CustomerDomain[]) : [],
  };
}
