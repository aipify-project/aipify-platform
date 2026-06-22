import type { CreativeProviderImplementationStatus } from "@/lib/integration-intelligence/creative/types";
import type { CreativeProviderManifest } from "@/lib/integration-intelligence/creative/types";
import { buildCreativeCapabilityId } from "@/lib/integration-intelligence/creative/types";

export type CreativeProviderRuntimeStatus = {
  provider_key: string;
  implementation_status: CreativeProviderImplementationStatus;
  studio_enabled: boolean;
  bridge_enabled: boolean;
  verified: boolean;
  adapter_available: boolean;
  entitlement_active: boolean;
};

export type CreativeCapabilityRuntimeRef = {
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
  runtime_status: CreativeProviderImplementationStatus;
  enabled: boolean;
};

export type CompanionCreativeContext = {
  studio_enabled: boolean;
  bridge_enabled: boolean;
  human_oversight_required: boolean;
  providers: CreativeProviderRuntimeStatus[];
  capabilities: CreativeCapabilityRuntimeRef[];
  permission_denied: boolean;
  app_entitlement_blocked: boolean;
  cross_link_studio: string;
  cross_link_bridge: string;
};

export function createEmptyCompanionCreativeContext(
  overrides?: Partial<CompanionCreativeContext>,
): CompanionCreativeContext {
  return {
    studio_enabled: false,
    bridge_enabled: false,
    human_oversight_required: true,
    providers: [],
    capabilities: [],
    permission_denied: false,
    app_entitlement_blocked: false,
    cross_link_studio: "/app/aipify-studio-creative-intelligence-engine",
    cross_link_bridge: "/app/aipify-desktop-companion-creative-bridge-engine",
    ...overrides,
  };
}

export function buildCreativeCapabilityRuntimeRef(input: {
  manifest: CreativeProviderManifest;
  providerStatus: CreativeProviderRuntimeStatus;
  capability: CreativeProviderManifest["capabilities"][number];
  hasPermission: boolean;
}): CreativeCapabilityRuntimeRef {
  const capabilityId = buildCreativeCapabilityId(
    input.manifest.provider_key,
    input.capability.capability_key,
    input.capability.operation,
  );

  const enabled =
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
    enabled: enabled && input.providerStatus.entitlement_active,
  };
}

export function listEnabledCreativeCapabilities(
  context: CompanionCreativeContext,
): CreativeCapabilityRuntimeRef[] {
  return context.capabilities.filter((capability) => capability.enabled);
}

export function findCreativeProviderStatus(
  context: CompanionCreativeContext,
  providerKey: string,
): CreativeProviderRuntimeStatus | null {
  return context.providers.find((provider) => provider.provider_key === providerKey) ?? null;
}
