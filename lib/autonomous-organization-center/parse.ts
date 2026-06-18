import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  AutonomousOperation,
  AutonomousOrganizationCenter,
  AutonomyLevelInfo,
  AutonomySectionItem,
  AutonomySectionKey,
  AutonomySettings,
  CompanionDelegationItem,
  DelegationItem,
  OversightItem,
  PerformanceMetric,
  PolicyItem,
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

function parseSection(raw: unknown): AutonomySectionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), title: asString(d.title), summary: asString(d.summary),
    metricLabel: asString(d.metric_label), metricValue: asString(d.metric_value),
    statusKey: asStatus(d.status_key),
    sectionKey: asString(d.section_key, "autonomous_operations") as AutonomySectionKey,
    itemType: "section",
  };
}
function parseSections(raw: unknown): AutonomySectionItem[] {
  return Array.isArray(raw) ? raw.map(parseSection) : [];
}

function parseLevel(raw: unknown): AutonomyLevelInfo {
  const d = asRecord(raw);
  return { level: asNumber(d.level), label: asString(d.label), description: asString(d.description) };
}

function parseDelegation(raw: unknown): DelegationItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), delegationKey: asString(d.delegation_key), delegationName: asString(d.delegation_name),
    delegationCategory: asString(d.delegation_category), autonomyLevel: asNumber(d.autonomy_level),
    ownerName: asString(d.owner_name), statusKey: asStatus(d.status_key), itemType: "delegation",
  };
}

function parsePolicy(raw: unknown): PolicyItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), policyName: asString(d.policy_name), policyType: asString(d.policy_type),
    ruleLabel: asString(d.rule_label), thresholdLabel: asString(d.threshold_label),
    statusKey: asStatus(d.status_key), itemType: "policy",
  };
}

function parseOversight(raw: unknown): OversightItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), oversightType: asString(d.oversight_type), title: asString(d.title),
    summary: asString(d.summary), ownerName: asString(d.owner_name), policyUsed: asString(d.policy_used),
    statusKey: asStatus(d.status_key), itemType: "oversight",
  };
}

function parseOperation(raw: unknown, itemType: "support_op" | "admin_op"): AutonomousOperation {
  const d = asRecord(raw);
  return {
    id: asString(d.id), operationName: asString(d.operation_name), operationType: asString(d.operation_type),
    lastRunLabel: asString(d.last_run_label), successRateLabel: asString(d.success_rate_label),
    statusKey: asStatus(d.status_key), itemType,
  };
}

function parseMetric(raw: unknown, itemType: "performance" | "executive"): PerformanceMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType,
  };
}

function parseCompanion(raw: unknown): CompanionDelegationItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), suggestionType: asString(d.suggestion_type), suggestion: asString(d.suggestion),
    reason: asString(d.reason), status: asString(d.status), itemType: "companion",
  };
}

function parseSettings(raw: unknown): AutonomySettings {
  const d = asRecord(raw);
  return {
    autonomyEnabled: asBool(d.autonomy_enabled, true),
    currentAutonomyLevel: asNumber(d.current_autonomy_level, 2),
    executiveApprovalRequired: asBool(d.executive_approval_required, false),
  };
}

const emptyCenter: AutonomousOrganizationCenter = {
  found: false,
  autonomySettings: { autonomyEnabled: true, currentAutonomyLevel: 2, executiveApprovalRequired: false },
  autonomyLevels: [],
  delegationFramework: [],
  policyEngine: [],
  humanOversightCenter: [],
  autonomousSupportOperations: [],
  autonomousAdminOperations: [],
  autonomousPerformanceDashboard: [],
  executiveAutonomyDashboard: [],
  companionDelegationAdvisor: [],
  sections: {
    autonomousOperations: [], delegatedResponsibilities: [], approvalPolicies: [],
    humanOversight: [], autonomousPerformance: [], governanceControls: [],
  },
  statistics: {
    delegationCount: 0, policyCount: 0, oversightCount: 0,
    supportOpCount: 0, adminOpCount: 0, companionCount: 0,
  },
};

export function parseAutonomousOrganizationCenter(raw: unknown): AutonomousOrganizationCenter {
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
    privacyNote: asString(d.privacy_note) || undefined,
    autonomySettings: parseSettings(d.autonomy_settings),
    autonomyLevels: Array.isArray(d.autonomy_levels) ? d.autonomy_levels.map(parseLevel) : [],
    delegationFramework: Array.isArray(d.delegation_framework) ? d.delegation_framework.map(parseDelegation) : [],
    policyEngine: Array.isArray(d.policy_engine) ? d.policy_engine.map(parsePolicy) : [],
    humanOversightCenter: Array.isArray(d.human_oversight_center) ? d.human_oversight_center.map(parseOversight) : [],
    autonomousSupportOperations: Array.isArray(d.autonomous_support_operations)
      ? d.autonomous_support_operations.map((o) => parseOperation(o, "support_op")) : [],
    autonomousAdminOperations: Array.isArray(d.autonomous_admin_operations)
      ? d.autonomous_admin_operations.map((o) => parseOperation(o, "admin_op")) : [],
    autonomousPerformanceDashboard: Array.isArray(d.autonomous_performance_dashboard)
      ? d.autonomous_performance_dashboard.map((m) => parseMetric(m, "performance")) : [],
    executiveAutonomyDashboard: Array.isArray(d.executive_autonomy_dashboard)
      ? d.executive_autonomy_dashboard.map((m) => parseMetric(m, "executive")) : [],
    companionDelegationAdvisor: Array.isArray(d.companion_delegation_advisor)
      ? d.companion_delegation_advisor.map(parseCompanion) : [],
    sections: {
      autonomousOperations: parseSections(sections.autonomous_operations),
      delegatedResponsibilities: parseSections(sections.delegated_responsibilities),
      approvalPolicies: parseSections(sections.approval_policies),
      humanOversight: parseSections(sections.human_oversight),
      autonomousPerformance: parseSections(sections.autonomous_performance),
      governanceControls: parseSections(sections.governance_controls),
    },
    statistics: {
      delegationCount: asNumber(stats.delegation_count),
      policyCount: asNumber(stats.policy_count),
      oversightCount: asNumber(stats.oversight_count),
      supportOpCount: asNumber(stats.support_op_count),
      adminOpCount: asNumber(stats.admin_op_count),
      companionCount: asNumber(stats.companion_count),
    },
  };
}

export function parseAutonomousOrganizationAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
