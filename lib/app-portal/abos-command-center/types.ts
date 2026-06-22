export type AbosCommandCenterPriority =
  | "informational"
  | "opportunity"
  | "important"
  | "immediate_attention";

export type AbosOrganizationalStatus =
  | "thriving"
  | "healthy"
  | "stable"
  | "requires_attention"
  | "critical_attention_required";

export type AbosCompanionBriefingLine = {
  key: string;
  count?: number;
  status?: string;
};

export type AbosCompanionBriefing = {
  greeting_key: string;
  lines: AbosCompanionBriefingLine[];
  closing_key: string;
};

export type AbosCommandCenterPriorityItem = {
  id: string;
  title: string;
  category: string;
  priority: AbosCommandCenterPriority | string;
};

export type AbosCommandCenterRecommendation = {
  id: string;
  key: string;
  priority: AbosCommandCenterPriority | string;
  type: string;
};

export type AbosCommandCenterTimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type AbosStrategicOverview = {
  on_track: number;
  delayed: number;
  milestones_achieved: number;
};

export type AbosMomentumOverview = {
  score: number;
  teams_accelerating: number;
  initiatives_slowing: number;
  bottlenecks: number;
};

export type AbosResilienceOverview = {
  score: number;
  vulnerabilities: number;
  continuity_readiness: number;
};

export type AbosCapacityOverview = {
  teams_approaching_limits: number;
  healthy_distribution: number;
  capacity_risks: number;
};

export type AbosRiskOverview = {
  high_priority: number;
  recently_mitigated: number;
};

export type AbosSuccessOverview = {
  milestones_achieved: number;
  high_performing: number;
};

export type AbosCustomerHealthOverview = {
  adoption_score: number;
  learning_score: number;
  support_engagement: number;
};

export type AbosCommandCenterOverview = {
  found: boolean;
  can_full?: boolean;
  can_limited?: boolean;
  briefing_started?: boolean;
  companion_briefing?: AbosCompanionBriefing;
  organizational_status?: AbosOrganizationalStatus | string;
  todays_priorities?: AbosCommandCenterPriorityItem[];
  strategic_overview?: AbosStrategicOverview;
  momentum_overview?: AbosMomentumOverview;
  resilience_overview?: AbosResilienceOverview;
  capacity_overview?: AbosCapacityOverview;
  risk_overview?: AbosRiskOverview;
  success_overview?: AbosSuccessOverview;
  customer_health_overview?: AbosCustomerHealthOverview;
  recommendations?: AbosCommandCenterRecommendation[];
  principle?: string;
};

export type AbosCommandCenterLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  accessDenied: string;
  errorTitle: string;
  retry: string;
  backToApp: string;
  organizationMissing: string;
  subscriptionRequired: string;
  permissionMissing: string;
  entitlementLocked: string;
  pageLoadError: string;
  filters: {
    search: string;
    priority: string;
    organizationalArea: string;
    recommendationType: string;
    focusCategory: string;
    periodFrom: string;
    all: string;
  };
  dashboard: {
    executiveBriefing: string;
    organizationalStatus: string;
    todaysPriorities: string;
    strategicOverview: string;
    momentumOverview: string;
    resilienceOverview: string;
    capacityOverview: string;
    riskOverview: string;
    successOverview: string;
    customerHealthOverview: string;
    recommendations: string;
    executiveTimeline: string;
  };
  briefing: {
    goodMorning: string;
    overallHealth: string;
    strategicInitiativesAttention: string;
    resilienceVulnerability: string;
    momentumPositive: string;
    focusPrioritiesToday: string;
  };
  orgStatus: Record<string, string>;
  overviews: {
    onTrack: string;
    delayed: string;
    milestonesAchieved: string;
    momentumScore: string;
    teamsAccelerating: string;
    initiativesSlowing: string;
    bottlenecks: string;
    resilienceScore: string;
    vulnerabilities: string;
    continuityReadiness: string;
    teamsApproachingLimits: string;
    healthyDistribution: string;
    capacityRisks: string;
    highPriorityRisks: string;
    recentlyMitigated: string;
    highPerforming: string;
    adoptionScore: string;
    learningScore: string;
    supportEngagement: string;
  };
  priorities: {
    decisionAttention: string;
    strategicAtRisk: string;
    executiveCommitment: string;
    criticalFollowUp: string;
    highPriorityRecommendation: string;
    importantReview: string;
  };
  priorityLevels: Record<string, string>;
  recommendationTypes: Record<string, string>;
  recommendations: Record<string, string>;
  timeline: { title: string };
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    replacesModules: string;
    replacesModulesAnswer: string;
    runsOrganization: string;
    runsOrganizationAnswer: string;
  };
};

export const ABOS_COMMAND_CENTER_PRIORITIES: AbosCommandCenterPriority[] = [
  "informational",
  "opportunity",
  "important",
  "immediate_attention",
];

export const ABOS_COMMAND_CENTER_RECOMMENDATION_TYPES = [
  "risk",
  "strategic",
  "success",
  "capacity",
  "resilience",
] as const;
