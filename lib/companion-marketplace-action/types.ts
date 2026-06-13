import type { MARKETPLACE_CATEGORIES } from "./constants";

export type MarketplaceCategory = (typeof MARKETPLACE_CATEGORIES)[number];

export type MarketplaceInstalledState = {
  status: string;
  governance_level: number;
  approval_completed: boolean;
  installed_at: string | null;
} | null;

export type MarketplaceActionCapability = {
  capability_key: string;
  skill_name: string;
  provider_name: string;
  category: MarketplaceCategory | string;
  description: string;
  required_package: string;
  governance_level: number;
  rating: number | null;
  pricing_model: string | null;
  package_allowed: boolean | null;
  permissions_required: unknown;
  installed: MarketplaceInstalledState;
  is_active: boolean;
};

export type MarketplaceRecommendation = {
  capability_key: string;
  skill_name?: string;
  message: string;
  status: string;
  based_on_observed_value?: boolean;
  package_allowed?: boolean;
};

export type MarketplaceGovernanceWarning = {
  capability_key: string;
  message: string;
  severity?: string;
};

export type MarketplaceCatalogByCategory = Record<MarketplaceCategory, MarketplaceActionCapability[]>;

export type MarketplaceActionEcosystemCenter = {
  catalog_by_category: MarketplaceCatalogByCategory;
  installed: MarketplaceActionCapability[];
  recommended: MarketplaceRecommendation[];
  recently_updated: MarketplaceActionCapability[];
  governance_warnings: MarketplaceGovernanceWarning[];
  usage_insights: Record<string, unknown> | null;
  installation_flow: Array<{ step: string; description: string }> | null;
  blueprint: Record<string, unknown> | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_activate: boolean;
  privacy_note: string | null;
};
