import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type NetworkSectionKey =
  | "organizations"
  | "partners"
  | "vendors"
  | "service_providers"
  | "growth_partners"
  | "opportunities"
  | "introductions"
  | "collaboration";

export type VerificationStatus = "verified" | "pending" | "failed";

export type NetworkSectionItem = {
  id: string;
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  statusKey: OperationsStatusKey;
  sectionKey: NetworkSectionKey;
  itemType: "section";
};

export type OrganizationProfile = {
  id: string;
  companyName: string;
  industry: string;
  country: string;
  languagesLabel: string;
  servicesLabel: string;
  productsLabel: string;
  businessPacksLabel: string;
  verificationStatus: VerificationStatus;
  statusKey: OperationsStatusKey;
  itemType: "profile";
};

export type NetworkOpportunity = {
  id: string;
  opportunityType: string;
  title: string;
  summary: string;
  industry: string;
  locationLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "opportunity";
};

export type SmartMatch = {
  id: string;
  matchType: string;
  matchName: string;
  matchReason: string;
  industry: string;
  locationLabel: string;
  confidenceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "match";
};

export type TrustedVendor = {
  id: string;
  vendorName: string;
  industry: string;
  country: string;
  verificationStatus: string;
  ratingLabel: string;
  specialtiesLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "vendor";
};

export type GrowthPartnerNetworkItem = {
  id: string;
  partnerName: string;
  territoryLabel: string;
  prospectsLabel: string;
  teamLabel: string;
  opportunitiesLabel: string;
  performanceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "growth_partner";
};

export type CollaborationItem = {
  id: string;
  collaborationType: string;
  title: string;
  partnerName: string;
  summary: string;
  statusKey: OperationsStatusKey;
  itemType: "collaboration";
};

export type ExecutiveNetworkMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "executive";
};

export type CompanionNetworkItem = {
  id: string;
  recommendationType: string;
  recommendation: string;
  reason: string;
  status: string;
  itemType: "companion";
};

export type NetworkSettings = {
  networkEnabled: boolean;
  publicProfileEnabled: boolean;
  connectionRequestsEnabled: boolean;
};

export type GlobalBusinessNetworkCenter = {
  found: boolean;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  networkSettings: NetworkSettings;
  organizationProfiles: OrganizationProfile[];
  opportunityMarketplace: NetworkOpportunity[];
  smartMatching: SmartMatch[];
  trustedVendorDirectory: TrustedVendor[];
  growthPartnerNetwork: GrowthPartnerNetworkItem[];
  collaborationCenter: CollaborationItem[];
  executiveDashboard: ExecutiveNetworkMetric[];
  companionAdvisor: CompanionNetworkItem[];
  sections: {
    organizations: NetworkSectionItem[];
    partners: NetworkSectionItem[];
    vendors: NetworkSectionItem[];
    serviceProviders: NetworkSectionItem[];
    growthPartners: NetworkSectionItem[];
    opportunities: NetworkSectionItem[];
    introductions: NetworkSectionItem[];
    collaboration: NetworkSectionItem[];
  };
  statistics: {
    profileCount: number;
    opportunityCount: number;
    matchCount: number;
    vendorCount: number;
    growthPartnerCount: number;
    collaborationCount: number;
    companionCount: number;
  };
  error?: string;
};
