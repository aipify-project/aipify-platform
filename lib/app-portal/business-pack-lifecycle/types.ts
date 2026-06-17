export type PackLifecycleStage =
  | "planned"
  | "evaluating"
  | "implementing"
  | "active"
  | "optimizing"
  | "mature"
  | "under_review"
  | "retiring"
  | "retired";

export type PackReviewStatus = "scheduled" | "in_progress" | "completed" | "overdue";
export type PackReviewFrequency = "quarterly" | "annual" | "on_demand";
export type PackReviewType = "quarterly" | "annual" | "on_demand";

export type PackLifecycleTimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type PackLifecycleMilestone = {
  key: string;
  achieved_at: string;
};

export type PackLifecycleReview = {
  id: string;
  review_type: string;
  status: string;
  review_owner: string;
  answers?: Record<string, unknown>;
  notes?: string;
  completed_at: string;
};

export type PackLifecycleGovernance = {
  review_owner: string;
  responsible_department: string;
  review_history: PackLifecycleReview[];
  lifecycle_notes: string;
  decision_history: PackLifecycleReview[];
};

export type PackLifecycleRecommendation = {
  id: string;
  key: string;
  pack_key: string;
};

export type PackLifecycleCard = {
  id: string;
  pack_key: string;
  name: string;
  lifecycle_stage: PackLifecycleStage | string;
  installed_at?: string | null;
  last_activity_at?: string | null;
  adoption_score: number;
  users_assigned: number;
  review_frequency: PackReviewFrequency | string;
  review_owner: string;
  responsible_department?: string;
  related_packs?: string[];
  next_review_at?: string | null;
  review_status: PackReviewStatus | string;
  lifecycle_notes?: string;
  upcoming_milestones?: PackLifecycleMilestone[];
  timeline?: PackLifecycleTimelineEvent[];
};

export type PackLifecycleHighlight = {
  pack_key: string;
  name: string;
  installed_at?: string;
  next_review_at?: string;
  review_owner?: string;
};

export type PackLifecycleOverview = {
  found: boolean;
  can_full?: boolean;
  can_manage?: boolean;
  can_view?: boolean;
  has_lifecycle_data?: boolean;
  total_installed?: number;
  lifecycle_distribution?: Record<string, number>;
  packs_requiring_review?: number;
  recently_activated?: PackLifecycleHighlight[];
  recently_retired?: PackLifecycleHighlight[];
  upcoming_reviews?: PackLifecycleHighlight[];
  packs?: PackLifecycleCard[];
  recommendations?: PackLifecycleRecommendation[];
  principle?: string;
};

export type PackLifecycleDetail = PackLifecycleCard & {
  found: boolean;
  governance?: PackLifecycleGovernance;
  recommendations?: PackLifecycleRecommendation[];
  can_update?: boolean;
  can_review?: boolean;
};

export type PackLifecycleLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  accessDenied: string;
  filters: {
    search: string;
    lifecycleStage: string;
    reviewOwner: string;
    department: string;
    adoptionStatus: string;
    reviewStatus: string;
    periodFrom: string;
    all: string;
    lowAdoption: string;
    healthyAdoption: string;
    highAdoption: string;
  };
  dashboard: {
    totalInstalled: string;
    lifecycleDistribution: string;
    packsRequiringReview: string;
    recentlyActivated: string;
    recentlyRetired: string;
    recommendedActions: string;
    upcomingReviews: string;
    installedPacks: string;
    lifecycleTimeline: string;
    reviewCenter: string;
    governance: string;
  };
  card: {
    lifecycleStage: string;
    installedDate: string;
    lastActivity: string;
    adoptionScore: string;
    usersAssigned: string;
    reviewFrequency: string;
    reviewOwner: string;
    relatedPacks: string;
    upcomingMilestones: string;
    viewDetails: string;
  };
  review: {
    title: string;
    quarterly: string;
    annual: string;
    onDemand: string;
    submitReview: string;
    notes: string;
    owner: string;
    activelyUsed: string;
    objectivesAchieved: string;
    additionalUsers: string;
    trainingRecommended: string;
    retirementAppropriate: string;
    upgradesRecommended: string;
  };
  governance: {
    assignedOwner: string;
    responsibleDepartment: string;
    reviewHistory: string;
    lifecycleNotes: string;
    decisionHistory: string;
    updateLifecycle: string;
    saveNotes: string;
  };
  stages: Record<string, string>;
  reviewStatuses: Record<string, string>;
  reviewFrequencies: Record<string, string>;
  timelineEvents: Record<string, string>;
  recommendations: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    autoRetire: string;
    autoRetireAnswer: string;
    whyReviews: string;
    whyReviewsAnswer: string;
  };
};

export const PACK_LIFECYCLE_STAGES: PackLifecycleStage[] = [
  "planned", "evaluating", "implementing", "active", "optimizing", "mature", "under_review", "retiring", "retired",
];

export const PACK_REVIEW_STATUSES: PackReviewStatus[] = ["scheduled", "in_progress", "completed", "overdue"];

export const PACK_REVIEW_FREQUENCIES: PackReviewFrequency[] = ["quarterly", "annual", "on_demand"];
