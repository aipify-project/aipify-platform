export type DigitalTwinSimulationTab =
  | "overview"
  | "models"
  | "scenarios"
  | "forecasts"
  | "impacts"
  | "experiments"
  | "reports";

export type DigitalTwinSimulationCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  models?: Record<string, unknown>[];
  scenarios?: Record<string, unknown>[];
  forecasts?: Record<string, unknown>[];
  impacts?: Record<string, unknown>[];
  experiments?: Record<string, unknown>[];
  capacity?: Record<string, unknown>[];
  allocations?: Record<string, unknown>[];
  decision_previews?: Record<string, unknown>[];
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

export type DigitalTwinSimulationLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<DigitalTwinSimulationTab, string>;
  overview: Record<string, string>;
  sections: Record<string, string>;
  actions: Record<string, string>;
  impactDirection: Record<string, string>;
  impactMagnitude: Record<string, string>;
  whatIfTitle: string;
  whatIfSubtitle: string;
};
