import type { HealthState } from "@/lib/design/semantic-status-system";
import type { SuccessPlanStatus } from "./config";
import type { CustomerSuccessScores, PilotStatus, ScoreAvailability, SourceFreshness } from "./score-availability";

export type { CustomerSuccessScores, PilotStatus, ScoreAvailability, SourceFreshness };

export type CustomerSuccessStatus =
  | "getting_started"
  | "developing"
  | "established"
  | "advanced"
  | "high_performing";

export type MaturityKey =
  | "getting_started"
  | "operational"
  | "optimized"
  | "strategic"
  | "transformational";

export type RecommendationPriority = "opportunity" | "recommended" | "important" | "high_impact";

export type CategoryScores = {
  learning_completion: number;
  feature_adoption: number;
  user_engagement: number;
  operational_maturity: number;
  security_completion: number;
  integration_usage: number;
};

export type SuccessMilestone = {
  id?: string;
  key: string;
  title: string;
  achieved_at: string;
  auto_detected?: boolean;
  item_type?: string;
  status?: string;
};

export type CustomerSuccessRecommendation = {
  id: string;
  key: string;
  priority: RecommendationPriority | string;
  category: string;
};

export type RecommendedNextAction = {
  key: string;
  priority: string;
  category: string;
  shadow?: boolean;
};

export type SuccessPlan = {
  id: string;
  title: string;
  goal_summary: string;
  owner_id?: string;
  owner_label: string;
  status: SuccessPlanStatus | string;
  category: string;
  priority: string;
  progress_percent: number;
  start_date?: string;
  target_date?: string;
  item_type?: string;
};

export type CustomerSuccessFollowUpItem = {
  id: string;
  title: string;
  summary?: string;
  category: string;
  priority: string;
  status: string;
  owner_id?: string;
  owner_label: string;
  due_at?: string;
  item_type: string;
  href?: string;
};

export type CustomerOutcome = {
  id: string;
  title: string;
  target_value: string;
  current_value: string;
  progress_percent: number;
  category: string;
  status: string;
  item_type?: string;
};

export type ActiveRisk = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  likelihood: string;
  impact: string;
  owner_id?: string;
  owner_label: string;
  item_type?: string;
  href?: string;
};

export type AdoptionSignal = {
  key: string;
  label_key: string;
  value: number;
  unit: "score" | "count" | "percent";
  availability?: string;
};

export type CustomerSuccessActivityEvent = {
  id: string;
  event_type: string;
  title?: string;
  description: string;
  created_at: string;
  item_type?: string;
};

export type CustomerSuccessOverview = {
  found: boolean;
  filtered_out?: boolean;
  can_manage?: boolean;
  can_admin?: boolean;
  journey_started?: boolean;
  adoption_score?: number | null;
  utilization_score?: number | null;
  engagement_score?: number | null;
  health_score?: number | null;
  scores?: CustomerSuccessScores;
  pilot_status?: PilotStatus | null;
  health_state?: HealthState | string;
  success_status?: CustomerSuccessStatus;
  maturity?: { stage: number; key: MaturityKey | string };
  category_scores?: CategoryScores;
  milestones_achieved?: SuccessMilestone[];
  recommendations?: CustomerSuccessRecommendation[];
  recommended_next_action?: RecommendedNextAction | null;
  follow_ups?: CustomerSuccessFollowUpItem[];
  success_plans?: SuccessPlan[];
  outcomes?: CustomerOutcome[];
  active_risks?: ActiveRisk[];
  adoption_signals?: AdoptionSignal[];
  timeline?: CustomerSuccessActivityEvent[];
  owners?: string[];
  personal_progress?: { courses_completed?: number; certifications?: number };
  team_reporting?: { team_count?: string; two_fa_adoption_percent?: number; learning_completions?: string } | null;
  last_updated_at?: string;
};

export type CustomerSuccessLabels = {
  eyebrow: string;
  title: string;
  subtitle: string;
  loading: string;
  breadcrumbSupport: string;
  breadcrumbCustomerSuccess: string;
  backToSupport: string;
  accessDenied: string;
  organizationMissing: string;
  subscriptionRequired: string;
  permissionMissing: string;
  entitlementMissing: string;
  errorTitle: string;
  errorBody: string;
  pageLoadError: string;
  noDataYet: string;
  emptyTitle: string;
  emptyBody: string;
  emptyAction: string;
  retry: string;
  sections: {
    overview: string;
    nextAction: string;
    successPlans: string;
    followUpsMilestones: string;
    outcomes: string;
    risksAdoption: string;
    activeRisks: string;
    adoptionSignals: string;
    recentActivity: string;
    understanding: string;
  };
  overview: {
    organizationOverview: string;
    healthScore: string;
    adoptionScore: string;
    utilizationScore: string;
    engagementScore: string;
    healthStatus: string;
    advisory: string;
    lastUpdated: string;
  };
  filters: {
    search: string;
    category: string;
    priority: string;
    successStatus: string;
    owner: string;
    dueDate: string;
    sortBy: string;
    all: string;
    sortDueDate: string;
    sortPriority: string;
    sortTitle: string;
    sortProgress: string;
    sortUpdated: string;
  };
  followUpTabs: {
    all: string;
    followUps: string;
    milestones: string;
    overdue: string;
    completed: string;
  };
  planStates: Record<SuccessPlanStatus, string>;
  statuses: Record<CustomerSuccessStatus, string>;
  scores: {
    learningCompletion: string;
    featureAdoption: string;
    userEngagement: string;
    operationalMaturity: string;
    securityCompletion: string;
    integrationUsage: string;
    teamCount: string;
    businessPacks: string;
    integrationsConnected: string;
    twoFaAdoption: string;
  };
  adoptionSignals: Record<string, string>;
  categories: Record<string, string>;
  priorities: Record<string, string>;
  recommendations: Record<string, { title: string; reason: string; action: string }>;
  understanding: {
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
    q4: string;
    a4: string;
  };
  empty: {
    plans: string;
    followUps: string;
    followUpsDescription: string;
    outcomes: string;
    risks: string;
    risksDescription: string;
    activity: string;
    adoption: string;
    noLearningProgress: string;
    scoreUnavailable: string;
    scoreUnavailableDescription: string;
  };
  healthStates: Record<string, string>;
  scoreAvailability: Record<string, string>;
  scoreAvailabilityDescriptions: Record<string, string>;
  sourceFreshness: Record<string, string>;
  pilot: {
    title: string;
    readOnlyMode: string;
    readOnlyDescription: string;
    lastSuccessfulSync: string;
    dataFreshness: string;
    connectedSources: string;
    awaitingFirstSync: string;
    shadowPrepared: string;
    shadowNoAction: string;
    viewDataStatus: string;
    contactSupport: string;
  };
  workflowStates: Record<string, string>;
  severityLabels: Record<string, string>;
  card: {
    owner: string;
    progress: string;
    targetDate: string;
    target: string;
    current: string;
  };
};

export const CUSTOMER_SUCCESS_STATUSES: CustomerSuccessStatus[] = [
  "getting_started",
  "developing",
  "established",
  "advanced",
  "high_performing",
];

export const RECOMMENDATION_PRIORITIES: RecommendationPriority[] = [
  "opportunity",
  "recommended",
  "important",
  "high_impact",
];
