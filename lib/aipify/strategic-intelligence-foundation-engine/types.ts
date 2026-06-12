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

export type StrategicIntelligenceFoundationEngineCard = {
  has_organization: boolean;
  new_insights?: number;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  implementation_blueprint?: ImplementationBlueprint;
  strategic_intelligence_foundation_note?: string;
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
  [key: string]: unknown;
};
