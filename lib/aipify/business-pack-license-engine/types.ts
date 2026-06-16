export type LicenseMetric =
  | "properties"
  | "stores"
  | "agents"
  | "users"
  | "employees"
  | "campaigns"
  | "partner_seats"
  | "workspaces";

export type LicenseTier = {
  key: string;
  label: string;
  tier_type: string;
  capacity_min?: number | null;
  capacity_max?: number | null;
  monthly_price?: number;
  annual_price?: number;
  custom_capacity?: boolean;
  contact_sales?: boolean;
};

export type BusinessPackLicenseCenter = {
  found: boolean;
  pack_key?: string;
  principle?: string;
  definition?: {
    pack_name: string;
    license_metric: LicenseMetric;
    metric_label: string;
    metric_label_plural: string;
    tiers: LicenseTier[];
    trial_config: Record<string, unknown>;
    downgrade_rules: Record<string, unknown>;
    renewal_rules: Record<string, unknown>;
    failed_payment_rules: Record<string, unknown>;
    enterprise_rules: Record<string, unknown>;
    upgrade_path: string[];
    feature_comparison: Array<Record<string, unknown>>;
  };
  overview?: {
    current_tier: string;
    license_status: string;
    billing_frequency: string;
    renewal_date: string | null;
    trial_ends_at: string | null;
    plan_name: string;
  };
  usage?: {
    usage_count: number;
    capacity_limit: number | null;
    remaining_capacity: number | null;
    capacity_label: string | null;
    at_capacity: boolean;
    upgrade_required: boolean;
    metric_label: string;
    metric_label_plural: string;
  };
  upgrade?: {
    available_tiers: LicenseTier[];
    feature_comparison: Array<Record<string, unknown>>;
    upgrade_flow: string[];
    activation_route: string;
    billing_route: string;
    landing_route: string;
  };
  governance_note?: string;
};

export type BusinessPackLicenseEngineDashboard = {
  has_access: boolean;
  is_platform_admin?: boolean;
  principle?: string;
  upgrade_flow?: string[];
  governance?: Record<string, string>;
  license_metrics?: Array<{ pack: string; metric: string }>;
  summary?: Record<string, number>;
  definitions?: Array<Record<string, unknown>>;
  recent_audit?: Array<Record<string, unknown>>;
  success_criteria?: string[];
};
