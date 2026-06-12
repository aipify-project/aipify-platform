export type OnboardingStepItem = {
  step_key: string;
  step_index?: number;
  completed?: boolean;
  current?: boolean;
};

export type OnboardingChecklistItem = {
  checklist_key: string;
  title: string;
  completed?: boolean;
  completed_at?: string | null;
};

export type OnboardingRecommendations = {
  current_step?: string;
  step_index?: number;
  total_steps?: number;
  next_step_hint?: string;
  knowledge_articles?: Array<Record<string, unknown>>;
  suggested_checklist?: OnboardingChecklistItem[];
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type OnboardingJourneyStage = {
  key?: string;
  label?: string;
  order?: number;
  description?: string;
  a10_steps?: string[];
  objectives?: string[];
};

export type EarlySuccessMoment = {
  emoji?: string;
  key?: string;
  scenario?: string;
  example?: string;
  checklist_key?: string;
};

export type CustomerSuccessObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  self_love_route?: string;
  naming_doc?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  users_should_know?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
};

export type DogfoodingBlueprint = {
  principle?: string;
  aipify_group?: Record<string, unknown>;
  unonight?: Record<string, unknown>;
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  note?: string;
};

export type OnboardingEngagementSummary = {
  current_step?: string;
  step_index?: number;
  total_steps?: number;
  completion_percentage?: number;
  checklist_total?: number;
  checklist_completed?: number;
  checklist_remaining?: number;
  onboarding_completed?: boolean;
  days_since_start?: number;
  started_at?: string;
  completed_at?: string | null;
  privacy_note?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type CustomerOnboardingEngineCard = {
  has_organization: boolean;
  current_step?: string;
  completion_percentage?: number;
  completed?: boolean;
  checklist_remaining?: number;
  philosophy?: string;
  implementation_blueprint?: ImplementationBlueprintMeta;
  mission?: string;
  abos_principle?: string;
  engagement_summary?: OnboardingEngagementSummary;
  blueprint_note?: string;
};

export type CustomerOnboardingEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  current_step?: string;
  step_index?: number;
  total_steps?: number;
  steps: OnboardingStepItem[];
  completion_percentage?: number;
  completed_at?: string | null;
  checklist: OnboardingChecklistItem[];
  checklist_completed?: number;
  checklist_total?: number;
  recommendations?: OnboardingRecommendations;
  implementation_blueprint?: ImplementationBlueprintMeta;
  onboarding_success_note?: string;
  blueprint_philosophy?: string;
  blueprint_mission?: string;
  blueprint_abos_principle?: string;
  vision?: string;
  blueprint_distinction_note?: string;
  onboarding_journey?: OnboardingJourneyStage[];
  early_success_moments?: EarlySuccessMoment[];
  customer_success_objectives?: CustomerSuccessObjective[];
  self_love_connection?: SelfLoveConnection;
  trust_connection?: TrustConnection;
  dogfooding?: DogfoodingBlueprint;
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: OnboardingEngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  privacy_note?: string;
};
