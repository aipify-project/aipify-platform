export const MARKETPLACE_ITEM_TYPES = [
  "skill",
  "business_pack",
  "industry_pack",
  "workflow_pack",
  "automation_pack",
  "knowledge_pack",
  "template_pack",
  "integration_pack",
  "playbook",
] as const;

export const MARKETPLACE_RISK_LEVELS = ["low", "medium", "high", "restricted"] as const;

export const INSTALL_STATUSES = [
  "pending_approval",
  "installed",
  "active",
  "disabled",
  "update_available",
  "failed",
  "uninstalled",
] as const;

export type MarketplaceItem = {
  id: string;
  item_key: string;
  slug: string;
  title: string;
  short_description?: string | null;
  long_description?: string | null;
  item_type: string;
  category: string;
  industry?: string | null;
  author_type: string;
  author_name?: string | null;
  risk_level: string;
  pricing_model: string;
  price?: number | null;
  currency: string;
  trial_available: boolean;
  deployment_support: string[];
  requires_agent: boolean;
  rating: number;
  install_count: number;
  installed?: boolean;
  install_id?: string | null;
};

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
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string | number;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type MarketplaceEngagementSummary = {
  catalog_count?: number;
  installed_count?: number;
  updates_available?: number;
  skill_categories?: number;
  install_flow_steps?: number;
  objectives_documented?: number;
  qa_dimensions?: number;
  integration_links?: number;
  companion_examples?: number;
  privacy_note?: string;
};

export type SkillCategoryExample = {
  skill_id?: string;
  label?: string;
  marketplace_item?: string | null;
  route?: string;
};

export type SkillCategory = {
  key?: string;
  label?: string;
  description?: string;
  example_skills?: SkillCategoryExample[];
  cross_link?: string;
};

export type InstallFlowStep = {
  order?: number;
  key?: string;
  label?: string;
  description?: string;
};

export type CompanionAdaptationExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type SkillsExtensionsMarketplaceBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: BlueprintObjective[];
  skills_marketplace_concept?: Record<string, unknown>;
  skill_categories?: { categories?: SkillCategory[]; principle?: string };
  extensions_marketplace?: Record<string, unknown>;
  companion_adaptation?: { examples?: CompanionAdaptationExample[]; principle?: string };
  skill_quality_assurance?: Record<string, unknown>;
  growth_partner_marketplace?: Record<string, unknown>;
  developer_ecosystem?: Record<string, unknown>;
  installation_experience?: { steps?: InstallFlowStep[]; principle?: string };
  self_love_connection?: { quotes?: string[]; principle?: string };
  leadership_connection?: Record<string, unknown>;
  trust_connection?: Record<string, unknown>;
  limitation_principles?: { must_avoid?: string[]; principle?: string };
  dogfooding?: Record<string, unknown>;
  success_criteria?: AbosSuccessCriterion[];
  vision?: string;
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  engagement_summary?: MarketplaceEngagementSummary;
  privacy_note?: string;
};

export type MarketplaceCard = {
  has_customer: boolean;
  catalog_count?: number;
  installed_count?: number;
  updates_available?: number;
  philosophy?: string;
  privacy_note?: string;
  implementation_blueprint_phase112?: ImplementationBlueprintMeta;
  marketplace_mission?: string;
  marketplace_abos_principle?: string;
  marketplace_engagement_summary?: MarketplaceEngagementSummary;
  marketplace_note?: string;
  marketplace_vision_note?: string;
};

export type MarketplaceDashboard = {
  has_customer: boolean;
  catalog_count?: number;
  featured: MarketplaceItem[];
  installed: Array<{ install_id: string; status: string; installed_at?: string; item: MarketplaceItem }>;
  recommended: MarketplaceItem[];
  implementation_blueprint_phase112?: ImplementationBlueprintMeta;
  marketplace_engine_note?: string;
  skills_extensions_marketplace_blueprint?: SkillsExtensionsMarketplaceBlueprint;
  marketplace_distinction_note?: string;
  marketplace_mission?: string;
  marketplace_philosophy?: string;
  marketplace_abos_principle?: string;
  marketplace_objectives?: BlueprintObjective[];
  skills_marketplace_concept?: Record<string, unknown>;
  skill_categories?: SkillsExtensionsMarketplaceBlueprint["skill_categories"];
  extensions_marketplace?: Record<string, unknown>;
  companion_adaptation?: SkillsExtensionsMarketplaceBlueprint["companion_adaptation"];
  skill_quality_assurance?: Record<string, unknown>;
  growth_partner_marketplace?: Record<string, unknown>;
  developer_ecosystem?: Record<string, unknown>;
  installation_experience?: SkillsExtensionsMarketplaceBlueprint["installation_experience"];
  marketplace_self_love_connection?: SkillsExtensionsMarketplaceBlueprint["self_love_connection"];
  marketplace_leadership_connection?: Record<string, unknown>;
  marketplace_trust_connection?: Record<string, unknown>;
  marketplace_limitation_principles?: SkillsExtensionsMarketplaceBlueprint["limitation_principles"];
  marketplace_dogfooding?: Record<string, unknown>;
  sembp112_integration_links?: IntegrationLink[];
  marketplace_engagement_summary?: MarketplaceEngagementSummary;
  marketplace_success_criteria?: AbosSuccessCriterion[];
  marketplace_vision?: string;
  marketplace_vision_phrases?: string[];
  marketplace_privacy_note?: string;
};

export type MarketplacePrecheck = {
  allowed: boolean;
  reason?: string;
  requires_approval?: boolean;
  risk_level?: string;
  required_permissions?: string[];
  included_skills?: string[];
  missing_skills?: unknown[];
  missing_modules?: unknown[];
  deployment_mode?: string;
};

export type MarketplaceItemDetail = {
  item: MarketplaceItem & Record<string, unknown>;
  versions: Record<string, unknown>[];
  reviews: Array<{ rating: number; review_text?: string; created_at?: string }>;
  precheck: MarketplacePrecheck;
};

export type MarketplaceInstall = {
  id: string;
  status: string;
  installed_at?: string | null;
  settings?: Record<string, unknown>;
  item: MarketplaceItem;
};

export type MarketplaceInstallResult = {
  status: string;
  install_id?: string;
  item_key?: string;
  precheck?: MarketplacePrecheck;
  skills_installed?: unknown[];
};
