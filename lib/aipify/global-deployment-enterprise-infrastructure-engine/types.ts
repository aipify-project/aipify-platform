export type GlobalRegion = {
  id?: string;
  region_key?: string;
  region_title?: string;
  region_type?: string;
  status?: string;
  countries_count?: number;
  summary?: string;
  [key: string]: unknown;
};

export type GlobalCountry = {
  id?: string;
  country_key?: string;
  country_name?: string;
  region_key?: string;
  primary_language?: string;
  currency_code?: string;
  timezone?: string;
  compliance_status?: string;
  summary?: string;
  [key: string]: unknown;
};

export type GlobalLocalization = {
  id?: string;
  locale_key?: string;
  locale_title?: string;
  language_code?: string;
  currency_code?: string;
  date_format?: string;
  timezone?: string;
  status?: string;
  adoption_percent?: number;
  summary?: string;
  [key: string]: unknown;
};

export type GlobalCompliancePolicy = {
  id?: string;
  policy_key?: string;
  policy_title?: string;
  policy_type?: string;
  region_scope?: string;
  status?: string;
  summary?: string;
  [key: string]: unknown;
};

export type GlobalDataResidency = {
  id?: string;
  residency_key?: string;
  residency_title?: string;
  storage_type?: string;
  region_scope?: string;
  status?: string;
  summary?: string;
  [key: string]: unknown;
};

export type GlobalDeployment = {
  id?: string;
  deployment_key?: string;
  deployment_title?: string;
  deployment_model?: string;
  region_scope?: string;
  status?: string;
  health_score?: number;
  summary?: string;
  [key: string]: unknown;
};

export type GlobalInfrastructureProfile = {
  id?: string;
  profile_key?: string;
  profile_title?: string;
  profile_type?: string;
  status?: string;
  readiness_score?: number;
  summary?: string;
  [key: string]: unknown;
};

export type GlobalIntelligenceSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type GlobalAdvisorSignal = {
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

export type GlobalDeploymentEnterpriseInfrastructureCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  global_expansion_route?: string;
  deployment_environment_route?: string;
  observability_route?: string;
  settings_security_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  core_languages?: string[];
  future_languages?: string[];
  supported_currencies?: string[];
  deployment_models?: string[];
  regions?: GlobalRegion[];
  countries?: GlobalCountry[];
  localizations?: GlobalLocalization[];
  compliance_policies?: GlobalCompliancePolicy[];
  data_residency?: GlobalDataResidency[];
  deployments?: GlobalDeployment[];
  infrastructure_profiles?: GlobalInfrastructureProfile[];
  intelligence_signals?: GlobalIntelligenceSignal[];
  advisor_signals?: GlobalAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  executive_dashboard?: Record<string, unknown>;
  governance?: Record<string, unknown>;
  [key: string]: unknown;
};
