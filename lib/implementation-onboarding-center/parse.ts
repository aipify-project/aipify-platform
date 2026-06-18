import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  AuditItem,
  BusinessPackItem,
  ChecklistItem,
  CompanionConfigItem,
  ExecutiveMetric,
  GuidanceItem,
  ImplementationOnboardingCenter,
  IntegrationItem,
  KnowledgeItem,
  LaunchChecklistItem,
  OrganizationSetupItem,
  RecommendationItem,
  TimelineItem,
  TrainingItem,
  UserInviteItem,
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
function asStatus(value: unknown): OperationsStatusKey {
  const key = asString(value, "information");
  const allowed: OperationsStatusKey[] = [
    "completed", "not_allowed", "requires_attention", "information", "restricted", "verified", "waiting",
  ];
  return allowed.includes(key as OperationsStatusKey) ? (key as OperationsStatusKey) : "information";
}

function parseChecklist(raw: unknown): ChecklistItem {
  const d = asRecord(raw);
  const state = asString(d.progress_state, "not_started");
  return {
    id: asString(d.id), stepKey: asString(d.step_key), title: asString(d.title), summary: asString(d.summary),
    progressState: (["not_started", "in_progress", "complete"].includes(state) ? state : "not_started") as ChecklistItem["progressState"],
    statusKey: asStatus(d.status_key), sortOrder: asNumber(d.sort_order), itemType: "checklist",
  };
}

function parseOrganization(raw: unknown): OrganizationSetupItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), setupKey: asString(d.setup_key), title: asString(d.title), summary: asString(d.summary),
    valueLabel: asString(d.value_label), statusKey: asStatus(d.status_key), itemType: "organization",
  };
}

function parseUserInvite(raw: unknown): UserInviteItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), inviteKey: asString(d.invite_key), inviteeLabel: asString(d.invitee_label),
    roleLabel: asString(d.role_label), inviteStatus: asString(d.invite_status), statusKey: asStatus(d.status_key),
    itemType: "user_invite",
  };
}

function parseCompanion(raw: unknown): CompanionConfigItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), configKey: asString(d.config_key), title: asString(d.title), summary: asString(d.summary),
    valueLabel: asString(d.value_label), statusKey: asStatus(d.status_key), itemType: "companion",
  };
}

function parseKnowledge(raw: unknown): KnowledgeItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), knowledgeType: asString(d.knowledge_type), title: asString(d.title), summary: asString(d.summary),
    metricLabel: asString(d.metric_label), metricValue: asString(d.metric_value), statusKey: asStatus(d.status_key),
    itemType: "knowledge",
  };
}

function parseIntegration(raw: unknown): IntegrationItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), integrationKey: asString(d.integration_key), integrationName: asString(d.integration_name),
    category: asString(d.category), statusKey: asStatus(d.status_key), itemType: "integration",
  };
}

function parseBusinessPack(raw: unknown): BusinessPackItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), packKey: asString(d.pack_key), packName: asString(d.pack_name),
    packCategory: asString(d.pack_category), summary: asString(d.summary), statusKey: asStatus(d.status_key),
    itemType: "business_pack",
  };
}

function parseTraining(raw: unknown): TrainingItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), moduleKey: asString(d.module_key), moduleTitle: asString(d.module_title),
    trainingCategory: asString(d.training_category), roleLabel: asString(d.role_label),
    progressLabel: asString(d.progress_label), statusKey: asStatus(d.status_key),
    sortOrder: asNumber(d.sort_order), itemType: "training",
  };
}

function parseTimeline(raw: unknown): TimelineItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), milestoneDay: asString(d.milestone_day), title: asString(d.title),
    recommendedActions: asString(d.recommended_actions), expectedMilestones: asString(d.expected_milestones),
    successIndicators: asString(d.success_indicators), statusKey: asStatus(d.status_key), itemType: "timeline",
  };
}

function parseGuidance(raw: unknown): GuidanceItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), guidanceKey: asString(d.guidance_key), title: asString(d.title),
    insight: asString(d.insight), recommendation: asString(d.recommendation), statusKey: asStatus(d.status_key),
    itemType: "guidance",
  };
}

function parseExecutive(raw: unknown): ExecutiveMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "executive",
  };
}

function parseRecommendation(raw: unknown): RecommendationItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), recommendationKey: asString(d.recommendation_key), title: asString(d.title),
    insight: asString(d.insight), statusKey: asStatus(d.status_key), itemType: "recommendation",
  };
}

function parseLaunchChecklist(raw: unknown): LaunchChecklistItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), checklistKey: asString(d.checklist_key), title: asString(d.title),
    statusKey: asStatus(d.status_key), itemType: "launch_checklist",
  };
}

function parseAudit(raw: unknown): AuditItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), itemType: asString(d.item_type), action: asString(d.action),
    description: asString(d.description), createdAt: asString(d.created_at),
  };
}

const empty: ImplementationOnboardingCenter = {
  found: false,
  checklist: [], organizationSetup: [], userSetup: [], companionSetup: [], knowledgeSetup: [],
  integrations: [], businessPacks: [], trainingCenter: [], customerSuccessTimeline: [],
  companionGuidance: [], executiveOverview: [], topRecommendations: [], goLiveChecklist: [], auditHistory: [],
  statistics: { checklistComplete: 0, checklistTotal: 0, integrationCount: 0, trainingCount: 0 },
};

export function parseImplementationOnboardingCenter(raw: unknown): ImplementationOnboardingCenter {
  const d = asRecord(raw);
  if (!d.found) return { ...empty, error: asString(d.error) || undefined };
  const stats = asRecord(d.statistics);
  return {
    found: true,
    organizationName: asString(d.organization_name) || undefined,
    planLabel: asString(d.plan_label) || undefined,
    ownerName: asString(d.owner_name) || undefined,
    setupProgressPct: asNumber(d.setup_progress_pct),
    daysSinceSignup: asNumber(d.days_since_signup),
    launchStatus: asString(d.launch_status) || undefined,
    launchReadinessScore: asNumber(d.launch_readiness_score),
    launchReadinessLabel: asString(d.launch_readiness_label) || undefined,
    canManage: d.can_manage === true,
    canExecutive: d.can_executive === true,
    governanceNote: asString(d.governance_note) || undefined,
    privacyNote: asString(d.privacy_note) || undefined,
    checklist: Array.isArray(d.checklist) ? d.checklist.map(parseChecklist) : [],
    organizationSetup: Array.isArray(d.organization_setup) ? d.organization_setup.map(parseOrganization) : [],
    userSetup: Array.isArray(d.user_setup) ? d.user_setup.map(parseUserInvite) : [],
    companionSetup: Array.isArray(d.companion_setup) ? d.companion_setup.map(parseCompanion) : [],
    knowledgeSetup: Array.isArray(d.knowledge_setup) ? d.knowledge_setup.map(parseKnowledge) : [],
    integrations: Array.isArray(d.integrations) ? d.integrations.map(parseIntegration) : [],
    businessPacks: Array.isArray(d.business_packs) ? d.business_packs.map(parseBusinessPack) : [],
    trainingCenter: Array.isArray(d.training_center) ? d.training_center.map(parseTraining) : [],
    customerSuccessTimeline: Array.isArray(d.customer_success_timeline) ? d.customer_success_timeline.map(parseTimeline) : [],
    companionGuidance: Array.isArray(d.companion_guidance) ? d.companion_guidance.map(parseGuidance) : [],
    executiveOverview: Array.isArray(d.executive_overview) ? d.executive_overview.map(parseExecutive) : [],
    topRecommendations: Array.isArray(d.top_recommendations) ? d.top_recommendations.map(parseRecommendation) : [],
    goLiveChecklist: Array.isArray(d.go_live_checklist) ? d.go_live_checklist.map(parseLaunchChecklist) : [],
    auditHistory: Array.isArray(d.audit_history) ? d.audit_history.map(parseAudit) : [],
    statistics: {
      checklistComplete: asNumber(stats.checklist_complete),
      checklistTotal: asNumber(stats.checklist_total),
      integrationCount: asNumber(stats.integration_count),
      trainingCount: asNumber(stats.training_count),
    },
  };
}
