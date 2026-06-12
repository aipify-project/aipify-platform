export type InnovationIdea = {
  id: string;
  idea_key: string;
  title: string;
  problem_statement: string;
  proposed_solution: string;
  expected_outcomes: string;
  target_audience: string;
  source: string;
  status: string;
  customer_value_score: number;
  strategic_alignment_score: number;
  feasibility_score: number;
  risk_level: string;
  estimated_effort: string;
};

export type InnovationExperiment = {
  id: string;
  experiment_key: string;
  title: string;
  description: string;
  experiment_type: string;
  status: string;
  stage: string;
  progress_pct: number;
  participant_count: number;
};

export type PilotProgram = {
  id: string;
  program_key: string;
  title: string;
  description: string;
  status: string;
  max_participants: number;
  current_participants: number;
  success_criteria: string;
};

export type InnovationFeatureFlag = {
  id: string;
  flag_key: string;
  title: string;
  description: string;
  status: string;
  target_segment: string;
  exposure_pct: number;
};

export type InnovationScorecard = {
  period_label?: string;
  experiment_completion_pct?: number;
  customer_satisfaction_impact?: number;
  adoption_potential_pct?: number;
  business_value_score?: number;
  return_on_innovation?: number;
};

export type LessonLearned = {
  id: string;
  title: string;
  summary: string;
  outcome_type: string;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type BlueprintCapability = {
  key?: string;
  label?: string;
  description?: string;
};

export type IdeaManagementDomain = {
  domain?: string;
  label?: string;
  examples?: string[];
};

export type IdeaManagementBlueprint = {
  principle?: string;
  capabilities?: BlueprintCapability[];
  example_domains?: IdeaManagementDomain[];
  route?: string;
};

export type ExperimentationPrinciples = {
  principle?: string;
  required_elements?: BlueprintCapability[];
  visibility_note?: string;
  boundary?: string;
};

export type CompanionInnovationExample = {
  emoji?: string;
  key?: string;
  scenario?: string;
  example?: string;
};

export type LearningCaptureBlueprint = {
  principle?: string;
  capture_fields?: BlueprintCapability[];
  organizational_memory_route?: string;
  cross_link_note?: string;
  failure_framing?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  self_love_route?: string;
  naming_doc?: string;
  boundary_note?: string;
};

export type RecognitionExperience = {
  emoji?: string;
  key?: string;
  label?: string;
  description?: string;
};

export type RecognitionExperiencesBlueprint = {
  principle?: string;
  experiences?: RecognitionExperience[];
  gratitude_route?: string;
  cross_link_note?: string;
};

export type TrustConnection = {
  principle?: string;
  users_should_know?: string[];
  operators_should_understand?: string[];
  governance_route?: string;
  audit_note?: string;
};

export type DogfoodingEntry = {
  slug?: string;
  role?: string;
  focus?: string[];
};

export type InnovationEngagementSummary = {
  ideas_total?: number;
  ideas_approved?: number;
  ideas_in_experiment?: number;
  experiments_total?: number;
  experiments_active?: number;
  experiments_completed?: number;
  pilots_total?: number;
  pilots_active?: number;
  feature_flags_controlled?: number;
  lessons_total?: number;
  lessons_learning_or_pivot?: number;
  sandbox_isolated?: boolean;
  privacy_note?: string;
};

export type BlueprintSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type ImplementationBlueprintPhase38 = {
  phase?: number;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type InnovationLabCard = {
  has_customer: boolean;
  innovation_score?: number;
  active_experiments?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint_phase38?: ImplementationBlueprintPhase38;
  innovation_lab_mission?: string;
  innovation_abos_principle?: string;
  innovation_engagement_summary?: InnovationEngagementSummary;
  blueprint_note?: string;
};

export type InnovationLabDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  lab_enabled?: boolean;
  sandbox_enabled?: boolean;
  customer_cocreation_enabled?: boolean;
  feature_flags_enabled?: boolean;
  executive_approval_required?: boolean;
  failure_learning_enabled?: boolean;
  innovation_score?: number;
  experiment_completion_pct?: number;
  active_experiments?: number;
  ideas_in_pipeline?: number;
  return_on_innovation?: number;
  lab_structure?: Array<{ area: string; label: string }>;
  experiment_stages?: string[];
  sandbox_capabilities?: string[];
  ideas: InnovationIdea[];
  experiments: InnovationExperiment[];
  pilot_programs: PilotProgram[];
  feature_flags: InnovationFeatureFlag[];
  scorecard?: InnovationScorecard;
  lessons_learned: LessonLearned[];
  governance_controls?: string[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
  implementation_blueprint_phase38?: ImplementationBlueprintPhase38;
  innovation_lab_mission?: string;
  innovation_lab_philosophy?: string;
  innovation_objectives?: BlueprintObjective[];
  idea_management?: IdeaManagementBlueprint;
  experimentation_principles?: ExperimentationPrinciples;
  companion_innovation_support?: CompanionInnovationExample[];
  learning_capture?: LearningCaptureBlueprint;
  innovation_self_love_connection?: SelfLoveConnection;
  innovation_recognition_experiences?: RecognitionExperiencesBlueprint;
  innovation_trust_connection?: TrustConnection;
  innovation_dogfooding?: {
    principle?: string;
    aipify_group?: DogfoodingEntry;
    unonight?: DogfoodingEntry;
  };
  innovation_success_criteria?: BlueprintSuccessCriterion[];
  innovation_vision_phrases?: string[];
  innovation_abos_principle?: string;
  innovation_distinction_note?: string;
  innovation_integration_links?: IntegrationLink[];
  innovation_engagement_summary?: InnovationEngagementSummary;
};

export type InnovationLabActionResult = {
  status?: string;
  error?: string;
};

export type InnovationLabBriefingResult = {
  briefing_id?: string;
  summary?: string;
  error?: string;
};
