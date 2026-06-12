export type DiscoveryCategoryInfo = {
  key?: string;
  label?: string;
  bullets?: string[] | unknown[];
  [key: string]: unknown;
};

export type DiscoveryQuestionExample = {
  key?: string;
  question?: string;
  [key: string]: unknown;
};

export type DiscoveryPrompt = {
  id?: string;
  category?: string;
  prompt?: string;
  context_summary?: string | null;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type DiscoverySignal = {
  id?: string;
  category?: string;
  summary?: string;
  confidence?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type CuriosityDiscoveryEngineSettings = {
  organization_id?: string;
  enabled?: boolean;
  encourage_experimentation?: boolean;
  prompt_cadence?: string;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type CompanionGuidanceExample = {
  emoji?: string;
  key?: string;
  label?: string;
  prompt?: string;
  question?: string;
  consideration?: string;
  signal?: string;
  description?: string;
};

export type CompanionGuidance = {
  principle?: string;
  examples?: CompanionGuidanceExample[];
};

export type OpportunitySources = {
  principle?: string;
  sources?: BlueprintObjective[];
  knowledge_center_route?: string;
  privacy_note?: string;
};

export type OpportunityQuestions = {
  principle?: string;
  questions?: CompanionGuidanceExample[];
  curiosity_note?: string;
};

export type OpportunityEvaluation = {
  principle?: string;
  criteria?: BlueprintObjective[];
  evaluation_note?: string;
};

export type InnovationConnection = {
  principle?: string;
  connections?: BlueprintObjective[];
  innovation_lab_route?: string;
  innovation_lab_note?: string;
  boundary_note?: string;
};

export type LeadershipInsights = {
  principle?: string;
  insight_types?: CompanionGuidanceExample[];
  clarity_note?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  journey_phrase?: string;
  self_love_route?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  leaders_should_know?: string[];
  organizations_should_understand?: string[];
  audit_note?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  forbidden?: string[];
  required?: string[];
  boundary_note?: string;
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

export type OpportunityExplorationEngagementSummary = {
  prompt_count?: number;
  pending_prompts?: number;
  explored_prompts?: number;
  dismissed_prompts?: number;
  signal_count?: number;
  prompt_categories?: number;
  opportunity_questions?: number;
  opportunity_sources?: number;
  companion_examples?: number;
  privacy_note?: string;
};

export type BlueprintSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type CuriosityDiscoveryEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  prompt_count?: number;
  pending_prompts?: number;
  signal_count?: number;
  enabled?: boolean;
  implementation_blueprint_phase80?: ImplementationBlueprintMeta;
  blueprint_mission?: string;
  blueprint_abos_principle?: string;
  engagement_summary?: OpportunityExplorationEngagementSummary;
  blueprint_note?: string;
  exploration_note?: string;
  [key: string]: unknown;
};

export type CuriosityDiscoveryEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  discovery_categories?: DiscoveryCategoryInfo[];
  question_examples?: DiscoveryQuestionExample[];
  self_love_note?: string;
  trust_note?: string;
  settings?: CuriosityDiscoveryEngineSettings;
  recent_prompts?: DiscoveryPrompt[];
  recent_signals?: DiscoverySignal[];
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  implementation_blueprint_phase80?: ImplementationBlueprintMeta;
  opportunity_exploration_note?: string;
  blueprint_distinction_note?: string;
  blueprint_mission?: string;
  blueprint_philosophy?: string;
  blueprint_abos_principle?: string;
  blueprint_objectives?: BlueprintObjective[];
  opportunity_sources?: OpportunitySources;
  opportunity_questions?: OpportunityQuestions;
  opportunity_evaluation?: OpportunityEvaluation;
  companion_guidance?: CompanionGuidance;
  innovation_connection?: InnovationConnection;
  blueprint_self_love_connection?: SelfLoveConnection;
  leadership_insights?: LeadershipInsights;
  blueprint_trust_connection?: TrustConnection;
  limitation_principles?: LimitationPrinciples;
  blueprint_dogfooding?: DogfoodingBlueprint;
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: OpportunityExplorationEngagementSummary;
  blueprint_success_criteria?: BlueprintSuccessCriterion[];
  blueprint_vision_phrases?: string[];
  blueprint_privacy_note?: string;
  [key: string]: unknown;
};

export type CuriosityDiscoveryEngineExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  discovery_categories?: DiscoveryCategoryInfo[];
  question_examples?: DiscoveryQuestionExample[];
  trust_note?: string;
  self_love_note?: string;
  settings?: CuriosityDiscoveryEngineSettings;
  recent_prompts?: DiscoveryPrompt[];
  recent_signals?: DiscoverySignal[];
  summary?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
