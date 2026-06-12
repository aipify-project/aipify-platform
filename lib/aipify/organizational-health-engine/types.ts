export type OrganizationalHealthScore = {
  id?: string;
  health_category?: string;
  health_score?: number;
  health_status?: string;
  measured_at?: string;
  indicators?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type OrganizationalHealthIntervention = {
  id?: string;
  category?: string;
  recommendation?: string;
  status?: string;
  approved_at?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type HealthDomain = {
  key?: string;
  label?: string;
  description?: string;
  indicators?: string[];
};

export type HealthObservation = {
  emoji?: string;
  key?: string;
  scenario?: string;
  example?: string;
};

export type WorkloadAwareness = {
  principle?: string;
  signals?: BlueprintObjective[];
  sustainability_note?: string;
};

export type RecognitionConnection = {
  principle?: string;
  practices?: string[];
  gratitude_route?: string;
  boundary_note?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
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

export type PrivacyPrinciples = {
  principle?: string;
  must_avoid?: string[];
  must_support?: string[];
};

export type DogfoodingBlueprint = {
  principle?: string;
  aipify_group?: Record<string, unknown>;
  unonight?: Record<string, unknown>;
};

export type HealthEngagementSummary = {
  categories_measured?: number;
  healthy_categories?: number;
  attention_required_categories?: number;
  overall_score?: number;
  overall_status?: string;
  pending_interventions?: number;
  health_domains_documented?: number;
  observation_examples?: number;
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

export type EmployeeExperienceQuestion = {
  emoji?: string;
  key?: string;
  question?: string;
  description?: string;
};

export type EmployeeExperienceQuestions = {
  principle?: string;
  questions?: EmployeeExperienceQuestion[];
  reflection_note?: string;
};

export type RecognitionPractice = {
  emoji?: string;
  key?: string;
  label?: string;
  description?: string;
};

export type RecognitionPractices = {
  principle?: string;
  practices?: RecognitionPractice[] | string[];
  gratitude_route?: string;
  boundary_note?: string;
};

export type CompanionCheckIn = {
  emoji?: string;
  key?: string;
  scenario?: string;
  example?: string;
};

export type CompanionCheckIns = {
  principle?: string;
  check_ins?: CompanionCheckIn[];
  companion_name?: string;
  not_label?: string;
  reflection_note?: string;
};

export type SelfLoveWellbeingConnection = SelfLoveConnection & {
  quotes?: string[];
};

export type LeadershipConnection = {
  principle?: string;
  leadership_practices?: BlueprintObjective[];
  dialogue_note?: string;
};

export type EmployeeJourneyStage = {
  key?: string;
  label?: string;
  description?: string;
  route?: string;
};

export type EmployeeJourneyConnection = {
  principle?: string;
  journey_stages?: EmployeeJourneyStage[];
  boundary_note?: string;
};

export type WellbeingTrustConnection = TrustConnection & {
  employees_should_know?: string[];
  leaders_should_understand?: string[];
};

export type WellbeingEngagementSummary = HealthEngagementSummary & {
  experience_questions_documented?: number;
  wellbeing_observations_documented?: number;
  recognition_practices_documented?: number;
  companion_check_ins_documented?: number;
  journey_stages_documented?: number;
  integration_links_documented?: number;
};

export type EmployeeExperienceWellbeingBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: BlueprintObjective[];
  employee_experience_questions?: EmployeeExperienceQuestions;
  wellbeing_observations?: HealthObservation[];
  recognition_practices?: RecognitionPractices;
  companion_check_ins?: CompanionCheckIns;
  self_love_connection?: SelfLoveWellbeingConnection;
  leadership_connection?: LeadershipConnection;
  employee_journey_connection?: EmployeeJourneyConnection;
  trust_connection?: WellbeingTrustConnection;
  privacy_principles?: PrivacyPrinciples;
  dogfooding?: DogfoodingBlueprint;
  success_criteria?: AbosSuccessCriterion[];
  vision?: string;
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  engagement_summary?: WellbeingEngagementSummary;
  privacy_note?: string;
};

export type OrganizationalHealthEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  overall_score?: number;
  overall_status?: string;
  categories_measured?: number;
  pending_interventions?: number;
  implementation_blueprint_phase61?: ImplementationBlueprintMeta;
  implementation_blueprint_phase96?: ImplementationBlueprintMeta;
  mission?: string;
  abos_principle?: string;
  engagement_summary?: HealthEngagementSummary;
  wellbeing_engagement_summary?: WellbeingEngagementSummary;
  blueprint_note?: string;
  health_note?: string;
  employee_experience_wellbeing_mission?: string;
  employee_experience_wellbeing_abos_principle?: string;
  employee_experience_wellbeing_note?: string;
  employee_experience_wellbeing_vision_note?: string;
  [key: string]: unknown;
};

export type OrganizationalHealthEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  scores?: OrganizationalHealthScore[];
  interventions?: OrganizationalHealthIntervention[];
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  implementation_blueprint_phase61?: ImplementationBlueprintMeta;
  organizational_health_note?: string;
  blueprint_distinction_note?: string;
  blueprint_mission?: string;
  blueprint_philosophy?: string;
  blueprint_abos_principle?: string;
  vision?: string;
  blueprint_objectives?: BlueprintObjective[];
  health_domains?: HealthDomain[];
  health_observations?: HealthObservation[];
  workload_awareness?: WorkloadAwareness;
  recognition_connection?: RecognitionConnection;
  self_love_connection?: SelfLoveConnection;
  leadership_insights?: LeadershipInsights;
  trust_connection?: TrustConnection;
  privacy_principles?: PrivacyPrinciples;
  dogfooding?: DogfoodingBlueprint;
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: HealthEngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  privacy_note?: string;
  implementation_blueprint_phase96?: ImplementationBlueprintMeta;
  employee_experience_wellbeing_engine_note?: string;
  employee_experience_wellbeing_blueprint?: EmployeeExperienceWellbeingBlueprint;
  employee_experience_wellbeing_distinction_note?: string;
  employee_experience_wellbeing_mission?: string;
  employee_experience_wellbeing_philosophy?: string;
  employee_experience_wellbeing_abos_principle?: string;
  employee_experience_wellbeing_objectives?: BlueprintObjective[];
  employee_experience_questions?: EmployeeExperienceQuestions;
  wellbeing_observations?: HealthObservation[];
  wellbeing_recognition_practices?: RecognitionPractices;
  companion_check_ins?: CompanionCheckIns;
  wellbeing_self_love_connection?: SelfLoveWellbeingConnection;
  wellbeing_leadership_connection?: LeadershipConnection;
  employee_journey_connection?: EmployeeJourneyConnection;
  wellbeing_trust_connection?: WellbeingTrustConnection;
  wellbeing_privacy_principles?: PrivacyPrinciples;
  wellbeing_dogfooding?: DogfoodingBlueprint;
  wellbeing_integration_links?: IntegrationLink[];
  wellbeing_engagement_summary?: WellbeingEngagementSummary;
  wellbeing_success_criteria?: AbosSuccessCriterion[];
  employee_experience_wellbeing_vision?: string;
  employee_experience_wellbeing_vision_phrases?: string[];
  employee_experience_wellbeing_privacy_note?: string;
  [key: string]: unknown;
};

export type OrganizationalHealthReportExport = {
  has_organization?: boolean;
  exported_at?: string;
  report_type?: string;
  scores?: OrganizationalHealthScore[];
  interventions?: OrganizationalHealthIntervention[];
  summary?: Record<string, unknown>;
  [key: string]: unknown;
};
