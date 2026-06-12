export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type ImplementationBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  note?: string;
};

export type StrategicObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type InsightCategory = {
  key?: string;
  label?: string;
  description?: string;
  examples?: string[];
  source_modules?: string[];
};

export type CompanionCommunicationExample = {
  emoji?: string;
  key?: string;
  scenario?: string;
  example?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  strategic_patterns?: string[];
  practices?: string[];
  journey_phrase?: string;
  self_love_route?: string;
  naming_doc?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  leaders_should_know?: string[];
  organizations_should_understand?: string[];
  audit_note?: string;
};

export type DataSources = {
  principle?: string;
  modules?: Array<Record<string, unknown>>;
  privacy_note?: string;
};

export type StrategicInsight = {
  id?: string;
  category?: string;
  title?: string;
  summary?: string;
  impact_level?: string;
  confidence_score?: number;
  recommended_action?: string;
  status?: string;
  [key: string]: unknown;
};

export type BlueprintPrincipleBlock = {
  principle?: string;
  forbidden?: string[];
  required?: string[];
  boundary_note?: string;
};

export type BlueprintGuidanceBlock = {
  principle?: string;
  examples?: Array<Record<string, unknown>>;
  observations?: Array<Record<string, unknown>>;
  opportunities?: Array<Record<string, unknown>>;
  patterns?: Array<Record<string, unknown>>;
  briefing_types?: Array<Record<string, unknown>>;
  sources?: Array<Record<string, unknown>>;
  questions?: Array<Record<string, unknown>>;
  dimensions?: Array<Record<string, unknown>>;
  modes?: Array<Record<string, unknown>>;
  connections?: Array<Record<string, unknown>>;
  insights?: Array<Record<string, unknown>>;
};

export type StrategicIntelligenceEngagementSummary = {
  total_insights?: number;
  new_insights?: number;
  high_impact_insights?: number;
  completed_insights?: number;
  dismissed_insights?: number;
  active_categories?: number;
  strategic_observations?: number;
  opportunity_signals?: number;
  companion_examples?: number;
  adaptive_questions?: number;
  review_dimensions?: number;
  flexibility_modes?: number;
  learning_connections?: number;
  leadership_insight_types?: number;
  integration_links?: number;
  privacy_note?: string;
};

export type AdaptiveStrategicIntelligenceBlock = {
  implementation_blueprint_phase85?: ImplementationBlueprint;
  adaptive_strategic_intelligence_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: StrategicObjective[];
  adaptive_strategic_questions?: BlueprintGuidanceBlock;
  continuous_strategic_review?: BlueprintGuidanceBlock;
  companion_guidance?: BlueprintGuidanceBlock;
  learning_organization_connection?: BlueprintGuidanceBlock;
  strategic_flexibility?: BlueprintGuidanceBlock;
  self_love_connection?: SelfLoveConnection;
  leadership_insights?: BlueprintGuidanceBlock;
  trust_connection?: TrustConnection;
  limitation_principles?: BlueprintPrincipleBlock;
  dogfooding?: Record<string, unknown>;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  engagement_summary?: StrategicIntelligenceEngagementSummary;
  privacy_note?: string;
};

export type StrategicIntelligenceFoundationEngineCard = {
  has_organization: boolean;
  new_insights?: number;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  implementation_blueprint?: ImplementationBlueprint;
  strategic_intelligence_foundation_note?: string;
  implementation_blueprint_phase79?: ImplementationBlueprint;
  blueprint_mission?: string;
  blueprint_abos_principle?: string;
  engagement_summary?: StrategicIntelligenceEngagementSummary;
  blueprint_note?: string;
  understanding_note?: string;
  [key: string]: unknown;
};

export type StrategicIntelligenceFoundationEngineDashboard = {
  has_organization: boolean;
  implementation_blueprint?: ImplementationBlueprint;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  strategic_intelligence_foundation_note?: string;
  distinction_note?: string;
  strategic_objectives?: StrategicObjective[];
  insight_categories?: InsightCategory[];
  companion_communication_examples?: CompanionCommunicationExample[];
  self_love_connection?: SelfLoveConnection;
  self_love_note?: string;
  trust_connection?: TrustConnection;
  data_sources?: DataSources;
  dogfooding?: Record<string, unknown>;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  safety_note?: string;
  principles?: string[];
  summary?: {
    new_insights?: number;
    high_impact?: number;
    completed?: number;
  };
  insights?: StrategicInsight[];
  priorities?: StrategicInsight[];
  implementation_blueprint_phase79?: ImplementationBlueprint;
  strategic_intelligence_engine_note?: string;
  blueprint_distinction_note?: string;
  blueprint_mission?: string;
  blueprint_philosophy?: string;
  blueprint_abos_principle?: string;
  blueprint_objectives?: StrategicObjective[];
  intelligence_sources?: BlueprintGuidanceBlock;
  strategic_observations?: BlueprintGuidanceBlock;
  pattern_recognition?: BlueprintGuidanceBlock;
  opportunity_identification?: BlueprintGuidanceBlock;
  leadership_intelligence_briefings?: BlueprintGuidanceBlock;
  companion_guidance?: BlueprintGuidanceBlock;
  blueprint_self_love_connection?: SelfLoveConnection;
  blueprint_trust_connection?: TrustConnection;
  limitation_principles?: BlueprintPrincipleBlock;
  blueprint_dogfooding?: Record<string, unknown>;
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: StrategicIntelligenceEngagementSummary;
  blueprint_success_criteria?: AbosSuccessCriterion[];
  blueprint_vision_phrases?: string[];
  blueprint_privacy_note?: string;
  adaptive_strategic_intelligence?: AdaptiveStrategicIntelligenceBlock;
  [key: string]: unknown;
};
