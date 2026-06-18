export type EcosystemPartner = {
  id?: string;
  partner_key?: string;
  company_name?: string;
  partner_type?: string;
  partnership_status?: string;
  regions?: string;
  industries?: string;
  certifications?: string;
  rating?: number;
  performance_score?: number;
  services_summary?: string;
  summary?: string;
  [key: string]: unknown;
};

export type EcosystemGrowthPartner = {
  id?: string;
  growth_partner_key?: string;
  partner_name?: string;
  certification_level?: string;
  status?: string;
  commission_rate_percent?: number;
  sales_activity_score?: number;
  partner_health_score?: number;
  summary?: string;
  [key: string]: unknown;
};

export type EcosystemServiceProvider = {
  id?: string;
  provider_key?: string;
  provider_name?: string;
  provider_type?: string;
  regions?: string;
  availability?: string;
  rating?: number;
  summary?: string;
  [key: string]: unknown;
};

export type EcosystemIndustryExpert = {
  id?: string;
  expert_key?: string;
  expert_name?: string;
  expertise?: string;
  industries?: string;
  certifications?: string;
  projects_count?: number;
  customer_rating?: number;
  regions?: string;
  availability?: string;
  summary?: string;
  [key: string]: unknown;
};

export type EcosystemDeveloperAsset = {
  id?: string;
  asset_key?: string;
  asset_title?: string;
  asset_type?: string;
  status?: string;
  summary?: string;
  [key: string]: unknown;
};

export type EcosystemMarketplaceListing = {
  id?: string;
  listing_key?: string;
  listing_title?: string;
  listing_type?: string;
  status?: string;
  summary?: string;
  [key: string]: unknown;
};

export type EcosystemPartnerSuccess = {
  id?: string;
  success_key?: string;
  partner_name?: string;
  revenue_index?: number;
  satisfaction_score?: number;
  implementation_success?: number;
  retention_score?: number;
  growth_score?: number;
  partner_health?: number;
  summary?: string;
  [key: string]: unknown;
};

export type EcosystemIntelligenceSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type EcosystemAdvisorSignal = {
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

export type EnterpriseEcosystemPartnerNetworkCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  growth_partner_portal_route?: string;
  ecosystem_governance_route?: string;
  ecosystem_intelligence_route?: string;
  marketplace_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  core_languages?: string[];
  partners?: EcosystemPartner[];
  growth_partners?: EcosystemGrowthPartner[];
  service_providers?: EcosystemServiceProvider[];
  industry_experts?: EcosystemIndustryExpert[];
  developer_assets?: EcosystemDeveloperAsset[];
  marketplace_listings?: EcosystemMarketplaceListing[];
  partner_success?: EcosystemPartnerSuccess[];
  intelligence_signals?: EcosystemIntelligenceSignal[];
  advisor_signals?: EcosystemAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  executive_dashboard?: Record<string, unknown>;
  governance?: Record<string, unknown>;
  [key: string]: unknown;
};
