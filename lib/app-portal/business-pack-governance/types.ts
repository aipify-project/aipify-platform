export type GovernanceStatus =
  | "well_governed"
  | "healthy"
  | "stable"
  | "requires_review"
  | "governance_gap_identified";

export type GovernanceHealthStatus =
  | "thriving"
  | "healthy"
  | "stable"
  | "requires_attention"
  | "critical_governance_gap";

export type GovernanceReviewFrequency =
  | "monthly"
  | "quarterly"
  | "semi_annually"
  | "annually"
  | "custom";

export type GovernanceReview = {
  id: string;
  status: string;
  reviewer_name: string;
  governance_notes: string;
  review_frequency: string;
  reviewed_at?: string;
};

export type GovernancePackCard = {
  id: string;
  pack_key: string;
  name: string;
  primary_owner: string;
  backup_owner: string;
  department: string;
  governance_status: GovernanceStatus | string;
  health_status: GovernanceHealthStatus | string;
  review_frequency: GovernanceReviewFrequency | string;
  governance_notes?: string;
  related_risks?: string[];
  recommended_actions?: string[];
  last_review_at?: string | null;
  next_review_at?: string | null;
};

export type GovernanceInsightItem = {
  pack_key?: string;
  name?: string;
  primary_owner?: string;
  department?: string;
  count?: number;
};

export type GovernanceInsights = {
  packs_without_ownership?: GovernanceInsightItem[];
  packs_overdue_review?: GovernanceInsightItem[];
  ownership_concentration?: GovernanceInsightItem[];
  strongest_departments?: GovernanceInsightItem[];
  improvement_opportunities?: GovernanceInsightItem[];
};

export type GovernanceRecommendation = {
  id: string;
  key: string;
  pack_key?: string;
};

export type GovernanceTimelineEvent = {
  id: string;
  pack_key?: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type GovernanceOverview = {
  found: boolean;
  can_full?: boolean;
  can_manage?: boolean;
  can_view?: boolean;
  can_review?: boolean;
  has_governance_data?: boolean;
  total_packs?: number;
  packs_with_owners?: number;
  packs_missing_owners?: number;
  governance_health_score?: number;
  upcoming_reviews?: number;
  ownership_changes?: number;
  executive_summary?: string;
  packs?: GovernancePackCard[];
  insights?: GovernanceInsights;
  recommendations?: GovernanceRecommendation[];
  principle?: string;
};

export type GovernanceDetail = GovernancePackCard & {
  found: boolean;
  review_history?: GovernanceReview[];
  can_review?: boolean;
  recommendations?: GovernanceRecommendation[];
};

export type GovernanceReviewResult = {
  found: boolean;
  review_id?: string;
  pack_key?: string;
  next_review_at?: string;
  message?: string;
};

export type GovernanceLabels = {
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
    governanceStatus: string;
    department: string;
    primaryOwner: string;
    backupOwner: string;
    reviewFrequency: string;
    periodFrom: string;
    all: string;
  };
  dashboard: {
    totalPacks: string;
    packsWithOwners: string;
    packsMissingOwners: string;
    governanceHealthScore: string;
    upcomingReviews: string;
    ownershipChanges: string;
    executiveSummary: string;
    governanceInsights: string;
    recommendedActions: string;
    timeline: string;
    healthOverview: string;
  };
  card: {
    primaryOwner: string;
    backupOwner: string;
    department: string;
    governanceStatus: string;
    healthStatus: string;
    lastReview: string;
    nextReview: string;
    relatedRisks: string;
    recommendedActions: string;
    reviewFrequency: string;
    viewDetails: string;
    completeReview: string;
  };
  review: {
    title: string;
    notes: string;
    frequency: string;
    submit: string;
    success: string;
    governanceNote: string;
  };
  governanceStatuses: Record<string, string>;
  healthStatuses: Record<string, string>;
  reviewFrequencies: Record<string, string>;
  recommendations: Record<string, string>;
  insights: {
    packsWithoutOwnership: string;
    packsOverdueReview: string;
    ownershipConcentration: string;
    strongestDepartments: string;
    improvementOpportunities: string;
  };
  timelineEvents: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    whyOwners: string;
    whyOwnersAnswer: string;
    autoAssign: string;
    autoAssignAnswer: string;
  };
};

export const GOVERNANCE_STATUSES: GovernanceStatus[] = [
  "well_governed", "healthy", "stable", "requires_review", "governance_gap_identified",
];

export const GOVERNANCE_HEALTH_STATUSES: GovernanceHealthStatus[] = [
  "thriving", "healthy", "stable", "requires_attention", "critical_governance_gap",
];

export const GOVERNANCE_REVIEW_FREQUENCIES: GovernanceReviewFrequency[] = [
  "monthly", "quarterly", "semi_annually", "annually", "custom",
];
