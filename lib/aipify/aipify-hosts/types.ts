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

export type HostsPackageKey = "hosts_starter" | "hosts_professional" | "hosts_enterprise";

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
  key: HostsPackageKey;
  label: string;
  target: string;
  modules: HostsModuleKey[];
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
  package_key: HostsPackageKey;
  property_count: number;
  human_oversight_required: boolean;
  positioning: string;
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
  package_key?: HostsPackageKey;
  property_count?: number;
  human_oversight_required?: boolean;
  positioning?: string;
  route?: string;
};
