export type SuperAdminSectionId =
  | "platformOperations"
  | "tenantManagement"
  | "commercialOperations"
  | "growthPartners"
  | "marketplaceGovernance"
  | "globalGovernance"
  | "globalKnowledge"
  | "internalSupport";

export type SuperAdminModule = {
  id: string;
  labelKey: string;
  href: string;
  descriptionKey: string;
};

export type SuperAdminSection = {
  id: SuperAdminSectionId;
  titleKey: string;
  purposeKey: string;
  modules: SuperAdminModule[];
};

export type SuperAdminControlCenter = {
  has_access: boolean;
  admin_role?: string;
  display_name?: string;
  platform_health_score?: number;
  active_organizations?: number;
  growth_partner_applications_pending?: number;
  marketplace_reviews_pending?: number;
  critical_incidents?: number;
  privacy_note?: string;
};
