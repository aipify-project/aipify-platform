export type CollaborationCategory =
  | "leadership_collaboration" | "operations_alignment" | "customer_journey_alignment"
  | "sales_support_alignment" | "product_customer_alignment" | "workforce_collaboration"
  | "knowledge_sharing" | "process_coordination" | "communication_efficiency"
  | "organizational_dependencies";

export type DependencyType =
  | "operational" | "informational" | "approval" | "resource"
  | "knowledge" | "process" | "communication";

export type DependencyStrength = "low" | "moderate" | "high" | "critical";
export type RiskLevel          = "low" | "moderate" | "high" | "critical";
export type CollaborationType  = "strong" | "emerging" | "weak" | "gap";
export type HealthStatus       = "healthy" | "stable" | "needs_attention" | "high_priority";
export type FrictionType =
  | "bottleneck" | "delayed_workflow" | "repeated_escalation"
  | "duplicate_effort" | "knowledge_silo" | "coordination_challenge";
export type FrictionSeverity = "low" | "moderate" | "high" | "critical";
export type Priority = "low" | "moderate" | "high" | "critical";
export type ReviewStatus = "pending" | "in_review" | "reviewed" | "needs_follow_up";

export type Dependency = {
  id: string;
  dependency_key: string;
  from_department: string;
  to_department: string;
  dependency_type: DependencyType | string;
  dependency_strength: DependencyStrength | string;
  risk_level: RiskLevel | string;
  review_status: ReviewStatus | string;
  leadership_owner: string;
  description: string;
  recommended_review: string;
};

export type CollaborationRecord = {
  id: string;
  collaboration_key: string;
  department_a: string;
  department_b: string;
  category: CollaborationCategory | string;
  collaboration_type: CollaborationType | string;
  health_status: HealthStatus | string;
  description: string;
  improvement_opportunity: string;
  priority: Priority | string;
  leadership_owner: string;
};

export type FrictionRecord = {
  id: string;
  friction_key: string;
  title: string;
  friction_type: FrictionType | string;
  description: string;
  affected_departments: string[];
  severity: FrictionSeverity | string;
  recommended_action: string;
  status: "identified" | "in_progress" | "resolved";
};

export type CFIInsightItem = { id: string; title: string };
export type CFIRecommendation = { id: string; key: string };

export type CFITimelineEvent = {
  id: string;
  entity_id?: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type CrossFunctionalIntelligenceOverview = {
  found: boolean;
  can_full?: boolean;
  can_view?: boolean;
  can_review?: boolean;
  has_intelligence_data?: boolean;
  cross_functional_health_score?: number;
  department_collaboration_score?: number;
  organizational_dependency_score?: number;
  process_alignment_score?: number;
  executive_summary?: string;
  areas_requiring_attention?: CFIInsightItem[];
  improvement_opportunities?: CFIInsightItem[];
  dependencies?: Dependency[];
  collaboration?: CollaborationRecord[];
  friction?: FrictionRecord[];
  recommendations?: CFIRecommendation[];
  advisory_note?: string;
  principle?: string;
};

export type CFIActionResult = {
  found: boolean;
  message?: string;
  review_id?: string;
};

export type CrossFunctionalIntelligenceLabels = {
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
    department: string;
    team: string;
    dependencyType: string;
    riskLevel: string;
    priority: string;
    reviewStatus: string;
    all: string;
  };
  dashboard: {
    healthScore: string;
    collaborationScore: string;
    dependencyScore: string;
    processAlignmentScore: string;
    executiveSummary: string;
    areasRequiringAttention: string;
    improvementOpportunities: string;
    dependencyMap: string;
    collaborationInsights: string;
    frictionView: string;
    heatmap: string;
    recommendations: string;
    timeline: string;
    reviewQuestions: string;
    beginReview: string;
  };
  dependency: {
    from: string;
    to: string;
    type: string;
    strength: string;
    riskLevel: string;
    owner: string;
    recommendedReview: string;
  };
  collaboration: {
    departments: string;
    category: string;
    type: string;
    healthStatus: string;
    opportunity: string;
    priority: string;
  };
  friction: {
    type: string;
    severity: string;
    affectedDepartments: string;
    recommendedAction: string;
    status: string;
  };
  heatmapLegend: {
    healthy: string;
    stable: string;
    needsAttention: string;
    highPriority: string;
  };
  detail: {
    reviewNotes: string;
    submitReview: string;
    reviewSuccess: string;
    advisoryNote: string;
  };
  beginReview: {
    success: string;
  };
  categories: Record<string, string>;
  dependencyTypes: Record<string, string>;
  dependencyStrengths: Record<string, string>;
  riskLevels: Record<string, string>;
  collaborationTypes: Record<string, string>;
  healthStatuses: Record<string, string>;
  frictionTypes: Record<string, string>;
  frictionSeverities: Record<string, string>;
  priorities: Record<string, string>;
  reviewStatuses: Record<string, string>;
  recommendations: Record<string, string>;
  timelineEvents: Record<string, string>;
  reviewQuestions: string[];
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    whyImportant: string;
    whyImportantAnswer: string;
    whoShouldUse: string;
    whoShouldUseAnswer: string;
  };
};

export const COLLABORATION_CATEGORIES: CollaborationCategory[] = [
  "leadership_collaboration","operations_alignment","customer_journey_alignment",
  "sales_support_alignment","product_customer_alignment","workforce_collaboration",
  "knowledge_sharing","process_coordination","communication_efficiency",
  "organizational_dependencies",
];

export const DEPENDENCY_TYPES: DependencyType[] = [
  "operational","informational","approval","resource","knowledge","process","communication",
];

export const RISK_LEVELS: RiskLevel[]             = ["low","moderate","high","critical"];
export const PRIORITIES: Priority[]               = ["low","moderate","high","critical"];
export const REVIEW_STATUSES: ReviewStatus[]      = ["pending","in_review","reviewed","needs_follow_up"];
export const HEALTH_STATUSES: HealthStatus[]      = ["healthy","stable","needs_attention","high_priority"];
export const COLLABORATION_TYPES: CollaborationType[] = ["strong","emerging","weak","gap"];
