import type { PACKAGE_TIERS } from "./constants";

export type PackageTier = (typeof PACKAGE_TIERS)[number];

export type PackageFeature = {
  feature_key: string;
  feature_label: string;
  required_package: PackageTier;
  is_gold_nugget: boolean;
  upgrade_message_en?: string;
  upgrade_message_no?: string;
  action_capability?: boolean;
  access_status?: string;
  allowed?: boolean;
  upgrade_message?: string;
};

export type PackageAccessSubscription = {
  current_package: PackageTier;
  subscription_status: string;
  trial_ends_at: string | null;
  renewal_at: string | null;
  seat_count: number;
  instant_access_enabled: boolean;
  last_upgrade_at: string | null;
};

export type PackageComparison = {
  package_key: PackageTier;
  package_name: string;
  description: string;
  package_type: string;
  sort_order: number;
  is_current: boolean;
  is_upgrade: boolean;
};

export type PackageAccessCenter = {
  current_package: { package_key: PackageTier; resolved_from: string };
  subscription: PackageAccessSubscription;
  packages: PackageComparison[];
  locked_features: PackageFeature[];
  recommendation: { best_fit: PackageTier; reason: string } | null;
  recent_events: Array<{
    id: string;
    event_type: string;
    summary: string | null;
    created_at: string;
    feature_key?: string | null;
    package_key?: string | null;
  }>;
  blueprint: Record<string, unknown> | null;
  can_manage: boolean;
  can_upgrade: boolean;
  can_view_billing: boolean;
  privacy_note: string | null;
};

export type PackageFeatureAccess = {
  allowed: boolean;
  required_package: PackageTier;
  upgrade_message: string;
  access_status: string;
  feature_key?: string;
  feature_label?: string;
  is_gold_nugget?: boolean;
};

export type PackageUpgradeStart = {
  upgrade_event_id: string;
  from_package: PackageTier;
  to_package: PackageTier;
  status: string;
  instant_activation: boolean;
  message: string;
};

export type PackageUpgradeResult = {
  success: boolean;
  message: string;
  confirmation: string;
  from_package: PackageTier | null;
  to_package: PackageTier | null;
  instant_activation: boolean;
  upgrade_event_id: string | null;
};
