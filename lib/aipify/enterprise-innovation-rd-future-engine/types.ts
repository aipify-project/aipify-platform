export type InnovationIdea = {
  id?: string;
  idea_key?: string;
  idea_title?: string;
  source_type?: string;
  lifecycle_stage?: string;
  business_value?: number;
  strategic_alignment?: number;
  implementation_complexity?: number;
  customer_impact?: number;
  revenue_potential?: number;
  risk_level?: string;
  innovation_score?: number;
  owner_name?: string;
  summary?: string;
  [key: string]: unknown;
};

export type InnovationResearchProject = {
  id?: string;
  project_key?: string;
  project_title?: string;
  project_type?: string;
  status?: string;
  pipeline_stage?: string;
  summary?: string;
  [key: string]: unknown;
};

export type InnovationExperiment = {
  id?: string;
  experiment_key?: string;
  experiment_title?: string;
  experiment_type?: string;
  status?: string;
  pipeline_stage?: string;
  summary?: string;
  [key: string]: unknown;
};

export type InnovationTechnologyRadar = {
  id?: string;
  radar_key?: string;
  radar_title?: string;
  radar_category?: string;
  maturity?: string;
  summary?: string;
  [key: string]: unknown;
};

export type InnovationOpportunity = {
  id?: string;
  opportunity_key?: string;
  opportunity_title?: string;
  opportunity_type?: string;
  priority?: string;
  pipeline_stage?: string;
  summary?: string;
  [key: string]: unknown;
};

export type InnovationCompetitiveSignal = {
  id?: string;
  signal_key?: string;
  signal_title?: string;
  signal_type?: string;
  summary?: string;
  [key: string]: unknown;
};

export type InnovationIntelligenceSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type InnovationAdvisorSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  effort?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type EnterpriseInnovationRdFutureCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  innovation_lab_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  core_languages?: string[];
  ideas?: InnovationIdea[];
  research_projects?: InnovationResearchProject[];
  experiments?: InnovationExperiment[];
  technology_radar?: InnovationTechnologyRadar[];
  opportunities?: InnovationOpportunity[];
  competitive_signals?: InnovationCompetitiveSignal[];
  intelligence_signals?: InnovationIntelligenceSignal[];
  advisor_signals?: InnovationAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  executive_dashboard?: Record<string, unknown>;
  governance?: Record<string, unknown>;
  [key: string]: unknown;
};
