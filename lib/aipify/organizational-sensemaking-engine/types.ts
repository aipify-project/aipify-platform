export type BlueprintObjective = {
  key?: string;
  label?: string;
  emoji?: string;
  description?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  phase?: number;
  key?: string;
  label?: string;
  route?: string;
  note?: string;
  relationship?: string;
  description?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type SensemakingSignal = {
  id: string;
  signal_key?: string;
  signal_type?: string;
  title?: string;
  theme_summary?: string;
  signal_strength?: string;
  status?: string;
  captured_at?: string;
};

export type KnowledgeSynthesis = {
  id: string;
  synthesis_key?: string;
  synthesis_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  cross_link_route?: string | null;
  created_at?: string;
};

export type ExecutiveSensemakingReview = {
  id: string;
  review_key?: string;
  review_type?: string;
  title?: string;
  reflection_summary?: string;
  status?: string;
  created_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
};

export type OrganizationalSensemakingEngagementSummary = {
  sensemaking_score?: number;
  enabled?: boolean;
  sensemaking_mode?: string;
  signals_count?: number;
  active_signals_count?: number;
  syntheses_count?: number;
  reviews_count?: number;
  cross_links_count?: number;
  privacy_note?: string;
  not_surveillance?: boolean;
};

export type OrganizationalSensemakingBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  objectives?: BlueprintObjective[];
  sensemaking_center?: Record<string, unknown>;
  collective_intelligence_engine?: Record<string, unknown>;
  organizational_signal_engine?: Record<string, unknown>;
  executive_sensemaking_reviews?: Record<string, unknown>;
  sensemaking_companion?: Record<string, unknown>;
  diverse_perspective_framework?: Record<string, unknown>;
  knowledge_synthesis_engine?: Record<string, unknown>;
  organizational_awareness_engine?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: OrganizationalSensemakingEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type OrganizationalSensemakingCard = {
  has_customer: boolean;
  sensemaking_score?: number;
  enabled?: boolean;
  sensemaking_mode?: string;
  signals_count?: number;
  philosophy?: string;
  theme_detection_enabled?: boolean;
  synthesis_enabled?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  organizational_sensemaking_mission?: string;
  organizational_sensemaking_abos_principle?: string;
  organizational_sensemaking_engagement_summary?: OrganizationalSensemakingEngagementSummary;
  organizational_sensemaking_note?: string;
  organizational_sensemaking_vision_note?: string;
};

export type OrganizationalSensemakingDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  sensemaking_mode?: string;
  theme_detection_enabled?: boolean;
  synthesis_enabled?: boolean;
  reflection_enabled?: boolean;
  cross_department_visibility?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  sensemaking_score?: number;
  signals_count?: number;
  active_signals_count?: number;
  syntheses_count?: number;
  reviews_count?: number;
  signals: SensemakingSignal[];
  syntheses: KnowledgeSynthesis[];
  reviews: ExecutiveSensemakingReview[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  organizational_sensemaking_blueprint?: OrganizationalSensemakingBlueprint;
  organizational_sensemaking_mission?: string;
  organizational_sensemaking_philosophy?: string;
  organizational_sensemaking_abos_principle?: string;
  organizational_sensemaking_objectives?: BlueprintObjective[];
  sensemaking_center_meta?: Record<string, unknown>;
  collective_intelligence_engine_meta?: Record<string, unknown>;
  organizational_signal_engine_meta?: Record<string, unknown>;
  executive_sensemaking_reviews_meta?: Record<string, unknown>;
  sensemaking_companion_meta?: Record<string, unknown>;
  diverse_perspective_framework_meta?: Record<string, unknown>;
  knowledge_synthesis_engine_meta?: Record<string, unknown>;
  organizational_awareness_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  ocsmebp158_integration_links?: IntegrationLink[];
  organizational_sensemaking_engagement_summary?: OrganizationalSensemakingEngagementSummary;
  organizational_sensemaking_success_criteria?: AbosSuccessCriterion[];
  organizational_sensemaking_vision?: string;
  organizational_sensemaking_vision_phrases?: string[];
  organizational_sensemaking_privacy_note?: string;
  organizational_sensemaking_dogfooding?: string;
  organizational_sensemaking_engine_note?: string;
  organizational_sensemaking_distinction_note?: string;
};
