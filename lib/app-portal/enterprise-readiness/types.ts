export type ReadinessCategory =
  | "leadership" | "governance" | "operations" | "security" | "compliance"
  | "workforce" | "technology" | "customer_success" | "knowledge_management"
  | "business_continuity" | "vendor_management" | "risk_management";

export type ReadinessLevel =
  | "emerging" | "developing" | "established" | "advanced" | "enterprise_ready";

export type ReadinessTrend   = "improving" | "stable" | "declining";
export type ReadinessPriority = "low" | "moderate" | "high" | "critical";
export type ReviewStatus     = "pending" | "in_review" | "reviewed" | "needs_follow_up";
export type GapStatus        = "identified" | "in_progress" | "resolved" | "accepted";
export type ImpactLevel      = "low" | "moderate" | "high" | "critical";

export type ReadinessAssessment = {
  id: string;
  assessment_key: string;
  title: string;
  description: string;
  category: ReadinessCategory | string;
  readiness_level: ReadinessLevel | string;
  current_score: number;
  target_score: number;
  trend: ReadinessTrend | string;
  priority: ReadinessPriority | string;
  leadership_owner: string;
  review_status: ReviewStatus | string;
  recommended_action: string;
  department: string;
  review_date?: string | null;
  last_reviewed_at?: string | null;
  updated_at?: string;
};

export type ReadinessGap = {
  id: string;
  gap_key: string;
  title: string;
  description: string;
  impact_level: ImpactLevel | string;
  recommended_action: string;
  suggested_owner: string;
  review_timeline: string;
  status: GapStatus | string;
};

export type ReadinessReview = {
  id: string;
  review_notes: string;
  new_score?: number | null;
  reviewed_at?: string;
};

export type ReadinessRecommendation = { id: string; key: string };

export type ReadinessTimelineEvent = {
  id: string;
  assessment_id?: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type ReadinessInsightCard = { id?: string; title?: string; current_score?: number; readiness_level?: string };

export type EnterpriseReadinessOverview = {
  found: boolean;
  can_full?: boolean;
  can_view?: boolean;
  can_review?: boolean;
  can_assess?: boolean;
  has_assessment_data?: boolean;
  enterprise_readiness_score?: number;
  readiness_level?: string;
  executive_summary?: string;
  operational_readiness?: ReadinessAssessment;
  leadership_readiness?: ReadinessAssessment;
  workforce_readiness?: ReadinessAssessment;
  technology_readiness?: ReadinessAssessment;
  security_readiness?: ReadinessAssessment;
  compliance_readiness?: ReadinessAssessment;
  growth_readiness?: ReadinessAssessment;
  gaps?: ReadinessGap[];
  assessments?: ReadinessAssessment[];
  recommendations?: ReadinessRecommendation[];
  advisory_note?: string;
  principle?: string;
};

export type ReadinessDetail = ReadinessAssessment & {
  found: boolean;
  can_review?: boolean;
  can_assess?: boolean;
  reviews?: ReadinessReview[];
  advisory_note?: string;
};

export type ReadinessActionResult = {
  found: boolean;
  message?: string;
  review_id?: string;
};

export type EnterpriseReadinessLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  advisoryNote: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  accessDenied: string;
  filters: {
    search: string;
    category: string;
    readinessLevel: string;
    priority: string;
    department: string;
    owner: string;
    reviewStatus: string;
    all: string;
  };
  dashboard: {
    readinessScore: string;
    overallLevel: string;
    executiveSummary: string;
    operationalReadiness: string;
    leadershipReadiness: string;
    workforceReadiness: string;
    technologyReadiness: string;
    securityReadiness: string;
    complianceReadiness: string;
    growthReadiness: string;
    identifiedGaps: string;
    allAssessments: string;
    recommendations: string;
    timeline: string;
    reviewQuestions: string;
    viewAssessment: string;
    startAssessment: string;
  };
  scorecard: {
    currentScore: string;
    targetScore: string;
    trend: string;
    priority: string;
    owner: string;
    reviewDate: string;
    department: string;
    recommendedAction: string;
  };
  gap: {
    impactLevel: string;
    recommendedAction: string;
    suggestedOwner: string;
    reviewTimeline: string;
    status: string;
  };
  detail: {
    back: string;
    scorecard: string;
    reviewHistory: string;
    reviewNotes: string;
    newScore: string;
    submitReview: string;
    reviewSuccess: string;
    advisoryNote: string;
  };
  startAssessment: {
    success: string;
    governanceNote: string;
  };
  categories: Record<string, string>;
  readinessLevels: Record<string, string>;
  trends: Record<string, string>;
  priorities: Record<string, string>;
  reviewStatuses: Record<string, string>;
  gapStatuses: Record<string, string>;
  impactLevels: Record<string, string>;
  recommendations: Record<string, string>;
  timelineEvents: Record<string, string>;
  reviewQuestions: string[];
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    certifies: string;
    certifiesAnswer: string;
    whoShouldUse: string;
    whoShouldUseAnswer: string;
  };
};

export const READINESS_CATEGORIES: ReadinessCategory[] = [
  "leadership","governance","operations","security","compliance",
  "workforce","technology","customer_success","knowledge_management",
  "business_continuity","vendor_management","risk_management",
];

export const READINESS_LEVELS: ReadinessLevel[] = [
  "emerging","developing","established","advanced","enterprise_ready",
];

export const READINESS_PRIORITIES: ReadinessPriority[] = ["low","moderate","high","critical"];
export const READINESS_TRENDS: ReadinessTrend[]         = ["improving","stable","declining"];
export const REVIEW_STATUSES: ReviewStatus[]            = ["pending","in_review","reviewed","needs_follow_up"];
