export type SupportedLanguage = {
  id: string;
  language_code: string;
  language_name: string;
  native_name: string;
  market_status: string;
  coverage_pct: number;
  is_default?: boolean;
};

export type LocalizationProject = {
  id: string;
  project_key: string;
  title: string;
  description: string;
  target_language: string;
  content_scope: string;
  status: string;
  progress_pct: number;
};

export type CountryPlaybook = {
  id: string;
  country_code: string;
  country_name: string;
  market_status: string;
  readiness_score: number;
  summary: string;
  checklist?: string[];
};

export type LocalizationRecommendation = {
  id: string;
  title: string;
  description: string;
  recommendation_type: string;
  priority: string;
  language_code?: string | null;
  status: string;
};

export type TerminologyEntry = {
  id: string;
  term_key: string;
  source_term: string;
  translated_term: string;
  language_code: string;
  domain: string;
};

export type RegionalContent = {
  id: string;
  title: string;
  description: string;
  region_code: string;
  language_code: string;
  content_type: string;
};

export type LocalizationAudit = {
  id: string;
  audit_type: string;
  title: string;
  summary?: string | null;
  overall_score?: number | null;
  status: string;
};

export type InternationalAnalytics = {
  id: string;
  region_code: string;
  region_label: string;
  adoption_rate_pct: number;
  language_usage_pct: number;
  satisfaction_score: number;
};

export type GlobalExpansionCard = {
  has_customer: boolean;
  global_readiness_score?: number;
  avg_language_coverage_pct?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
};

export type GlobalExpansionDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  default_language?: string;
  default_region?: string;
  default_timezone?: string;
  default_currency?: string;
  multi_language_enabled?: boolean;
  localized_notifications?: boolean;
  timezone_intelligence?: boolean;
  global_readiness_score?: number;
  avg_language_coverage_pct?: number;
  active_markets?: number;
  planned_markets?: number;
  localization_dimensions?: string[];
  supported_languages: SupportedLanguage[];
  future_languages?: string[];
  localization_projects: LocalizationProject[];
  country_playbooks: CountryPlaybook[];
  recommendations: LocalizationRecommendation[];
  terminology_glossary: TerminologyEntry[];
  regional_content: RegionalContent[];
  localization_audits: LocalizationAudit[];
  international_analytics: InternationalAnalytics[];
  timezone_capabilities?: string[];
  compliance_readiness?: string[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
};

export type GlobalExpansionActionResult = {
  status?: string;
  error?: string;
};

export type GlobalExpansionBriefingResult = {
  briefing_id?: string;
  summary?: string;
  error?: string;
};
