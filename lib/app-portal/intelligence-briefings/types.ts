export type BriefingType =
  | "daily_briefing"
  | "weekly_briefing"
  | "monthly_briefing"
  | "executive_briefing"
  | "operational_briefing"
  | "strategic_briefing"
  | "risk_briefing"
  | "custom_briefing";

export type BriefingPriority = "informational" | "important" | "high_priority" | "critical_attention_required";

export type OrgStatus = "stable" | "improving" | "requires_attention" | "elevated_risk";

export type BriefingInsight = { id: string; text: string };

export type BriefingItem = {
  id: string;
  title: string;
  briefing_type: BriefingType;
  reporting_period_start?: string | null;
  reporting_period_end?: string | null;
  generated_at: string;
  audience: string;
  priority_level: BriefingPriority;
  org_status: OrgStatus;
  executive_summary: string;
  key_insights?: BriefingInsight[];
  risks?: BriefingInsight[];
  opportunities?: BriefingInsight[];
  recommended_actions?: BriefingRecommendation[];
  related_initiative_ids?: string[];
  related_follow_up_ids?: string[];
  related_commitment_ids?: string[];
  related_decision_ids?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type BriefingRecommendation = {
  id: string;
  key: string;
  priority: string;
};

export type BriefingDashboard = {
  latest_briefing?: BriefingItem | null;
  previous_briefings: BriefingItem[];
  priority_items: Array<{ id: string; title: string; priority_level: string; org_status: string }>;
  emerging_opportunities: BriefingInsight[];
  emerging_risks: BriefingInsight[];
  recommended_next_actions: BriefingRecommendation[];
};

export type BriefingListResponse = {
  found: boolean;
  can_manage?: boolean;
  items: BriefingItem[];
  dashboard?: BriefingDashboard;
  recommendations?: BriefingRecommendation[];
  principle?: string;
};

export type BriefingDetail = {
  found: boolean;
  can_manage?: boolean;
  briefing?: BriefingItem;
  related_initiatives?: Array<{ id: string; title: string; status: string }>;
  related_commitments?: Array<{ id: string; title: string; status: string }>;
  related_decisions?: Array<{ id: string; title: string; status: string }>;
  related_follow_ups?: Array<{ id: string; title: string; status: string }>;
  activity_timeline?: Array<{ id: string; event_type: string; description: string; created_at: string }>;
  recommendations?: BriefingRecommendation[];
  principle?: string;
};

export type IntelligenceBriefingsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  back: string;
  notFound: string;
  accessDenied: string;
  filters: {
    search: string;
    type: string;
    priority: string;
    periodFrom: string;
    periodTo: string;
    audience: string;
    orgStatus: string;
    all: string;
  };
  dashboard: {
    latest: string;
    previous: string;
    priorityItems: string;
    emergingOpportunities: string;
    emergingRisks: string;
    recommendedActions: string;
  };
  generate: {
    title: string;
    type: string;
    audience: string;
    periodFrom: string;
    periodTo: string;
    notes: string;
    submit: string;
    cancel: string;
  };
  card: {
    type: string;
    priority: string;
    orgStatus: string;
    generatedAt: string;
    audience: string;
    view: string;
  };
  detail: {
    executiveSummary: string;
    keyInsights: string;
    risks: string;
    opportunities: string;
    recommendedActions: string;
    relatedInitiatives: string;
    relatedCommitments: string;
    relatedDecisions: string;
    relatedFollowUps: string;
    activityTimeline: string;
    recommendations: string;
    reportingPeriod: string;
  };
  types: Record<BriefingType, string>;
  priorities: Record<BriefingPriority, string>;
  orgStatuses: Record<OrgStatus, string>;
  recommendations: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    howCreated: string;
    howCreatedAnswer: string;
    autoDecisions: string;
    autoDecisionsAnswer: string;
  };
};

export const BRIEFING_TYPES: BriefingType[] = [
  "daily_briefing", "weekly_briefing", "monthly_briefing", "executive_briefing",
  "operational_briefing", "strategic_briefing", "risk_briefing", "custom_briefing",
];

export const BRIEFING_PRIORITIES: BriefingPriority[] = [
  "informational", "important", "high_priority", "critical_attention_required",
];

export const ORG_STATUSES: OrgStatus[] = [
  "stable", "improving", "requires_attention", "elevated_risk",
];
