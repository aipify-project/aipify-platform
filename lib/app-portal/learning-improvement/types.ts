export type LearningCategory =
  | "operational_improvement"
  | "customer_experience"
  | "security_improvement"
  | "incident_learning"
  | "leadership_learning"
  | "process_improvement"
  | "team_collaboration"
  | "technology_learning"
  | "vendor_learning"
  | "custom_learning";

export type LearningStatus =
  | "identified"
  | "under_review"
  | "approved"
  | "in_progress"
  | "implemented"
  | "archived";

export type LearningImpactLevel =
  | "minor_improvement"
  | "moderate_improvement"
  | "significant_improvement"
  | "transformational_improvement";

export type LearningRecordItem = {
  id: string;
  title: string;
  description?: string;
  description_full?: string;
  category: LearningCategory;
  submitted_by_id?: string | null;
  submitted_by_name: string;
  owner_id?: string | null;
  owner_name: string;
  contributor_ids?: string[];
  status: LearningStatus;
  impact_level: LearningImpactLevel;
  date_identified: string;
  date_implemented?: string | null;
  related_modules?: string[];
  notes?: string;
  notes_full?: string;
  created_at: string;
  updated_at: string;
};

export type LearningAction = {
  id: string;
  title: string;
  root_causes?: string;
  recommended_actions?: string;
  assigned_owner_id?: string | null;
  assigned_owner_name?: string;
  success_criteria?: string;
  expected_outcomes?: string;
  lessons_applied_elsewhere?: string;
  notes?: string;
  created_at: string;
};

export type RecurringTheme = {
  theme_key: string;
  count: number;
  label: string;
};

export type PatternInsight = {
  key: string;
  active: boolean;
};

export type LearningRecommendation = {
  id: string;
  key: string;
  priority: string;
  record_id?: string;
};

export type LearningDashboard = {
  recently_identified: LearningRecordItem[];
  implemented: number;
  awaiting_review: number;
  high_impact: number;
  recurring_themes: RecurringTheme[];
  recently_archived: LearningRecordItem[];
};

export type LearningListResponse = {
  found: boolean;
  can_manage?: boolean;
  can_contribute?: boolean;
  items: LearningRecordItem[];
  dashboard?: LearningDashboard;
  pattern_insights?: PatternInsight[];
  recommendations?: LearningRecommendation[];
  principle?: string;
};

export type LearningDetail = {
  found: boolean;
  can_manage?: boolean;
  record?: LearningRecordItem;
  actions?: LearningAction[];
  related_follow_ups?: Array<{ id: string; title: string; status: string }>;
  related_decisions?: Array<{ id: string; title: string; status: string }>;
  activity_timeline?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  audit_history?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  recommendations?: LearningRecommendation[];
};

export type LearningImprovementLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  back: string;
  notFound: string;
  filters: {
    search: string;
    category: string;
    status: string;
    owner: string;
    impact: string;
    identifiedFrom: string;
    identifiedTo: string;
    recentlyImplemented: string;
    all: string;
    yes: string;
    no: string;
  };
  dashboard: {
    recentlyIdentified: string;
    implemented: string;
    awaitingReview: string;
    highImpact: string;
    recurringThemes: string;
    recentlyArchived: string;
  };
  patterns: {
    title: string;
    repeatedBottlenecks: string;
    commonSupportIssues: string;
    delayedActivities: string;
    approvalChallenges: string;
    onboardingObstacles: string;
    inactive: string;
  };
  form: {
    createTitle: string;
    title: string;
    description: string;
    category: string;
    impact: string;
    notes: string;
    submit: string;
    cancel: string;
  };
  card: {
    submittedBy: string;
    owner: string;
    impact: string;
    dateIdentified: string;
    dateImplemented: string;
    view: string;
  };
  detail: {
    overview: string;
    ownership: string;
    actions: string;
    relatedFollowUps: string;
    relatedDecisions: string;
    activity: string;
    audit: string;
    save: string;
    saved: string;
    recommendations: string;
    addAction: string;
    actionTitle: string;
    rootCauses: string;
    recommendedActions: string;
    successCriteria: string;
    expectedOutcomes: string;
    lessonsApplied: string;
  };
  categories: Record<LearningCategory, string>;
  statuses: Record<LearningStatus, string>;
  impact: Record<LearningImpactLevel, string>;
  recommendations: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    document: string;
    documentAnswer: string;
    autoImplement: string;
    autoImplementAnswer: string;
  };
};
