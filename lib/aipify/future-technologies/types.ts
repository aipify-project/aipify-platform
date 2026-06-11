export type TechnologyObservation = {
  id: string;
  observation_key: string;
  title: string;
  description: string;
  observation_area: string;
  maturity_level: string;
  relevance_score: number;
  status: string;
};

export type TrendReport = {
  id: string;
  title: string;
  summary: string;
  trend_category: string;
  impact_level: string;
};

export type EmergingInitiative = {
  id: string;
  initiative_key: string;
  title: string;
  description: string;
  interface_type: string;
  interface_label?: string;
  status: string;
  business_value_score: number;
  governance_compatible: boolean;
};

export type PilotOpportunity = {
  id: string;
  title: string;
  description: string;
  status: string;
  participant_type: string;
};

export type ReadinessAssessment = {
  id: string;
  assessment_type: string;
  title: string;
  summary: string;
  readiness_score: number;
};

export type ScenarioPlan = {
  id: string;
  title: string;
  description: string;
  time_horizon: string;
  status: string;
};

export type FutureRecommendation = {
  id: string;
  title: string;
  description: string;
  recommendation_type: string;
  priority: string;
  status: string;
};

export type FutureTechnologiesCard = {
  has_customer: boolean;
  future_readiness_score?: number;
  active_initiatives?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
};

export type FutureTechnologiesDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  observatory_enabled?: boolean;
  scenario_planning_enabled?: boolean;
  voice_readiness_tracking?: boolean;
  multimodal_exploration?: boolean;
  human_approval_required?: boolean;
  interoperability_focus?: boolean;
  future_readiness_score?: number;
  avg_technology_relevance?: number;
  active_initiatives?: number;
  open_pilot_opportunities?: number;
  observation_areas?: string[];
  emerging_interfaces?: Array<{ type: string; label: string }>;
  technology_observations: TechnologyObservation[];
  trend_reports: TrendReport[];
  emerging_initiatives: EmergingInitiative[];
  pilot_opportunities: PilotOpportunity[];
  readiness_assessments: ReadinessAssessment[];
  scenario_plans: ScenarioPlan[];
  recommendations: FutureRecommendation[];
  responsible_adoption_principles?: string[];
  automation_evolution_principles?: string[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
};

export type FutureTechnologiesActionResult = {
  status?: string;
  error?: string;
};

export type FutureTechnologiesBriefingResult = {
  briefing_id?: string;
  summary?: string;
  error?: string;
};
