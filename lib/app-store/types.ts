export type AppStorePackListing = {
  pack_key: string;
  pack_name: string;
  pack_logo_url: string | null;
  category: string;
  version: string;
  status: string;
  short_description: string;
  starting_price: string;
  starting_price_monthly: number | null;
  trial_available: boolean;
  install_available: boolean;
  card_status: string;
  installed: boolean;
  upgrade_required: boolean;
  trial_days_left: number | null;
  included_modules: { module_key: string; module_name: string; route_href?: string | null }[];
  license_requirements: string;
  detail_route: string;
  install_route: string;
  landing_route: string;
  workspace_route: string | null;
};

export type AppStoreHome = {
  found: boolean;
  principle?: string;
  locale?: string;
  categories?: string[];
  seat_tiers?: { tier_key: string; seat_count: number | null; label: string }[];
  installation_flow?: string[];
  sections?: {
    installed: AppStorePackListing[];
    marketplace: AppStorePackListing[];
    recommended: AppStorePackListing[];
    popular: AppStorePackListing[];
    recently_added: AppStorePackListing[];
    my_licenses: unknown[];
  };
  governance_note?: string;
  module_access_route?: string;
  licenses_route?: string;
};

export type AppStorePackDetail = {
  found: boolean;
  pack_key?: string;
  principle?: string;
  listing?: AppStorePackListing;
  overview?: Record<string, unknown>;
  modules_included?: { module_key: string; module_name: string; description?: string; route_href?: string | null }[];
  license_requirements?: string;
  benefits?: unknown[];
  who_is_it_for?: string;
  permissions_added?: { permission_key: string; permission_name: string; module_key: string }[];
  pricing?: {
    starting_price_monthly: number | null;
    pricing_label: string;
    seat_tiers: { tier_key: string; seat_count: number | null; label: string }[];
    current_tier?: string;
    current_seats?: number | null;
  };
  faq?: { question: string; answer: string }[];
  version_history?: { version: string; released_at?: string; notes?: string }[];
  supported_actions?: string[];
  module_access_route?: string;
};

export type CustomerLicenseDashboard = {
  found: boolean;
  principle?: string;
  current_plan?: { plan_key: string; status: string; renewal_date?: string | null };
  business_packs?: unknown[];
  user_licenses?: { tier_key: string; seat_count: number | null; label: string }[];
  consumption?: { active_pack_licenses: number; total_seats: number; employees: number };
  supported_actions?: string[];
  app_store_route?: string;
  module_access_route?: string;
};

export type PlatformAppStoreRevenue = {
  found: boolean;
  privacy_note?: string;
  principle?: string;
  summary?: Record<string, number>;
  most_installed_packs?: unknown[];
  revenue_per_pack?: unknown[];
  growth?: Record<string, number>;
};
