import type { EmergencyState } from "@/lib/trust-action/levels";
import { parseCompanionActionCenter } from "@/lib/companion-action-approval/parse";
import type { CompanionActionCenter, CompanionActionPolicy } from "@/lib/companion-action-approval/types";
import { parseTrustActionsCenter } from "@/lib/trust-action/parse";
import type { TrustActionsCenterBundle } from "@/lib/trust-action/types";
import type { CompanionBusinessPackCollection } from "./companion-business-pack-context";
import type { CompanionSchemaCollection } from "./companion-schema-context";
import {
  buildActionDefinitionFromCapability,
  buildActionDefinitionFromPolicy,
  buildActionDefinitionFromSchemaEntity,
  createEmptyCompanionActionRegistry,
  dedupeActionDefinitions,
  mapMaxRiskLevelToActionLevel,
  type CompanionActionDefinition,
  type CompanionActionRegistry,
} from "./companion-action-definition";

export type CompanionActionContext = {
  registry: CompanionActionRegistry;
  emergency_state: EmergencyState;
  execution_enabled: boolean;
  automation_disabled: boolean;
  app_suspended: boolean;
  permission_denied: boolean;
  missing_policy: boolean;
  pending_approval_count: number;
  latest_audit_reference: string | null;
  cross_link_approvals: string;
};

function permissionAllowed(permission: string | null, effectivePermissions: string[]): boolean {
  if (!permission) return true;
  return effectivePermissions.includes(permission);
}

function resolveEmergencyState(
  companionCenter: CompanionActionCenter | null,
  trustCenter: TrustActionsCenterBundle | null,
): EmergencyState {
  if (companionCenter?.emergency_stop_active) return "paused";
  const trustState = trustCenter?.emergency_state;
  if (trustState === "paused" || trustState === "emergency_shutdown") return trustState;
  if (trustState) return trustState;
  return "normal";
}

export function createEmptyCompanionActionContext(
  overrides?: Partial<CompanionActionContext>,
): CompanionActionContext {
  return {
    registry: createEmptyCompanionActionRegistry(),
    emergency_state: "normal",
    execution_enabled: false,
    automation_disabled: false,
    app_suspended: false,
    permission_denied: false,
    missing_policy: false,
    pending_approval_count: 0,
    latest_audit_reference: null,
    cross_link_approvals: "/app/approvals",
    ...overrides,
  };
}

export type NormalizeCompanionActionContextInput = {
  companionCenterRaw: unknown;
  trustCenterRaw: unknown;
  schemaContext: CompanionSchemaCollection;
  businessPackContext: CompanionBusinessPackCollection;
  effectivePermissions: string[];
  subscriptionStatus: string | null;
  permissionDenied?: boolean;
};

export function normalizeCompanionActionContext(
  input: NormalizeCompanionActionContextInput,
): CompanionActionContext {
  if (input.permissionDenied) {
    return createEmptyCompanionActionContext({ permission_denied: true });
  }

  const companionCenter = parseCompanionActionCenter(input.companionCenterRaw);
  const trustCenter = input.trustCenterRaw ? parseTrustActionsCenter(input.trustCenterRaw) : null;

  if (!companionCenter?.has_access && !trustCenter?.has_customer) {
    return createEmptyCompanionActionContext({
      permission_denied: true,
      missing_policy: true,
    });
  }

  const appSuspended =
    input.businessPackContext.appEntitlementBlocked ||
    ["paused", "suspended", "cancelled"].includes(String(input.subscriptionStatus ?? "").toLowerCase());

  const emergencyStop =
    Boolean(companionCenter?.emergency_stop_active) ||
    resolveEmergencyState(companionCenter, trustCenter) !== "normal";

  const maxRiskLevel = mapMaxRiskLevelToActionLevel(
    companionCenter?.limits.max_risk_level ?? "high",
  );

  const governanceOptions = {
    permissionAllowed: (perm: string | null) => permissionAllowed(perm, input.effectivePermissions),
    appEntitlementBlocked: appSuspended,
    emergencyStop,
    maxRiskLevel,
  };

  const actions: CompanionActionDefinition[] = [];

  for (const policy of companionCenter?.policies ?? []) {
    actions.push(
      buildActionDefinitionFromPolicy(policy, {
        permissionAllowed: governanceOptions.permissionAllowed(null),
        appEntitlementBlocked: appSuspended,
        emergencyStop,
        maxRiskLevel,
      }),
    );
  }

  for (const capability of input.businessPackContext.entitledCapabilities) {
    const definition = buildActionDefinitionFromCapability(capability, {
      permissionAllowed: governanceOptions.permissionAllowed(capability.permission),
      appEntitlementBlocked: appSuspended,
      emergencyStop,
      maxRiskLevel,
      writeBoundaries: capability.access_mode === "write" ? [capability.capability_id] : [],
    });
    if (definition) actions.push(definition);
  }

  for (const entity of input.schemaContext.entities) {
    const definition = buildActionDefinitionFromSchemaEntity(entity, {
      permissionAllowed: governanceOptions.permissionAllowed(entity.required_permissions[0] ?? null),
      appEntitlementBlocked: appSuspended,
      emergencyStop,
      maxRiskLevel,
    });
    if (definition) actions.push(definition);
  }

  const deduped = dedupeActionDefinitions(actions);
  const registry = createEmptyCompanionActionRegistry({
    actions: deduped,
    enabledActions: deduped.filter((action) => action.enabled),
  });

  const pendingCount =
    (companionCenter?.pending_actions.length ?? 0) +
    (trustCenter?.pending_approvals?.length ?? 0);

  const latestAudit =
    companionCenter?.receipts[0]?.audit_reference ??
    companionCenter?.audit_logs[0]?.id ??
    trustCenter?.recent_activity?.[0]?.id ??
    null;

  return createEmptyCompanionActionContext({
    registry,
    emergency_state: resolveEmergencyState(companionCenter, trustCenter),
    execution_enabled: Boolean(companionCenter?.execution_enabled) && !emergencyStop,
    automation_disabled: Boolean(companionCenter?.automation_disabled),
    app_suspended: appSuspended,
    permission_denied: input.schemaContext.permissionDenied && deduped.length === 0,
    missing_policy: (companionCenter?.policies.length ?? 0) === 0,
    pending_approval_count: pendingCount,
    latest_audit_reference: latestAudit,
    cross_link_approvals: companionCenter?.cross_link_trust_approvals ?? "/app/approvals",
  });
}

export function findCompanionActionPolicy(
  policies: CompanionActionPolicy[],
  actionId: string,
): CompanionActionPolicy | null {
  return policies.find((policy) => policy.policy_key === actionId) ?? null;
}
