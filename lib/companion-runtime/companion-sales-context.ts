import type {
  SalesProviderImplementationStatus,
  SalesProviderManifest,
} from "@/lib/integration-intelligence/sales/types";
import {
  buildSalesCapabilityId,
  isSalesCapabilityBlocked,
} from "@/lib/integration-intelligence/sales/types";

export type SalesProviderRuntimeStatus = {
  provider_key: string;
  implementation_status: SalesProviderImplementationStatus;
  sales_revenue_pipeline_enabled: boolean;
  customer_relationship_enabled: boolean;
  lead_management_enabled: boolean;
  revenue_intelligence_enabled: boolean;
  growth_partner_attribution_enabled: boolean;
  verified: boolean;
  adapter_available: boolean;
  entitlement_active: boolean;
  business_pack_active: boolean;
};

export type SalesCapabilityRuntimeRef = {
  capability_id: string;
  provider_key: string;
  capability_key: string;
  operation: "read" | "write";
  entity: string;
  adapter_available: boolean;
  approval_required: boolean;
  reversible: boolean;
  risk_level: number;
  required_permission: string | null;
  runtime_status: SalesProviderImplementationStatus;
  privacy_sensitive: boolean;
  enabled: boolean;
};

export type SalesCommandBriefSignal = {
  signal_key: string;
  count: number | null;
};

export type CompanionSalesContext = {
  sales_revenue_pipeline_enabled: boolean;
  customer_relationship_enabled: boolean;
  lead_management_enabled: boolean;
  revenue_intelligence_enabled: boolean;
  auto_send_blocked: boolean;
  customer_deletion_blocked: boolean;
  contract_approval_blocked: boolean;
  price_change_blocked: boolean;
  payment_execution_blocked: boolean;
  irreversible_pipeline_blocked: boolean;
  sales_role_filter_active: boolean;
  partner_attribution_metadata_only: boolean;
  sensitive_contact_data_filtered: boolean;
  least_privilege_enforced: boolean;
  open_leads_count: number | null;
  follow_ups_due_count: number | null;
  at_risk_customers_count: number | null;
  at_risk_deals_count: number | null;
  churn_risk_count: number | null;
  command_brief_signals: SalesCommandBriefSignal[];
  command_brief_events_linked: boolean;
  providers: SalesProviderRuntimeStatus[];
  capabilities: SalesCapabilityRuntimeRef[];
  permission_denied: boolean;
  app_entitlement_blocked: boolean;
  privacy_filtered: boolean;
  cross_link_sales: string;
  cross_link_customers: string;
  cross_link_leads: string;
  cross_link_revenue: string;
};

export function createEmptyCompanionSalesContext(
  overrides?: Partial<CompanionSalesContext>,
): CompanionSalesContext {
  return {
    sales_revenue_pipeline_enabled: false,
    customer_relationship_enabled: false,
    lead_management_enabled: false,
    revenue_intelligence_enabled: false,
    auto_send_blocked: true,
    customer_deletion_blocked: true,
    contract_approval_blocked: true,
    price_change_blocked: true,
    payment_execution_blocked: true,
    irreversible_pipeline_blocked: true,
    sales_role_filter_active: true,
    partner_attribution_metadata_only: true,
    sensitive_contact_data_filtered: true,
    least_privilege_enforced: true,
    open_leads_count: null,
    follow_ups_due_count: null,
    at_risk_customers_count: null,
    at_risk_deals_count: null,
    churn_risk_count: null,
    command_brief_signals: [],
    command_brief_events_linked: false,
    providers: [],
    capabilities: [],
    permission_denied: false,
    app_entitlement_blocked: false,
    privacy_filtered: false,
    cross_link_sales: "/app/sales",
    cross_link_customers: "/app/customers",
    cross_link_leads: "/app/leads",
    cross_link_revenue: "/app/revenue",
    ...overrides,
  };
}

function engineEnabledForProvider(
  manifest: SalesProviderManifest,
  providerStatus: SalesProviderRuntimeStatus,
): boolean {
  switch (manifest.source_engine) {
    case "sales_revenue_pipeline":
      return providerStatus.sales_revenue_pipeline_enabled;
    case "customer_relationship":
      return providerStatus.customer_relationship_enabled;
    case "lead_management":
      return providerStatus.lead_management_enabled;
    case "revenue_intelligence":
      return providerStatus.revenue_intelligence_enabled;
    case "growth_partner_attribution":
      return providerStatus.growth_partner_attribution_enabled;
    case "sales_pack_adapter":
      return false;
    default:
      return false;
  }
}

export function buildSalesCapabilityRuntimeRef(input: {
  manifest: SalesProviderManifest;
  providerStatus: SalesProviderRuntimeStatus;
  capability: SalesProviderManifest["capabilities"][number];
  hasPermission: boolean;
}): SalesCapabilityRuntimeRef | null {
  if (isSalesCapabilityBlocked(input.capability.capability_key)) {
    return null;
  }

  const capabilityId = buildSalesCapabilityId(
    input.manifest.provider_key,
    input.capability.capability_key,
    input.capability.operation,
  );

  const engineEnabled = engineEnabledForProvider(input.manifest, input.providerStatus);
  const packOk =
    !input.manifest.business_pack_key ||
    input.providerStatus.business_pack_active ||
    input.manifest.business_pack_key === null;

  const enabled =
    engineEnabled &&
    packOk &&
    input.providerStatus.entitlement_active &&
    input.hasPermission &&
    input.providerStatus.implementation_status !== "placeholder" &&
    (input.capability.operation === "read"
      ? true
      : input.capability.approval_required &&
        input.capability.reversible &&
        input.capability.risk_level <= 2);

  return {
    capability_id: capabilityId,
    provider_key: input.manifest.provider_key,
    capability_key: input.capability.capability_key,
    operation: input.capability.operation,
    entity: input.capability.entity,
    adapter_available: input.capability.adapter_available && input.providerStatus.adapter_available,
    approval_required: input.capability.approval_required,
    reversible: input.capability.reversible,
    risk_level: input.capability.risk_level,
    required_permission: input.capability.required_permission,
    runtime_status: input.providerStatus.implementation_status,
    privacy_sensitive: input.capability.privacy_sensitive,
    enabled: enabled && input.providerStatus.entitlement_active,
  };
}

export function filterSalesCapabilitiesForPrivacy(
  context: CompanionSalesContext,
): SalesCapabilityRuntimeRef[] {
  if (context.permission_denied || context.app_entitlement_blocked) {
    return [];
  }

  return context.capabilities.filter((capability) => {
    if (!capability.privacy_sensitive) return true;
    return capability.enabled && capability.operation === "read";
  });
}

export function listEnabledSalesCapabilities(
  context: CompanionSalesContext,
): SalesCapabilityRuntimeRef[] {
  return filterSalesCapabilitiesForPrivacy(context).filter((capability) => capability.enabled);
}

export function findSalesProviderStatus(
  context: CompanionSalesContext,
  providerKey: string,
): SalesProviderRuntimeStatus | null {
  return context.providers.find((provider) => provider.provider_key === providerKey) ?? null;
}
