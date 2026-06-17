export type ExecutivePriority = {
  id: string;
  title: string;
  description: string;
  focus_area: string;
  priority_level: string;
  rank_order?: number;
  due_date?: string | null;
};

export type ExecutiveAction = {
  id: string;
  action_type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  due_date?: string | null;
};

export type ExecutiveInsight = {
  id?: string;
  insight_type?: string;
  observation: string;
  explanation?: string;
  impact: string;
  recommendation: string;
  effort: string;
  potential_value: string;
  source_module?: string;
};

export type IntelligenceModule = {
  key: string;
  label?: string;
  summary?: string;
  status?: string;
};

export type ExecutiveTimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type ExecutiveCompanionDashboard = {
  found: boolean;
  has_briefing?: boolean;
  role?: string;
  can_full?: boolean;
  can_limited?: boolean;
  workspace_view?: string;
  executive_health_score?: number;
  organizational_health_score?: number;
  executive_readiness_score?: number;
  risk_count?: number;
  opportunity_count?: number;
  daily_opening?: string;
  executive_summary?: string;
  organizational_summary?: string;
  priorities?: ExecutivePriority[];
  actions?: ExecutiveAction[];
  insights?: ExecutiveInsight[];
  timeline?: ExecutiveTimelineEvent[];
  intelligence_modules?: IntelligenceModule[];
  usage_example?: string;
  privacy_note?: string;
  principle?: string;
  golden_rule?: string;
};

export type CompanionExecutiveLayerLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  privacyNote: string;
  goldenRule: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  accessDenied: string;
  filters: { search: string; workspace: string; all: string };
  sections: {
    home: string;
    dailyOpening: string;
    todaysPriorities: string;
    sinceLastLogin: string;
    recommendedActions: string;
    upcomingMeetings: string;
    executiveBriefing: string;
    strategicFocus: string;
    actionCenter: string;
    focusEngine: string;
    relationships: string;
    intelligence: string;
    decisionSupport: string;
    timeline: string;
    usageExamples: string;
  };
  dashboard: {
    executiveHealthScore: string;
    organizationalHealthScore: string;
    executiveReadinessScore: string;
    todaysPriorities: string;
    strategicOpportunities: string;
    emergingRisks: string;
    relationshipInsights: string;
    executiveSummary: string;
  };
  card: {
    observation: string;
    explanation: string;
    impact: string;
    recommendation: string;
    effort: string;
    potentialValue: string;
    dueDate: string;
    priority: string;
  };
  actions: { generateBriefing: string; viewDetails: string };
  workspaces: Record<string, string>;
  focusAreas: Record<string, string>;
  briefingPeriods: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    makesDecisions: string;
    makesDecisionsAnswer: string;
    whyUse: string;
    whyUseAnswer: string;
  };
};
