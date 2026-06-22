import type { CommerceProviderImplementationStatus } from "@/lib/integration-intelligence/commerce/types";
import type { CommerceProviderManifest } from "@/lib/integration-intelligence/commerce/types";
import { buildCommerceCapabilityId, isCommerceCapabilityBlocked } from "@/lib/integration-intelligence/commerce/types";

export type CommerceProviderRuntimeStatus = {
  provider_key: string;
  implementation_status: CommerceProviderImplementationStatus;
  retail_operations_enabled: boolean;
  intelligence_enabled: boolean;
  automation_enabled: boolean;
  multi_store_enabled: boolean;
  verified: boolean;
  adapter_available: boolean;
  entitlement_active: boolean;
};

export type CommerceCapabilityRuntimeRef = {
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
  runtime_status: CommerceProviderImplementationStatus;
  privacy_sensitive: boolean;
  enabled: boolean;
};

export type CompanionCommerceContext = {
  retail_operations_enabled: boolean;
  intelligence_enabled: boolean;
  automation_enabled: boolean;
  multi_store_enabled: boolean;
  human_oversight_required: boolean;
  auto_publish_disabled: boolean;
  auto_import_disabled: boolean;
  providers: CommerceProviderRuntimeStatus[];
  capabilities: CommerceCapabilityRuntimeRef[];
  permission_denied: boolean;
  app_entitlement_blocked: boolean;
  privacy_filtered: boolean;
  cross_link_commerce: string;
  cross_link_intelligence: string;
  cross_link_automation: string;
  cross_link_multi_store: string;
};

export function createEmptyCompanionCommerceContext(
  overrides?: Partial<CompanionCommerceContext>,
): CompanionCommerceContext {
  return {
    retail_operations_enabled: false,
    intelligence_enabled: false,
    automation_enabled: false,
    multi_store_enabled: false,
    human_oversight_required: true,
    auto_publish_disabled: true,
    auto_import_disabled: true,
    providers: [],
    capabilities: [],
    permission_denied: false,
    app_entitlement_blocked: false,
    privacy_filtered: false,
    cross_link_commerce: "/app/commerce",
    cross_link_intelligence: "/app/commerce-intelligence",
    cross_link_automation: "/app/product-automation",
    cross_link_multi_store: "/app/multi-store",
    ...overrides,
  };
}

export function buildCommerceCapabilityRuntimeRef(input: {
  manifest: CommerceProviderManifest;
  providerStatus: CommerceProviderRuntimeStatus;
  capability: CommerceProviderManifest["capabilities"][number];
  hasPermission: boolean;
}): CommerceCapabilityRuntimeRef | null {
  if (isCommerceCapabilityBlocked(input.capability.capability_key)) {
    return null;
  }

  const capabilityId = buildCommerceCapabilityId(
    input.manifest.provider_key,
    input.capability.capability_key,
    input.capability.operation,
  );

  const engineEnabled = (() => {
    switch (input.manifest.source_engine) {
      case "commerce_retail_operations_pack":
        return input.providerStatus.retail_operations_enabled;
      case "commerce_intelligence":
        return input.providerStatus.intelligence_enabled;
      case "product_automation":
        return input.providerStatus.automation_enabled;
      case "multi_store_orchestration":
        return input.providerStatus.multi_store_enabled;
      case "app_portal_integration":
        return (
          input.providerStatus.retail_operations_enabled ||
          input.providerStatus.verified
        );
      default:
        return false;
    }
  })();

  const enabled =
    engineEnabled &&
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

export function filterCommerceCapabilitiesForPrivacy(
  context: CompanionCommerceContext,
): CommerceCapabilityRuntimeRef[] {
  if (context.permission_denied || context.app_entitlement_blocked) {
    return [];
  }

  return context.capabilities.filter((capability) => {
    if (!capability.privacy_sensitive) return true;
    return capability.enabled && capability.operation === "read";
  });
}

export function listEnabledCommerceCapabilities(
  context: CompanionCommerceContext,
): CommerceCapabilityRuntimeRef[] {
  return filterCommerceCapabilitiesForPrivacy(context).filter((capability) => capability.enabled);
}

export function findCommerceProviderStatus(
  context: CompanionCommerceContext,
  providerKey: string,
): CommerceProviderRuntimeStatus | null {
  return context.providers.find((provider) => provider.provider_key === providerKey) ?? null;
}
