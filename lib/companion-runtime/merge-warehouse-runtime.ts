import type { CompanionCapabilityRef } from "./companion-business-pack-context";
import type { CompanionWarehouseContext } from "./companion-warehouse-context";
import { filterWarehouseCapabilitiesForPrivacy } from "./companion-warehouse-context";
import type { CompanionSchemaCollection, CompanionSchemaContext } from "./companion-schema-context";
import type { CompanionToolDefinition, CompanionToolRegistry } from "./companion-tool-definition";
import {
  buildReadToolInputSchema,
  buildReadToolOutputSchema,
  createEmptyCompanionToolRegistry,
} from "./companion-tool-definition";
import type { ActionLevel } from "@/lib/trust-action/levels";
import { buildActionDefinitionFromWarehouseCapability } from "./companion-action-definition";
import type { CompanionActionDefinition } from "./companion-action-definition";
import { humanizeEntityKey } from "@/lib/integration-intelligence/normalize-text";

const WAREHOUSE_PACK_KEY = "warehouse_provider";

export function mapWarehouseCapabilitiesToRefs(
  warehouseContext: CompanionWarehouseContext,
): CompanionCapabilityRef[] {
  return filterWarehouseCapabilitiesForPrivacy(warehouseContext).map((capability) => ({
    capability_id: capability.capability_id,
    entity: capability.entity,
    operation: capability.operation,
    access_mode: capability.operation === "write" ? "write" : "read",
    permission: capability.required_permission,
    source_provider: capability.provider_key,
    pack_key: WAREHOUSE_PACK_KEY,
  }));
}

export function mergeWarehouseCapabilities(
  entitledCapabilities: CompanionCapabilityRef[],
  warehouseContext: CompanionWarehouseContext,
): CompanionCapabilityRef[] {
  const warehouseRefs = mapWarehouseCapabilitiesToRefs(warehouseContext);
  const seen = new Set(entitledCapabilities.map((capability) => capability.capability_id));
  const merged = [...entitledCapabilities];
  for (const ref of warehouseRefs) {
    if (seen.has(ref.capability_id)) continue;
    seen.add(ref.capability_id);
    merged.push(ref);
  }
  return merged;
}

export function buildWarehouseSchemaEntities(
  warehouseContext: CompanionWarehouseContext,
  effectivePermissions: string[],
): CompanionSchemaContext[] {
  if (warehouseContext.permission_denied || warehouseContext.app_entitlement_blocked) {
    return [];
  }

  const entities: CompanionSchemaContext[] = [];

  for (const capability of filterWarehouseCapabilitiesForPrivacy(warehouseContext)) {
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
      field_types: { [capability.capability_key]: "warehouse_capability" },
      relations: [`${capability.entity}->${capability.provider_key}`],
      supported_operations: ["read"],
      read_boundaries: [capability.capability_id],
      write_boundaries: [],
      required_permissions: capability.required_permission ? [capability.required_permission] : [],
      source_provider: capability.provider_key,
      pack_key: WAREHOUSE_PACK_KEY,
      schema_version: "warehouse_provider:v1",
      freshness: "unknown",
      approval_status: "approved",
    });
  }

  return entities;
}

export function mergeWarehouseSchemaCollection(
  collection: CompanionSchemaCollection,
  warehouseContext: CompanionWarehouseContext,
  effectivePermissions: string[],
): CompanionSchemaCollection {
  const warehouseEntities = buildWarehouseSchemaEntities(warehouseContext, effectivePermissions);
  if (warehouseEntities.length === 0) return collection;

  const entityMap = new Map(collection.entities.map((entity) => [entity.entity_key, entity]));
  for (const entity of warehouseEntities) {
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

export function buildWarehouseReadToolDefinitions(input: {
  warehouseContext: CompanionWarehouseContext;
  effectivePermissions: string[];
}): CompanionToolDefinition[] {
  const tools: CompanionToolDefinition[] = [];

  for (const capability of filterWarehouseCapabilitiesForPrivacy(input.warehouseContext)) {
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
      source_label: `warehouse:${capability.provider_key}`,
      freshness: "unknown",
      approval_required: false,
      enabled:
        permissionOk &&
        capability.enabled &&
        capability.adapter_available &&
        !input.warehouseContext.app_entitlement_blocked,
    });
  }

  return tools;
}

export function mergeWarehouseToolRegistry(
  registry: CompanionToolRegistry,
  warehouseContext: CompanionWarehouseContext,
  effectivePermissions: string[],
): CompanionToolRegistry {
  const warehouseTools = buildWarehouseReadToolDefinitions({
    warehouseContext,
    effectivePermissions,
  });

  if (warehouseTools.length === 0) return registry;

  const tools = [...registry.tools];
  const seen = new Set(tools.map((tool) => tool.tool_id));
  for (const tool of warehouseTools) {
    if (seen.has(tool.tool_id)) continue;
    seen.add(tool.tool_id);
    tools.push(tool);
  }

  const enabledTools = tools.filter((tool) => tool.enabled);
  return createEmptyCompanionToolRegistry({ tools, enabledTools });
}

export function buildWarehouseActionDefinitions(input: {
  warehouseContext: CompanionWarehouseContext;
  effectivePermissions: string[];
  appEntitlementBlocked: boolean;
  emergencyStop: boolean;
  maxRiskLevel: ActionLevel;
}): CompanionActionDefinition[] {
  const actions: CompanionActionDefinition[] = [];

  for (const capability of filterWarehouseCapabilitiesForPrivacy(input.warehouseContext)) {
    if (capability.operation !== "write") continue;

    const permissionOk =
      !capability.required_permission ||
      input.effectivePermissions.includes(capability.required_permission);

    const definition = buildActionDefinitionFromWarehouseCapability(capability, {
      permissionAllowed: permissionOk,
      appEntitlementBlocked: input.appEntitlementBlocked,
      emergencyStop: input.emergencyStop,
      maxRiskLevel: input.maxRiskLevel,
    });
    if (definition) actions.push(definition);
  }

  return actions;
}

export function mergeWarehouseActionDefinitions(
  actions: CompanionActionDefinition[],
  warehouseContext: CompanionWarehouseContext,
  input: {
    effectivePermissions: string[];
    appEntitlementBlocked: boolean;
    emergencyStop: boolean;
    maxRiskLevel: ActionLevel;
  },
): CompanionActionDefinition[] {
  const warehouseActions = buildWarehouseActionDefinitions({
    warehouseContext,
    ...input,
  });
  if (warehouseActions.length === 0) return actions;

  const seen = new Set(actions.map((action) => action.action_id));
  const merged = [...actions];
  for (const action of warehouseActions) {
    if (seen.has(action.action_id)) continue;
    seen.add(action.action_id);
    merged.push(action);
  }
  return merged;
}
