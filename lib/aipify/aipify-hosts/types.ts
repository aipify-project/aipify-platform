export type HostsPlatformKey = "airbnb" | "booking_com" | "vrbo" | "expedia" | "direct";

export type HostsModuleKey =
  | "guest_operations"
  | "property_operations"
  | "cleaner_operations"
  | "guest_experience_companion"
  | "revenue_intelligence"
  | "property_health_score"
  | "incident_claims"
  | "team_operations"
  | "hospitality_knowledge"
  | "executive_operations";

export type HostsPackageKey =
  | "hosts_solo"
  | "hosts_5"
  | "hosts_10"
  | "hosts_20"
  | "hosts_enterprise";

export type HostsLicensing = {
  allowed: boolean;
  can_add_property: boolean;
  plan_type: HostsPackageKey | string;
  base_property_limit: number;
  additional_property_licenses: number;
  property_limit: number;
  active_property_count: number;
  remaining_capacity: number;
  upgrade_required: boolean;
  at_capacity: boolean;
  capacity_label: string;
  principle?: string;
};

export type HostsModule = {
  key: HostsModuleKey;
  label: string;
  description: string;
};

export type HostsPlatform = {
  key: HostsPlatformKey | string;
  label: string;
};

export type HostsPackage = {
  key: HostsPackageKey | string;
  label: string;
  target: string;
  property_limit: number | null;
  modules: HostsModuleKey[];
  custom_limit?: boolean;
  contact_sales?: boolean;
};

export type HostsProperty = {
  id: string;
  property_key: string;
  display_name: string;
  platform_source: string | null;
  health_score: number;
  status: string;
};

export type HostsExecutiveWidget = {
  key: string;
  label: string;
};

export type AipifyHostsDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: HostsPackageKey | string;
  plan_type?: HostsPackageKey | string;
  property_count: number;
  property_limit?: number;
  human_oversight_required: boolean;
  positioning: string;
  licensing?: HostsLicensing;
  licensing_principle?: string;
  platforms: HostsPlatform[];
  modules: HostsModule[];
  packages: HostsPackage[];
  executive_widgets: HostsExecutiveWidget[];
  success_metrics: HostsExecutiveWidget[];
  governance: { principle: string; approval_required: boolean; audit_required: boolean };
  property_health_score: number;
  properties: HostsProperty[];
};

export type AipifyHostsCard = {
  has_customer: boolean;
  enabled?: boolean;
  package_key?: HostsPackageKey | string;
  plan_type?: HostsPackageKey | string;
  property_count?: number;
  property_limit?: number;
  licensing?: HostsLicensing;
  human_oversight_required?: boolean;
  positioning?: string;
  route?: string;
};

export type CreateAipifyHostsPropertyResult = {
  success: boolean;
  error_code?: string;
  upgrade_required?: boolean;
  licensing?: HostsLicensing;
  property?: HostsProperty;
};

export type AddAipifyHostsPropertyLicenseResult = {
  success: boolean;
  additional_property_licenses?: number;
  licensing?: HostsLicensing;
  error?: string;
};
