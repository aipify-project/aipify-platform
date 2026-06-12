export type PartnerRecord = {
  id?: string;
  partner_name?: string;
  partner_type?: string;
  status?: string;
  certification_level?: string;
  certification_level_label?: string;
  website?: string;
  quality_score?: number;
  review_notes?: string;
  [key: string]: unknown;
};

export type MarketplaceOfferingRecord = {
  offering?: Record<string, unknown>;
  partner_name?: string;
  partner_certification?: string;
  partner_certification_label?: string;
  [key: string]: unknown;
};

export type PartnerTierBlueprint = {
  tier_key?: string;
  display_name?: string;
  certification_level?: string;
  focus?: string;
  requirements?: string[];
  benefits?: string[];
  [key: string]: unknown;
};

export type PartnerPortalTerminology = {
  principle?: string;
  preferred_terms?: Array<{ key?: string; label?: string; replaces?: string }>;
  avoid_terms?: string[];
  partners_route?: string;
};

export type CompensationPrinciple = {
  principle?: string;
  tiers?: Array<{ tier?: string; label?: string; model?: string }>;
  governance?: string;
  boundary?: string;
};

export type CertificationConnection = {
  principle?: string;
  pathways?: Array<{ key?: string; label?: string; description?: string; tier?: string; status?: string }>;
  certification_route?: string;
  training_route?: string;
  partners_route?: string;
};

export type PartnerEngagementSummary = {
  sales_representative_partners?: number;
  sales_expert_partners?: number;
  certified_partners?: number;
  expert_partners?: number;
  approved_partners_total?: number;
  pending_reviews?: number;
  suspended_partners?: number;
  published_offerings?: number;
  org_partner_submissions?: number;
  tier_summary?: string;
  privacy_note?: string;
};

export type MarketObservationExample = {
  emoji?: string;
  key?: string;
  example?: string;
};

export type MarketObservationsBlueprint = {
  principle?: string;
  companion_examples?: MarketObservationExample[];
  tone?: string;
  boundary?: string;
};

export type IndustrySignalCategory = {
  key?: string;
  label?: string;
  description?: string;
};

export type IndustryIntelligenceBlueprint = {
  principle?: string;
  signal_categories?: IndustrySignalCategory[];
  industries?: Array<{ key?: string; label?: string; emerging_needs?: string[] }>;
  industry_intelligence_route?: string;
  industry_solutions_phase?: number;
};

export type RegionalInsightRegion = {
  key?: string;
  label?: string;
  trends?: string[];
  partner_activity?: string;
  localization_opportunities?: string[];
};

export type RegionalInsightsBlueprint = {
  principle?: string;
  regions?: RegionalInsightRegion[];
  global_expansion_route?: string;
  global_expansion_phase?: number;
};

export type SalesExpertFeedbackLoops = {
  principle?: string;
  feedback_loops?: Array<{ key?: string; label?: string; description?: string }>;
  sales_expert_route?: string;
  sales_expert_phase?: string;
  intelligence_tab_phase?: number;
  boundary?: string;
};

export type PartnerEcosystemInsights = {
  principle?: string;
  dimensions?: Array<{ key?: string; label?: string; description?: string }>;
  partner_success_route?: string;
  partner_success_phase?: string;
  partner_network_phase?: number;
};

export type ExecutiveSupportType = {
  emoji?: string;
  key?: string;
  label?: string;
  description?: string;
};

export type ExecutiveSupportBlueprint = {
  principle?: string;
  support_types?: ExecutiveSupportType[];
  executive_route?: string;
  strategic_intelligence_route?: string;
  boundary?: string;
};

export type EcosystemGrowthSummary = {
  partner_engagement?: PartnerEngagementSummary;
  activation?: EcosystemActivationSummary;
  sales_expert_signal_counts?: {
    open_opportunities?: number;
    active_customers?: number;
    scheduled_follow_ups?: number;
    total_signals?: number;
  };
  nordic_partner_indicators?: number;
  ecosystem_summary?: string;
  privacy_note?: string;
};

export type MarketIntelligenceTrustConnection = {
  principle?: string;
  organizations_should_understand?: string[];
  security_route?: string;
  trust_route?: string;
};

export type EcosystemObjective = {
  key?: string;
  label?: string;
  description?: string;
  route?: string;
  status?: string;
};

export type IndustryPack = {
  pack_key?: string;
  display_name?: string;
  description?: string;
  examples?: string[];
  route?: string;
  cross_link?: string;
  status?: string;
};

export type ConnectorMarketplaceEntry = {
  connector_key?: string;
  label?: string;
  category?: string;
  route?: string;
  integration_engine_phase?: string;
};

export type KnowledgePacksBlueprint = {
  principle?: string;
  pack_types?: Array<{ key?: string; label?: string; description?: string }>;
  route?: string;
  cross_link?: string;
  boundary?: string;
};

export type CompanionSkillsBlueprint = {
  status?: string;
  principle?: string;
  companions?: Array<{ key?: string; label?: string; domain?: string; route?: string; status?: string }>;
  identity_route?: string;
  cross_link?: string;
  boundary?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  route?: string;
  phase?: string;
  boundary?: string;
};

export type TrustConnection = {
  principle?: string;
  operators_should_know?: string[];
  organizations_should_understand?: string[];
  disable_routes?: Record<string, string>;
};

export type QualityGuardianConnection = {
  principle?: string;
  governance_patterns?: string[];
  route?: string;
  phase?: string;
  boundary?: string;
};

export type DogfoodingEntry = {
  slug?: string;
  role?: string;
  contributions?: string[];
  note?: string;
};

export type EcosystemActivationSummary = {
  active_integrations?: number;
  pending_integrations?: number;
  active_business_packs?: number;
  enabled_modules?: number;
  approved_partners?: number;
  published_offerings?: number;
  org_partner_submissions?: number;
  activation_summary?: string;
  privacy_note?: string;
};

export type AbosSuccessCriterion = {
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

export type PartnerObjective = {
  key?: string;
  label?: string;
  description?: string;
  status?: string;
};

export type PartnerTier = {
  tier_key?: string;
  display_name?: string;
  certification_level?: string;
  focus?: string;
  requirements?: string[];
  benefits?: string[];
};

export type PartnerCapability = {
  key?: string;
  label?: string;
  description?: string;
};

export type PartnerMarketplaceConnection = {
  principle?: string;
  discovery_steps?: string[];
  route?: string;
  partners_route?: string;
  boundary?: string;
};

export type PartnerTrustConnection = {
  principle?: string;
  organizations_should_understand?: string[];
  security_route?: string;
  trust_route?: string;
  boundary?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: number | string;
  title?: string;
  engine_phase?: string;
  doc?: string;
  mapping_note?: string;
};

export type MarketplacePartnerEcosystemFoundationEngineCard = {
  has_organization: boolean;
  approved_partners?: number;
  published_offerings?: number;
  pending_reviews?: number;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  implementation_blueprint?: ImplementationBlueprintMeta;
  ecosystem_activation_summary?: EcosystemActivationSummary;
  partner_mission?: string;
  partner_philosophy?: string;
  partner_abos_principle?: string;
  implementation_blueprint_phase33?: ImplementationBlueprintMeta;
  partner_engagement_summary?: PartnerEngagementSummary;
  implementation_blueprint_phase51?: ImplementationBlueprintMeta;
  market_intelligence_mission?: string;
  market_intelligence_philosophy?: string;
  ecosystem_growth_summary?: EcosystemGrowthSummary;
  [key: string]: unknown;
};

export type MarketplacePartnerEcosystemFoundationEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  approved_partners?: PartnerRecord[];
  pending_partners?: PartnerRecord[];
  offerings?: MarketplaceOfferingRecord[];
  certification_breakdown?: Record<string, unknown>;
  quality_indicators?: Record<string, unknown>;
  integration_notes?: Record<string, unknown>;
  recent_activity?: Array<Record<string, unknown>>;
  implementation_blueprint?: ImplementationBlueprintMeta;
  mission?: string;
  abos_principle?: string;
  ecosystem_objectives?: EcosystemObjective[];
  industry_packs?: IndustryPack[];
  connector_marketplace?: ConnectorMarketplaceEntry[];
  knowledge_packs?: KnowledgePacksBlueprint;
  companion_skills?: CompanionSkillsBlueprint;
  self_love_connection?: SelfLoveConnection;
  trust_connection?: TrustConnection;
  quality_guardian_connection?: QualityGuardianConnection;
  dogfooding?: {
    principle?: string;
    aipify_group?: DogfoodingEntry;
    unonight?: DogfoodingEntry;
  };
  integration_links?: IntegrationLink[];
  ecosystem_activation_summary?: EcosystemActivationSummary;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  partner_mission?: string;
  partner_philosophy?: string;
  partner_abos_principle?: string;
  partner_vision?: string;
  implementation_blueprint_phase33?: ImplementationBlueprintMeta;
  partner_objectives?: PartnerObjective[];
  partner_tiers?: PartnerTier[];
  partner_capabilities?: PartnerCapability[];
  partner_marketplace_connection?: PartnerMarketplaceConnection;
  partner_portal_terminology?: PartnerPortalTerminology;
  compensation_principle?: CompensationPrinciple;
  partner_self_love_connection?: SelfLoveConnection;
  partner_trust_connection?: PartnerTrustConnection;
  certification_connection?: CertificationConnection;
  partner_dogfooding?: {
    principle?: string;
    aipify_group?: DogfoodingEntry;
    unonight?: DogfoodingEntry;
  };
  penbp_integration_links?: IntegrationLink[];
  partner_engagement_summary?: PartnerEngagementSummary;
  blueprint_success_criteria?: AbosSuccessCriterion[];
  partner_vision_phrases?: string[];
  blueprint_distinction_note?: string;
  certification_breakdown_labels?: Record<string, string>;
  sales_expert_os_link?: {
    label?: string;
    route?: string;
    engine_phase?: string;
    doc?: string;
    note?: string;
  };
  implementation_blueprint_phase51?: ImplementationBlueprintMeta;
  market_intelligence_mission?: string;
  market_intelligence_philosophy?: string;
  market_intelligence_abos_principle?: string;
  market_intelligence_objectives?: EcosystemObjective[];
  market_observations?: MarketObservationsBlueprint;
  industry_intelligence?: IndustryIntelligenceBlueprint;
  regional_insights?: RegionalInsightsBlueprint;
  sales_expert_feedback_loops?: SalesExpertFeedbackLoops;
  partner_ecosystem_insights?: PartnerEcosystemInsights;
  executive_support?: ExecutiveSupportBlueprint;
  market_intelligence_self_love_connection?: SelfLoveConnection;
  market_intelligence_trust_connection?: MarketIntelligenceTrustConnection;
  market_intelligence_dogfooding?: {
    principle?: string;
    aipify_group?: DogfoodingEntry;
    unonight?: DogfoodingEntry;
  };
  egmibp_integration_links?: IntegrationLink[];
  ecosystem_growth_summary?: EcosystemGrowthSummary;
  market_intelligence_success_criteria?: AbosSuccessCriterion[];
  market_intelligence_vision_phrases?: string[];
  market_intelligence_distinction_note?: string;
  [key: string]: unknown;
};
