export type PlatformAosCoreTab =
  | "overview"
  | "orchestration"
  | "engine_registry"
  | "dependencies"
  | "platform_health"
  | "feature_flags"
  | "execution_control"
  | "governance"
  | "reports"
  | "executive";

export type AosEngine = {
  id: string;
  engine_key: string;
  engine_name: string;
  engine_version?: string;
  owner_team?: string;
  engine_status?: string;
  health_score?: number;
  dependencies?: unknown;
  business_pack_usage?: unknown;
  activity_summary?: string;
};

export type PlatformAosCoreCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  overview?: Record<string, string | number | undefined>;
  engine_registry?: AosEngine[];
  orchestration?: Record<string, unknown>;
  dependency_engine?: Record<string, unknown>;
  platform_governor?: Record<string, unknown>;
  feature_flags?: Record<string, unknown>[];
  platform_health?: Record<string, unknown>[];
  platform_health_center?: Record<string, unknown>[];
  companion_governance?: Record<string, unknown>;
  execution_coordination?: Record<string, unknown>;
  cross_engine_messaging?: Record<string, unknown>[];
  event_bus?: Record<string, unknown>;
  business_pack_registry?: Record<string, unknown>[];
  platform_policies?: Record<string, unknown>[];
  simulation_integration?: Record<string, unknown>;
  companion_advisor?: Record<string, unknown>;
  enterprise_readiness?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  audit_recent?: { event_type: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
};

export type PlatformAosCoreLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<PlatformAosCoreTab, string>;
  overview: Record<string, string>;
  actions: Record<string, string>;
  engineStatuses: Record<string, string>;
  enginesPage: { title: string; subtitle: string };
  featuresPage: { title: string; subtitle: string };
};
