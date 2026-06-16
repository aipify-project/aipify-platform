export type ExecutiveCompanionPriority =
  | "informational"
  | "recommended"
  | "important"
  | "immediate_attention";

export type ExecutiveBriefingLine = {
  key: string;
  count?: number;
};

export type ExecutiveDailyBriefing = {
  greeting_key: string;
  lines: ExecutiveBriefingLine[];
  momentum_summary_key: string;
  momentum_score?: number;
};

export type ExecutivePriority = {
  id: string;
  title: string;
  category: string;
  priority: ExecutiveCompanionPriority | string;
  due_date?: string | null;
};

export type ExecutiveMeetingPrep = {
  id: string;
  title: string;
  scheduled_at: string;
  related_commitments: string[];
  related_decisions: string[];
  related_follow_ups: string[];
  previous_summary: string;
  preparation_topics: string[];
};

export type ExecutiveHealthSnapshot = {
  strategy_status: string;
  momentum_status: string;
  resilience_status: string;
  capacity_indicator: string;
  risk_indicator: string;
  success_indicator: string;
  momentum_score?: number;
  resilience_score?: number;
};

export type ExecutiveMemoryItem = {
  id: string;
  type: string;
  title: string;
  recorded_at: string;
};

export type ExecutiveRecommendation = {
  id: string;
  key: string;
  priority: ExecutiveCompanionPriority | string;
};

export type ExecutiveTimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type ExecutiveCompanionOverview = {
  found: boolean;
  can_full?: boolean;
  can_limited?: boolean;
  briefing_started?: boolean;
  daily_briefing?: ExecutiveDailyBriefing;
  todays_priorities?: ExecutivePriority[];
  items_requiring_attention?: ExecutivePriority[];
  upcoming_responsibilities?: ExecutivePriority[];
  strategic_progress?: { active_initiatives: number; delayed_initiatives: number };
  organizational_health?: ExecutiveHealthSnapshot;
  meeting_preparation?: ExecutiveMeetingPrep[];
  executive_memory?: ExecutiveMemoryItem[];
  recommendations?: ExecutiveRecommendation[];
  positive_indicators?: string[];
  principle?: string;
};

export type ExecutiveCompanionLabels = {
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
    priority: string;
    strategicArea: string;
    organizationalArea: string;
    focusCategory: string;
    periodFrom: string;
    all: string;
  };
  dashboard: {
    executiveBriefing: string;
    todaysPriorities: string;
    itemsAttention: string;
    upcomingResponsibilities: string;
    strategicProgress: string;
    organizationalHealth: string;
    recommendedActions: string;
    activeInitiatives: string;
    delayedInitiatives: string;
  };
  briefing: {
    goodMorning: string;
    strategicInitiativesAttention: string;
    commitmentsApproaching: string;
    riskShouldReview: string;
    momentumHealthy: string;
    momentumStable: string;
    momentumNeedsAttention: string;
  };
  priorities: {
    title: string;
    criticalCommitment: string;
    delayedInitiative: string;
    highPriorityDecision: string;
    emergingRisk: string;
    upcomingReview: string;
    executiveAction: string;
  };
  meetingPrep: {
    title: string;
    relatedCommitments: string;
    relatedDecisions: string;
    relatedFollowUps: string;
    previousSummary: string;
    preparationTopics: string;
  };
  health: {
    title: string;
    strategy: string;
    momentum: string;
    resilience: string;
    capacity: string;
    risk: string;
    success: string;
  };
  memory: { title: string; decision: string; commitment: string };
  timeline: { title: string };
  priorityLevels: Record<string, string>;
  recommendations: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    makesDecisions: string;
    makesDecisionsAnswer: string;
    replaceLeadership: string;
    replaceLeadershipAnswer: string;
  };
};

export const EXECUTIVE_COMPANION_PRIORITIES: ExecutiveCompanionPriority[] = [
  "informational", "recommended", "important", "immediate_attention",
];
