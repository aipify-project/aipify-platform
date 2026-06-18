import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type AutonomySectionKey =
  | "autonomous_operations"
  | "delegated_responsibilities"
  | "approval_policies"
  | "human_oversight"
  | "autonomous_performance"
  | "governance_controls";

export type AutonomySectionItem = {
  id: string;
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  statusKey: OperationsStatusKey;
  sectionKey: AutonomySectionKey;
  itemType: "section";
};

export type AutonomyLevelInfo = {
  level: number;
  label: string;
  description: string;
};

export type DelegationItem = {
  id: string;
  delegationKey: string;
  delegationName: string;
  delegationCategory: string;
  autonomyLevel: number;
  ownerName: string;
  statusKey: OperationsStatusKey;
  itemType: "delegation";
};

export type PolicyItem = {
  id: string;
  policyName: string;
  policyType: string;
  ruleLabel: string;
  thresholdLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "policy";
};

export type OversightItem = {
  id: string;
  oversightType: string;
  title: string;
  summary: string;
  ownerName: string;
  policyUsed: string;
  statusKey: OperationsStatusKey;
  itemType: "oversight";
};

export type AutonomousOperation = {
  id: string;
  operationName: string;
  operationType: string;
  lastRunLabel: string;
  successRateLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "support_op" | "admin_op";
};

export type PerformanceMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "performance" | "executive";
};

export type CompanionDelegationItem = {
  id: string;
  suggestionType: string;
  suggestion: string;
  reason: string;
  status: string;
  itemType: "companion";
};

export type AutonomySettings = {
  autonomyEnabled: boolean;
  currentAutonomyLevel: number;
  executiveApprovalRequired: boolean;
};

export type AutonomousOrganizationCenter = {
  found: boolean;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  autonomySettings: AutonomySettings;
  autonomyLevels: AutonomyLevelInfo[];
  delegationFramework: DelegationItem[];
  policyEngine: PolicyItem[];
  humanOversightCenter: OversightItem[];
  autonomousSupportOperations: AutonomousOperation[];
  autonomousAdminOperations: AutonomousOperation[];
  autonomousPerformanceDashboard: PerformanceMetric[];
  executiveAutonomyDashboard: PerformanceMetric[];
  companionDelegationAdvisor: CompanionDelegationItem[];
  sections: {
    autonomousOperations: AutonomySectionItem[];
    delegatedResponsibilities: AutonomySectionItem[];
    approvalPolicies: AutonomySectionItem[];
    humanOversight: AutonomySectionItem[];
    autonomousPerformance: AutonomySectionItem[];
    governanceControls: AutonomySectionItem[];
  };
  statistics: {
    delegationCount: number;
    policyCount: number;
    oversightCount: number;
    supportOpCount: number;
    adminOpCount: number;
    companionCount: number;
  };
  error?: string;
};
