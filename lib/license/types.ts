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
