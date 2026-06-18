import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  BusinessOsEcosystemMarketplaceCenter,
  CertificationProgram,
  CompanionEcosystemItem,
  EcosystemAnalyticsMetric,
  EcosystemSectionItem,
  EcosystemSectionKey,
  GrowthPartnerItem,
  IntegrationListing,
  MarketplaceListing,
  MarketplaceSettings,
  RevenueStream,
  SolutionProvider,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}
function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}
function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}
function asStatus(value: unknown): OperationsStatusKey {
  const key = asString(value, "information");
  const allowed: OperationsStatusKey[] = ["completed", "not_allowed", "requires_attention", "information", "restricted", "verified", "waiting"];
  return allowed.includes(key as OperationsStatusKey) ? (key as OperationsStatusKey) : "information";
}

function parseSection(raw: unknown): EcosystemSectionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), title: asString(d.title), summary: asString(d.summary),
    metricLabel: asString(d.metric_label), metricValue: asString(d.metric_value),
    statusKey: asStatus(d.status_key),
    sectionKey: asString(d.section_key, "marketplace") as EcosystemSectionKey,
    itemType: "section",
  };
}
function parseSections(raw: unknown): EcosystemSectionItem[] {
  return Array.isArray(raw) ? raw.map(parseSection) : [];
}

function parseListing(raw: unknown): MarketplaceListing {
  const d = asRecord(raw);
  return {
    id: asString(d.id), listingName: asString(d.listing_name), listingCategory: asString(d.listing_category),
    vendorName: asString(d.vendor_name), ratingLabel: asString(d.rating_label),
    downloadsLabel: asString(d.downloads_label), versionLabel: asString(d.version_label),
    priceLabel: asString(d.price_label), listingType: asString(d.listing_type),
    statusKey: asStatus(d.status_key), itemType: "listing",
  };
}

function parseIntegration(raw: unknown): IntegrationListing {
  const d = asRecord(raw);
  return {
    id: asString(d.id), integrationName: asString(d.integration_name), integrationType: asString(d.integration_type),
    providerName: asString(d.provider_name), summary: asString(d.summary),
    statusKey: asStatus(d.status_key), itemType: "integration",
  };
}

function parseProvider(raw: unknown): SolutionProvider {
  const d = asRecord(raw);
  return {
    id: asString(d.id), providerName: asString(d.provider_name), providerType: asString(d.provider_type),
    certificationLabel: asString(d.certification_label), ratingLabel: asString(d.rating_label),
    regionsLabel: asString(d.regions_label), statusKey: asStatus(d.status_key), itemType: "provider",
  };
}

function parseCertification(raw: unknown): CertificationProgram {
  const d = asRecord(raw);
  return {
    id: asString(d.id), certificationKey: asString(d.certification_key),
    certificationName: asString(d.certification_name), certificationType: asString(d.certification_type),
    holderCount: asNumber(d.holder_count), statusKey: asStatus(d.status_key), itemType: "certification",
  };
}

function parseRevenue(raw: unknown): RevenueStream {
  const d = asRecord(raw);
  return {
    id: asString(d.id), revenueType: asString(d.revenue_type), revenueLabel: asString(d.revenue_label),
    amountLabel: asString(d.amount_label), periodLabel: asString(d.period_label),
    statusKey: asStatus(d.status_key), itemType: "revenue",
  };
}

function parseGrowthPartner(raw: unknown): GrowthPartnerItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), partnerName: asString(d.partner_name), partnerTier: asString(d.partner_tier),
    leadsLabel: asString(d.leads_label), revenueLabel: asString(d.revenue_label),
    commissionLabel: asString(d.commission_label), certificationsLabel: asString(d.certifications_label),
    performanceLabel: asString(d.performance_label), statusKey: asStatus(d.status_key), itemType: "growth_partner",
  };
}

function parseAnalytics(raw: unknown): EcosystemAnalyticsMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "analytics",
  };
}

function parseCompanion(raw: unknown): CompanionEcosystemItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), recommendationType: asString(d.recommendation_type),
    recommendation: asString(d.recommendation), reason: asString(d.reason),
    status: asString(d.status), itemType: "companion",
  };
}

function parseSettings(raw: unknown): MarketplaceSettings {
  const d = asRecord(raw);
  return {
    marketplaceEnabled: asBool(d.marketplace_enabled, true),
    reviewRequired: asBool(d.review_required, true),
    revenueSharingEnabled: asBool(d.revenue_sharing_enabled, true),
  };
}

const emptyCenter: BusinessOsEcosystemMarketplaceCenter = {
  found: false,
  marketplaceSettings: { marketplaceEnabled: true, reviewRequired: true, revenueSharingEnabled: true },
  businessPackStore: [],
  marketplaceListings: [],
  integrationMarketplace: [],
  solutionProviderDirectory: [],
  certificationFramework: [],
  revenueSharingEngine: [],
  growthPartnerEcosystem: [],
  ecosystemAnalytics: [],
  companionAdvisor: [],
  sections: {
    marketplace: [], businessPacks: [], skills: [], integrations: [],
    growthPartners: [], solutionProviders: [], certifications: [], revenueSharing: [],
  },
  statistics: {
    listingCount: 0, integrationCount: 0, providerCount: 0,
    certificationCount: 0, growthPartnerCount: 0, companionCount: 0,
  },
};

export function parseBusinessOsEcosystemMarketplaceCenter(raw: unknown): BusinessOsEcosystemMarketplaceCenter {
  const d = asRecord(raw);
  if (!d.found) return { ...emptyCenter, error: asString(d.error) || undefined };

  const sections = asRecord(d.sections);
  const stats = asRecord(d.statistics);

  return {
    found: true,
    philosophy: asString(d.philosophy) || undefined,
    canExecutive: d.can_executive === true,
    canManage: d.can_manage === true,
    governanceNote: asString(d.governance_note) || undefined,
    privacyNote: asString(d.privacy_note) || undefined,
    marketplaceSettings: parseSettings(d.marketplace_settings),
    businessPackStore: Array.isArray(d.business_pack_store) ? d.business_pack_store.map(parseListing) : [],
    marketplaceListings: Array.isArray(d.marketplace_listings) ? d.marketplace_listings.map(parseListing) : [],
    integrationMarketplace: Array.isArray(d.integration_marketplace) ? d.integration_marketplace.map(parseIntegration) : [],
    solutionProviderDirectory: Array.isArray(d.solution_provider_directory) ? d.solution_provider_directory.map(parseProvider) : [],
    certificationFramework: Array.isArray(d.certification_framework) ? d.certification_framework.map(parseCertification) : [],
    revenueSharingEngine: Array.isArray(d.revenue_sharing_engine) ? d.revenue_sharing_engine.map(parseRevenue) : [],
    growthPartnerEcosystem: Array.isArray(d.growth_partner_ecosystem) ? d.growth_partner_ecosystem.map(parseGrowthPartner) : [],
    ecosystemAnalytics: Array.isArray(d.ecosystem_analytics) ? d.ecosystem_analytics.map(parseAnalytics) : [],
    companionAdvisor: Array.isArray(d.companion_advisor) ? d.companion_advisor.map(parseCompanion) : [],
    sections: {
      marketplace: parseSections(sections.marketplace),
      businessPacks: parseSections(sections.business_packs),
      skills: parseSections(sections.skills),
      integrations: parseSections(sections.integrations),
      growthPartners: parseSections(sections.growth_partners),
      solutionProviders: parseSections(sections.solution_providers),
      certifications: parseSections(sections.certifications),
      revenueSharing: parseSections(sections.revenue_sharing),
    },
    statistics: {
      listingCount: asNumber(stats.listing_count),
      integrationCount: asNumber(stats.integration_count),
      providerCount: asNumber(stats.provider_count),
      certificationCount: asNumber(stats.certification_count),
      growthPartnerCount: asNumber(stats.growth_partner_count),
      companionCount: asNumber(stats.companion_count),
    },
  };
}

export function parseBusinessOsEcosystemMarketplaceAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
