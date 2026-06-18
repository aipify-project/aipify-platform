import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type ActionSectionKey =
  | "available_actions"
  | "pending_actions"
  | "approved_actions"
  | "completed_actions"
  | "failed_actions"
  | "action_history";

export type ActionCategory =
  | "personal"
  | "business"
  | "customer"
  | "operations"
  | "travel"
  | "commerce"
  | "support"
  | "administrative";

export type RiskLevel = "low" | "medium" | "high";

export type ExecutionStage =
  | "request"
  | "validation"
  | "approval"
  | "execution"
  | "confirmation"
  | "completed"
  | "failed"
  | "approved";

export type ActionSectionItem = {
  id: string;
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  statusKey: OperationsStatusKey;
  sectionKey: ActionSectionKey;
  itemType: "section";
};

export type ActionRegistryItem = {
  id: string;
  actionName: string;
  actionCategory: ActionCategory | string;
  providerName: string;
  riskLevel: RiskLevel;
  approvalRequired: boolean;
  statusKey: OperationsStatusKey;
  itemType: "registry";
};

export type ActionInstance = {
  id: string;
  actionName: string;
  actionCategory: string;
  providerName: string;
  riskLevel: RiskLevel;
  executionStage: ExecutionStage | string;
  ownerName: string;
  costLabel: string;
  resultLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "instance";
};

export type ActionProvider = {
  id: string;
  providerKey: string;
  providerName: string;
  providerType: string;
  healthLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "provider";
};

export type ActionHistoryItem = {
  id: string;
  actionName: string;
  userName: string;
  executedAtLabel: string;
  resultLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "history";
};

export type CompanionActionRequest = {
  id: string;
  requestType: string;
  requestText: string;
  explanation: string;
  costLabel: string;
  riskLevel: RiskLevel;
  approvalRequired: boolean;
  status: string;
  itemType: "companion";
};

export type ExecutiveActionMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "executive";
};

export type EnterpriseControls = {
  actionsEnabled: boolean;
  multiLevelApprovalsRequired: boolean;
  restrictedCategories: string[];
  restrictedProviders: string[];
};

export type RealWorldActionsExecutionCenter = {
  found: boolean;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  executionWorkflow?: string;
  privacyNote?: string;
  enterpriseControls: EnterpriseControls;
  executiveDashboard: ExecutiveActionMetric[];
  actionRegistry: ActionRegistryItem[];
  pendingActions: ActionInstance[];
  approvedActions: ActionInstance[];
  completedActions: ActionInstance[];
  failedActions: ActionInstance[];
  actionProviders: ActionProvider[];
  actionHistory: ActionHistoryItem[];
  companionRequests: CompanionActionRequest[];
  sections: {
    availableActions: ActionSectionItem[];
    pendingActions: ActionSectionItem[];
    approvedActions: ActionSectionItem[];
    completedActions: ActionSectionItem[];
    failedActions: ActionSectionItem[];
    actionHistory: ActionSectionItem[];
  };
  statistics: {
    registryCount: number;
    pendingCount: number;
    approvedCount: number;
    completedCount: number;
    failedCount: number;
    providerCount: number;
    companionCount: number;
  };
  error?: string;
};
