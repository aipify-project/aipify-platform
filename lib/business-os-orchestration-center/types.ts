import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type OrchestrationSectionKey =
  | "active_workflows"
  | "pending_approvals"
  | "running_automations"
  | "cross_system_tasks"
  | "business_pack_orchestration"
  | "workflow_templates"
  | "orchestration_analytics";

export type AutomationRunStatus = "running" | "requires_attention" | "failed" | "waiting";

export type OrchestrationSectionItem = {
  id: string;
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  statusKey: OperationsStatusKey;
  sectionKey: OrchestrationSectionKey;
  itemType: "section";
};

export type WorkflowItem = {
  id: string;
  workflowName: string;
  workflowType: string;
  ownerName: string;
  currentStep: string;
  stepsSummary: string;
  statusKey: OperationsStatusKey;
  priorityLevel: string;
  itemType: "workflow";
};

export type ApprovalItem = {
  id: string;
  approvalType: string;
  title: string;
  ownerName: string;
  deadlineLabel: string;
  priorityLevel: string;
  statusKey: OperationsStatusKey;
  itemType: "approval";
};

export type AutomationItem = {
  id: string;
  automationName: string;
  ownerName: string;
  runStatus: AutomationRunStatus;
  lastRunLabel: string;
  successRateLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "automation";
};

export type CrossSystemTask = {
  id: string;
  actionSystem: string;
  title: string;
  summary: string;
  stepsSummary: string;
  statusKey: OperationsStatusKey;
  itemType: "cross_task";
};

export type PackOrchestrationItem = {
  id: string;
  packKey: string;
  title: string;
  summary: string;
  coordinatedWorkflows: number;
  statusKey: OperationsStatusKey;
  itemType: "pack";
};

export type DependencyItem = {
  id: string;
  dependencyType: string;
  title: string;
  summary: string;
  blockerLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "dependency";
};

export type WorkflowTemplate = {
  id: string;
  templateKey: string;
  title: string;
  summary: string;
  stepsSummary: string;
  statusKey: OperationsStatusKey;
  itemType: "template";
};

export type CompanionOrchestrationItem = {
  id: string;
  recommendationType: string;
  recommendation: string;
  reason: string;
  status: string;
  itemType: "companion";
};

export type ExecutiveOrchestrationMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "executive";
};

export type BusinessOsOrchestrationCenter = {
  found: boolean;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  executiveDashboard: ExecutiveOrchestrationMetric[];
  workflowOrchestration: WorkflowItem[];
  approvalOrchestration: ApprovalItem[];
  automationRegistry: AutomationItem[];
  crossSystemActions: CrossSystemTask[];
  businessPackOrchestration: PackOrchestrationItem[];
  dependencyManagement: DependencyItem[];
  workflowTemplates: WorkflowTemplate[];
  companionAdvisor: CompanionOrchestrationItem[];
  sections: {
    activeWorkflows: OrchestrationSectionItem[];
    pendingApprovals: OrchestrationSectionItem[];
    runningAutomations: OrchestrationSectionItem[];
    crossSystemTasks: OrchestrationSectionItem[];
    businessPackOrchestration: OrchestrationSectionItem[];
    workflowTemplates: OrchestrationSectionItem[];
    orchestrationAnalytics: OrchestrationSectionItem[];
  };
  statistics: {
    workflowCount: number;
    approvalCount: number;
    automationCount: number;
    dependencyCount: number;
    templateCount: number;
    companionCount: number;
  };
  error?: string;
};
