import type {
  FinanceProviderImplementationStatus,
  FinanceProviderManifest,
} from "@/lib/integration-intelligence/finance/types";
import {
  buildFinanceCapabilityId,
  isFinanceCapabilityBlocked,
} from "@/lib/integration-intelligence/finance/types";

export type FinanceProviderRuntimeStatus = {
  provider_key: string;
  implementation_status: FinanceProviderImplementationStatus;
  finance_operations_enabled: boolean;
  revenue_operations_enabled: boolean;
  unified_billing_enabled: boolean;
  payment_providers_enabled: boolean;
  enterprise_invoicing_enabled: boolean;
  verified: boolean;
  adapter_available: boolean;
  entitlement_active: boolean;
  business_pack_active: boolean;
};

export type FinanceCapabilityRuntimeRef = {
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
  runtime_status: FinanceProviderImplementationStatus;
  privacy_sensitive: boolean;
  enabled: boolean;
};

export type FinanceCommandBriefSignal = {
  signal_key: string;
  count: number | null;
};

export type CompanionFinanceContext = {
  finance_operations_enabled: boolean;
  revenue_operations_enabled: boolean;
  unified_billing_enabled: boolean;
  payment_providers_enabled: boolean;
  enterprise_invoicing_enabled: boolean;
  payment_execution_blocked: boolean;
  payout_execution_blocked: boolean;
  refund_execution_blocked: boolean;
  bank_transfer_blocked: boolean;
  invoice_send_blocked: boolean;
  subscription_cancel_blocked: boolean;
  destructive_correction_blocked: boolean;
  irreversible_posting_blocked: boolean;
  finance_role_filter_active: boolean;
  sensitive_account_data_masked: boolean;
  no_raw_card_or_bank_details: boolean;
  provider_verified_only: boolean;
  overdue_invoice_count: number | null;
  subscription_renewal_count: number | null;
  forecast_warning_count: number | null;
  revenue_deviation_count: number | null;
  command_brief_signals: FinanceCommandBriefSignal[];
  command_brief_events_linked: boolean;
  providers: FinanceProviderRuntimeStatus[];
  capabilities: FinanceCapabilityRuntimeRef[];
  permission_denied: boolean;
  app_entitlement_blocked: boolean;
  privacy_filtered: boolean;
  cross_link_finance: string;
  cross_link_revenue: string;
  cross_link_billing: string;
  cross_link_payment_providers: string;
};

export function createEmptyCompanionFinanceContext(
  overrides?: Partial<CompanionFinanceContext>,
): CompanionFinanceContext {
  return {
    finance_operations_enabled: false,
    revenue_operations_enabled: false,
    unified_billing_enabled: false,
    payment_providers_enabled: false,
    enterprise_invoicing_enabled: false,
    payment_execution_blocked: true,
    payout_execution_blocked: true,
    refund_execution_blocked: true,
    bank_transfer_blocked: true,
    invoice_send_blocked: true,
    subscription_cancel_blocked: true,
    destructive_correction_blocked: true,
    irreversible_posting_blocked: true,
    finance_role_filter_active: true,
    sensitive_account_data_masked: true,
    no_raw_card_or_bank_details: true,
    provider_verified_only: true,
    overdue_invoice_count: null,
    subscription_renewal_count: null,
    forecast_warning_count: null,
    revenue_deviation_count: null,
    command_brief_signals: [],
    command_brief_events_linked: false,
    providers: [],
    capabilities: [],
    permission_denied: false,
    app_entitlement_blocked: false,
    privacy_filtered: false,
    cross_link_finance: "/app/finance",
    cross_link_revenue: "/app/revenue",
    cross_link_billing: "/app/billing",
    cross_link_payment_providers: "/app/settings/billing/payment-providers",
    ...overrides,
  };
}

function engineEnabledForProvider(
  manifest: FinanceProviderManifest,
  providerStatus: FinanceProviderRuntimeStatus,
): boolean {
  switch (manifest.source_engine) {
    case "finance_operations":
      return providerStatus.finance_operations_enabled;
    case "revenue_operations":
      return providerStatus.revenue_operations_enabled;
    case "unified_billing":
      return providerStatus.unified_billing_enabled;
    case "payment_providers":
      return providerStatus.payment_providers_enabled;
    case "enterprise_invoicing":
      return providerStatus.enterprise_invoicing_enabled;
    case "finance_pack_adapter":
      return false;
    default:
      return false;
  }
}

export function buildFinanceCapabilityRuntimeRef(input: {
  manifest: FinanceProviderManifest;
  providerStatus: FinanceProviderRuntimeStatus;
  capability: FinanceProviderManifest["capabilities"][number];
  hasPermission: boolean;
}): FinanceCapabilityRuntimeRef | null {
  if (isFinanceCapabilityBlocked(input.capability.capability_key)) {
    return null;
  }

  const capabilityId = buildFinanceCapabilityId(
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

export function filterFinanceCapabilitiesForPrivacy(
  context: CompanionFinanceContext,
): FinanceCapabilityRuntimeRef[] {
  if (context.permission_denied || context.app_entitlement_blocked) {
    return [];
  }

  return context.capabilities.filter((capability) => {
    if (!capability.privacy_sensitive) return true;
    return capability.enabled && capability.operation === "read";
  });
}

export function listEnabledFinanceCapabilities(
  context: CompanionFinanceContext,
): FinanceCapabilityRuntimeRef[] {
  return filterFinanceCapabilitiesForPrivacy(context).filter((capability) => capability.enabled);
}

export function findFinanceProviderStatus(
  context: CompanionFinanceContext,
  providerKey: string,
): FinanceProviderRuntimeStatus | null {
  return context.providers.find((provider) => provider.provider_key === providerKey) ?? null;
}
