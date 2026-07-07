/** Phase 20 — License, Ownership & Trust Center types. */

export type LicenseServiceStatus = "active" | "grace_period" | "paused";

export type LicenseCenterSectionId =
  | "license_information"
  | "software_ownership"
  | "subscription_status"
  | "data_ownership"
  | "security_principles"
  | "update_policy"
  | "payment_policy"
  | "contact_information"
  | "legal_information"
  | "anti_tampering"
  | "enterprise_note";

export type LicenseSidebarSummary = {
  companyName: string;
  planName: string;
  licenseStatus: LicenseServiceStatus;
  softwareVersion: string;
};

export type LicenseCenterOverview = {
  companyName: string;
  softwareVersion: string;
  licenseStatus: LicenseServiceStatus;
  gracePeriodDays: number;
  gracePeriodEndsAt: string | null;
  pausedMessage: string | null;
  reactivationMessage: string | null;
  hasLicenseCode?: boolean;
  licenseCode?: string | null;
  appSubscriptionLicenseStatus?: string | null;
  subscription: {
    planName: string | null;
    planType: string | null;
    renewalDate: string | null;
    subscriptionStatus: string | null;
    paymentStatus: string | null;
    installationCount: number;
    domainCount: number;
    userCount: number;
  };
};

export type CustomerLicenseCenterRpc = {
  has_customer?: boolean;
  has_license_code?: boolean;
  license_code?: string | null;
  app_subscription_license_status?: string | null;
  license_status?: string;
  company_name?: string;
  software_version?: string;
  software_owner?: string;
  paused_message?: string | null;
  pricing_philosophy_note?: string | null;
  subscription?: Record<string, unknown>;
  legal?: Record<string, unknown>;
};

export type RevealCustomerAppLicenseCodeResponse = {
  ok: boolean;
  license_code?: string;
  license_type?: string;
  license_status?: string;
  revealed_at?: string;
  reason?: string;
};

export function parseCustomerLicenseCenter(data: unknown): CustomerLicenseCenterRpc {
  return (data ?? {}) as CustomerLicenseCenterRpc;
}

export function parseRevealCustomerAppLicenseCode(
  data: unknown
): RevealCustomerAppLicenseCodeResponse {
  const row = (data ?? {}) as Record<string, unknown>;
  return {
    ok: Boolean(row.ok),
    license_code: typeof row.license_code === "string" ? row.license_code : undefined,
    license_type: typeof row.license_type === "string" ? row.license_type : undefined,
    license_status: typeof row.license_status === "string" ? row.license_status : undefined,
    revealed_at: typeof row.revealed_at === "string" ? row.revealed_at : undefined,
    reason: typeof row.reason === "string" ? row.reason : undefined,
  };
}
