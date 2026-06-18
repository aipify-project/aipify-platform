import type {
  EnterpriseEcosystemPartnerNetworkCenter,
  EcosystemAdvisorSignal,
  EcosystemDeveloperAsset,
  EcosystemGrowthPartner,
  EcosystemIndustryExpert,
  EcosystemIntelligenceSignal,
  EcosystemMarketplaceListing,
  EcosystemPartner,
  EcosystemPartnerSuccess,
  EcosystemServiceProvider,
} from "./types";

function parsePartner(raw: unknown): EcosystemPartner {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    partner_key: typeof d.partner_key === "string" ? d.partner_key : undefined,
    company_name: typeof d.company_name === "string" ? d.company_name : undefined,
    partner_type: typeof d.partner_type === "string" ? d.partner_type : undefined,
    partnership_status: typeof d.partnership_status === "string" ? d.partnership_status : undefined,
    regions: typeof d.regions === "string" ? d.regions : undefined,
    industries: typeof d.industries === "string" ? d.industries : undefined,
    certifications: typeof d.certifications === "string" ? d.certifications : undefined,
    rating: Number(d.rating ?? 0),
    performance_score: Number(d.performance_score ?? 0),
    services_summary: typeof d.services_summary === "string" ? d.services_summary : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseGrowthPartner(raw: unknown): EcosystemGrowthPartner {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    growth_partner_key: typeof d.growth_partner_key === "string" ? d.growth_partner_key : undefined,
    partner_name: typeof d.partner_name === "string" ? d.partner_name : undefined,
    certification_level: typeof d.certification_level === "string" ? d.certification_level : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    commission_rate_percent: Number(d.commission_rate_percent ?? 0),
    sales_activity_score: Number(d.sales_activity_score ?? 0),
    partner_health_score: Number(d.partner_health_score ?? 0),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseServiceProvider(raw: unknown): EcosystemServiceProvider {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    provider_key: typeof d.provider_key === "string" ? d.provider_key : undefined,
    provider_name: typeof d.provider_name === "string" ? d.provider_name : undefined,
    provider_type: typeof d.provider_type === "string" ? d.provider_type : undefined,
    regions: typeof d.regions === "string" ? d.regions : undefined,
    availability: typeof d.availability === "string" ? d.availability : undefined,
    rating: Number(d.rating ?? 0),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseExpert(raw: unknown): EcosystemIndustryExpert {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    expert_key: typeof d.expert_key === "string" ? d.expert_key : undefined,
    expert_name: typeof d.expert_name === "string" ? d.expert_name : undefined,
    expertise: typeof d.expertise === "string" ? d.expertise : undefined,
    industries: typeof d.industries === "string" ? d.industries : undefined,
    certifications: typeof d.certifications === "string" ? d.certifications : undefined,
    projects_count: Number(d.projects_count ?? 0),
    customer_rating: Number(d.customer_rating ?? 0),
    regions: typeof d.regions === "string" ? d.regions : undefined,
    availability: typeof d.availability === "string" ? d.availability : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseDeveloperAsset(raw: unknown): EcosystemDeveloperAsset {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    asset_key: typeof d.asset_key === "string" ? d.asset_key : undefined,
    asset_title: typeof d.asset_title === "string" ? d.asset_title : undefined,
    asset_type: typeof d.asset_type === "string" ? d.asset_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseListing(raw: unknown): EcosystemMarketplaceListing {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    listing_key: typeof d.listing_key === "string" ? d.listing_key : undefined,
    listing_title: typeof d.listing_title === "string" ? d.listing_title : undefined,
    listing_type: typeof d.listing_type === "string" ? d.listing_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parsePartnerSuccess(raw: unknown): EcosystemPartnerSuccess {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    success_key: typeof d.success_key === "string" ? d.success_key : undefined,
    partner_name: typeof d.partner_name === "string" ? d.partner_name : undefined,
    revenue_index: Number(d.revenue_index ?? 0),
    satisfaction_score: Number(d.satisfaction_score ?? 0),
    implementation_success: Number(d.implementation_success ?? 0),
    retention_score: Number(d.retention_score ?? 0),
    growth_score: Number(d.growth_score ?? 0),
    partner_health: Number(d.partner_health ?? 0),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseIntelligence(raw: unknown): EcosystemIntelligenceSignal {
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

function parseAdvisor(raw: unknown): EcosystemAdvisorSignal {
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

function parseArray<T>(raw: unknown, parser: (item: unknown) => T): T[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parser);
}

export function parseEnterpriseEcosystemPartnerNetworkCenter(raw: unknown): EnterpriseEcosystemPartnerNetworkCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: d.found === true,
    has_access: d.has_access === true,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    growth_partner_portal_route: typeof d.growth_partner_portal_route === "string" ? d.growth_partner_portal_route : undefined,
    ecosystem_governance_route: typeof d.ecosystem_governance_route === "string" ? d.ecosystem_governance_route : undefined,
    ecosystem_intelligence_route: typeof d.ecosystem_intelligence_route === "string" ? d.ecosystem_intelligence_route : undefined,
    marketplace_route: typeof d.marketplace_route === "string" ? d.marketplace_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview !== null ? (d.overview as Record<string, unknown>) : undefined,
    settings: typeof d.settings === "object" && d.settings !== null ? (d.settings as Record<string, unknown>) : undefined,
    modules: parseArray(d.modules, (m) => m as { key?: string; route?: string }),
    core_languages: Array.isArray(d.core_languages) ? d.core_languages.filter((l): l is string => typeof l === "string") : undefined,
    partners: parseArray(d.partners, parsePartner),
    growth_partners: parseArray(d.growth_partners, parseGrowthPartner),
    service_providers: parseArray(d.service_providers, parseServiceProvider),
    industry_experts: parseArray(d.industry_experts, parseExpert),
    developer_assets: parseArray(d.developer_assets, parseDeveloperAsset),
    marketplace_listings: parseArray(d.marketplace_listings, parseListing),
    partner_success: parseArray(d.partner_success, parsePartnerSuccess),
    intelligence_signals: parseArray(d.intelligence_signals, parseIntelligence),
    advisor_signals: parseArray(d.advisor_signals, parseAdvisor),
    audit_logs: parseArray(d.audit_logs, (l) => l as Record<string, unknown>),
    executive_dashboard:
      typeof d.executive_dashboard === "object" && d.executive_dashboard !== null
        ? (d.executive_dashboard as Record<string, unknown>)
        : undefined,
    governance:
      typeof d.governance === "object" && d.governance !== null ? (d.governance as Record<string, unknown>) : undefined,
  };
}
