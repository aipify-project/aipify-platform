export type MomentumStatus =
  | "accelerating"
  | "healthy"
  | "stable"
  | "slowing"
  | "stalled";

export type MomentumTrend = "improving" | "stable" | "declining";

export type MomentumPriority = "opportunity" | "recommended" | "important" | "immediate_attention";

export type MomentumInitiative = {
  id: string;
  title: string;
  initiative_owner: string;
  owner_id?: string | null;
  source_type: string;
  momentum_status: MomentumStatus | string;
  trend_direction: MomentumTrend | string;
  progress_percent: number;
  recent_activity_count: number;
  blockers_identified: string[];
  next_milestone: string;
  related_goals: string[];
  related_follow_ups: string[];
  related_decisions: string[];
  notes: string;
  team?: string;
};

export type MomentumRecommendation = {
  id: string;
  key: string;
  priority: MomentumPriority | string;
};

export type MomentumBottleneck = {
  id: string;
  key: string;
  severity: string;
};

export type MomentumExecutionSignals = {
  goal_progress: number;
  follow_up_completion: number;
  commitment_fulfillment: number;
  decision_implementation: number;
  strategic_movement: number;
  learning_implementation: number;
  meeting_action_completion: number;
  success_initiative_progress: number;
};

export type MomentumTimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type MomentumOverview = {
  found: boolean;
  can_manage?: boolean;
  can_admin?: boolean;
  review_started?: boolean;
  organizational_momentum_score?: number;
  execution_trend?: MomentumTrend;
  organizational_momentum_status?: MomentumStatus;
  high_momentum_initiatives?: MomentumInitiative[];
  slowing_initiatives?: MomentumInitiative[];
  stalled_initiatives?: MomentumInitiative[];
  teams_requiring_attention?: string[];
  positive_momentum_signals?: string[];
  initiatives?: MomentumInitiative[];
  recommendations?: MomentumRecommendation[];
  bottlenecks?: MomentumBottleneck[];
  personal_initiatives?: MomentumInitiative[];
  execution_signals?: MomentumExecutionSignals;
  principle?: string;
};

export type MomentumLabels = {
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
    momentumStatus: string;
    team: string;
    owner: string;
    trend: string;
    priority: string;
    periodFrom: string;
    all: string;
  };
  dashboard: {
    momentumScore: string;
    executionTrend: string;
    highMomentum: string;
    slowing: string;
    stalled: string;
    teamsAttention: string;
    positiveSignals: string;
    openRecommendations: string;
    momentumStatus: string;
  };
  signals: {
    title: string;
    goalProgress: string;
    followUpCompletion: string;
    commitmentFulfillment: string;
    decisionImplementation: string;
    strategicMovement: string;
    learningImplementation: string;
    meetingActionCompletion: string;
    successInitiativeProgress: string;
  };
  initiatives: {
    title: string;
    owner: string;
    progress: string;
    status: string;
    trend: string;
    blockers: string;
    nextMilestone: string;
    activity: string;
  };
  bottlenecks: { title: string };
  timeline: { title: string };
  team: { title: string };
  statuses: Record<MomentumStatus, string>;
  trends: Record<MomentumTrend, string>;
  priorities: Record<string, string>;
  recommendations: Record<string, string>;
  bottleneckKeys: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    howCalculated: string;
    howCalculatedAnswer: string;
    autoIncrease: string;
    autoIncreaseAnswer: string;
  };
};

export const MOMENTUM_STATUSES: MomentumStatus[] = [
  "accelerating", "healthy", "stable", "slowing", "stalled",
];

export const MOMENTUM_TRENDS: MomentumTrend[] = [
  "improving", "stable", "declining",
];

export const MOMENTUM_PRIORITIES: MomentumPriority[] = [
  "opportunity", "recommended", "important", "immediate_attention",
];
