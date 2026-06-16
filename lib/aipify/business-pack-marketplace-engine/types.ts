export type MarketplacePackListing = {
  pack_key: string;
  pack_name: string;
  pack_logo_url?: string | null;
  category: string;
  version: string;
  status: string;
  status_badge: string;
  short_description: string;
  starting_price: string;
  starting_price_monthly?: number | null;
  trial_available: boolean;
  install_available: boolean;
  card_status: string;
  installed: boolean;
  upgrade_required: boolean;
  trial_days_left?: number | null;
  supported_languages?: string[];
  landing_route: string;
  install_route: string;
  license_route: string;
  knowledge_route: string;
  workspace_route?: string | null;
};

export type MarketplaceHomeSection = {
  key: string;
  label: string;
};

export type ContinueSetupItem = {
  pack_key: string;
  workflow_step: string;
  install_route: string;
  card?: MarketplacePackListing;
};

export type BusinessPackMarketplaceHome = {
  found: boolean;
  principle?: string;
  commercial_principles?: string[];
  locale?: string;
  categories?: string[];
  installation_flow?: string[];
  home_sections?: MarketplaceHomeSection[];
  sections?: {
    recommended_for_you?: MarketplacePackListing[];
    installed?: MarketplacePackListing[];
    popular?: MarketplacePackListing[];
    recently_added?: MarketplacePackListing[];
    continue_setup?: ContinueSetupItem[];
    upgrade_opportunities?: MarketplacePackListing[];
  };
  all_listings?: MarketplacePackListing[];
  governance_note?: string;
  marketplace_route?: string;
};

export type BusinessPackMarketplaceInstall = {
  found: boolean;
  pack_key?: string;
  listing?: MarketplacePackListing;
  workflow_step?: string;
  steps_completed?: string[];
  installation_flow?: string[];
  step_routes?: Record<string, string>;
  activation_blocked_pending_legal?: boolean;
  commercial_principles?: string[];
};

export type BusinessPackMarketplaceEngineDashboard = {
  has_access: boolean;
  is_platform_admin?: boolean;
  principle?: string;
  commercial_principles?: string[];
  categories?: string[];
  installation_flow?: string[];
  governance?: Record<string, string>;
  forbidden?: string[];
  summary?: Record<string, number>;
  listings?: Array<Record<string, unknown>>;
  top_viewed?: Array<Record<string, unknown>>;
  recent_audit?: Array<Record<string, unknown>>;
  success_criteria?: string[];
};
