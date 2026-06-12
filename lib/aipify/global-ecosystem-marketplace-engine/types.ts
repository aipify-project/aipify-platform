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

export type SolutionListing = {
  id: string;
  listing_key?: string;
  solution_key?: string;
  category?: string;
  title?: string;
  summary?: string;
  industry_tags?: string[];
  validation_status?: string;
  publisher_org_key?: string | null;
  submitted_at?: string;
};

export type SolutionValidation = {
  id: string;
  listing_id?: string;
  validation_key?: string;
  status?: string;
  documentation_quality_score?: number | null;
  governance_alignment_score?: number | null;
  security_checklist_score?: number | null;
  reviewed_at?: string | null;
};

export type SolutionContribution = {
  id: string;
  contribution_key?: string;
  contribution_type?: string;
  title?: string;
  summary?: string;
  industry_tag?: string | null;
  status?: string;
  submitted_at?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  must_avoid?: string[];
};

export type GlobalEcosystemMarketplaceEngagementSummary = {
  marketplace_score?: number;
  participation_status?: string;
  enabled?: boolean;
  listings_count?: number;
  approved_listings_count?: number;
  pending_listings_count?: number;
  validations_count?: number;
  contributions_count?: number;
  approved_contributions_count?: number;
  cross_links_count?: number;
  marketplace_categories_count?: number;
  industry_packs_count?: number;
  privacy_note?: string;
  opt_in_required?: boolean;
};

export type GlobalEcosystemMarketplaceBlueprint = {
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
  global_solution_marketplace_center?: Record<string, unknown>;
  marketplace_categories?: Record<string, unknown>;
  industry_solution_pack_engine?: Record<string, unknown>;
  growth_partner_marketplace_engine?: Record<string, unknown>;
  solution_validation_framework?: Record<string, unknown>;
  procurement_readiness_engine?: Record<string, unknown>;
  marketplace_companion?: Record<string, unknown>;
  solution_contribution_engine?: Record<string, unknown>;
  companion_limitations?: LimitationPrinciples;
  self_love_connection?: Record<string, unknown>;
  security_requirements?: Record<string, unknown>;
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: GlobalEcosystemMarketplaceEngagementSummary;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type GlobalEcosystemMarketplaceCard = {
  has_customer: boolean;
  marketplace_score?: number;
  participation_status?: string;
  enabled?: boolean;
  listings_count?: number;
  philosophy?: string;
  approval_required?: boolean;
  executive_approval_required?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  global_ecosystem_marketplace_mission?: string;
  global_ecosystem_marketplace_abos_principle?: string;
  global_ecosystem_marketplace_engagement_summary?: GlobalEcosystemMarketplaceEngagementSummary;
  global_ecosystem_marketplace_note?: string;
  global_ecosystem_marketplace_vision_note?: string;
};

export type GlobalEcosystemMarketplaceDashboard = {
  has_customer: boolean;
  enabled?: boolean;
  participation_status?: string;
  approval_required?: boolean;
  executive_approval_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  marketplace_score?: number;
  listings_count?: number;
  approved_listings_count?: number;
  pending_listings_count?: number;
  validations_count?: number;
  contributions_count?: number;
  approved_contributions_count?: number;
  listings: SolutionListing[];
  validations: SolutionValidation[];
  contributions: SolutionContribution[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ImplementationBlueprintMeta;
  global_ecosystem_marketplace_blueprint?: GlobalEcosystemMarketplaceBlueprint;
  global_ecosystem_marketplace_mission?: string;
  global_ecosystem_marketplace_philosophy?: string;
  global_ecosystem_marketplace_abos_principle?: string;
  global_ecosystem_marketplace_objectives?: BlueprintObjective[];
  global_solution_marketplace_center_meta?: Record<string, unknown>;
  marketplace_categories_meta?: Record<string, unknown>;
  industry_solution_pack_engine_meta?: Record<string, unknown>;
  growth_partner_marketplace_engine_meta?: Record<string, unknown>;
  solution_validation_framework_meta?: Record<string, unknown>;
  procurement_readiness_engine_meta?: Record<string, unknown>;
  marketplace_companion_meta?: Record<string, unknown>;
  solution_contribution_engine_meta?: Record<string, unknown>;
  companion_limitations_meta?: LimitationPrinciples;
  self_love_connection_meta?: Record<string, unknown>;
  security_requirements_meta?: Record<string, unknown>;
  gsembp148_integration_links?: IntegrationLink[];
  global_ecosystem_marketplace_engagement_summary?: GlobalEcosystemMarketplaceEngagementSummary;
  global_ecosystem_marketplace_success_criteria?: AbosSuccessCriterion[];
  global_ecosystem_marketplace_vision?: string;
  global_ecosystem_marketplace_vision_phrases?: string[];
  global_ecosystem_marketplace_privacy_note?: string;
  global_ecosystem_marketplace_dogfooding?: string;
  global_ecosystem_marketplace_engine_note?: string;
  global_ecosystem_marketplace_distinction_note?: string;
};
