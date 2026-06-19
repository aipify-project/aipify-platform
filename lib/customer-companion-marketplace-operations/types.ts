export type CompanionMarketplaceTab =
  | "overview"
  | "extensions"
  | "installed"
  | "updates"
  | "publishers"
  | "reviews"
  | "categories"
  | "reports"
  | "executive";

export type MarketplaceInstall = {
  install_key: string;
  extension_key: string;
  extension_name: string;
  publisher_name?: string;
  version?: string;
  install_status?: string;
  permissions_granted?: unknown[];
  installed_at?: string;
};

export type MarketplaceGovernance = {
  governance_key: string;
  governance_title: string;
  governance_type?: string;
  governance_status?: string;
  extension_key?: string;
  summary?: string;
};

export type CompanionMarketplaceCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  extensions?: Record<string, unknown>[];
  installed?: MarketplaceInstall[];
  updates?: Record<string, unknown>[];
  publishers?: Record<string, unknown>[];
  reviews?: Record<string, unknown>[];
  categories?: string[];
  governance?: MarketplaceGovernance[];
  reports?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  integrations?: Record<string, unknown>;
  audit_recent?: { event_type: string; audit_category?: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  notifications?: Record<string, unknown>;
  error?: string;
};

export type CompanionMarketplaceLabels = {
  title: string;
  subtitle: string;
  extensionsTitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<CompanionMarketplaceTab, string>;
  overview: Record<string, string>;
  actions: Record<string, string>;
  sections: Record<string, string>;
  extensionStatuses: Record<string, string>;
  certificationStatuses: Record<string, string>;
};
