import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type EcosystemSectionKey =
  | "marketplace"
  | "business_packs"
  | "skills"
  | "integrations"
  | "growth_partners"
  | "solution_providers"
  | "certifications"
  | "revenue_sharing";

export type EcosystemSectionItem = {
  id: string;
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  statusKey: OperationsStatusKey;
  sectionKey: EcosystemSectionKey;
  itemType: "section";
};

export type MarketplaceListing = {
  id: string;
  listingName: string;
  listingCategory: string;
  vendorName: string;
  ratingLabel: string;
  downloadsLabel: string;
  versionLabel: string;
  priceLabel: string;
  listingType: string;
  statusKey: OperationsStatusKey;
  itemType: "listing";
};

export type IntegrationListing = {
  id: string;
  integrationName: string;
  integrationType: string;
  providerName: string;
  summary: string;
  statusKey: OperationsStatusKey;
  itemType: "integration";
};

export type SolutionProvider = {
  id: string;
  providerName: string;
  providerType: string;
  certificationLabel: string;
  ratingLabel: string;
  regionsLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "provider";
};

export type CertificationProgram = {
  id: string;
  certificationKey: string;
  certificationName: string;
  certificationType: string;
  holderCount: number;
  statusKey: OperationsStatusKey;
  itemType: "certification";
};

export type RevenueStream = {
  id: string;
  revenueType: string;
  revenueLabel: string;
  amountLabel: string;
  periodLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "revenue";
};

export type GrowthPartnerItem = {
  id: string;
  partnerName: string;
  partnerTier: string;
  leadsLabel: string;
  revenueLabel: string;
  commissionLabel: string;
  certificationsLabel: string;
  performanceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "growth_partner";
};

export type EcosystemAnalyticsMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "analytics";
};

export type CompanionEcosystemItem = {
  id: string;
  recommendationType: string;
  recommendation: string;
  reason: string;
  status: string;
  itemType: "companion";
};

export type MarketplaceSettings = {
  marketplaceEnabled: boolean;
  reviewRequired: boolean;
  revenueSharingEnabled: boolean;
};

export type BusinessOsEcosystemMarketplaceCenter = {
  found: boolean;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  marketplaceSettings: MarketplaceSettings;
  businessPackStore: MarketplaceListing[];
  marketplaceListings: MarketplaceListing[];
  integrationMarketplace: IntegrationListing[];
  solutionProviderDirectory: SolutionProvider[];
  certificationFramework: CertificationProgram[];
  revenueSharingEngine: RevenueStream[];
  growthPartnerEcosystem: GrowthPartnerItem[];
  ecosystemAnalytics: EcosystemAnalyticsMetric[];
  companionAdvisor: CompanionEcosystemItem[];
  sections: {
    marketplace: EcosystemSectionItem[];
    businessPacks: EcosystemSectionItem[];
    skills: EcosystemSectionItem[];
    integrations: EcosystemSectionItem[];
    growthPartners: EcosystemSectionItem[];
    solutionProviders: EcosystemSectionItem[];
    certifications: EcosystemSectionItem[];
    revenueSharing: EcosystemSectionItem[];
  };
  statistics: {
    listingCount: number;
    integrationCount: number;
    providerCount: number;
    certificationCount: number;
    growthPartnerCount: number;
    companionCount: number;
  };
  error?: string;
};
