export type SuperAdminSectionId =
  | "groupOrganization"
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

export type SuperAdminPlatformStatus = "operational" | "pending_setup" | "attention_required";

export type SuperAdminGlobalStatus = "operational" | "warning" | "critical";

export type SuperAdminSystemService = {
  id: string;
  status: SuperAdminPlatformStatus;
  last_check_seconds_ago: number;
  response_time_ms?: number | null;
};

export type SuperAdminTrustSignals = {
  backup_ok: boolean;
  two_factor_enforced: boolean;
  audit_logging_active: boolean;
  compliance_monitoring_active: boolean;
};

export type SuperAdminActionItem = {
  id: string;
  category: "billing" | "customers" | "support" | "growthPartners" | "installations" | "security";
  message: string;
  href: string;
  priority: "critical" | "attention" | "informational";
};

export type SuperAdminControlCenter = {
  has_access: boolean;
  admin_role?: string;
  display_name?: string;
  platform_health_score?: number;
  platform_status?: SuperAdminPlatformStatus;
  global_status?: SuperAdminGlobalStatus;
  system_uptime_pct?: number;
  active_organizations?: number;
  active_workspaces?: number;
  aipify_actions_today?: number;
  subscriptions_requiring_review?: number;
  growth_partner_applications_pending?: number;
  marketplace_reviews_pending?: number;
  critical_incidents?: number;
  trust_signals?: SuperAdminTrustSignals;
  system_services?: SuperAdminSystemService[];
  privacy_note?: string;
  checked_at?: string;
};
