export type ResilienceStatus =
  | "highly_resilient"
  | "resilient"
  | "stable"
  | "vulnerable"
  | "requires_attention";

export type ResilienceTrend = "improving" | "stable" | "declining";

export type ResiliencePriority = "opportunity" | "recommended" | "important" | "immediate_attention";

export type ResilienceCategory =
  | "operational_resilience"
  | "technology_resilience"
  | "workforce_resilience"
  | "vendor_resilience"
  | "leadership_resilience"
  | "financial_resilience"
  | "compliance_resilience"
  | "security_resilience"
  | "strategic_resilience"
  | "custom_category";

export type ResilienceArea = {
  id: string;
  title: string;
  category: ResilienceCategory | string;
  resilience_status: ResilienceStatus | string;
  current_assessment: number;
  identified_vulnerabilities: string[];
  existing_safeguards: string[];
  recovery_considerations: string;
  responsible_owner: string;
  owner_id?: string | null;
  last_reviewed_date?: string | null;
  related_continuity_plans: string[];
  related_risks: string[];
  related_playbooks: string[];
  notes: string;
  trend_direction: ResilienceTrend | string;
};

export type ResilienceRecommendation = {
  id: string;
  key: string;
  priority: ResiliencePriority | string;
};

export type ResilienceVulnerability = {
  id: string;
  key: string;
  severity: string;
};

export type ResilienceSignals = {
  continuity_planning: number;
  risk_mitigation_progress: number;
  backup_ownership_coverage: number;
  operational_dependencies: number;
  learning_implementation: number;
  capacity_balance: number;
  policy_compliance: number;
  incident_preparedness: number;
  vendor_diversification: number;
  leadership_readiness: number;
};

export type ResilienceTimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type ResilienceOverview = {
  found: boolean;
  can_manage?: boolean;
  can_admin?: boolean;
  review_started?: boolean;
  organizational_resilience_score?: number;
  adaptability_score?: number;
  continuity_preparedness_score?: number;
  operational_stability_score?: number;
  dependency_risk_score?: number;
  recovery_readiness?: number;
  organizational_resilience_status?: ResilienceStatus;
  positive_resilience_indicators?: string[];
  resilience_areas?: ResilienceArea[];
  recommendations?: ResilienceRecommendation[];
  vulnerabilities?: ResilienceVulnerability[];
  personal_areas?: ResilienceArea[];
  resilience_signals?: ResilienceSignals;
  principle?: string;
};

export type ResilienceLabels = {
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
    category: string;
    status: string;
    owner: string;
    trend: string;
    priority: string;
    periodFrom: string;
    all: string;
  };
  dashboard: {
    resilienceScore: string;
    adaptability: string;
    continuityPreparedness: string;
    operationalStability: string;
    dependencyRisk: string;
    recoveryReadiness: string;
    positiveIndicators: string;
    openRecommendations: string;
    resilienceStatus: string;
  };
  signals: {
    title: string;
    continuityPlanning: string;
    riskMitigation: string;
    backupOwnership: string;
    operationalDependencies: string;
    learningImplementation: string;
    capacityBalance: string;
    policyCompliance: string;
    incidentPreparedness: string;
    vendorDiversification: string;
    leadershipReadiness: string;
  };
  areas: {
    title: string;
    owner: string;
    assessment: string;
    status: string;
    trend: string;
    vulnerabilities: string;
    safeguards: string;
    recovery: string;
    lastReviewed: string;
  };
  vulnerabilities: { title: string };
  timeline: { title: string };
  statuses: Record<ResilienceStatus, string>;
  trends: Record<ResilienceTrend, string>;
  priorities: Record<string, string>;
  categories: Record<string, string>;
  recommendations: Record<string, string>;
  vulnerabilityKeys: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    predictDisruptions: string;
    predictDisruptionsAnswer: string;
    improveOverTime: string;
    improveOverTimeAnswer: string;
  };
};

export const RESILIENCE_STATUSES: ResilienceStatus[] = [
  "highly_resilient", "resilient", "stable", "vulnerable", "requires_attention",
];

export const RESILIENCE_TRENDS: ResilienceTrend[] = ["improving", "stable", "declining"];

export const RESILIENCE_PRIORITIES: ResiliencePriority[] = [
  "opportunity", "recommended", "important", "immediate_attention",
];

export const RESILIENCE_CATEGORIES: ResilienceCategory[] = [
  "operational_resilience", "technology_resilience", "workforce_resilience",
  "vendor_resilience", "leadership_resilience", "financial_resilience",
  "compliance_resilience", "security_resilience", "strategic_resilience", "custom_category",
];
