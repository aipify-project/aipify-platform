export type StrategicObjective = {
  id?: string;
  objective_name?: string;
  description?: string;
  owner_user_id?: string;
  priority?: string;
  status?: string;
  target_date?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type StrategicObjectiveLink = {
  id?: string;
  objective_id?: string;
  link_type?: string;
  linked_entity_id?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type StrategicReview = {
  id?: string;
  objective_id?: string;
  review_date?: string;
  findings?: string;
  participants_metadata?: Record<string, unknown>;
  org_memory_hook_metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type StrategicAlignmentSnapshot = {
  id?: string;
  misaligned_initiatives?: unknown[];
  progress_metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type AlignmentQuestion = {
  emoji?: string;
  key?: string;
  question?: string;
  description?: string;
};

export type AlignmentQuestions = {
  principle?: string;
  questions?: AlignmentQuestion[];
};

export type CascadingLevel = {
  key?: string;
  label?: string;
  description?: string;
};

export type StrategicCascading = {
  principle?: string;
  levels?: CascadingLevel[];
  okr_cross_link?: string;
  purpose_cross_link?: string;
};

export type CrossFunctionalVisibility = {
  principle?: string;
  dimensions?: BlueprintObjective[];
  metadata_note?: string;
};

export type CompanionGuidanceExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type CompanionGuidance = {
  principle?: string;
  examples?: CompanionGuidanceExample[];
};

export type GoalCommunication = {
  principle?: string;
  elements?: BlueprintObjective[];
  consistency_note?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  self_love_route?: string;
  journey_phrase?: string;
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

export type OrganizationalAlignmentEngagementSummary = {
  total_objectives?: number;
  active_objectives?: number;
  linked_entities?: number;
  reviews_recorded?: number;
  latest_misaligned_count?: number;
  cascading_levels?: number;
  alignment_questions?: number;
  privacy_note?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type StrategicAlignmentEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_objectives?: number;
  misaligned_count?: number;
  implementation_blueprint_phase68?: ImplementationBlueprintMeta;
  mission?: string;
  abos_principle?: string;
  engagement_summary?: OrganizationalAlignmentEngagementSummary;
  blueprint_note?: string;
  alignment_note?: string;
  [key: string]: unknown;
};

export type StrategicAlignmentEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  objectives?: StrategicObjective[];
  links?: StrategicObjectiveLink[];
  reviews?: StrategicReview[];
  snapshots?: StrategicAlignmentSnapshot[];
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  implementation_blueprint_phase68?: ImplementationBlueprintMeta;
  organizational_alignment_note?: string;
  blueprint_distinction_note?: string;
  blueprint_mission?: string;
  blueprint_philosophy?: string;
  blueprint_abos_principle?: string;
  blueprint_objectives?: BlueprintObjective[];
  alignment_questions?: AlignmentQuestions;
  strategic_cascading?: StrategicCascading;
  cross_functional_visibility?: CrossFunctionalVisibility;
  companion_guidance?: CompanionGuidance;
  goal_communication?: GoalCommunication;
  self_love_connection?: SelfLoveConnection;
  leadership_insights?: LeadershipInsights;
  trust_connection?: TrustConnection;
  dogfooding?: DogfoodingBlueprint;
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: OrganizationalAlignmentEngagementSummary;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  privacy_note?: string;
  [key: string]: unknown;
};

export type StrategicAlignmentReportExport = {
  has_organization?: boolean;
  exported_at?: string;
  objective?: StrategicObjective;
  objectives?: StrategicObjective[];
  links?: StrategicObjectiveLink[];
  reviews?: StrategicReview[];
  snapshots?: StrategicAlignmentSnapshot[];
  summary?: Record<string, unknown>;
  [key: string]: unknown;
};
