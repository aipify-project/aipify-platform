export type IndustryPackRegistry = {
  id?: string;
  pack_key?: string;
  slug?: string;
  display_name?: string;
  industry_type?: string;
  pack_source?: string;
  lifecycle_status?: string;
  short_description?: string;
  inherits?: unknown[];
  dependencies?: unknown[];
  marketplace_item_id?: string | null;
  [key: string]: unknown;
};

export type IndustryPackInstall = {
  id?: string;
  registry_id?: string;
  install_status?: string;
  lifecycle_status?: string;
  install_mode?: string;
  health_score?: number;
  version_label?: string;
  installed_at?: string;
  updated_at?: string;
  pack?: IndustryPackRegistry;
  [key: string]: unknown;
};

export type IndustryPackAdvisorSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  effort?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type IndustryPackEcosystemCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  business_packs_route?: string;
  marketplace_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  inherited_architecture?: string[];
  modules?: Array<{ key?: string; route?: string }>;
  overview?: Record<string, unknown>;
  installed_packs?: IndustryPackInstall[];
  available_packs?: IndustryPackRegistry[];
  marketplace_packs?: Array<Record<string, unknown>>;
  governance_policies?: Array<Record<string, unknown>>;
  advisor_signals?: IndustryPackAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  analytics?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  [key: string]: unknown;
};
