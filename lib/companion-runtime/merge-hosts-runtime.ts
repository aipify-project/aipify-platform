import type { CompanionCapabilityRef } from "./companion-business-pack-context";
import type { CompanionHostsContext } from "./companion-hosts-context";
import { filterHostsCapabilitiesForPrivacy } from "./companion-hosts-context";
import type { CompanionSchemaCollection, CompanionSchemaContext } from "./companion-schema-context";
import type { CompanionToolDefinition, CompanionToolRegistry } from "./companion-tool-definition";
import {
  buildReadToolInputSchema,
  buildReadToolOutputSchema,
  createEmptyCompanionToolRegistry,
} from "./companion-tool-definition";
import type { ActionLevel } from "@/lib/trust-action/levels";
import { buildActionDefinitionFromHostsCapability } from "./companion-action-definition";
import type { CompanionActionDefinition } from "./companion-action-definition";
import { humanizeEntityKey } from "@/lib/integration-intelligence/normalize-text";

const HOSTS_PACK_KEY = "hosts_provider";

export function mapHostsCapabilitiesToRefs(
  hostsContext: CompanionHostsContext,
): CompanionCapabilityRef[] {
  return filterHostsCapabilitiesForPrivacy(hostsContext).map((capability) => ({
    capability_id: capability.capability_id,
    entity: capability.entity,
    operation: capability.operation,
    access_mode: capability.operation === "write" ? "write" : "read",
    permission: capability.required_permission,
    source_provider: capability.provider_key,
    pack_key: HOSTS_PACK_KEY,
  }));
}

export function mergeHostsCapabilities(
  entitledCapabilities: CompanionCapabilityRef[],
  hostsContext: CompanionHostsContext,
): CompanionCapabilityRef[] {
  const hostsRefs = mapHostsCapabilitiesToRefs(hostsContext);
  const seen = new Set(entitledCapabilities.map((capability) => capability.capability_id));
  const merged = [...entitledCapabilities];
  for (const ref of hostsRefs) {
    if (seen.has(ref.capability_id)) continue;
    seen.add(ref.capability_id);
    merged.push(ref);
  }
  return merged;
}

export function buildHostsSchemaEntities(
  hostsContext: CompanionHostsContext,
  effectivePermissions: string[],
): CompanionSchemaContext[] {
  if (hostsContext.permission_denied || hostsContext.app_entitlement_blocked) {
    return [];
  }

  const entities: CompanionSchemaContext[] = [];

  for (const capability of filterHostsCapabilitiesForPrivacy(hostsContext)) {
    if (capability.operation !== "read") continue;
    if (
      capability.required_permission &&
      !effectivePermissions.includes(capability.required_permission)
    ) {
      continue;
    }

    entities.push({
      entity_key: `${capability.provider_key}.${capability.entity}`,
      display_name: humanizeEntityKey(capability.entity),
      fields: [capability.capability_key],
      field_types: { [capability.capability_key]: "hosts_capability" },
      relations: [`${capability.entity}->${capability.provider_key}`],
      supported_operations: ["read"],
      read_boundaries: [capability.capability_id],
      write_boundaries: [],
      required_permissions: capability.required_permission ? [capability.required_permission] : [],
      source_provider: capability.provider_key,
      pack_key: HOSTS_PACK_KEY,
      schema_version: "hosts_provider:v1",
      freshness: "unknown",
      approval_status: "approved",
    });
  }

  return entities;
}

export function mergeHostsSchemaCollection(
  collection: CompanionSchemaCollection,
  hostsContext: CompanionHostsContext,
  effectivePermissions: string[],
): CompanionSchemaCollection {
  const hostsEntities = buildHostsSchemaEntities(hostsContext, effectivePermissions);
  if (hostsEntities.length === 0) return collection;

  const entityMap = new Map(collection.entities.map((entity) => [entity.entity_key, entity]));
  for (const entity of hostsEntities) {
    entityMap.set(entity.entity_key, entity);
  }

  const entities = [...entityMap.values()];
  return {
    ...collection,
    entities,
    availableEntities: [...new Set(entities.map((entity) => entity.entity_key))],
    availableOperations: [
      ...new Set(entities.flatMap((entity) => entity.supported_operations)),
    ] as ("read" | "write")[],
  };
}

export function buildHostsReadToolDefinitions(input: {
  hostsContext: CompanionHostsContext;
  effectivePermissions: string[];
}): CompanionToolDefinition[] {
  const tools: CompanionToolDefinition[] = [];

  for (const capability of filterHostsCapabilitiesForPrivacy(input.hostsContext)) {
    if (capability.operation !== "read") continue;

    const permissionOk =
      !capability.required_permission ||
      input.effectivePermissions.includes(capability.required_permission);

    tools.push({
      tool_id: `${capability.provider_key}:${capability.capability_key}`,
      capability_id: capability.capability_id,
      provider_key: capability.provider_key,
      operation: "read",
      access_mode: "read",
      required_permission: capability.required_permission,
      input_schema: buildReadToolInputSchema(),
      output_schema: buildReadToolOutputSchema([capability.capability_key, "status"]),
      source_label: `hosts:${capability.provider_key}`,
      freshness: "unknown",
      approval_required: false,
      enabled:
        permissionOk &&
        capability.enabled &&
        capability.adapter_available &&
        !input.hostsContext.app_entitlement_blocked,
    });
  }

  return tools;
}

export function mergeHostsToolRegistry(
  registry: CompanionToolRegistry,
  hostsContext: CompanionHostsContext,
  effectivePermissions: string[],
): CompanionToolRegistry {
  const hostsTools = buildHostsReadToolDefinitions({
    hostsContext,
    effectivePermissions,
  });

  if (hostsTools.length === 0) return registry;

  const tools = [...registry.tools];
  const seen = new Set(tools.map((tool) => tool.tool_id));
  for (const tool of hostsTools) {
    if (seen.has(tool.tool_id)) continue;
    seen.add(tool.tool_id);
    tools.push(tool);
  }

  const enabledTools = tools.filter((tool) => tool.enabled);
  return createEmptyCompanionToolRegistry({ tools, enabledTools });
}

export function buildHostsActionDefinitions(input: {
  hostsContext: CompanionHostsContext;
  effectivePermissions: string[];
  appEntitlementBlocked: boolean;
  emergencyStop: boolean;
  maxRiskLevel: ActionLevel;
}): CompanionActionDefinition[] {
  const actions: CompanionActionDefinition[] = [];

  for (const capability of filterHostsCapabilitiesForPrivacy(input.hostsContext)) {
    if (capability.operation !== "write") continue;

    const permissionOk =
      !capability.required_permission ||
      input.effectivePermissions.includes(capability.required_permission);

    const definition = buildActionDefinitionFromHostsCapability(capability, {
      permissionAllowed: permissionOk,
      appEntitlementBlocked: input.appEntitlementBlocked,
      emergencyStop: input.emergencyStop,
      maxRiskLevel: input.maxRiskLevel,
    });
    if (definition) actions.push(definition);
  }

  return actions;
}

export function mergeHostsActionDefinitions(
  actions: CompanionActionDefinition[],
  hostsContext: CompanionHostsContext,
  input: {
    effectivePermissions: string[];
    appEntitlementBlocked: boolean;
    emergencyStop: boolean;
    maxRiskLevel: ActionLevel;
  },
): CompanionActionDefinition[] {
  const hostsActions = buildHostsActionDefinitions({
    hostsContext,
    ...input,
  });
  if (hostsActions.length === 0) return actions;

  const seen = new Set(actions.map((action) => action.action_id));
  const merged = [...actions];
  for (const action of hostsActions) {
    if (seen.has(action.action_id)) continue;
    seen.add(action.action_id);
    merged.push(action);
  }
  return merged;
}
