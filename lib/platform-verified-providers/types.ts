export type VerifiedProviderTab =
  | "overview"
  | "providers"
  | "services"
  | "verifications"
  | "contracts"
  | "performance"
  | "audit";

export type VerifiedProviderCenter = {
  found: boolean;
  principle?: string;
  section?: string;
  overview?: Record<string, string | number | undefined>;
  providers?: Record<string, unknown>[];
  services?: Record<string, unknown>[];
  verifications?: Record<string, unknown>[];
  contracts?: Record<string, unknown>[];
  performance?: Record<string, unknown>[];
  audit_recent?: { event_type: string; summary: string; created_at?: string; provider_key?: string }[];
  provider_categories?: string[];
  verification_statuses?: Record<string, string>;
  routes?: Record<string, string>;
  mobile_access?: Record<string, unknown>;
  error?: string;
};

export type VerifiedProviderLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<VerifiedProviderTab, string>;
  overview: Record<string, string>;
  actions: Record<string, string>;
  verificationStatuses: Record<string, string>;
  performanceLabels: Record<string, string>;
};
