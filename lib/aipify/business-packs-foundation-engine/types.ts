export type BusinessPackRecord = {
  id?: string;
  pack_key: string;
  pack_name: string;
  industry?: string;
  description?: string;
  status?: string;
  version?: string;
  is_future?: boolean;
  components?: Record<string, unknown>;
  [key: string]: unknown;
};

export type ProductizationPack = {
  blueprint_key?: string;
  display_name?: string;
  target_audience?: string;
  outcome_summary?: string;
  examples?: string[];
  mapped_pack_key?: string;
  mapping_note?: string;
  is_reserved?: boolean;
  module_routes?: string[];
};

export type ModularAddon = {
  addon_key?: string;
  label?: string;
  outcome?: string;
  route?: string;
  source?: string;
};

export type TrustConnection = {
  principle?: string;
  qualities?: string[];
  review_route?: string;
  commercial_packages_note?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  route?: string;
  phase?: string;
  boundary?: string;
};

export type WebsitePresentationPrinciples = {
  principle?: string;
  outcomes?: string[];
  avoid?: string[];
  positioning_doc?: string;
  kc_article_slug?: string;
  plain_language?: string;
};

export type DogfoodingEntry = {
  slug?: string;
  role?: string;
  packs?: string[];
  note?: string;
  integrations?: string[];
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
  kc_slug?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: number;
  title?: string;
  engine_phase?: string;
  doc?: string;
};

export type CommercialPackagesDistinction = {
  productization_layer?: string;
  subscription_layer?: string;
  billing_route?: string;
  modules_route?: string;
};

export type BusinessPacksFoundationEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_packs?: number;
  available_packs?: number;
  mission?: string;
  abos_principle?: string;
  implementation_blueprint?: ImplementationBlueprintMeta;
  productization_pack_count?: number;
  example_industry_pack_count?: number;
  ipsbp111_distinction_note?: string;
  ipsbp111_vision?: string;
  [key: string]: unknown;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  emoji?: string;
  description?: string;
};

export type ExampleIndustryPack = {
  pack_key?: string;
  display_name?: string;
  mapped_catalog_pack_key?: string;
  mapping_note?: string;
  is_future?: boolean;
  included_capabilities?: string[];
  module_routes?: string[];
};

export type CompanionAdaptationExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type InstallFlowStep = {
  step?: number;
  key?: string;
  label?: string;
  description?: string;
  route?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
  relevance_note?: string;
};

export type IndustryPacksBusinessSpecializationBlueprint = {
  phase?: number;
  title?: string;
  engine_phase?: string;
  doc?: string;
  route?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: BlueprintObjective[];
  business_pack_concept?: Record<string, unknown>;
  example_industry_packs?: ExampleIndustryPack[];
  companion_adaptation?: {
    principle?: string;
    examples?: CompanionAdaptationExample[];
    identity_route?: string;
    boundary_note?: string;
  };
  knowledge_center_connection?: Record<string, unknown>;
  growth_partner_connection?: Record<string, unknown>;
  installation_engine_connection?: {
    principle?: string;
    steps?: InstallFlowStep[];
    install_route?: string;
    sync_note?: string;
  };
  self_love_connection?: {
    principle?: string;
    quotes?: string[];
    route?: string;
    boundary_note?: string;
  };
  leadership_connection?: Record<string, unknown>;
  trust_connection?: TrustConnection;
  limitation_principles?: LimitationPrinciples;
  dogfooding?: Record<string, unknown>;
  success_criteria?: AbosSuccessCriterion[];
  vision?: string;
  integration_links?: IntegrationLink[];
  privacy_note?: string;
};

export type BusinessPacksFoundationEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  active_packs?: Array<{ activation?: Record<string, unknown>; pack?: BusinessPackRecord; customization_status?: string }>;
  available_packs?: BusinessPackRecord[];
  recommended_packs?: BusinessPackRecord[];
  future_packs?: Array<Record<string, unknown>>;
  recent_activation_logs?: Array<Record<string, unknown>>;
  integration_notes?: Record<string, string>;
  implementation_blueprint?: ImplementationBlueprintMeta;
  mission?: string;
  abos_principle?: string;
  packaging_principles?: string[];
  productization_packs?: ProductizationPack[];
  modular_addons?: ModularAddon[];
  self_love_connection?: SelfLoveConnection;
  trust_connection?: TrustConnection;
  website_presentation_principles?: WebsitePresentationPrinciples;
  dogfooding?: {
    principle?: string;
    aipify_group?: DogfoodingEntry;
    unonight?: DogfoodingEntry;
    commerce_pilots?: DogfoodingEntry;
  };
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  commercial_packages_distinction?: CommercialPackagesDistinction;
  ipsbp111_distinction_note?: string;
  industry_packs_business_specialization_blueprint?: IndustryPacksBusinessSpecializationBlueprint;
  [key: string]: unknown;
};

export type BusinessPackReview = {
  pack?: BusinessPackRecord;
  review?: Record<string, unknown>;
  already_active?: boolean;
  industry_blueprint_note?: string;
  [key: string]: unknown;
};
