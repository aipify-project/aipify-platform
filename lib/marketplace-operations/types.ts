export type MarketplaceOperationsTab =
  | "overview"
  | "business_packs"
  | "installed"
  | "recommended"
  | "connectors"
  | "licenses"
  | "domains"
  | "purchases"
  | "reports"
  | "companion";

export type BusinessPack = {
  pack_key: string;
  pack_name: string;
  description?: string;
  category?: string;
  industry_key?: string;
  version?: string;
  pricing_model?: string;
  starting_price_monthly?: number;
  trial_days?: number;
  dependencies?: unknown;
  status?: string;
  is_featured?: boolean;
  release_notes?: string;
  detail_href?: string;
  install_href?: string;
  dependency_check?: { satisfied?: boolean; missing?: unknown; required?: unknown };
};

export type InstalledPack = {
  pack_key: string;
  pack_name?: string;
  domain_id?: string;
  domain?: string;
  license_status?: string;
  status?: string;
  category?: string;
  version?: string;
  installed_at?: string;
};

export type PackUpdate = {
  id: string;
  pack_key: string;
  from_version?: string;
  to_version?: string;
  update_type?: string;
  release_notes?: string;
};

export type PackTrial = {
  id: string;
  pack_key: string;
  domain_id?: string;
  trial_days?: number;
  status?: string;
  expires_at?: string;
};

export type PackHealth = {
  pack_key: string;
  health_status?: string;
  active_users?: number;
  error_count?: number;
  license_compliant?: boolean;
  summary?: string;
  checked_at?: string;
};

export type MarketplaceOperationsCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  overview?: Record<string, string | number | undefined>;
  pack_statuses?: string[];
  categories?: string[];
  featured_packs?: BusinessPack[];
  business_packs?: BusinessPack[];
  installed_packs?: InstalledPack[];
  recommended_packs?: BusinessPack[];
  industry_packs?: BusinessPack[];
  available_upgrades?: PackUpdate[];
  connectors?: { connector_key?: string; connector_name?: string; category?: string }[];
  licenses?: Record<string, unknown>;
  domains?: { domain_id?: string; domain?: string; license_status?: string; pack_count?: number }[];
  purchases?: { pack_key?: string; event_type?: string; summary?: string; created_at?: string }[];
  trials?: PackTrial[];
  pack_health?: PackHealth[];
  reviews?: { id: string; pack_key: string; rating: number; review_text?: string; feedback_type?: string; created_at?: string }[];
  companion_advisor?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  platform_governance?: Record<string, unknown>;
  analytics?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  mobile_access?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; pack_key?: string; section?: string; created_at?: string }[];
  routes?: Record<string, string>;
  error?: string;
};
