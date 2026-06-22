export type SalesProviderImplementationStatus =
  | "connected"
  | "implemented_disconnected"
  | "partial"
  | "specification_only"
  | "placeholder";

export type SalesCapabilityOperation = "read" | "write";

export type SalesCapabilityKey =
  | "lead.read"
  | "prospect.read"
  | "customer.read"
  | "contact.read"
  | "opportunity.read"
  | "pipeline.read"
  | "deal.read"
  | "conversion.read"
  | "attribution.read"
  | "customer_health.read"
  | "churn_risk.read"
  | "sales_forecast.read"
  | "follow_up.read"
  | "follow_up.create"
  | "sales_task.create"
  | "response.draft";

/** Blocked in Companion runtime Phase 24 — never expose as enabled capabilities. */
export const SALES_BLOCKED_CAPABILITY_KEYS = [
  "message.send",
  "message.auto_send",
  "customer.delete",
  "contract.approve",
  "price.change",
  "discount.change",
  "payment.execute",
  "refund.execute",
  "pipeline.irreversible",
  "deal.close.irreversible",
  "customer.transfer.ownership",
] as const;

export type SalesBlockedCapabilityKey = (typeof SALES_BLOCKED_CAPABILITY_KEYS)[number];

export type SalesCapabilityManifest = {
  capability_key: SalesCapabilityKey;
  operation: SalesCapabilityOperation;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: 1 | 2 | 3;
  entity: string;
  required_permission: string | null;
  privacy_sensitive: boolean;
};

export type SalesProviderSourceEngine =
  | "sales_revenue_pipeline"
  | "customer_relationship"
  | "lead_management"
  | "revenue_intelligence"
  | "growth_partner_attribution"
  | "sales_pack_adapter";

export type SalesProviderManifest = {
  provider_key: string;
  display_name_key: string;
  source_engine: SalesProviderSourceEngine;
  implementation_status: SalesProviderImplementationStatus;
  capabilities: readonly SalesCapabilityManifest[];
  search_terms_key: string;
  business_pack_key: string | null;
};

export const SALES_BUSINESS_PACK_KEYS = [
  "revenue_pack",
  "sales",
  "crm",
  "customer_intelligence",
] as const;

export function isSalesBusinessPackActive(activeBusinessPacks: readonly string[]): boolean {
  return activeBusinessPacks.some((pack) =>
    (SALES_BUSINESS_PACK_KEYS as readonly string[]).includes(pack),
  );
}

export function buildSalesCapabilityId(
  providerKey: string,
  capabilityKey: SalesCapabilityKey,
  operation: SalesCapabilityOperation,
): string {
  return `${providerKey}.${capabilityKey}.${operation}`;
}

export function isSalesCapabilityBlocked(capabilityKey: string): boolean {
  return (SALES_BLOCKED_CAPABILITY_KEYS as readonly string[]).includes(capabilityKey);
}
