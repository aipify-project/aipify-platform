export type EvolutionOperationsTab =
  | "overview"
  | "adoption"
  | "maturity"
  | "recommendations"
  | "training"
  | "optimization"
  | "companion_insights"
  | "reports"
  | "executive";

export type EvolutionRecommendation = {
  id: string;
  recommendation_type?: string;
  title: string;
  summary?: string;
  department?: string;
  status?: string;
  estimated_value?: string;
  measured_result?: string;
  value_generated?: string;
  training_assigned?: boolean;
  created_at?: string;
  resolved_at?: string;
};

export type EvolutionAdoptionItem = {
  id: string;
  item_type?: string;
  item_key?: string;
  title: string;
  status?: string;
  usage_pct?: number;
  business_pack_key?: string;
  domain_scope?: string;
};

export type DepartmentEvolution = {
  department_name: string;
  automation_score?: number;
  knowledge_score?: number;
  training_score?: number;
  maturity_score?: number;
  adoption_score?: number;
  suggestions?: unknown;
};

export type EvolutionOperationsCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  overview?: Record<string, string | number | undefined>;
  maturity_engine?: Record<string, unknown>;
  adoption?: EvolutionAdoptionItem[];
  feature_adoption_engine?: Record<string, unknown>;
  business_pack_adoption?: unknown[];
  health_review?: Record<string, unknown>;
  training_integration?: Record<string, unknown>;
  process_optimization?: Record<string, unknown>;
  recommendations?: EvolutionRecommendation[];
  companion_insights?: Record<string, unknown>;
  success_tracking?: Record<string, unknown>;
  learning_loop?: Record<string, unknown>;
  department_evolution?: DepartmentEvolution[];
  domain_awareness?: unknown[];
  business_pack_integration?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  mobile_access?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; section?: string; created_at?: string }[];
  routes?: Record<string, string>;
  error?: string;
};
