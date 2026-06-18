import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  CollaborationItem,
  CompanionNetworkItem,
  ExecutiveNetworkMetric,
  GlobalBusinessNetworkCenter,
  GrowthPartnerNetworkItem,
  NetworkOpportunity,
  NetworkSectionItem,
  NetworkSectionKey,
  NetworkSettings,
  OrganizationProfile,
  SmartMatch,
  TrustedVendor,
  VerificationStatus,
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
function asVerification(value: unknown): VerificationStatus {
  const key = asString(value, "pending");
  return key === "verified" || key === "failed" ? key : "pending";
}

function parseSection(raw: unknown): NetworkSectionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), title: asString(d.title), summary: asString(d.summary),
    metricLabel: asString(d.metric_label), metricValue: asString(d.metric_value),
    statusKey: asStatus(d.status_key),
    sectionKey: asString(d.section_key, "organizations") as NetworkSectionKey,
    itemType: "section",
  };
}
function parseSections(raw: unknown): NetworkSectionItem[] {
  return Array.isArray(raw) ? raw.map(parseSection) : [];
}

function parseProfile(raw: unknown): OrganizationProfile {
  const d = asRecord(raw);
  return {
    id: asString(d.id), companyName: asString(d.company_name), industry: asString(d.industry),
    country: asString(d.country), languagesLabel: asString(d.languages_label),
    servicesLabel: asString(d.services_label), productsLabel: asString(d.products_label),
    businessPacksLabel: asString(d.business_packs_label),
    verificationStatus: asVerification(d.verification_status),
    statusKey: asStatus(d.status_key), itemType: "profile",
  };
}

function parseOpportunity(raw: unknown): NetworkOpportunity {
  const d = asRecord(raw);
  return {
    id: asString(d.id), opportunityType: asString(d.opportunity_type), title: asString(d.title),
    summary: asString(d.summary), industry: asString(d.industry), locationLabel: asString(d.location_label),
    statusKey: asStatus(d.status_key), itemType: "opportunity",
  };
}

function parseMatch(raw: unknown): SmartMatch {
  const d = asRecord(raw);
  return {
    id: asString(d.id), matchType: asString(d.match_type), matchName: asString(d.match_name),
    matchReason: asString(d.match_reason), industry: asString(d.industry),
    locationLabel: asString(d.location_label), confidenceLabel: asString(d.confidence_label),
    statusKey: asStatus(d.status_key), itemType: "match",
  };
}

function parseVendor(raw: unknown): TrustedVendor {
  const d = asRecord(raw);
  return {
    id: asString(d.id), vendorName: asString(d.vendor_name), industry: asString(d.industry),
    country: asString(d.country), verificationStatus: asString(d.verification_status),
    ratingLabel: asString(d.rating_label), specialtiesLabel: asString(d.specialties_label),
    statusKey: asStatus(d.status_key), itemType: "vendor",
  };
}

function parseGrowthPartner(raw: unknown): GrowthPartnerNetworkItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), partnerName: asString(d.partner_name), territoryLabel: asString(d.territory_label),
    prospectsLabel: asString(d.prospects_label), teamLabel: asString(d.team_label),
    opportunitiesLabel: asString(d.opportunities_label), performanceLabel: asString(d.performance_label),
    statusKey: asStatus(d.status_key), itemType: "growth_partner",
  };
}

function parseCollaboration(raw: unknown): CollaborationItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), collaborationType: asString(d.collaboration_type), title: asString(d.title),
    partnerName: asString(d.partner_name), summary: asString(d.summary),
    statusKey: asStatus(d.status_key), itemType: "collaboration",
  };
}

function parseExecutive(raw: unknown): ExecutiveNetworkMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "executive",
  };
}

function parseCompanion(raw: unknown): CompanionNetworkItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), recommendationType: asString(d.recommendation_type),
    recommendation: asString(d.recommendation), reason: asString(d.reason),
    status: asString(d.status), itemType: "companion",
  };
}

function parseSettings(raw: unknown): NetworkSettings {
  const d = asRecord(raw);
  return {
    networkEnabled: asBool(d.network_enabled, true),
    publicProfileEnabled: asBool(d.public_profile_enabled, true),
    connectionRequestsEnabled: asBool(d.connection_requests_enabled, true),
  };
}

const emptyCenter: GlobalBusinessNetworkCenter = {
  found: false,
  networkSettings: { networkEnabled: true, publicProfileEnabled: true, connectionRequestsEnabled: true },
  organizationProfiles: [],
  opportunityMarketplace: [],
  smartMatching: [],
  trustedVendorDirectory: [],
  growthPartnerNetwork: [],
  collaborationCenter: [],
  executiveDashboard: [],
  companionAdvisor: [],
  sections: {
    organizations: [], partners: [], vendors: [], serviceProviders: [],
    growthPartners: [], opportunities: [], introductions: [], collaboration: [],
  },
  statistics: {
    profileCount: 0, opportunityCount: 0, matchCount: 0, vendorCount: 0,
    growthPartnerCount: 0, collaborationCount: 0, companionCount: 0,
  },
};

export function parseGlobalBusinessNetworkCenter(raw: unknown): GlobalBusinessNetworkCenter {
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
    networkSettings: parseSettings(d.network_settings),
    organizationProfiles: Array.isArray(d.organization_profiles) ? d.organization_profiles.map(parseProfile) : [],
    opportunityMarketplace: Array.isArray(d.opportunity_marketplace) ? d.opportunity_marketplace.map(parseOpportunity) : [],
    smartMatching: Array.isArray(d.smart_matching) ? d.smart_matching.map(parseMatch) : [],
    trustedVendorDirectory: Array.isArray(d.trusted_vendor_directory) ? d.trusted_vendor_directory.map(parseVendor) : [],
    growthPartnerNetwork: Array.isArray(d.growth_partner_network) ? d.growth_partner_network.map(parseGrowthPartner) : [],
    collaborationCenter: Array.isArray(d.collaboration_center) ? d.collaboration_center.map(parseCollaboration) : [],
    executiveDashboard: Array.isArray(d.executive_dashboard) ? d.executive_dashboard.map(parseExecutive) : [],
    companionAdvisor: Array.isArray(d.companion_advisor) ? d.companion_advisor.map(parseCompanion) : [],
    sections: {
      organizations: parseSections(sections.organizations),
      partners: parseSections(sections.partners),
      vendors: parseSections(sections.vendors),
      serviceProviders: parseSections(sections.service_providers),
      growthPartners: parseSections(sections.growth_partners),
      opportunities: parseSections(sections.opportunities),
      introductions: parseSections(sections.introductions),
      collaboration: parseSections(sections.collaboration),
    },
    statistics: {
      profileCount: asNumber(stats.profile_count),
      opportunityCount: asNumber(stats.opportunity_count),
      matchCount: asNumber(stats.match_count),
      vendorCount: asNumber(stats.vendor_count),
      growthPartnerCount: asNumber(stats.growth_partner_count),
      collaborationCount: asNumber(stats.collaboration_count),
      companionCount: asNumber(stats.companion_count),
    },
  };
}

export function parseGlobalBusinessNetworkAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
