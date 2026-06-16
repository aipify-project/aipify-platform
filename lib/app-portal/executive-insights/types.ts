export type ExecutiveInsightsHealthStatus = "healthy" | "warning" | "critical";
export type ExecutiveInsightsTrend = "improving" | "stable" | "declining";
export type RiskSeverity = "low" | "medium" | "high";

export type ExecutiveInsightsHealthFactor = {
  key: string;
  label: string;
  value: string | number;
  status: string;
};

export type ExecutiveInsightsPriority = {
  id: string;
  title: string;
  href: string;
  kind?: string;
};

export type ExecutiveInsightsCard = {
  id: string;
  title: string;
  detail: string;
  severity: RiskSeverity;
};

export type ExecutiveInsightsRecommendation = {
  id: string;
  title: string;
  why: string;
  expected_impact: string;
  action: string;
  href: string;
};

export type ExecutiveInsightsSinceLastLogin = {
  new_team_members?: number;
  integrations_connected?: number;
  business_packs_installed?: number;
  tasks_completed?: number;
  major_events?: string[];
  billing_events?: string[];
  summary?: string;
  highlights?: Array<{ title: string; detail?: string }>;
};

export type AppPortalExecutiveInsights = {
  found: boolean;
  has_access: boolean;
  error?: string;
  principle?: string;
  sparse_data?: boolean;
  health?: {
    score: number;
    trend: ExecutiveInsightsTrend;
    status: ExecutiveInsightsHealthStatus;
    status_label: string;
    factors: ExecutiveInsightsHealthFactor[];
  };
  priorities: ExecutiveInsightsPriority[];
  since_last_login: ExecutiveInsightsSinceLastLogin;
  opportunities: ExecutiveInsightsCard[];
  risks: ExecutiveInsightsCard[];
  recommendations: ExecutiveInsightsRecommendation[];
};

export type AppPortalExecutiveInsightsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  accessDeniedTitle: string;
  accessDeniedBody: string;
  emptyTitle: string;
  emptyBody: string;
  exploreBusinessPacks: string;
  sections: {
    health: string;
    priorities: string;
    sinceLastLogin: string;
    opportunities: string;
    risks: string;
    recommendations: string;
  };
  health: {
    score: string;
    trend: string;
    status: string;
    factors: string;
    trends: Record<ExecutiveInsightsTrend, string>;
    statuses: Record<ExecutiveInsightsHealthStatus, string>;
  };
  sinceLastLogin: {
    newTeamMembers: string;
    integrationsConnected: string;
    businessPacksInstalled: string;
    tasksCompleted: string;
    majorEvents: string;
    billingEvents: string;
  };
  recommendation: {
    why: string;
    expectedImpact: string;
    suggestedAction: string;
  };
  severity: Record<RiskSeverity, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    autoDecisions: string;
    autoDecisionsAnswer: string;
    updateFrequency: string;
    updateFrequencyAnswer: string;
  };
};
