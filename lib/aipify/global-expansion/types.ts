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

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type BlueprintIntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type BlueprintSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type CompanionLocalizationPersonality = {
  emoji?: string;
  key?: string;
  trait?: string;
  example?: string;
};

export type PaymentMarketScaffold = {
  country?: string;
  code?: string;
  providers?: string[];
  expectations?: string[];
};

export type LocalizationSummary = {
  active_languages?: number;
  avg_coverage_pct?: number;
  active_markets?: number;
  open_recommendations?: number;
  published_projects?: number;
  regional_content_items?: number;
  privacy_note?: string;
};

export type ImplementationBlueprintPhase35 = {
  phase?: number;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type GlobalExpansionCard = {
  has_customer: boolean;
  global_readiness_score?: number;
  avg_language_coverage_pct?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint_phase35?: ImplementationBlueprintPhase35;
  localization_expansion_phase?: number;
  localization_abos_principle?: string;
  localization_summary?: LocalizationSummary;
  blueprint_note?: string;
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
  implementation_blueprint_phase35?: ImplementationBlueprintPhase35;
  localization_expansion_mission?: string;
  localization_expansion_philosophy?: string;
  localization_objectives?: BlueprintObjective[];
  language_strategy?: {
    principle?: string;
    priority_locales?: Array<{ code?: string; label?: string; status?: string; note?: string }>;
    future_locales?: string[];
    future_note?: string;
  };
  companion_localization?: {
    principle?: string;
    personalities?: CompanionLocalizationPersonality[];
    companion_identity_route?: string;
    boundary?: string;
  };
  knowledge_center_localization?: {
    principle?: string;
    content_types?: BlueprintObjective[];
    knowledge_center_route?: string;
    global_expansion_category?: string;
  };
  sales_expert_localization?: {
    principle?: string;
    capabilities?: string[];
    sales_expert_route?: string;
    cross_link_note?: string;
  };
  payment_financial_localization?: {
    principle?: string;
    nordic_markets?: PaymentMarketScaffold[];
    international?: { providers?: string[]; strategies?: string[] };
    commercial_route?: string;
    safety_note?: string;
  };
  training_certification_localization?: {
    principle?: string;
    capabilities?: string[];
    learning_training_route?: string;
    certification_route?: string;
    academy_route?: string;
    cross_link_note?: string;
  };
  localization_trust_connection?: {
    principle?: string;
    users_should_understand?: string[];
    operators_should_understand?: string[];
    trust_route?: string;
    license_route?: string;
    metadata_only?: boolean;
  };
  localization_dogfooding?: {
    principle?: string;
    aipify_group?: { slug?: string; role?: string; focus?: string[] };
    unonight?: { slug?: string; role?: string; focus?: string[] };
  };
  localization_success_criteria?: BlueprintSuccessCriterion[];
  localization_vision_phrases?: string[];
  localization_abos_principle?: string;
  localization_distinction_note?: string;
  localization_integration_links?: BlueprintIntegrationLink[];
  localization_summary?: LocalizationSummary;
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
