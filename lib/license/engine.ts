import type { LicenseCenterSectionId, LicenseServiceStatus } from "./types";

export const AIPIFY_SOFTWARE_OWNER = "Aipify Group AS";
export const AIPIFY_OFFICIAL_WEBSITE = "https://aipify.ai";
export const AIPIFY_SUPPORT_EMAIL = "support@aipify.ai";
export const AIPIFY_PRIVACY_EMAIL = "privacy@aipify.ai";
export const AIPIFY_PLATFORM_VERSION = "1.0.0";

/** Payment grace period before services pause (Phase 20). */
export const PAYMENT_GRACE_PERIOD_DAYS = 3;

export const LICENSE_CENTER_SECTIONS: readonly LicenseCenterSectionId[] = [
  "license_information",
  "software_ownership",
  "subscription_status",
  "data_ownership",
  "security_principles",
  "update_policy",
  "payment_policy",
  "contact_information",
  "legal_information",
  "anti_tampering",
  "enterprise_note",
] as const;

export const PAUSED_SERVICES_DISABLED = [
  "active_assistance",
  "executive_briefings",
  "recommendations",
  "new_actions",
  "install_heartbeat_processing",
] as const;

export const PAUSED_SERVICES_ALLOWED = [
  "billing_information",
  "license_center",
  "payment_recovery",
] as const;

export const PAUSED_STATE_MESSAGE =
  "Aipify services are temporarily paused due to an overdue subscription. Services will resume automatically once payment has been received.";

export const REACTIVATION_MESSAGE =
  "Welcome back. Aipify has resumed normal operations.";

export const CUSTOMER_DATA_PROTECTION_RULES = [
  "Do not delete settings",
  "Do not delete recommendations",
  "Do not delete preferences",
  "Do not delete installations",
  "Do not delete approval policies",
  "Retain operational configuration",
] as const;

export function formatSoftwareVersion(version: string = AIPIFY_PLATFORM_VERSION): string {
  return version.startsWith("v") ? version : `v${version}`;
}

export function isLicenseServiceStatus(
  value: string
): value is LicenseServiceStatus {
  return value === "active" || value === "grace_period" || value === "paused";
}

export function mapSubscriptionToLicenseStatus(
  subscriptionStatus: string | null | undefined,
  daysPastDue: number | null
): LicenseServiceStatus {
  if (!subscriptionStatus || subscriptionStatus === "active" || subscriptionStatus === "trialing") {
    return "active";
  }
  if (subscriptionStatus === "past_due") {
    if (daysPastDue !== null && daysPastDue <= PAYMENT_GRACE_PERIOD_DAYS) {
      return "grace_period";
    }
    return "paused";
  }
  if (subscriptionStatus === "paused" || subscriptionStatus === "cancelled") {
    return "paused";
  }
  return "active";
}
