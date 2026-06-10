import type { DataAccessLevel, EnterpriseSecurityModel } from "./types";

/** Phase 19 §1 — customer owns data; Aipify owns intelligence layer. */
export const TRUST_CORE_PRINCIPLE =
  "The customer owns the data. Aipify owns the intelligence layer.";

export const DATA_MINIMIZATION_QUESTION =
  "Do we need this information? If no — do not collect, store, or process it.";

export const DATA_ACCESS_LEVELS: ReadonlyArray<{
  level: DataAccessLevel;
  order: number;
  label: string;
  default: boolean;
}> = [
  {
    level: "metadata",
    order: 1,
    label: "Metadata Access",
    default: true,
  },
  {
    level: "read_only_operational",
    order: 2,
    label: "Read-Only Operational Access",
    default: false,
  },
  {
    level: "approved_operational_actions",
    order: 3,
    label: "Approved Operational Actions",
    default: false,
  },
  {
    level: "customer_hosted_intelligence",
    order: 4,
    label: "Customer-Hosted Intelligence",
    default: false,
  },
] as const;

export const ENTERPRISE_SECURITY_MODELS: readonly EnterpriseSecurityModel[] = [
  "cloud_intelligence",
  "hybrid_intelligence",
  "customer_hosted_intelligence",
] as const;

export const DEFAULT_ACCESS_LEVEL: DataAccessLevel = "metadata";

/** Read-only first — all new integrations default here (§8). */
export const DEFAULT_CONNECTOR_PERMISSION = "read" as const;

export const CUSTOMER_OWNED_SYSTEMS = [
  "shopify",
  "woocommerce",
  "supabase",
  "postgresql",
  "erp",
  "crm",
  "accounting",
  "support",
  "inventory",
  "email",
] as const;

export const CUSTOMER_TRUST_MESSAGES = [
  "Your operational data remains under your control.",
  "Aipify stores intelligence, not ownership of your business.",
  "Permissions are transparent and revocable.",
  "Sensitive actions require approval.",
] as const;

export const INSTALLATION_SECURITY_CHECKS = [
  "tenant_id",
  "installation_id",
  "installation_token",
  "registered_domains",
  "subscription_status",
  "permission_scope",
] as const;

export function isDataAccessLevel(value: string): value is DataAccessLevel {
  return DATA_ACCESS_LEVELS.some((entry) => entry.level === value);
}

export function requiresExplicitApproval(level: DataAccessLevel): boolean {
  return level !== "metadata";
}
