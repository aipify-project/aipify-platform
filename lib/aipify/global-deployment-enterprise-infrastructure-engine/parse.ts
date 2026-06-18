import type {
  GlobalAdvisorSignal,
  GlobalCompliancePolicy,
  GlobalCountry,
  GlobalDataResidency,
  GlobalDeployment,
  GlobalDeploymentEnterpriseInfrastructureCenter,
  GlobalInfrastructureProfile,
  GlobalIntelligenceSignal,
  GlobalLocalization,
  GlobalRegion,
} from "./types";

function parseRegion(raw: unknown): GlobalRegion {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    region_key: typeof d.region_key === "string" ? d.region_key : undefined,
    region_title: typeof d.region_title === "string" ? d.region_title : undefined,
    region_type: typeof d.region_type === "string" ? d.region_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    countries_count: Number(d.countries_count ?? 0),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseCountry(raw: unknown): GlobalCountry {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    country_key: typeof d.country_key === "string" ? d.country_key : undefined,
    country_name: typeof d.country_name === "string" ? d.country_name : undefined,
    region_key: typeof d.region_key === "string" ? d.region_key : undefined,
    primary_language: typeof d.primary_language === "string" ? d.primary_language : undefined,
    currency_code: typeof d.currency_code === "string" ? d.currency_code : undefined,
    timezone: typeof d.timezone === "string" ? d.timezone : undefined,
    compliance_status: typeof d.compliance_status === "string" ? d.compliance_status : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseLocalization(raw: unknown): GlobalLocalization {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    locale_key: typeof d.locale_key === "string" ? d.locale_key : undefined,
    locale_title: typeof d.locale_title === "string" ? d.locale_title : undefined,
    language_code: typeof d.language_code === "string" ? d.language_code : undefined,
    currency_code: typeof d.currency_code === "string" ? d.currency_code : undefined,
    date_format: typeof d.date_format === "string" ? d.date_format : undefined,
    timezone: typeof d.timezone === "string" ? d.timezone : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    adoption_percent: Number(d.adoption_percent ?? 0),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseCompliance(raw: unknown): GlobalCompliancePolicy {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    policy_key: typeof d.policy_key === "string" ? d.policy_key : undefined,
    policy_title: typeof d.policy_title === "string" ? d.policy_title : undefined,
    policy_type: typeof d.policy_type === "string" ? d.policy_type : undefined,
    region_scope: typeof d.region_scope === "string" ? d.region_scope : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseResidency(raw: unknown): GlobalDataResidency {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    residency_key: typeof d.residency_key === "string" ? d.residency_key : undefined,
    residency_title: typeof d.residency_title === "string" ? d.residency_title : undefined,
    storage_type: typeof d.storage_type === "string" ? d.storage_type : undefined,
    region_scope: typeof d.region_scope === "string" ? d.region_scope : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseDeployment(raw: unknown): GlobalDeployment {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    deployment_key: typeof d.deployment_key === "string" ? d.deployment_key : undefined,
    deployment_title: typeof d.deployment_title === "string" ? d.deployment_title : undefined,
    deployment_model: typeof d.deployment_model === "string" ? d.deployment_model : undefined,
    region_scope: typeof d.region_scope === "string" ? d.region_scope : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    health_score: Number(d.health_score ?? 0),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseInfrastructure(raw: unknown): GlobalInfrastructureProfile {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    profile_key: typeof d.profile_key === "string" ? d.profile_key : undefined,
    profile_title: typeof d.profile_title === "string" ? d.profile_title : undefined,
    profile_type: typeof d.profile_type === "string" ? d.profile_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    readiness_score: Number(d.readiness_score ?? 0),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseIntelligence(raw: unknown): GlobalIntelligenceSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

function parseAdvisor(raw: unknown): GlobalAdvisorSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    effort: typeof d.effort === "string" ? d.effort : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

export function parseGlobalDeploymentEnterpriseInfrastructureCenter(
  raw: unknown
): GlobalDeploymentEnterpriseInfrastructureCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    global_expansion_route: typeof d.global_expansion_route === "string" ? d.global_expansion_route : undefined,
    deployment_environment_route:
      typeof d.deployment_environment_route === "string" ? d.deployment_environment_route : undefined,
    observability_route: typeof d.observability_route === "string" ? d.observability_route : undefined,
    settings_security_route: typeof d.settings_security_route === "string" ? d.settings_security_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: (d.overview as Record<string, unknown>) ?? {},
    settings: (d.settings as Record<string, unknown>) ?? {},
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    core_languages: Array.isArray(d.core_languages) ? (d.core_languages as string[]) : [],
    future_languages: Array.isArray(d.future_languages) ? (d.future_languages as string[]) : [],
    supported_currencies: Array.isArray(d.supported_currencies) ? (d.supported_currencies as string[]) : [],
    deployment_models: Array.isArray(d.deployment_models) ? (d.deployment_models as string[]) : [],
    regions: Array.isArray(d.regions) ? d.regions.map(parseRegion) : [],
    countries: Array.isArray(d.countries) ? d.countries.map(parseCountry) : [],
    localizations: Array.isArray(d.localizations) ? d.localizations.map(parseLocalization) : [],
    compliance_policies: Array.isArray(d.compliance_policies) ? d.compliance_policies.map(parseCompliance) : [],
    data_residency: Array.isArray(d.data_residency) ? d.data_residency.map(parseResidency) : [],
    deployments: Array.isArray(d.deployments) ? d.deployments.map(parseDeployment) : [],
    infrastructure_profiles: Array.isArray(d.infrastructure_profiles)
      ? d.infrastructure_profiles.map(parseInfrastructure)
      : [],
    intelligence_signals: Array.isArray(d.intelligence_signals) ? d.intelligence_signals.map(parseIntelligence) : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseAdvisor) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    executive_dashboard: (d.executive_dashboard as Record<string, unknown>) ?? {},
    governance: (d.governance as Record<string, unknown>) ?? {},
  };
}
