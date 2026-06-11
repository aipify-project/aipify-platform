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

export type MarketplaceCard = {
  has_customer: boolean;
  catalog_count?: number;
  installed_count?: number;
  updates_available?: number;
  philosophy?: string;
  privacy_note?: string;
};

export type MarketplaceDashboard = {
  has_customer: boolean;
  catalog_count?: number;
  featured: MarketplaceItem[];
  installed: Array<{ install_id: string; status: string; installed_at?: string; item: MarketplaceItem }>;
  recommended: MarketplaceItem[];
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
