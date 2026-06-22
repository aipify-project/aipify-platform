import type { CompanionCapabilityRef } from "./companion-business-pack-context";
import type { CompanionMediaContext } from "./companion-media-context";
import type { CompanionSchemaCollection, CompanionSchemaContext } from "./companion-schema-context";
import type { CompanionToolDefinition, CompanionToolRegistry } from "./companion-tool-definition";
import {
  buildReadToolInputSchema,
  buildReadToolOutputSchema,
  createEmptyCompanionToolRegistry,
} from "./companion-tool-definition";
import type { ActionLevel } from "@/lib/trust-action/levels";
import { buildActionDefinitionFromMediaCapability } from "./companion-action-definition";
import type { CompanionActionDefinition } from "./companion-action-definition";
import { humanizeEntityKey } from "@/lib/integration-intelligence/normalize-text";

const MEDIA_PACK_KEY = "media_provider";

export function mapMediaCapabilitiesToRefs(
  mediaContext: CompanionMediaContext,
): CompanionCapabilityRef[] {
  return mediaContext.capabilities.map((capability) => ({
    capability_id: capability.capability_id,
    entity: capability.entity,
    operation: capability.operation,
    access_mode: capability.operation === "write" ? "write" : "read",
    permission: capability.required_permission,
    source_provider: capability.provider_key,
    pack_key: MEDIA_PACK_KEY,
  }));
}

export function mergeMediaCapabilities(
  entitledCapabilities: CompanionCapabilityRef[],
  mediaContext: CompanionMediaContext,
): CompanionCapabilityRef[] {
  const mediaRefs = mapMediaCapabilitiesToRefs(mediaContext);
  const seen = new Set(entitledCapabilities.map((capability) => capability.capability_id));
  const merged = [...entitledCapabilities];
  for (const ref of mediaRefs) {
    if (seen.has(ref.capability_id)) continue;
    seen.add(ref.capability_id);
    merged.push(ref);
  }
  return merged;
}

export function buildMediaSchemaEntities(
  mediaContext: CompanionMediaContext,
  effectivePermissions: string[],
): CompanionSchemaContext[] {
  if (mediaContext.permission_denied || mediaContext.app_entitlement_blocked) {
    return [];
  }

  const entities: CompanionSchemaContext[] = [];

  for (const capability of mediaContext.capabilities) {
    if (capability.operation !== "read") continue;
    if (
      capability.required_permission &&
      !effectivePermissions.includes(capability.required_permission)
    ) {
      continue;
    }

    entities.push({
      entity_key: capability.entity,
      display_name: humanizeEntityKey(capability.entity),
      fields: [capability.capability_key],
      field_types: { [capability.capability_key]: "media_capability" },
      relations: [`${capability.entity}->${capability.provider_key}`],
      supported_operations: ["read"],
      read_boundaries: [capability.capability_id],
      write_boundaries: [],
      required_permissions: capability.required_permission ? [capability.required_permission] : [],
      source_provider: capability.provider_key,
      pack_key: MEDIA_PACK_KEY,
      schema_version: "media_provider:v1",
      freshness: "unknown",
      approval_status: "approved",
    });
  }

  return entities;
}

export function mergeMediaSchemaCollection(
  collection: CompanionSchemaCollection,
  mediaContext: CompanionMediaContext,
  effectivePermissions: string[],
): CompanionSchemaCollection {
  const mediaEntities = buildMediaSchemaEntities(mediaContext, effectivePermissions);
  if (mediaEntities.length === 0) return collection;

  const entityMap = new Map(collection.entities.map((entity) => [entity.entity_key, entity]));
  for (const entity of mediaEntities) {
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

export function buildMediaReadToolDefinitions(input: {
  mediaContext: CompanionMediaContext;
  effectivePermissions: string[];
}): CompanionToolDefinition[] {
  const tools: CompanionToolDefinition[] = [];

  for (const capability of input.mediaContext.capabilities) {
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
      source_label: `media:${capability.provider_key}`,
      freshness: "unknown",
      approval_required: false,
      enabled:
        permissionOk &&
        capability.enabled &&
        capability.adapter_available &&
        !input.mediaContext.app_entitlement_blocked,
    });
  }

  return tools;
}

export function mergeMediaToolRegistry(
  registry: CompanionToolRegistry,
  mediaContext: CompanionMediaContext,
  effectivePermissions: string[],
): CompanionToolRegistry {
  const mediaTools = buildMediaReadToolDefinitions({
    mediaContext,
    effectivePermissions,
  });

  if (mediaTools.length === 0) return registry;

  const tools = [...registry.tools];
  const seen = new Set(tools.map((tool) => tool.tool_id));
  for (const tool of mediaTools) {
    if (seen.has(tool.tool_id)) continue;
    seen.add(tool.tool_id);
    tools.push(tool);
  }

  const enabledTools = tools.filter((tool) => tool.enabled);
  return createEmptyCompanionToolRegistry({ tools, enabledTools });
}

export function buildMediaActionDefinitions(input: {
  mediaContext: CompanionMediaContext;
  effectivePermissions: string[];
  appEntitlementBlocked: boolean;
  emergencyStop: boolean;
  maxRiskLevel: ActionLevel;
}): CompanionActionDefinition[] {
  const actions: CompanionActionDefinition[] = [];

  for (const capability of input.mediaContext.capabilities) {
    if (capability.operation !== "write") continue;

    const permissionOk =
      !capability.required_permission ||
      input.effectivePermissions.includes(capability.required_permission);

    const definition = buildActionDefinitionFromMediaCapability(capability, {
      permissionAllowed: permissionOk,
      appEntitlementBlocked: input.appEntitlementBlocked,
      emergencyStop: input.emergencyStop,
      maxRiskLevel: input.maxRiskLevel,
    });
    if (definition) actions.push(definition);
  }

  return actions;
}

export function mergeMediaActionDefinitions(
  actions: CompanionActionDefinition[],
  mediaContext: CompanionMediaContext,
  input: {
    effectivePermissions: string[];
    appEntitlementBlocked: boolean;
    emergencyStop: boolean;
    maxRiskLevel: ActionLevel;
  },
): CompanionActionDefinition[] {
  const mediaActions = buildMediaActionDefinitions({
    mediaContext,
    ...input,
  });
  if (mediaActions.length === 0) return actions;

  const seen = new Set(actions.map((action) => action.action_id));
  const merged = [...actions];
  for (const action of mediaActions) {
    if (seen.has(action.action_id)) continue;
    seen.add(action.action_id);
    merged.push(action);
  }
  return merged;
}
