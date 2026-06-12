export type ResiliencePlanRecord = {
  id?: string;
  plan_name?: string;
  scenario_type?: string;
  owner_user_id?: string;
  status?: string;
  review_frequency?: string;
  continuity_requirements?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type ResilienceSimulationRecord = {
  id?: string;
  plan_id?: string;
  simulation_type?: string;
  status?: string;
  completed_at?: string;
  outcomes_metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type ResilienceVulnerabilityRecord = {
  id?: string;
  title?: string;
  severity?: string;
  status?: string;
  linked_plan_id?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type ResilienceReviewRecord = {
  id?: string;
  plan_id?: string;
  review_date?: string;
  findings_metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type ResilienceDimension = {
  key?: string;
  label?: string;
  examples?: string[];
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  description?: string;
};

export type OrganizationalResilienceEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  active_plans?: number;
  open_vulnerabilities?: number;
  [key: string]: unknown;
};

export type OrganizationalResilienceEngineDashboard = {
  has_organization: boolean;
  purpose?: string;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  principles?: string[];
  resilience_dimensions?: ResilienceDimension[];
  crisis_support_guidance?: string;
  crisis_examples?: string[];
  self_love_note?: string;
  growth_evolution_note?: string;
  trust_engine_note?: string;
  continuity_phase80_note?: string;
  distinction_note?: string;
  integration_links?: IntegrationLink[];
  summary?: Record<string, unknown>;
  plans?: ResiliencePlanRecord[];
  simulations?: ResilienceSimulationRecord[];
  vulnerabilities?: ResilienceVulnerabilityRecord[];
  reviews?: ResilienceReviewRecord[];
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};
