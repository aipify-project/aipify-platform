export type UniversalSearchTab =
  | "overview"
  | "search"
  | "discovery"
  | "saved_searches"
  | "filters"
  | "analytics"
  | "reports";

export type SearchResultItem = {
  id: string;
  entity_type: string;
  entity_id?: string;
  title: string;
  summary?: string;
  status: string;
  department_id?: string;
  domain_id?: string;
  business_pack_key?: string;
  record_href?: string;
  quick_actions?: unknown[];
  updated_at?: string;
};

export type SavedSearch = {
  id: string;
  name: string;
  query: string;
  search_mode: string;
  filters?: Record<string, unknown>;
};

export type UniversalSearchCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  overview?: Record<string, string | number | undefined>;
  categories?: string[];
  search_modes?: { key: string; label: string }[];
  filters?: Record<string, unknown>;
  saved_searches?: SavedSearch[];
  default_saved_searches?: SavedSearch[];
  analytics?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  companion_integration?: Record<string, unknown>;
  smart_recommendations?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; query?: string; created_at?: string }[];
  routes?: Record<string, string>;
  error?: string;
};

export type UniversalSearchQueryResult = {
  found: boolean;
  query?: string;
  mode?: string;
  natural_language?: Record<string, unknown>;
  results?: SearchResultItem[];
  total?: number;
  discovery?: { entity_type: string; title: string; record_href: string }[];
  suggestions?: string[];
  permission_note?: string;
  error?: string;
};
