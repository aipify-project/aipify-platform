import {
  getIntegrationProviderManifest,
  listRegisteredIntegrationProviders,
} from "@/lib/integration-intelligence/manifest-registry";
import type { IntegrationCapabilityManifest } from "@/lib/integration-intelligence/types";
import type { CompanionBusinessPackCollection } from "./companion-business-pack-context";
import type { CompanionDiscoveryContext } from "./companion-discovery-context";
import type { CompanionSchemaCollection } from "./companion-schema-context";
import type { CompanionCapabilityRef } from "./companion-business-pack-context";
import {
  buildProviderCapabilityId,
  buildProviderToolId,
  buildReadToolInputSchema,
  buildReadToolOutputSchema,
  createEmptyCompanionToolRegistry,
  type CompanionToolDefinition,
  type CompanionToolFreshness,
  type CompanionToolRegistry,
} from "./companion-tool-definition";
import {
  listProviderReadAdapterCapabilities,
  providerHasReadAdapter,
} from "./provider-tool-adapters-shared";

function permissionAllowed(permission: string | null, effectivePermissions: string[]): boolean {
  if (!permission) return true;
  return effectivePermissions.includes(permission);
}

function isProviderDiscoveryApproved(
  providerKey: string,
  discovery: CompanionDiscoveryContext,
): boolean {
  if (discovery.permissionDenied) return false;

  const approvedSystem = discovery.discoveredSystems.find(
    (system) => system.systemKey === providerKey && system.approvalStatus === "approved",
  );
  if (approvedSystem) return true;

  return discovery.discoveryStatus === "unavailable";
}

function resolveToolFreshness(
  providerKey: string,
  schemaContext: CompanionSchemaCollection,
  discovery: CompanionDiscoveryContext,
): CompanionToolFreshness {
  const schemaEntity = schemaContext.entities.find((entity) => entity.source_provider === providerKey);
  if (schemaEntity?.freshness === "fresh") return "fresh";
  if (schemaEntity?.freshness === "stale") return "stale";
  if (discovery.discoveryFreshness === "fresh") return "fresh";
  if (discovery.discoveryFreshness === "stale") return "stale";
  return "unknown";
}

function hasSchemaCoverage(
  providerKey: string,
  schemaContext: CompanionSchemaCollection,
): boolean {
  if (schemaContext.entities.some((entity) => entity.source_provider === providerKey)) {
    return true;
  }

  const manifest = getIntegrationProviderManifest(providerKey);
  if (!manifest) return false;

  return manifest.entities.some((entity) => schemaContext.availableEntities.includes(entity.key));
}

function isPackEntitlementBlocked(businessPackContext: CompanionBusinessPackCollection): boolean {
  return businessPackContext.appEntitlementBlocked;
}

function isCapabilityEntitled(
  capabilityId: string,
  providerKey: string,
  entitledCapabilities: CompanionCapabilityRef[],
  connectedProviders: string[],
): boolean {
  if (entitledCapabilities.some((capability) => capability.capability_id === capabilityId)) {
    return true;
  }

  return (
    connectedProviders.includes(providerKey) &&
    capabilityId.startsWith(`${providerKey}.`) &&
    capabilityId.endsWith(".read")
  );
}

function buildToolDefinition(
  providerKey: string,
  capability: IntegrationCapabilityManifest,
  input: {
    connectedProviders: string[];
    entitledCapabilities: CompanionCapabilityRef[];
    schemaContext: CompanionSchemaCollection;
    businessPackContext: CompanionBusinessPackCollection;
    discovery: CompanionDiscoveryContext;
    effectivePermissions: string[];
  },
): CompanionToolDefinition {
  const capabilityId = buildProviderCapabilityId(providerKey, capability.key);
  const adapterAvailable = providerHasReadAdapter(providerKey, capability.key);
  const verified = input.connectedProviders.includes(providerKey);
  const discoveryApproved = isProviderDiscoveryApproved(providerKey, input.discovery);
  const schemaReady = hasSchemaCoverage(providerKey, input.schemaContext);
  const entitled = isCapabilityEntitled(
    capabilityId,
    providerKey,
    input.entitledCapabilities,
    input.connectedProviders,
  );
  const permission = input.schemaContext.entities.find(
    (entity) => entity.source_provider === providerKey,
  )?.required_permissions[0] ?? null;

  const enabled =
    adapterAvailable &&
    verified &&
    discoveryApproved &&
    !isPackEntitlementBlocked(input.businessPackContext) &&
    entitled &&
    schemaReady &&
    permissionAllowed(permission, input.effectivePermissions);

  return {
    tool_id: buildProviderToolId(providerKey, capability.key),
    capability_id: capabilityId,
    provider_key: providerKey,
    operation: "read",
    access_mode: "read",
    required_permission: permission,
    input_schema: buildReadToolInputSchema(),
    output_schema: buildReadToolOutputSchema(capability.fields),
    source_label: `provider:${providerKey}`,
    freshness: resolveToolFreshness(providerKey, input.schemaContext, input.discovery),
    approval_required: false,
    enabled,
  };
}

export function resolveCompanionToolRegistry(input: {
  connectedProviders: string[];
  entitledCapabilities: CompanionCapabilityRef[];
  schemaContext: CompanionSchemaCollection;
  businessPackContext: CompanionBusinessPackCollection;
  discovery: CompanionDiscoveryContext;
  effectivePermissions: string[];
}): CompanionToolRegistry {
  if (input.businessPackContext.appEntitlementBlocked) {
    return createEmptyCompanionToolRegistry();
  }

  if (input.discovery.permissionDenied && input.connectedProviders.length === 0) {
    return createEmptyCompanionToolRegistry();
  }

  const tools: CompanionToolDefinition[] = [];
  const providerKeys = new Set([
    ...input.connectedProviders,
    ...listRegisteredIntegrationProviders().filter((providerKey) =>
      listProviderReadAdapterCapabilities(providerKey).length > 0,
    ),
  ]);

  for (const providerKey of providerKeys) {
    const manifest = getIntegrationProviderManifest(providerKey);
    if (!manifest) continue;

    for (const capability of manifest.capabilities) {
      if (capability.key !== "platform_snapshot" && capability.key !== "connection_status") {
        continue;
      }

      tools.push(
        buildToolDefinition(providerKey, capability, input),
      );
    }
  }

  const enabledTools = tools.filter((tool) => tool.enabled);
  return createEmptyCompanionToolRegistry({ tools, enabledTools });
}

export function resolveCompanionToolDefinitions(
  input: Parameters<typeof resolveCompanionToolRegistry>[0],
): CompanionToolDefinition[] {
  return resolveCompanionToolRegistry(input).tools;
}
