export type ComplianceStatus =
  | "aligned"
  | "healthy"
  | "requires_review"
  | "review_overdue"
  | "immediate_attention";

export type PolicyCategory =
  | "information_security"
  | "data_governance"
  | "access_management"
  | "operational_procedures"
  | "customer_policies"
  | "vendor_management"
  | "internal_governance"
  | "business_continuity"
  | "custom";

export type PolicyAlignmentStatus =
  | "reviewed"
  | "acknowledged"
  | "requires_review"
  | "pending_approval"
  | "requires_update";

export type ComplianceReviewFrequency =
  | "monthly"
  | "quarterly"
  | "semi_annually"
  | "annually"
  | "custom";

export type CompliancePriorityLevel = "low" | "moderate" | "high" | "critical";

export type PolicyAlignmentSummary = {
  policies_reviewed?: number;
  policies_acknowledged?: number;
  policies_requiring_review?: number;
  policies_pending_approval?: number;
  policies_requiring_updates?: number;
};

export type CompliancePolicy = {
  id: string;
  policy_key: string;
  policy_name: string;
  category: PolicyCategory | string;
  alignment_status: PolicyAlignmentStatus | string;
};

export type ComplianceReview = {
  id: string;
  status: string;
  reviewer_name: string;
  governance_notes: string;
  review_frequency: string;
  reviewed_at?: string;
};

export type CompliancePackCard = {
  id: string;
  pack_key: string;
  name: string;
  compliance_status: ComplianceStatus | string;
  assigned_reviewer: string;
  review_frequency: ComplianceReviewFrequency | string;
  priority_level: CompliancePriorityLevel | string;
  governance_notes?: string;
  policies_linked?: string[];
  open_recommendations?: string[];
  policy_alignment?: PolicyAlignmentSummary;
  last_review_at?: string | null;
  next_review_at?: string | null;
};

export type ComplianceInsightItem = {
  pack_key?: string;
  name?: string;
};

export type ComplianceInsights = {
  approaching_deadlines?: ComplianceInsightItem[];
  missing_acknowledgements?: ComplianceInsightItem[];
  governance_gaps?: ComplianceInsightItem[];
  strong_practices?: ComplianceInsightItem[];
  improvement_opportunities?: ComplianceInsightItem[];
};

export type ComplianceRecommendation = {
  id: string;
  key: string;
  pack_key?: string;
};

export type ComplianceTimelineEvent = {
  id: string;
  pack_key?: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type ComplianceOverview = {
  found: boolean;
  can_full?: boolean;
  can_manage?: boolean;
  can_view?: boolean;
  can_review?: boolean;
  has_compliance_data?: boolean;
  compliance_health_score?: number;
  packs_under_review?: number;
  packs_missing_reviews?: number;
  upcoming_compliance_reviews?: number;
  recently_completed_reviews?: number;
  open_compliance_recommendations?: number;
  executive_summary?: string;
  packs?: CompliancePackCard[];
  policy_alignment?: PolicyAlignmentSummary;
  insights?: ComplianceInsights;
  recommendations?: ComplianceRecommendation[];
  principle?: string;
};

export type ComplianceDetail = CompliancePackCard & {
  found: boolean;
  review_history?: ComplianceReview[];
  policies?: CompliancePolicy[];
  can_review?: boolean;
  recommendations?: ComplianceRecommendation[];
};

export type ComplianceReviewResult = {
  found: boolean;
  review_id?: string;
  pack_key?: string;
  next_review_at?: string;
  message?: string;
};

export type ComplianceLabels = {
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
    complianceStatus: string;
    packKey: string;
    policyCategory: string;
    reviewer: string;
    reviewPeriod: string;
    priorityLevel: string;
    all: string;
  };
  dashboard: {
    complianceHealthScore: string;
    packsUnderReview: string;
    packsMissingReviews: string;
    upcomingReviews: string;
    recentlyCompleted: string;
    openRecommendations: string;
    executiveSummary: string;
    complianceInsights: string;
    recommendedActions: string;
    timeline: string;
    policyAlignment: string;
    healthOverview: string;
  };
  policyAlignment: {
    reviewed: string;
    acknowledged: string;
    requiringReview: string;
    pendingApproval: string;
    requiringUpdates: string;
  };
  card: {
    complianceStatus: string;
    assignedReviewer: string;
    lastReview: string;
    nextReview: string;
    policiesLinked: string;
    openRecommendations: string;
    governanceNotes: string;
    reviewFrequency: string;
    viewDetails: string;
    completeReview: string;
  };
  review: {
    title: string;
    notes: string;
    submit: string;
    success: string;
    governanceNote: string;
  };
  complianceStatuses: Record<string, string>;
  policyCategories: Record<string, string>;
  reviewFrequencies: Record<string, string>;
  priorityLevels: Record<string, string>;
  recommendations: Record<string, string>;
  insights: {
    approachingDeadlines: string;
    missingAcknowledgements: string;
    governanceGaps: string;
    strongPractices: string;
    improvementOpportunities: string;
  };
  timelineEvents: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    legalAdvice: string;
    legalAdviceAnswer: string;
    completeCompliance: string;
    completeComplianceAnswer: string;
  };
};

export const COMPLIANCE_STATUSES: ComplianceStatus[] = [
  "aligned", "healthy", "requires_review", "review_overdue", "immediate_attention",
];

export const POLICY_CATEGORIES: PolicyCategory[] = [
  "information_security", "data_governance", "access_management", "operational_procedures",
  "customer_policies", "vendor_management", "internal_governance", "business_continuity", "custom",
];

export const COMPLIANCE_REVIEW_FREQUENCIES: ComplianceReviewFrequency[] = [
  "monthly", "quarterly", "semi_annually", "annually", "custom",
];

export const COMPLIANCE_PRIORITY_LEVELS: CompliancePriorityLevel[] = [
  "low", "moderate", "high", "critical",
];
