import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type ImplementationOnboardingSection =
  | "welcome"
  | "setup"
  | "organization"
  | "users"
  | "companion"
  | "knowledge"
  | "integrations"
  | "businessPacks"
  | "training"
  | "launch"
  | "timeline"
  | "executive"
  | "governance";

export type ChecklistItem = {
  id: string;
  stepKey: string;
  title: string;
  summary: string;
  progressState: "not_started" | "in_progress" | "complete";
  statusKey: OperationsStatusKey;
  sortOrder: number;
  itemType: "checklist";
};

export type OrganizationSetupItem = {
  id: string;
  setupKey: string;
  title: string;
  summary: string;
  valueLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "organization";
};

export type UserInviteItem = {
  id: string;
  inviteKey: string;
  inviteeLabel: string;
  roleLabel: string;
  inviteStatus: string;
  statusKey: OperationsStatusKey;
  itemType: "user_invite";
};

export type CompanionConfigItem = {
  id: string;
  configKey: string;
  title: string;
  summary: string;
  valueLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "companion";
};

export type KnowledgeItem = {
  id: string;
  knowledgeType: string;
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  statusKey: OperationsStatusKey;
  itemType: "knowledge";
};

export type IntegrationItem = {
  id: string;
  integrationKey: string;
  integrationName: string;
  category: string;
  statusKey: OperationsStatusKey;
  itemType: "integration";
};

export type BusinessPackItem = {
  id: string;
  packKey: string;
  packName: string;
  packCategory: string;
  summary: string;
  statusKey: OperationsStatusKey;
  itemType: "business_pack";
};

export type TrainingItem = {
  id: string;
  moduleKey: string;
  moduleTitle: string;
  trainingCategory: string;
  roleLabel: string;
  progressLabel: string;
  statusKey: OperationsStatusKey;
  sortOrder: number;
  itemType: "training";
};

export type TimelineItem = {
  id: string;
  milestoneDay: string;
  title: string;
  recommendedActions: string;
  expectedMilestones: string;
  successIndicators: string;
  statusKey: OperationsStatusKey;
  itemType: "timeline";
};

export type GuidanceItem = {
  id: string;
  guidanceKey: string;
  title: string;
  insight: string;
  recommendation: string;
  statusKey: OperationsStatusKey;
  itemType: "guidance";
};

export type ExecutiveMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "executive";
};

export type RecommendationItem = {
  id: string;
  recommendationKey: string;
  title: string;
  insight: string;
  statusKey: OperationsStatusKey;
  itemType: "recommendation";
};

export type LaunchChecklistItem = {
  id: string;
  checklistKey: string;
  title: string;
  statusKey: OperationsStatusKey;
  itemType: "launch_checklist";
};

export type AuditItem = {
  id: string;
  itemType: string;
  action: string;
  description: string;
  createdAt: string;
};

export type ImplementationOnboardingCenter = {
  found: boolean;
  error?: string;
  organizationName?: string;
  planLabel?: string;
  ownerName?: string;
  setupProgressPct?: number;
  daysSinceSignup?: number;
  launchStatus?: string;
  launchReadinessScore?: number;
  launchReadinessLabel?: string;
  canManage?: boolean;
  canExecutive?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  checklist: ChecklistItem[];
  organizationSetup: OrganizationSetupItem[];
  userSetup: UserInviteItem[];
  companionSetup: CompanionConfigItem[];
  knowledgeSetup: KnowledgeItem[];
  integrations: IntegrationItem[];
  businessPacks: BusinessPackItem[];
  trainingCenter: TrainingItem[];
  customerSuccessTimeline: TimelineItem[];
  companionGuidance: GuidanceItem[];
  executiveOverview: ExecutiveMetric[];
  topRecommendations: RecommendationItem[];
  goLiveChecklist: LaunchChecklistItem[];
  auditHistory: AuditItem[];
  statistics: {
    checklistComplete: number;
    checklistTotal: number;
    integrationCount: number;
    trainingCount: number;
  };
};
