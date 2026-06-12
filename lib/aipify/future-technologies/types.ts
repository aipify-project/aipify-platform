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

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type FutureExplorationQuestion = {
  emoji?: string;
  key?: string;
  question?: string;
  example?: string;
};

export type EmergingTheme = {
  key?: string;
  label?: string;
  description?: string;
};

export type ScenarioPreparedness = {
  principle?: string;
  scenarios?: BlueprintObjective[];
  reflection_note?: string;
};

export type OrganizationalResilienceBlueprint = {
  principle?: string;
  encouragements?: BlueprintObjective[];
  resilience_route?: string;
  boundary_note?: string;
};

export type CompanionGuidanceItem = {
  emoji?: string;
  key?: string;
  topic?: string;
  example?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  mantra?: string;
  self_love_route?: string;
  boundary_note?: string;
};

export type LeadershipInsights = {
  principle?: string;
  insight_types?: BlueprintObjective[];
  dialogue_note?: string;
};

export type TrustConnection = {
  principle?: string;
  users_should_see?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
};

export type DogfoodingBlueprint = {
  principle?: string;
  aipify_group?: Record<string, unknown>;
  unonight?: Record<string, unknown>;
};

export type FutureReadinessEngagementSummary = {
  readiness_assessments_count?: number;
  scenario_plans_count?: number;
  active_scenario_plans?: number;
  future_exploration_documented?: number;
  emerging_themes_documented?: number;
  privacy_note?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  note?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type FutureTechnologiesCard = {
  has_customer: boolean;
  future_readiness_score?: number;
  active_initiatives?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint_phase63?: ImplementationBlueprintMeta;
  mission?: string;
  abos_principle?: string;
  engagement_summary?: FutureReadinessEngagementSummary;
  blueprint_note?: string;
  readiness_note?: string;
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
  implementation_blueprint_phase63?: ImplementationBlueprintMeta;
  future_readiness_note?: string;
  blueprint_distinction_note?: string;
  blueprint_mission?: string;
  blueprint_philosophy?: string;
  blueprint_abos_principle?: string;
  vision?: string;
  blueprint_objectives?: BlueprintObjective[];
  future_exploration?: FutureExplorationQuestion[];
  emerging_themes?: EmergingTheme[];
  scenario_preparedness?: ScenarioPreparedness;
  organizational_resilience?: OrganizationalResilienceBlueprint;
  companion_guidance?: CompanionGuidanceItem[];
  self_love_connection?: SelfLoveConnection;
  leadership_insights?: LeadershipInsights;
  trust_connection?: TrustConnection;
  dogfooding?: DogfoodingBlueprint;
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: FutureReadinessEngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  privacy_note?: string;
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
