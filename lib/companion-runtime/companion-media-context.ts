import type { MediaProviderImplementationStatus } from "@/lib/integration-intelligence/media/types";
import type { MediaProviderManifest } from "@/lib/integration-intelligence/media/types";
import { buildMediaCapabilityId } from "@/lib/integration-intelligence/media/types";

export type MediaProviderRuntimeStatus = {
  provider_key: string;
  implementation_status: MediaProviderImplementationStatus;
  device_ecosystem_enabled: boolean;
  presence_operations_enabled: boolean;
  verified: boolean;
  adapter_available: boolean;
  entitlement_active: boolean;
};

export type MediaCapabilityRuntimeRef = {
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
  runtime_status: MediaProviderImplementationStatus;
  enabled: boolean;
};

export type CompanionMediaContext = {
  device_ecosystem_enabled: boolean;
  presence_operations_enabled: boolean;
  connected_devices: number;
  online_devices: number;
  human_oversight_required: boolean;
  providers: MediaProviderRuntimeStatus[];
  capabilities: MediaCapabilityRuntimeRef[];
  permission_denied: boolean;
  app_entitlement_blocked: boolean;
  cross_link_device_ecosystem: string;
  cross_link_presence_devices: string;
};

export function createEmptyCompanionMediaContext(
  overrides?: Partial<CompanionMediaContext>,
): CompanionMediaContext {
  return {
    device_ecosystem_enabled: false,
    presence_operations_enabled: false,
    connected_devices: 0,
    online_devices: 0,
    human_oversight_required: true,
    providers: [],
    capabilities: [],
    permission_denied: false,
    app_entitlement_blocked: false,
    cross_link_device_ecosystem: "/app/companion-device-ecosystem-engine",
    cross_link_presence_devices: "/app/companion/devices",
    ...overrides,
  };
}

export function buildMediaCapabilityRuntimeRef(input: {
  manifest: MediaProviderManifest;
  providerStatus: MediaProviderRuntimeStatus;
  capability: MediaProviderManifest["capabilities"][number];
  hasPermission: boolean;
}): MediaCapabilityRuntimeRef {
  const capabilityId = buildMediaCapabilityId(
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

export function listEnabledMediaCapabilities(
  context: CompanionMediaContext,
): MediaCapabilityRuntimeRef[] {
  return context.capabilities.filter((capability) => capability.enabled);
}

export function findMediaProviderStatus(
  context: CompanionMediaContext,
  providerKey: string,
): MediaProviderRuntimeStatus | null {
  return context.providers.find((provider) => provider.provider_key === providerKey) ?? null;
}
