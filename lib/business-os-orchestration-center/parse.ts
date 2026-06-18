import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  ApprovalItem,
  AutomationItem,
  AutomationRunStatus,
  BusinessOsOrchestrationCenter,
  CompanionOrchestrationItem,
  CrossSystemTask,
  DependencyItem,
  ExecutiveOrchestrationMetric,
  OrchestrationSectionItem,
  OrchestrationSectionKey,
  PackOrchestrationItem,
  WorkflowItem,
  WorkflowTemplate,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}
function asString(value: unknown, fallback = ""): string { return typeof value === "string" ? value : fallback; }
function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function asStatus(value: unknown): OperationsStatusKey {
  const key = asString(value, "information");
  const allowed: OperationsStatusKey[] = ["completed", "not_allowed", "requires_attention", "information", "restricted", "verified", "waiting"];
  return allowed.includes(key as OperationsStatusKey) ? (key as OperationsStatusKey) : "information";
}
function asRunStatus(value: unknown): AutomationRunStatus {
  const key = asString(value, "running");
  const allowed: AutomationRunStatus[] = ["running", "requires_attention", "failed", "waiting"];
  return allowed.includes(key as AutomationRunStatus) ? (key as AutomationRunStatus) : "running";
}

function parseSection(raw: unknown): OrchestrationSectionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), title: asString(d.title), summary: asString(d.summary),
    metricLabel: asString(d.metric_label), metricValue: asString(d.metric_value),
    statusKey: asStatus(d.status_key),
    sectionKey: asString(d.section_key, "active_workflows") as OrchestrationSectionKey,
    itemType: "section",
  };
}
function parseSections(raw: unknown): OrchestrationSectionItem[] {
  return Array.isArray(raw) ? raw.map(parseSection) : [];
}

function parseWorkflow(raw: unknown): WorkflowItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), workflowName: asString(d.workflow_name), workflowType: asString(d.workflow_type),
    ownerName: asString(d.owner_name), currentStep: asString(d.current_step), stepsSummary: asString(d.steps_summary),
    statusKey: asStatus(d.status_key), priorityLevel: asString(d.priority_level), itemType: "workflow",
  };
}
function parseApproval(raw: unknown): ApprovalItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), approvalType: asString(d.approval_type), title: asString(d.title),
    ownerName: asString(d.owner_name), deadlineLabel: asString(d.deadline_label),
    priorityLevel: asString(d.priority_level), statusKey: asStatus(d.status_key), itemType: "approval",
  };
}
function parseAutomation(raw: unknown): AutomationItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), automationName: asString(d.automation_name), ownerName: asString(d.owner_name),
    runStatus: asRunStatus(d.run_status), lastRunLabel: asString(d.last_run_label),
    successRateLabel: asString(d.success_rate_label), statusKey: asStatus(d.status_key), itemType: "automation",
  };
}
function parseCrossTask(raw: unknown): CrossSystemTask {
  const d = asRecord(raw);
  return {
    id: asString(d.id), actionSystem: asString(d.action_system), title: asString(d.title),
    summary: asString(d.summary), stepsSummary: asString(d.steps_summary),
    statusKey: asStatus(d.status_key), itemType: "cross_task",
  };
}
function parsePack(raw: unknown): PackOrchestrationItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), packKey: asString(d.pack_key), title: asString(d.title), summary: asString(d.summary),
    coordinatedWorkflows: asNumber(d.coordinated_workflows), statusKey: asStatus(d.status_key), itemType: "pack",
  };
}
function parseDependency(raw: unknown): DependencyItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), dependencyType: asString(d.dependency_type), title: asString(d.title),
    summary: asString(d.summary), blockerLabel: asString(d.blocker_label),
    statusKey: asStatus(d.status_key), itemType: "dependency",
  };
}
function parseTemplate(raw: unknown): WorkflowTemplate {
  const d = asRecord(raw);
  return {
    id: asString(d.id), templateKey: asString(d.template_key), title: asString(d.title),
    summary: asString(d.summary), stepsSummary: asString(d.steps_summary),
    statusKey: asStatus(d.status_key), itemType: "template",
  };
}
function parseCompanion(raw: unknown): CompanionOrchestrationItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), recommendationType: asString(d.recommendation_type),
    recommendation: asString(d.recommendation), reason: asString(d.reason),
    status: asString(d.status), itemType: "companion",
  };
}
function parseExecutive(raw: unknown): ExecutiveOrchestrationMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "executive",
  };
}

const emptyCenter: BusinessOsOrchestrationCenter = {
  found: false,
  executiveDashboard: [],
  workflowOrchestration: [],
  approvalOrchestration: [],
  automationRegistry: [],
  crossSystemActions: [],
  businessPackOrchestration: [],
  dependencyManagement: [],
  workflowTemplates: [],
  companionAdvisor: [],
  sections: {
    activeWorkflows: [], pendingApprovals: [], runningAutomations: [], crossSystemTasks: [],
    businessPackOrchestration: [], workflowTemplates: [], orchestrationAnalytics: [],
  },
  statistics: { workflowCount: 0, approvalCount: 0, automationCount: 0, dependencyCount: 0, templateCount: 0, companionCount: 0 },
};

export function parseBusinessOsOrchestrationCenter(raw: unknown): BusinessOsOrchestrationCenter {
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
    executiveDashboard: Array.isArray(d.executive_dashboard) ? d.executive_dashboard.map(parseExecutive) : [],
    workflowOrchestration: Array.isArray(d.workflow_orchestration) ? d.workflow_orchestration.map(parseWorkflow) : [],
    approvalOrchestration: Array.isArray(d.approval_orchestration) ? d.approval_orchestration.map(parseApproval) : [],
    automationRegistry: Array.isArray(d.automation_registry) ? d.automation_registry.map(parseAutomation) : [],
    crossSystemActions: Array.isArray(d.cross_system_actions) ? d.cross_system_actions.map(parseCrossTask) : [],
    businessPackOrchestration: Array.isArray(d.business_pack_orchestration) ? d.business_pack_orchestration.map(parsePack) : [],
    dependencyManagement: Array.isArray(d.dependency_management) ? d.dependency_management.map(parseDependency) : [],
    workflowTemplates: Array.isArray(d.workflow_templates) ? d.workflow_templates.map(parseTemplate) : [],
    companionAdvisor: Array.isArray(d.companion_advisor) ? d.companion_advisor.map(parseCompanion) : [],
    sections: {
      activeWorkflows: parseSections(sections.active_workflows),
      pendingApprovals: parseSections(sections.pending_approvals),
      runningAutomations: parseSections(sections.running_automations),
      crossSystemTasks: parseSections(sections.cross_system_tasks),
      businessPackOrchestration: parseSections(sections.business_pack_orchestration),
      workflowTemplates: parseSections(sections.workflow_templates),
      orchestrationAnalytics: parseSections(sections.orchestration_analytics),
    },
    statistics: {
      workflowCount: asNumber(stats.workflow_count),
      approvalCount: asNumber(stats.approval_count),
      automationCount: asNumber(stats.automation_count),
      dependencyCount: asNumber(stats.dependency_count),
      templateCount: asNumber(stats.template_count),
      companionCount: asNumber(stats.companion_count),
    },
  };
}

export function parseBusinessOsOrchestrationAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
