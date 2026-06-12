export type LegacyDimensionInfo = {
  key?: string;
  label?: string;
  bullets?: string[] | unknown[];
  [key: string]: unknown;
};

export type LegacyStorytellingExample = {
  key?: string;
  label?: string;
  example?: string;
  [key: string]: unknown;
};

export type LegacyMilestoneExample = {
  key?: string;
  bell_text?: string;
  [key: string]: unknown;
};

export type LegacyStory = {
  id?: string;
  dimension?: string;
  title?: string;
  summary?: string;
  timeline_ref?: string | null;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type LegacyMilestone = {
  id?: string;
  milestone_key?: string;
  summary?: string;
  achieved_at?: string;
  celebrated?: boolean;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type LegacyEngineSettings = {
  organization_id?: string;
  enabled?: boolean;
  celebrate_milestones?: boolean;
  preserve_stories?: boolean;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type StewardshipQuestion = {
  emoji?: string;
  key?: string;
  question?: string;
  description?: string;
};

export type CompanionGuidanceExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
  label?: string;
  description?: string;
};

export type BlueprintGuidanceBlock = {
  principle?: string;
  questions?: StewardshipQuestion[];
  examples?: CompanionGuidanceExample[];
  dimensions?: BlueprintObjective[];
  insight_types?: CompanionGuidanceExample[];
  reflection_note?: string;
  growth_note?: string;
  awareness_note?: string;
  dialogue_note?: string;
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

export type StewardshipEngagementSummary = {
  story_count?: number;
  milestone_count?: number;
  uncelebrated_milestones?: number;
  stories_by_dimension?: Record<string, number>;
  stewardship_questions?: number;
  sustainable_growth_dimensions?: number;
  legacy_awareness_dimensions?: number;
  companion_examples?: number;
  privacy_note?: string;
};

export type BlueprintSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type LegacyEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  story_count?: number;
  milestone_count?: number;
  uncelebrated_milestones?: number;
  enabled?: boolean;
  implementation_blueprint_phase83?: ImplementationBlueprintMeta;
  blueprint_mission?: string;
  blueprint_abos_principle?: string;
  engagement_summary?: StewardshipEngagementSummary;
  blueprint_note?: string;
  stewardship_note?: string;
  [key: string]: unknown;
};

export type LegacyEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  legacy_dimensions?: LegacyDimensionInfo[];
  storytelling_examples?: LegacyStorytellingExample[];
  milestone_examples?: LegacyMilestoneExample[];
  self_love_note?: string;
  trust_note?: string;
  settings?: LegacyEngineSettings;
  recent_stories?: LegacyStory[];
  recent_milestones?: LegacyMilestone[];
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  implementation_blueprint_phase83?: ImplementationBlueprintMeta;
  long_term_stewardship_note?: string;
  blueprint_distinction_note?: string;
  blueprint_mission?: string;
  blueprint_philosophy?: string;
  blueprint_abos_principle?: string;
  blueprint_objectives?: BlueprintObjective[];
  stewardship_questions?: BlueprintGuidanceBlock;
  sustainable_growth?: BlueprintGuidanceBlock;
  legacy_awareness?: BlueprintGuidanceBlock;
  companion_guidance?: BlueprintGuidanceBlock;
  blueprint_self_love_connection?: SelfLoveConnection;
  leadership_insights?: BlueprintGuidanceBlock;
  blueprint_trust_connection?: TrustConnection;
  blueprint_dogfooding?: DogfoodingBlueprint;
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: StewardshipEngagementSummary;
  blueprint_success_criteria?: BlueprintSuccessCriterion[];
  blueprint_vision_phrases?: string[];
  blueprint_privacy_note?: string;
  [key: string]: unknown;
};

export type LegacyEngineExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  legacy_dimensions?: LegacyDimensionInfo[];
  storytelling_examples?: LegacyStorytellingExample[];
  milestone_examples?: LegacyMilestoneExample[];
  trust_note?: string;
  self_love_note?: string;
  settings?: LegacyEngineSettings;
  recent_stories?: LegacyStory[];
  recent_milestones?: LegacyMilestone[];
  summary?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
