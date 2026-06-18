import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  ActionHistoryItem,
  ActionInstance,
  ActionProvider,
  ActionRegistryItem,
  ActionSectionItem,
  ActionSectionKey,
  CompanionActionRequest,
  EnterpriseControls,
  ExecutiveActionMetric,
  RealWorldActionsExecutionCenter,
  RiskLevel,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}
function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}
function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}
function asStatus(value: unknown): OperationsStatusKey {
  const key = asString(value, "information");
  const allowed: OperationsStatusKey[] = ["completed", "not_allowed", "requires_attention", "information", "restricted", "verified", "waiting"];
  return allowed.includes(key as OperationsStatusKey) ? (key as OperationsStatusKey) : "information";
}
function asRisk(value: unknown): RiskLevel {
  const key = asString(value, "medium");
  return key === "low" || key === "high" ? key : "medium";
}

function parseSection(raw: unknown): ActionSectionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    title: asString(d.title),
    summary: asString(d.summary),
    metricLabel: asString(d.metric_label),
    metricValue: asString(d.metric_value),
    statusKey: asStatus(d.status_key),
    sectionKey: asString(d.section_key, "available_actions") as ActionSectionKey,
    itemType: "section",
  };
}
function parseSections(raw: unknown): ActionSectionItem[] {
  return Array.isArray(raw) ? raw.map(parseSection) : [];
}

function parseRegistry(raw: unknown): ActionRegistryItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    actionName: asString(d.action_name),
    actionCategory: asString(d.action_category),
    providerName: asString(d.provider_name),
    riskLevel: asRisk(d.risk_level),
    approvalRequired: asBool(d.approval_required, true),
    statusKey: asStatus(d.status_key),
    itemType: "registry",
  };
}

function parseInstance(raw: unknown): ActionInstance {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    actionName: asString(d.action_name),
    actionCategory: asString(d.action_category),
    providerName: asString(d.provider_name),
    riskLevel: asRisk(d.risk_level),
    executionStage: asString(d.execution_stage),
    ownerName: asString(d.owner_name),
    costLabel: asString(d.cost_label),
    resultLabel: asString(d.result_label),
    statusKey: asStatus(d.status_key),
    itemType: "instance",
  };
}

function parseProvider(raw: unknown): ActionProvider {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    providerKey: asString(d.provider_key),
    providerName: asString(d.provider_name),
    providerType: asString(d.provider_type),
    healthLabel: asString(d.health_label),
    statusKey: asStatus(d.status_key),
    itemType: "provider",
  };
}

function parseHistory(raw: unknown): ActionHistoryItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    actionName: asString(d.action_name),
    userName: asString(d.user_name),
    executedAtLabel: asString(d.executed_at_label),
    resultLabel: asString(d.result_label),
    statusKey: asStatus(d.status_key),
    itemType: "history",
  };
}

function parseCompanion(raw: unknown): CompanionActionRequest {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    requestType: asString(d.request_type),
    requestText: asString(d.request_text),
    explanation: asString(d.explanation),
    costLabel: asString(d.cost_label),
    riskLevel: asRisk(d.risk_level),
    approvalRequired: asBool(d.approval_required, true),
    status: asString(d.status),
    itemType: "companion",
  };
}

function parseExecutive(raw: unknown): ExecutiveActionMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    metricKey: asString(d.metric_key),
    metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label),
    statusKey: asStatus(d.status_key),
    itemType: "executive",
  };
}

function parseEnterpriseControls(raw: unknown): EnterpriseControls {
  const d = asRecord(raw);
  return {
    actionsEnabled: asBool(d.actions_enabled, true),
    multiLevelApprovalsRequired: asBool(d.multi_level_approvals_required, false),
    restrictedCategories: Array.isArray(d.restricted_categories) ? d.restricted_categories.map(String) : [],
    restrictedProviders: Array.isArray(d.restricted_providers) ? d.restricted_providers.map(String) : [],
  };
}

const emptyCenter: RealWorldActionsExecutionCenter = {
  found: false,
  enterpriseControls: {
    actionsEnabled: true,
    multiLevelApprovalsRequired: false,
    restrictedCategories: [],
    restrictedProviders: [],
  },
  executiveDashboard: [],
  actionRegistry: [],
  pendingActions: [],
  approvedActions: [],
  completedActions: [],
  failedActions: [],
  actionProviders: [],
  actionHistory: [],
  companionRequests: [],
  sections: {
    availableActions: [],
    pendingActions: [],
    approvedActions: [],
    completedActions: [],
    failedActions: [],
    actionHistory: [],
  },
  statistics: {
    registryCount: 0,
    pendingCount: 0,
    approvedCount: 0,
    completedCount: 0,
    failedCount: 0,
    providerCount: 0,
    companionCount: 0,
  },
};

export function parseRealWorldActionsExecutionCenter(raw: unknown): RealWorldActionsExecutionCenter {
  const d = asRecord(raw);
  if (!d.found) return { ...emptyCenter, error: asString(d.error) || undefined };

  const sections = asRecord(d.sections);
  const stats = asRecord(d.statistics);

  return {
    found: true,
    philosophy: asString(d.philosophy) || undefined,
    canExecutive: d.can_executive === true,
    canManage: d.can_manage === true,
    governanceNote: asString(d.governance_note) || undefined,
    executionWorkflow: asString(d.execution_workflow) || undefined,
    privacyNote: asString(d.privacy_note) || undefined,
    enterpriseControls: parseEnterpriseControls(d.enterprise_controls),
    executiveDashboard: Array.isArray(d.executive_dashboard) ? d.executive_dashboard.map(parseExecutive) : [],
    actionRegistry: Array.isArray(d.action_registry) ? d.action_registry.map(parseRegistry) : [],
    pendingActions: Array.isArray(d.pending_actions) ? d.pending_actions.map(parseInstance) : [],
    approvedActions: Array.isArray(d.approved_actions) ? d.approved_actions.map(parseInstance) : [],
    completedActions: Array.isArray(d.completed_actions) ? d.completed_actions.map(parseInstance) : [],
    failedActions: Array.isArray(d.failed_actions) ? d.failed_actions.map(parseInstance) : [],
    actionProviders: Array.isArray(d.action_providers) ? d.action_providers.map(parseProvider) : [],
    actionHistory: Array.isArray(d.action_history) ? d.action_history.map(parseHistory) : [],
    companionRequests: Array.isArray(d.companion_requests) ? d.companion_requests.map(parseCompanion) : [],
    sections: {
      availableActions: parseSections(sections.available_actions),
      pendingActions: parseSections(sections.pending_actions),
      approvedActions: parseSections(sections.approved_actions),
      completedActions: parseSections(sections.completed_actions),
      failedActions: parseSections(sections.failed_actions),
      actionHistory: parseSections(sections.action_history),
    },
    statistics: {
      registryCount: asNumber(stats.registry_count),
      pendingCount: asNumber(stats.pending_count),
      approvedCount: asNumber(stats.approved_count),
      completedCount: asNumber(stats.completed_count),
      failedCount: asNumber(stats.failed_count),
      providerCount: asNumber(stats.provider_count),
      companionCount: asNumber(stats.companion_count),
    },
  };
}

export function parseRealWorldActionsExecutionAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
