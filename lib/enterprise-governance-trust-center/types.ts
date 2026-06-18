import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type TrustSectionKey =
  | "trust_overview"
  | "governance_status"
  | "compliance_center"
  | "audit_center"
  | "risk_center"
  | "approval_center"
  | "policy_center";

export type TrustSectionItem = {
  id: string;
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  statusKey: OperationsStatusKey;
  sectionKey: TrustSectionKey;
  itemType: "section";
};

export type TrustSettings = {
  trustCenterEnabled: boolean;
  transparencyModeEnabled: boolean;
};

export type GovernanceFrameworkItem = {
  id: string;
  frameworkArea: string;
  areaName: string;
  governanceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "framework";
};

export type TrustScoreItem = {
  id: string;
  scoreCategory: string;
  scoreValue: string;
  scoreLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "trust_score";
};

export type PolicyItem = {
  id: string;
  policyType: string;
  policyName: string;
  ruleLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "policy";
};

export type AuditEventItem = {
  id: string;
  actorName: string;
  eventAction: string;
  eventWhat: string;
  eventWhy: string;
  eventResult: string;
  approvalHistoryLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "audit_event";
};

export type ExplainabilityItem = {
  id: string;
  explainType: string;
  title: string;
  whyLabel: string;
  howLabel: string;
  dataUsedLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "explainability";
};

export type ComplianceItem = {
  id: string;
  frameworkKey: string;
  frameworkName: string;
  complianceStatus: string;
  outstandingIssues: string;
  requiredActions: string;
  statusKey: OperationsStatusKey;
  itemType: "compliance";
};

export type ApprovalIntelItem = {
  id: string;
  intelType: string;
  title: string;
  summary: string;
  statusKey: OperationsStatusKey;
  itemType: "approval_intel";
};

export type ExecutiveTrustMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "executive";
};

export type CompanionTrustItem = {
  id: string;
  advisorType: string;
  explanation: string;
  contextLabel: string;
  status: string;
  itemType: "companion";
};

export type TransparencyItem = {
  id: string;
  sourceType: string;
  sourceName: string;
  sourceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "transparency";
};

export type GovernanceApiItem = {
  id: string;
  integrationType: string;
  integrationName: string;
  statusLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "api_integration";
};

export type EnterpriseGovernanceTrustCenter = {
  found: boolean;
  error?: string;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  trustSettings: TrustSettings;
  governanceFramework: GovernanceFrameworkItem[];
  trustScoreEngine: TrustScoreItem[];
  policyManagement: PolicyItem[];
  universalAuditLayer: AuditEventItem[];
  explainabilityEngine: ExplainabilityItem[];
  complianceCenter: ComplianceItem[];
  approvalIntelligence: ApprovalIntelItem[];
  executiveTrustDashboard: ExecutiveTrustMetric[];
  companionTrustAdvisor: CompanionTrustItem[];
  enterpriseTransparencyMode: TransparencyItem[];
  governanceApis: GovernanceApiItem[];
  sections: Record<TrustSectionKey, TrustSectionItem[]>;
  statistics: {
    frameworkCount: number;
    scoreCount: number;
    policyCount: number;
    auditCount: number;
    complianceCount: number;
    companionCount: number;
  };
};
