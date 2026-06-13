export type ResilienceDependency = {
  dependency_key: string;
  domain: string;
  dependency_type: string;
  title: string;
  message: string;
  severity: string;
  status: string;
};

export type PreparednessReview = {
  review_key: string;
  domain: string;
  title: string;
  summary: string;
  review_state: string;
  status: string;
  completed_at: string | null;
};

export type ResilienceScenario = {
  scenario_key: string;
  scenario_type: string;
  title: string;
  prompt: string;
  readiness_level: string;
};

export type ResilienceInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type ResilienceRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type ExecutiveResilienceReview = {
  exec_review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalResilienceCenter = {
  dashboard: {
    resilience_score: number;
    resilience_label: string;
    critical_dependencies: number;
    reviews_completed: number;
    reviews_pending: number;
    recovery_capability: string;
    knowledge_resilience: number;
    operational_resilience: number;
    workforce_resilience: number;
    technical_resilience: number;
    governance_resilience: number;
    executive_confidence: number;
    companion_usefulness: number;
  } | null;
  dependencies: ResilienceDependency[];
  preparedness_reviews: PreparednessReview[];
  scenarios: ResilienceScenario[];
  insights: ResilienceInsight[];
  recommendations: ResilienceRecommendation[];
  executive_reviews: ExecutiveResilienceReview[];
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
