export type PrioritizationCategory =
  | "strategic_initiative"
  | "operational_improvement"
  | "customer_initiative"
  | "technology_initiative"
  | "risk_mitigation"
  | "compliance_requirement"
  | "revenue_opportunity"
  | "workforce_initiative"
  | "innovation_opportunity"
  | "custom_category";

export type PriorityStatus =
  | "under_evaluation"
  | "recommended"
  | "high_priority"
  | "medium_priority"
  | "low_priority"
  | "deferred"
  | "completed";

export type MatrixQuadrant = "quick_wins" | "major_projects" | "fill_ins" | "reconsider";

export type PrioritizationItem = {
  id: string;
  title: string;
  description?: string;
  description_full?: string;
  category: PrioritizationCategory;
  owner_id?: string | null;
  owner_name: string;
  executive_sponsor_id?: string | null;
  executive_sponsor_name: string;
  priority_status: PriorityStatus;
  strategic_alignment_score: number;
  impact_score: number;
  urgency_score: number;
  effort_estimate: number;
  capacity_requirement: number;
  scoring_factors?: Record<string, unknown>;
  scoring_weights?: Record<string, unknown>;
  composite_score?: number;
  matrix_quadrant?: MatrixQuadrant;
  due_date?: string | null;
  dependencies?: string;
  dependencies_full?: string;
  capacity_considerations?: string;
  capacity_considerations_full?: string;
  capacity_conflict?: boolean;
  notes?: string;
  notes_full?: string;
  created_at: string;
  updated_at: string;
};

export type PrioritizationScoreRecord = {
  id: string;
  priority_status?: string;
  strategic_alignment_score?: number;
  impact_score?: number;
  urgency_score?: number;
  effort_estimate?: number;
  capacity_requirement?: number;
  composite_score?: number;
  matrix_quadrant?: MatrixQuadrant;
  notes?: string;
  created_at: string;
  performed_by: string;
};

export type PrioritizationMatrix = {
  quick_wins: PrioritizationItem[];
  major_projects: PrioritizationItem[];
  fill_ins: PrioritizationItem[];
  reconsider: PrioritizationItem[];
};

export type PrioritizationRecommendation = {
  id: string;
  key: string;
  priority: string;
  item_id?: string;
};

export type PrioritizationDashboard = {
  highest_priority: PrioritizationItem[];
  deferred: PrioritizationItem[];
  capacity_conflicts: number;
  strategic_alignment_overview: number;
  recently_reprioritized: Array<{
    id: string;
    item_id: string;
    priority_status?: string;
    composite_score?: number;
    matrix_quadrant?: MatrixQuadrant;
    created_at: string;
    performed_by: string;
  }>;
};

export type PrioritizationListResponse = {
  found: boolean;
  can_manage?: boolean;
  items: PrioritizationItem[];
  dashboard?: PrioritizationDashboard;
  matrix?: PrioritizationMatrix;
  recommendations?: PrioritizationRecommendation[];
  principle?: string;
};

export type PrioritizationDetail = {
  found: boolean;
  can_manage?: boolean;
  item?: PrioritizationItem;
  related_goals?: Array<{ id: string; title: string; status: string }>;
  related_follow_ups?: Array<{ id: string; title: string; status: string }>;
  related_risks?: Array<{ id: string; title: string; status: string }>;
  related_strategic_initiatives?: Array<{ id: string; title: string; status: string }>;
  recommendation_history?: PrioritizationScoreRecord[];
  activity_timeline?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  audit_history?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  recommendations?: PrioritizationRecommendation[];
};

export type PrioritizationEngineLabels = {
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
    priorityStatus: string;
    owner: string;
    sponsor: string;
    alignmentMin: string;
    dueFrom: string;
    dueTo: string;
    all: string;
  };
  dashboard: {
    highestPriority: string;
    deferred: string;
    capacityConflicts: string;
    strategicAlignment: string;
    recommendedActions: string;
    recentlyReprioritized: string;
  };
  matrix: {
    title: string;
    impact: string;
    effort: string;
    quickWins: string;
    majorProjects: string;
    fillIns: string;
    reconsider: string;
  };
  form: {
    createTitle: string;
    title: string;
    description: string;
    category: string;
    dueDate: string;
    notes: string;
    submit: string;
    cancel: string;
  };
  card: {
    owner: string;
    sponsor: string;
    alignment: string;
    impact: string;
    urgency: string;
    composite: string;
    quadrant: string;
    dueDate: string;
  };
  detail: {
    overview: string;
    scoringBreakdown: string;
    strategicAlignment: string;
    impact: string;
    urgency: string;
    effort: string;
    capacity: string;
    capacityConsiderations: string;
    dependencies: string;
    relatedGoals: string;
    relatedFollowUps: string;
    relatedRisks: string;
    relatedStrategicInitiatives: string;
    recommendationHistory: string;
    activityTimeline: string;
    audit: string;
    save: string;
    saved: string;
    score: string;
    scored: string;
    recommendations: string;
    priorityStatus: string;
    notes: string;
  };
  categories: Record<PrioritizationCategory, string>;
  priorityStatuses: Record<PriorityStatus, string>;
  quadrants: Record<MatrixQuadrant, string>;
  recommendations: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    canChange: string;
    canChangeAnswer: string;
    autoDecide: string;
    autoDecideAnswer: string;
  };
};
