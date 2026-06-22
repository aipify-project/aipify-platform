import type { CompanionCapabilityRef } from "./companion-business-pack-context";
import type { CompanionCommerceContext } from "./companion-commerce-context";
import { filterCommerceCapabilitiesForPrivacy } from "./companion-commerce-context";
import type { CompanionSchemaCollection, CompanionSchemaContext } from "./companion-schema-context";
import type { CompanionToolDefinition, CompanionToolRegistry } from "./companion-tool-definition";
import {
  buildReadToolInputSchema,
  buildReadToolOutputSchema,
  createEmptyCompanionToolRegistry,
} from "./companion-tool-definition";
import type { ActionLevel } from "@/lib/trust-action/levels";
import { buildActionDefinitionFromCommerceCapability } from "./companion-action-definition";
import type { CompanionActionDefinition } from "./companion-action-definition";
import { humanizeEntityKey } from "@/lib/integration-intelligence/normalize-text";

const COMMERCE_PACK_KEY = "commerce_provider";

export function mapCommerceCapabilitiesToRefs(
  commerceContext: CompanionCommerceContext,
): CompanionCapabilityRef[] {
  return filterCommerceCapabilitiesForPrivacy(commerceContext).map((capability) => ({
    capability_id: capability.capability_id,
    entity: capability.entity,
    operation: capability.operation,
    access_mode: capability.operation === "write" ? "write" : "read",
    permission: capability.required_permission,
    source_provider: capability.provider_key,
    pack_key: COMMERCE_PACK_KEY,
  }));
}

export function mergeCommerceCapabilities(
  entitledCapabilities: CompanionCapabilityRef[],
  commerceContext: CompanionCommerceContext,
): CompanionCapabilityRef[] {
  const commerceRefs = mapCommerceCapabilitiesToRefs(commerceContext);
  const seen = new Set(entitledCapabilities.map((capability) => capability.capability_id));
  const merged = [...entitledCapabilities];
  for (const ref of commerceRefs) {
    if (seen.has(ref.capability_id)) continue;
    seen.add(ref.capability_id);
    merged.push(ref);
  }
  return merged;
}

export function buildCommerceSchemaEntities(
  commerceContext: CompanionCommerceContext,
  effectivePermissions: string[],
): CompanionSchemaContext[] {
  if (commerceContext.permission_denied || commerceContext.app_entitlement_blocked) {
    return [];
  }

  const entities: CompanionSchemaContext[] = [];

  for (const capability of filterCommerceCapabilitiesForPrivacy(commerceContext)) {
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
      field_types: { [capability.capability_key]: "commerce_capability" },
      relations: [`${capability.entity}->${capability.provider_key}`],
      supported_operations: ["read"],
      read_boundaries: [capability.capability_id],
      write_boundaries: [],
      required_permissions: capability.required_permission ? [capability.required_permission] : [],
      source_provider: capability.provider_key,
      pack_key: COMMERCE_PACK_KEY,
      schema_version: "commerce_provider:v1",
      freshness: "unknown",
      approval_status: "approved",
    });
  }

  return entities;
}

export function mergeCommerceSchemaCollection(
  collection: CompanionSchemaCollection,
  commerceContext: CompanionCommerceContext,
  effectivePermissions: string[],
): CompanionSchemaCollection {
  const commerceEntities = buildCommerceSchemaEntities(commerceContext, effectivePermissions);
  if (commerceEntities.length === 0) return collection;

  const entityMap = new Map(collection.entities.map((entity) => [entity.entity_key, entity]));
  for (const entity of commerceEntities) {
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

export function buildCommerceReadToolDefinitions(input: {
  commerceContext: CompanionCommerceContext;
  effectivePermissions: string[];
}): CompanionToolDefinition[] {
  const tools: CompanionToolDefinition[] = [];

  for (const capability of filterCommerceCapabilitiesForPrivacy(input.commerceContext)) {
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
      source_label: `commerce:${capability.provider_key}`,
      freshness: "unknown",
      approval_required: false,
      enabled:
        permissionOk &&
        capability.enabled &&
        capability.adapter_available &&
        !input.commerceContext.app_entitlement_blocked,
    });
  }

  return tools;
}

export function mergeCommerceToolRegistry(
  registry: CompanionToolRegistry,
  commerceContext: CompanionCommerceContext,
  effectivePermissions: string[],
): CompanionToolRegistry {
  const commerceTools = buildCommerceReadToolDefinitions({
    commerceContext,
    effectivePermissions,
  });

  if (commerceTools.length === 0) return registry;

  const tools = [...registry.tools];
  const seen = new Set(tools.map((tool) => tool.tool_id));
  for (const tool of commerceTools) {
    if (seen.has(tool.tool_id)) continue;
    seen.add(tool.tool_id);
    tools.push(tool);
  }

  const enabledTools = tools.filter((tool) => tool.enabled);
  return createEmptyCompanionToolRegistry({ tools, enabledTools });
}

export function buildCommerceActionDefinitions(input: {
  commerceContext: CompanionCommerceContext;
  effectivePermissions: string[];
  appEntitlementBlocked: boolean;
  emergencyStop: boolean;
  maxRiskLevel: ActionLevel;
}): CompanionActionDefinition[] {
  const actions: CompanionActionDefinition[] = [];

  for (const capability of filterCommerceCapabilitiesForPrivacy(input.commerceContext)) {
    if (capability.operation !== "write") continue;

    const permissionOk =
      !capability.required_permission ||
      input.effectivePermissions.includes(capability.required_permission);

    const definition = buildActionDefinitionFromCommerceCapability(capability, {
      permissionAllowed: permissionOk,
      appEntitlementBlocked: input.appEntitlementBlocked,
      emergencyStop: input.emergencyStop,
      maxRiskLevel: input.maxRiskLevel,
    });
    if (definition) actions.push(definition);
  }

  return actions;
}

export function mergeCommerceActionDefinitions(
  actions: CompanionActionDefinition[],
  commerceContext: CompanionCommerceContext,
  input: {
    effectivePermissions: string[];
    appEntitlementBlocked: boolean;
    emergencyStop: boolean;
    maxRiskLevel: ActionLevel;
  },
): CompanionActionDefinition[] {
  const commerceActions = buildCommerceActionDefinitions({
    commerceContext,
    ...input,
  });
  if (commerceActions.length === 0) return actions;

  const seen = new Set(actions.map((action) => action.action_id));
  const merged = [...actions];
  for (const action of commerceActions) {
    if (seen.has(action.action_id)) continue;
    seen.add(action.action_id);
    merged.push(action);
  }
  return merged;
}
