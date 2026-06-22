export type FinanceProviderImplementationStatus =
  | "connected"
  | "implemented_disconnected"
  | "partial"
  | "specification_only"
  | "placeholder";

export type FinanceCapabilityOperation = "read" | "write";

export type FinanceCapabilityKey =
  | "revenue.read"
  | "expense.read"
  | "invoice.read"
  | "subscription.read"
  | "payment.read"
  | "payout.read"
  | "billing_profile.read"
  | "forecast.read"
  | "report.read"
  | "reconciliation.read"
  | "invoice.draft"
  | "report.export";

/** Blocked in Companion runtime Phase 23 — never expose as enabled capabilities. */
export const FINANCE_BLOCKED_CAPABILITY_KEYS = [
  "payment.execute",
  "payout.execute",
  "refund.execute",
  "bank_transfer.execute",
  "invoice.send",
  "subscription.cancel",
  "financial.correction.destructive",
  "accounting.posting.irreversible",
  "financial.posting",
  "payment.refund",
] as const;

export type FinanceBlockedCapabilityKey = (typeof FINANCE_BLOCKED_CAPABILITY_KEYS)[number];

export type FinanceCapabilityManifest = {
  capability_key: FinanceCapabilityKey;
  operation: FinanceCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1 | 2 | 3;
  entity: string;
  required_permission: string | null;
  privacy_sensitive: boolean;
};

export type FinanceProviderSourceEngine =
  | "finance_operations"
  | "revenue_operations"
  | "unified_billing"
  | "payment_providers"
  | "enterprise_invoicing"
  | "finance_pack_adapter";

export type FinanceProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: FinanceProviderSourceEngine;
  implementation_status: FinanceProviderImplementationStatus;
  capabilities: readonly FinanceCapabilityManifest[];
  search_terms_key: string;
  business_pack_key: string | null;
};

export const FINANCE_BUSINESS_PACK_KEYS = [
  "finance_pack",
  "finance",
  "finance_operations",
] as const;

export function isFinanceBusinessPackActive(activeBusinessPacks: readonly string[]): boolean {
  return activeBusinessPacks.some((pack) =>
    (FINANCE_BUSINESS_PACK_KEYS as readonly string[]).includes(pack),
  );
}

export function buildFinanceCapabilityId(
  providerKey: string,
  capabilityKey: FinanceCapabilityKey,
  operation: FinanceCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}

export function isFinanceCapabilityBlocked(capabilityKey: string): boolean {
  return (FINANCE_BLOCKED_CAPABILITY_KEYS as readonly string[]).includes(capabilityKey);
}
