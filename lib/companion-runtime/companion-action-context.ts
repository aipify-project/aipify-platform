import type { EmergencyState } from "@/lib/trust-action/levels";
import { parseCompanionActionCenter } from "@/lib/companion-action-approval/parse";
import type { CompanionActionCenter, CompanionActionPolicy } from "@/lib/companion-action-approval/types";
import { parseTrustActionsCenter } from "@/lib/trust-action/parse";
import type { TrustActionsCenterBundle } from "@/lib/trust-action/types";
import type { CompanionBusinessPackCollection } from "./companion-business-pack-context";
import type { CompanionSchemaCollection } from "./companion-schema-context";
import {
  buildActionDefinitionFromCapability,
  buildActionDefinitionFromCreativeCapability,
  buildActionDefinitionFromMediaCapability,
  buildActionDefinitionFromCommerceCapability,
  buildActionDefinitionFromServicesCapability,
  buildActionDefinitionFromSupportCapability,
  buildActionDefinitionFromIndustryPackCapability,
  buildActionDefinitionFromHostsCapability,
  buildActionDefinitionFromHrCapability,
  buildActionDefinitionFromWarehouseCapability,
  buildActionDefinitionFromFinanceCapability,
  buildActionDefinitionFromSalesCapability,
  buildActionDefinitionFromSecurityCapability,
  buildActionDefinitionFromCommunityCapability,
  buildActionDefinitionFromWorkspaceCapability,
  buildActionDefinitionFromPolicy,
  buildActionDefinitionFromSchemaEntity,
  createEmptyCompanionActionRegistry,
  dedupeActionDefinitions,
  mapMaxRiskLevelToActionLevel,
  type CompanionActionDefinition,
  type CompanionActionRegistry,
} from "./companion-action-definition";
import type { CompanionCreativeContext } from "./companion-creative-context";
import type { CompanionMediaContext } from "./companion-media-context";
import type { CompanionWorkspaceContext } from "./companion-workspace-context";
import type { CompanionCommerceContext } from "./companion-commerce-context";
import type { CompanionServicesContext } from "./companion-services-context";
import type { CompanionSupportContext } from "./companion-support-context";
import type { CompanionIndustryPackContext } from "./companion-industry-pack-context";
import type { CompanionHostsContext } from "./companion-hosts-context";
import type { CompanionHrContext } from "./companion-hr-context";
import type { CompanionWarehouseContext } from "./companion-warehouse-context";
import type { CompanionFinanceContext } from "./companion-finance-context";
import type { CompanionSalesContext } from "./companion-sales-context";
import type { CompanionSecurityContext } from "./companion-security-context";
import type { CompanionCommunityContext } from "./companion-community-context";
import {
  parseApprovedCompanionActionRequest,
  parseApprovedTrustActionRequest,
  type CompanionApprovedActionRecord,
} from "./companion-action-approval-resolver";

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
  approved_records: import("./companion-action-approval-resolver").CompanionApprovedActionRecord[];
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
    approved_records: [],
    ...overrides,
  };
}

export type NormalizeCompanionActionContextInput = {
  companionCenterRaw: unknown;
  trustCenterRaw: unknown;
  approvalsCenterRaw?: unknown;
  schemaContext: CompanionSchemaCollection;
  businessPackContext: CompanionBusinessPackCollection;
  effectivePermissions: string[];
  subscriptionStatus: string | null;
  permissionDenied?: boolean;
  creativeContext?: CompanionCreativeContext;
  mediaContext?: CompanionMediaContext;
  workspaceContext?: CompanionWorkspaceContext;
  commerceContext?: CompanionCommerceContext;
  servicesContext?: CompanionServicesContext;
  supportContext?: CompanionSupportContext;
  industryPackContext?: CompanionIndustryPackContext;
  hostsContext?: CompanionHostsContext;
  hrContext?: CompanionHrContext;
  warehouseContext?: CompanionWarehouseContext;
  financeContext?: CompanionFinanceContext;
  salesContext?: CompanionSalesContext;
  securityContext?: CompanionSecurityContext;
  communityContext?: CompanionCommunityContext;
};

function parseApprovedRecordsFromApprovalsCenter(raw: unknown): CompanionApprovedActionRecord[] {
  if (!raw || typeof raw !== "object") return [];
  const approvals = (raw as Record<string, unknown>).approvals;
  if (!Array.isArray(approvals)) return [];

  const records: CompanionApprovedActionRecord[] = [];
  for (const entry of approvals) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    if (String(row.status) !== "approved") continue;
    if (String(row.category ?? "action") !== "action") continue;
    const actionName = String(row.action_name ?? row.title ?? "");
    if (!actionName) continue;
    records.push({
      request_id: String(row.id),
      action_id: actionName,
      risk_level: Number(row.risk_level ?? 2),
      status: "approved",
      reversible: Number(row.risk_level ?? 2) <= 2,
      expires_at: null,
      source: "trust_action",
    });
  }
  return records;
}

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

  for (const capability of input.creativeContext?.capabilities ?? []) {
    if (capability.operation !== "write") continue;
    const definition = buildActionDefinitionFromCreativeCapability(capability, {
      permissionAllowed: governanceOptions.permissionAllowed(capability.required_permission),
      appEntitlementBlocked: appSuspended,
      emergencyStop,
      maxRiskLevel,
    });
    if (definition) actions.push(definition);
  }

  for (const capability of input.mediaContext?.capabilities ?? []) {
    if (capability.operation !== "write") continue;
    const definition = buildActionDefinitionFromMediaCapability(capability, {
      permissionAllowed: governanceOptions.permissionAllowed(capability.required_permission),
      appEntitlementBlocked: appSuspended,
      emergencyStop,
      maxRiskLevel,
    });
    if (definition) actions.push(definition);
  }

  for (const capability of input.workspaceContext?.capabilities ?? []) {
    if (capability.operation !== "write") continue;
    const definition = buildActionDefinitionFromWorkspaceCapability(capability, {
      permissionAllowed: governanceOptions.permissionAllowed(capability.required_permission),
      appEntitlementBlocked: appSuspended,
      emergencyStop,
      maxRiskLevel,
    });
    if (definition) actions.push(definition);
  }

  for (const capability of input.commerceContext?.capabilities ?? []) {
    if (capability.operation !== "write") continue;
    const definition = buildActionDefinitionFromCommerceCapability(capability, {
      permissionAllowed: governanceOptions.permissionAllowed(capability.required_permission),
      appEntitlementBlocked: appSuspended,
      emergencyStop,
      maxRiskLevel,
    });
    if (definition) actions.push(definition);
  }

  for (const capability of input.servicesContext?.capabilities ?? []) {
    if (capability.operation !== "write") continue;
    const definition = buildActionDefinitionFromServicesCapability(capability, {
      permissionAllowed: governanceOptions.permissionAllowed(capability.required_permission),
      appEntitlementBlocked: appSuspended,
      emergencyStop,
      maxRiskLevel,
    });
    if (definition) actions.push(definition);
  }

  for (const capability of input.supportContext?.capabilities ?? []) {
    if (capability.operation !== "write") continue;
    const definition = buildActionDefinitionFromSupportCapability(capability, {
      permissionAllowed: governanceOptions.permissionAllowed(capability.required_permission),
      appEntitlementBlocked: appSuspended,
      emergencyStop,
      maxRiskLevel,
    });
    if (definition) actions.push(definition);
  }

  for (const capability of input.industryPackContext?.capabilities ?? []) {
    if (capability.operation !== "write") continue;
    const definition = buildActionDefinitionFromIndustryPackCapability(capability, {
      permissionAllowed: governanceOptions.permissionAllowed(capability.required_permission),
      appEntitlementBlocked: appSuspended,
      emergencyStop,
      maxRiskLevel,
    });
    if (definition) actions.push(definition);
  }

  for (const capability of input.hostsContext?.capabilities ?? []) {
    if (capability.operation !== "write") continue;
    const definition = buildActionDefinitionFromHostsCapability(capability, {
      permissionAllowed: governanceOptions.permissionAllowed(capability.required_permission),
      appEntitlementBlocked: appSuspended,
      emergencyStop,
      maxRiskLevel,
    });
    if (definition) actions.push(definition);
  }

  for (const capability of input.hrContext?.capabilities ?? []) {
    if (capability.operation !== "write") continue;
    const definition = buildActionDefinitionFromHrCapability(capability, {
      permissionAllowed: governanceOptions.permissionAllowed(capability.required_permission),
      appEntitlementBlocked: appSuspended,
      emergencyStop,
      maxRiskLevel,
    });
    if (definition) actions.push(definition);
  }

  for (const capability of input.warehouseContext?.capabilities ?? []) {
    if (capability.operation !== "write") continue;
    const definition = buildActionDefinitionFromWarehouseCapability(capability, {
      permissionAllowed: governanceOptions.permissionAllowed(capability.required_permission),
      appEntitlementBlocked: appSuspended,
      emergencyStop,
      maxRiskLevel,
    });
    if (definition) actions.push(definition);
  }

  for (const capability of input.financeContext?.capabilities ?? []) {
    if (capability.operation !== "write") continue;
    const definition = buildActionDefinitionFromFinanceCapability(capability, {
      permissionAllowed: governanceOptions.permissionAllowed(capability.required_permission),
      appEntitlementBlocked: appSuspended,
      emergencyStop,
      maxRiskLevel,
    });
    if (definition) actions.push(definition);
  }

  for (const capability of input.salesContext?.capabilities ?? []) {
    if (capability.operation !== "write") continue;
    const definition = buildActionDefinitionFromSalesCapability(capability, {
      permissionAllowed: governanceOptions.permissionAllowed(capability.required_permission),
      appEntitlementBlocked: appSuspended,
      emergencyStop,
      maxRiskLevel,
    });
    if (definition) actions.push(definition);
  }

  for (const capability of input.securityContext?.capabilities ?? []) {
    if (capability.operation !== "write") continue;
    const definition = buildActionDefinitionFromSecurityCapability(capability, {
      permissionAllowed: governanceOptions.permissionAllowed(capability.required_permission),
      appEntitlementBlocked: appSuspended,
      emergencyStop,
      maxRiskLevel,
    });
    if (definition) actions.push(definition);
  }

  for (const capability of input.communityContext?.capabilities ?? []) {
    if (capability.operation !== "write") continue;
    const definition = buildActionDefinitionFromCommunityCapability(capability, {
      permissionAllowed: governanceOptions.permissionAllowed(capability.required_permission),
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

  const approvedRecords: CompanionApprovedActionRecord[] = [
    ...parseApprovedRecordsFromApprovalsCenter(input.approvalsCenterRaw),
  ];

  for (const request of trustCenter?.pending_approvals ?? []) {
    const parsed = parseApprovedTrustActionRequest(request);
    if (parsed) approvedRecords.push(parsed);
  }

  for (const request of companionCenter?.pending_actions ?? []) {
    const parsed = parseApprovedCompanionActionRequest(request);
    if (parsed) approvedRecords.push(parsed);
  }

  for (const request of companionCenter?.action_history ?? []) {
    if (!["approved", "completed"].includes(request.lifecycle_status)) continue;
    approvedRecords.push({
      request_id: request.id,
      action_id: request.title,
      risk_level: Number(request.risk_level ?? 2),
      status: "approved",
      reversible: Number(request.risk_level ?? 2) <= 2,
      expires_at: null,
      source: "companion_action",
    });
  }

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
    approved_records: approvedRecords,
  });
}

export function findCompanionActionPolicy(
  policies: CompanionActionPolicy[],
  actionId: string,
): CompanionActionPolicy | null {
  return policies.find((policy) => policy.policy_key === actionId) ?? null;
}
