export type LicenseStatus = "active" | "trial" | "grace_period" | "suspended" | "cancelled";

export type CapacityStatus = "full" | "near_capacity" | "upgrade_required" | "unlimited";

export type AppLicenseSummary = {
  license_type: string;
  status: LicenseStatus | string;
  renewal_date?: string | null;
  plan_key?: string;
  includes?: string[];
  access_blocked?: boolean;
};

export type DomainLicenseSummary = {
  purchased?: number;
  used?: number;
  available?: number;
  included?: number;
  purchased_additional?: number;
};

export type CapacitySummary = {
  included_capacity?: number | null;
  purchased_capacity?: number;
  total_capacity?: number | null;
  active_employees?: number;
  pending_invitations?: number;
  used?: number;
  available?: number | null;
  capacity_status?: CapacityStatus | string;
};

export type LicenseOverview = {
  domains_used?: number;
  domains_purchased?: number;
  employees_active?: number;
  employees_capacity?: number | null;
  business_pack_count?: number;
  renewal_date?: string | null;
};

export type DomainPackInstallation = {
  domain_id?: string;
  domain?: string;
  pack_key: string;
  license_status?: string;
  installed_at?: string;
};

export type LicenseSubscriptionCenter = {
  found: boolean;
  principle?: string;
  app_license?: AppLicenseSummary;
  domain_licenses?: DomainLicenseSummary;
  domains?: { id: string; domain: string; display_name?: string; is_primary?: boolean }[];
  capacity?: CapacitySummary;
  business_packs?: Record<string, unknown>[];
  domain_pack_installations?: DomainPackInstallation[];
  overview?: LicenseOverview;
  reports?: Record<string, unknown>;
  upgrade_center?: {
    purchase_capacity_route?: string;
    purchase_domain_route?: string;
    upgrade_subscription_route?: string;
    install_packs_route?: string;
    enterprise_route?: string;
  };
  routes?: {
    billing?: string;
    trust_center?: string;
    domains?: string;
    store?: string;
    employees?: string;
  };
  audit_recent?: { action: string; summary: string; created_at: string }[];
  commercial_principle?: string;
};
