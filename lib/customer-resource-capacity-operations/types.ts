export type ResourceCapacityTab =
  | "overview"
  | "capacity"
  | "teams"
  | "workloads"
  | "allocations"
  | "forecasts"
  | "availability"
  | "reports";

export type ResourceCapacityCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  registry?: Record<string, unknown>[];
  capacity?: Record<string, unknown>[];
  teams?: Record<string, unknown>[];
  workloads?: Record<string, unknown>[];
  allocations?: Record<string, unknown>[];
  forecasts?: Record<string, unknown>[];
  availability?: Record<string, unknown>[];
  overloads?: Record<string, unknown>[];
  underutilization?: Record<string, unknown>[];
  skill_matches?: Record<string, unknown>[];
  projects?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  executive_dashboard?: Record<string, unknown>;
  recommendations?: Record<string, unknown>[];
  companion?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  audit_recent?: { event_type: string; audit_category?: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  error?: string;
};

export type ResourceCapacityLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<ResourceCapacityTab, string>;
  overview: Record<string, string>;
  sections: Record<string, string>;
  actions: Record<string, string>;
  healthStatus: Record<string, string>;
  availabilityStatus: Record<string, string>;
  deliveryRisk: Record<string, string>;
};
