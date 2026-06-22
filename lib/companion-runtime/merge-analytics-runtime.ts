import type { CompanionCapabilityRef } from "./companion-business-pack-context";
import type { CompanionAnalyticsContext } from "./companion-analytics-context";
import { filterAnalyticsCapabilitiesForPrivacy } from "./companion-analytics-context";
import type { CompanionSchemaCollection, CompanionSchemaContext } from "./companion-schema-context";
import type { CompanionToolDefinition, CompanionToolRegistry } from "./companion-tool-definition";
import {
  buildReadToolInputSchema,
  buildReadToolOutputSchema,
  createEmptyCompanionToolRegistry,
} from "./companion-tool-definition";
import { humanizeEntityKey } from "@/lib/integration-intelligence/normalize-text";

const ANALYTICS_PACK_KEY = "analytics_provider";

export function mapAnalyticsCapabilitiesToRefs(
  analyticsContext: CompanionAnalyticsContext,
): CompanionCapabilityRef[] {
  return filterAnalyticsCapabilitiesForPrivacy(analyticsContext).map((capability) => ({
    capability_id: capability.capability_id,
    entity: capability.entity,
    operation: capability.operation,
    access_mode: "read",
    permission: capability.required_permission,
    source_provider: capability.provider_key,
    pack_key: ANALYTICS_PACK_KEY,
  }));
}

export function mergeAnalyticsCapabilities(
  entitledCapabilities: CompanionCapabilityRef[],
  analyticsContext: CompanionAnalyticsContext,
): CompanionCapabilityRef[] {
  const analyticsRefs = mapAnalyticsCapabilitiesToRefs(analyticsContext);
  const seen = new Set(entitledCapabilities.map((capability) => capability.capability_id));
  const merged = [...entitledCapabilities];
  for (const ref of analyticsRefs) {
    if (seen.has(ref.capability_id)) continue;
    seen.add(ref.capability_id);
    merged.push(ref);
  }
  return merged;
}

export function buildAnalyticsSchemaEntities(
  analyticsContext: CompanionAnalyticsContext,
  effectivePermissions: string[],
): CompanionSchemaContext[] {
  if (analyticsContext.permission_denied || analyticsContext.app_entitlement_blocked) {
    return [];
  }

  const entities: CompanionSchemaContext[] = [];

  for (const capability of filterAnalyticsCapabilitiesForPrivacy(analyticsContext)) {
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
      field_types: { [capability.capability_key]: "analytics_capability" },
      relations: [`${capability.entity}->${capability.provider_key}`],
      supported_operations: ["read"],
      read_boundaries: [capability.capability_id],
      write_boundaries: [],
      required_permissions: capability.required_permission ? [capability.required_permission] : [],
      source_provider: capability.provider_key,
      pack_key: ANALYTICS_PACK_KEY,
      schema_version: "analytics_provider:v1",
      freshness: analyticsContext.empty_metric_basis ? "unknown" : "fresh",
      approval_status: "approved",
    });
  }

  return entities;
}

export function mergeAnalyticsSchemaCollection(
  collection: CompanionSchemaCollection,
  analyticsContext: CompanionAnalyticsContext,
  effectivePermissions: string[],
): CompanionSchemaCollection {
  const analyticsEntities = buildAnalyticsSchemaEntities(analyticsContext, effectivePermissions);
  if (analyticsEntities.length === 0) return collection;

  const entityMap = new Map(collection.entities.map((entity) => [entity.entity_key, entity]));
  for (const entity of analyticsEntities) {
    entityMap.set(entity.entity_key, entity);
  }

  const entities = [...entityMap.values()];
  return {
    ...collection,
    entities,
    availableEntities: entities.map((entity) => entity.entity_key),
  };
}

export function buildAnalyticsReadToolDefinitions(input: {
  analyticsContext: CompanionAnalyticsContext;
  effectivePermissions: string[];
}): CompanionToolDefinition[] {
  const tools: CompanionToolDefinition[] = [];

  for (const capability of filterAnalyticsCapabilitiesForPrivacy(input.analyticsContext)) {
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
      source_label: `analytics:${capability.provider_key}`,
      freshness: "unknown",
      approval_required: false,
      enabled:
        permissionOk &&
        capability.enabled &&
        capability.adapter_available &&
        !input.analyticsContext.app_entitlement_blocked,
    });
  }

  return tools;
}

export function mergeAnalyticsToolRegistry(
  registry: CompanionToolRegistry,
  analyticsContext: CompanionAnalyticsContext,
  effectivePermissions: string[],
): CompanionToolRegistry {
  const analyticsTools = buildAnalyticsReadToolDefinitions({
    analyticsContext,
    effectivePermissions,
  });
  if (analyticsTools.length === 0) return registry;

  const tools = [...registry.tools];
  const seen = new Set(tools.map((tool) => tool.tool_id));
  for (const tool of analyticsTools) {
    if (seen.has(tool.tool_id)) continue;
    seen.add(tool.tool_id);
    tools.push(tool);
  }

  const enabledTools = tools.filter((tool) => tool.enabled);
  return createEmptyCompanionToolRegistry({ tools, enabledTools });
}
