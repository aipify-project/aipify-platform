import type { ActionLevel } from "@/lib/trust-action/levels";
import {
  aiExecutionProhibited,
  approvalRequiredForLevel,
} from "@/lib/trust-action/levels";
import type { CompanionActionPolicy } from "@/lib/companion-action-approval/types";
import type { CompanionCapabilityRef } from "./companion-business-pack-context";
import type { CompanionSchemaContext } from "./companion-schema-context";
import type { CompanionToolSchema } from "./companion-tool-definition";

export type CompanionActionSource =
  | "companion_policy"
  | "schema_write"
  | "business_pack"
  | "creative_provider"
  | "media_provider"
  | "workspace_provider";

export type CompanionActionDefinition = {
  action_id: string;
  capability_id: string;
  provider_key: string;
  entity: string;
  operation: "write";
  risk_level: ActionLevel;
  required_permission: string | null;
  approval_required: boolean;
  reversible: boolean;
  input_schema: CompanionToolSchema;
  expected_result_schema: CompanionToolSchema;
  source: CompanionActionSource;
  enabled: boolean;
};

export type CompanionActionRegistry = {
  actions: CompanionActionDefinition[];
  enabledActions: CompanionActionDefinition[];
};

const IRREVERSIBLE_BOUNDARY_PATTERN =
  /irreversible|permanent|delete|destroy|purge|non.?reversible/i;

function buildWriteInputSchema(actionId: string): CompanionToolSchema {
  return {
    fields: [
      { name: "action_id", type: "string" as const, required: true },
      { name: "target", type: "string" as const },
      { name: "payload", type: "object" as const },
      { name: "idempotency_key", type: "string" as const },
      { name: "provider_key", type: "string" as const },
      { name: "entity", type: "string" as const },
    ],
  };
}

function buildExpectedResultSchema(): CompanionToolSchema {
  return {
    fields: [
      { name: "status", type: "string" },
      { name: "audit_reference", type: "string" },
      { name: "approval_status", type: "string" },
    ],
  };
}

export function mapCompanionRiskToActionLevel(risk: string): ActionLevel {
  const normalized = risk.trim().toLowerCase();
  if (normalized === "critical") return 4;
  if (normalized === "high") return 3;
  if (normalized === "medium") return 2;
  if (normalized === "low") return 1;
  return 2;
}

export function mapMaxRiskLevelToActionLevel(maxRisk: string): ActionLevel {
  return mapCompanionRiskToActionLevel(maxRisk);
}

export function isIrreversibleAction(definition: CompanionActionDefinition): boolean {
  if (definition.risk_level >= 3) return true;
  return definition.input_schema.fields.some((field) =>
    IRREVERSIBLE_BOUNDARY_PATTERN.test(field.name),
  );
}

export function buildActionDefinitionFromPolicy(
  policy: CompanionActionPolicy,
  options: {
    permissionAllowed: boolean;
    appEntitlementBlocked: boolean;
    emergencyStop: boolean;
    maxRiskLevel: ActionLevel;
  },
): CompanionActionDefinition {
  const riskLevel: ActionLevel = policy.prohibited
    ? 4
    : policy.workflow_type === "executive"
      ? 3
      : policy.auto_approve_low_risk
        ? 1
        : 2;
  const exceedsMax = riskLevel > options.maxRiskLevel;
  const enabled =
    policy.allowed &&
    !policy.prohibited &&
    !options.appEntitlementBlocked &&
    !options.emergencyStop &&
    !exceedsMax &&
    !aiExecutionProhibited(riskLevel) &&
    options.permissionAllowed;

  return {
    action_id: policy.policy_key,
    capability_id: `${policy.category}.${policy.policy_key}.write`,
    provider_key: policy.category,
    entity: policy.category,
    operation: "write",
    risk_level: riskLevel,
    required_permission: null,
    approval_required: policy.requires_approval || approvalRequiredForLevel(riskLevel),
    reversible: riskLevel <= 2 && !policy.prohibited,
    input_schema: buildWriteInputSchema(policy.policy_key),
    expected_result_schema: buildExpectedResultSchema(),
    source: "companion_policy",
    enabled,
  };
}

function permissionAllowed(
  policy: CompanionActionPolicy,
  hasGenericAccess: boolean,
): boolean {
  if (policy.prohibited) return false;
  return hasGenericAccess;
}

export function buildActionDefinitionFromCapability(
  capability: CompanionCapabilityRef,
  options: {
    permissionAllowed: boolean;
    appEntitlementBlocked: boolean;
    emergencyStop: boolean;
    maxRiskLevel: ActionLevel;
    writeBoundaries: string[];
  },
): CompanionActionDefinition | null {
  if (capability.access_mode !== "write" && capability.operation !== "write") return null;

  const irreversible = options.writeBoundaries.some((boundary) =>
    IRREVERSIBLE_BOUNDARY_PATTERN.test(boundary),
  );
  const riskLevel: ActionLevel = irreversible ? 3 : 2;
  const permissionOk =
    !capability.permission || options.permissionAllowed;

  const enabled =
    permissionOk &&
    !options.appEntitlementBlocked &&
    !options.emergencyStop &&
    riskLevel <= options.maxRiskLevel &&
    !aiExecutionProhibited(riskLevel);

  return {
    action_id: capability.capability_id,
    capability_id: `${capability.capability_id}.write`,
    provider_key: capability.source_provider ?? capability.pack_key,
    entity: capability.entity,
    operation: "write",
    risk_level: riskLevel,
    required_permission: capability.permission,
    approval_required: approvalRequiredForLevel(riskLevel),
    reversible: riskLevel <= 2,
    input_schema: buildWriteInputSchema(capability.capability_id),
    expected_result_schema: buildExpectedResultSchema(),
    source: "business_pack",
    enabled,
  };
}

export function buildActionDefinitionFromCreativeCapability(
  capability: import("./companion-creative-context").CreativeCapabilityRuntimeRef,
  options: {
    permissionAllowed: boolean;
    appEntitlementBlocked: boolean;
    emergencyStop: boolean;
    maxRiskLevel: ActionLevel;
  },
): CompanionActionDefinition | null {
  if (capability.operation !== "write") return null;

  const riskLevel = Math.min(capability.risk_level, 3) as ActionLevel;
  const permissionOk = !capability.required_permission || options.permissionAllowed;

  const enabled =
    permissionOk &&
    !options.appEntitlementBlocked &&
    !options.emergencyStop &&
    capability.approval_required &&
    capability.reversible &&
    riskLevel <= options.maxRiskLevel &&
    riskLevel <= 2 &&
    !aiExecutionProhibited(riskLevel) &&
    capability.runtime_status !== "placeholder";

  return {
    action_id: capability.capability_id,
    capability_id: `${capability.capability_id}.write`,
    provider_key: capability.provider_key,
    entity: capability.entity,
    operation: "write",
    risk_level: riskLevel,
    required_permission: capability.required_permission,
    approval_required: capability.approval_required || approvalRequiredForLevel(riskLevel),
    reversible: capability.reversible,
    input_schema: buildWriteInputSchema(capability.capability_id),
    expected_result_schema: buildExpectedResultSchema(),
    source: "creative_provider",
    enabled,
  };
}

export function buildActionDefinitionFromMediaCapability(
  capability: import("./companion-media-context").MediaCapabilityRuntimeRef,
  options: {
    permissionAllowed: boolean;
    appEntitlementBlocked: boolean;
    emergencyStop: boolean;
    maxRiskLevel: ActionLevel;
  },
): CompanionActionDefinition | null {
  if (capability.operation !== "write") return null;

  const riskLevel = Math.min(capability.risk_level, 3) as ActionLevel;
  const permissionOk = !capability.required_permission || options.permissionAllowed;

  const enabled =
    permissionOk &&
    !options.appEntitlementBlocked &&
    !options.emergencyStop &&
    capability.approval_required &&
    capability.reversible &&
    riskLevel <= options.maxRiskLevel &&
    riskLevel <= 2 &&
    !aiExecutionProhibited(riskLevel) &&
    capability.runtime_status !== "placeholder";

  return {
    action_id: capability.capability_id,
    capability_id: `${capability.capability_id}.write`,
    provider_key: capability.provider_key,
    entity: capability.entity,
    operation: "write",
    risk_level: riskLevel,
    required_permission: capability.required_permission,
    approval_required: capability.approval_required || approvalRequiredForLevel(riskLevel),
    reversible: capability.reversible,
    input_schema: buildWriteInputSchema(capability.capability_id),
    expected_result_schema: buildExpectedResultSchema(),
    source: "media_provider",
    enabled,
  };
}

export function buildActionDefinitionFromWorkspaceCapability(
  capability: import("./companion-workspace-context").WorkspaceCapabilityRuntimeRef,
  options: {
    permissionAllowed: boolean;
    appEntitlementBlocked: boolean;
    emergencyStop: boolean;
    maxRiskLevel: ActionLevel;
  },
): CompanionActionDefinition | null {
  if (capability.operation !== "write") return null;

  const riskLevel = Math.min(capability.risk_level, 3) as ActionLevel;
  const permissionOk = !capability.required_permission || options.permissionAllowed;

  const enabled =
    permissionOk &&
    !options.appEntitlementBlocked &&
    !options.emergencyStop &&
    capability.approval_required &&
    capability.reversible &&
    riskLevel <= options.maxRiskLevel &&
    riskLevel <= 2 &&
    !aiExecutionProhibited(riskLevel) &&
    capability.runtime_status !== "placeholder";

  return {
    action_id: capability.capability_id,
    capability_id: `${capability.capability_id}.write`,
    provider_key: capability.provider_key,
    entity: capability.entity,
    operation: "write",
    risk_level: riskLevel,
    required_permission: capability.required_permission,
    approval_required: capability.approval_required || approvalRequiredForLevel(riskLevel),
    reversible: capability.reversible,
    input_schema: buildWriteInputSchema(capability.capability_id),
    expected_result_schema: buildExpectedResultSchema(),
    source: "workspace_provider",
    enabled,
  };
}

export function buildActionDefinitionFromSchemaEntity(
  entity: CompanionSchemaContext,
  options: {
    permissionAllowed: boolean;
    appEntitlementBlocked: boolean;
    emergencyStop: boolean;
    maxRiskLevel: ActionLevel;
  },
): CompanionActionDefinition | null {
  if (!entity.supported_operations.includes("write")) return null;

  const irreversible = entity.write_boundaries.some((boundary) =>
    IRREVERSIBLE_BOUNDARY_PATTERN.test(boundary),
  );
  const riskLevel: ActionLevel = irreversible ? 3 : 2;
  const permission = entity.required_permissions[0] ?? null;
  const permissionOk =
    !permission || options.permissionAllowed;

  const enabled =
    permissionOk &&
    !options.appEntitlementBlocked &&
    !options.emergencyStop &&
    entity.approval_status === "approved" &&
    riskLevel <= options.maxRiskLevel &&
    !aiExecutionProhibited(riskLevel);

  return {
    action_id: `${entity.source_provider ?? "schema"}.${entity.entity_key}.write`,
    capability_id: `${entity.source_provider ?? "schema"}.${entity.entity_key}.write`,
    provider_key: entity.source_provider ?? "schema",
    entity: entity.entity_key,
    operation: "write",
    risk_level: riskLevel,
    required_permission: permission,
    approval_required: approvalRequiredForLevel(riskLevel),
    reversible: riskLevel <= 2,
    input_schema: buildWriteInputSchema(entity.entity_key),
    expected_result_schema: buildExpectedResultSchema(),
    source: "schema_write",
    enabled,
  };
}

export function createEmptyCompanionActionRegistry(
  overrides?: Partial<CompanionActionRegistry>,
): CompanionActionRegistry {
  return {
    actions: [],
    enabledActions: [],
    ...overrides,
  };
}

export function dedupeActionDefinitions(actions: CompanionActionDefinition[]): CompanionActionDefinition[] {
  const seen = new Set<string>();
  const result: CompanionActionDefinition[] = [];
  for (const action of actions) {
    if (seen.has(action.action_id)) continue;
    seen.add(action.action_id);
    result.push(action);
  }
  return result;
}

export function validateCompanionActionInput(
  definition: CompanionActionDefinition,
  input: Record<string, unknown>,
): { ok: true; validated: Record<string, unknown> } | { ok: false; code: "invalid_input" } {
  for (const field of definition.input_schema.fields) {
    if (!field.required) continue;
    const value = input[field.name];
    if (value === undefined || value === null || value === "") {
      return { ok: false, code: "invalid_input" };
    }
  }

  if (input.action_id && String(input.action_id) !== definition.action_id) {
    return { ok: false, code: "invalid_input" };
  }

  const sanitized: Record<string, unknown> = {
    action_id: definition.action_id,
    provider_key: input.provider_key ?? definition.provider_key,
    entity: input.entity ?? definition.entity,
    target: input.target ?? null,
    payload: input.payload ?? {},
    idempotency_key: input.idempotency_key ?? null,
  };

  return { ok: true, validated: sanitized };
}
