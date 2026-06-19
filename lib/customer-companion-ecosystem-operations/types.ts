export type CompanionEcosystemTab =
  | "overview"
  | "providers"
  | "services"
  | "marketplace"
  | "requests"
  | "approvals"
  | "ratings"
  | "reports"
  | "executive";

export type EcosystemApproval = {
  approval_key: string;
  approval_title: string;
  request_key?: string;
  approval_status?: string;
  summary?: string;
};

export type EcosystemRequest = {
  request_key: string;
  service_title: string;
  provider_key?: string;
  provider_name?: string;
  request_status?: string;
  domain_scope?: string;
  summary?: string;
  recorded_at?: string;
};

export type CompanionEcosystemCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  providers?: Record<string, unknown>[];
  services?: Record<string, unknown>[];
  marketplace?: Record<string, unknown>;
  requests?: EcosystemRequest[];
  approvals?: EcosystemApproval[];
  ratings?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  integrations?: Record<string, unknown>;
  audit_recent?: { event_type: string; audit_category?: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  notifications?: Record<string, unknown>;
  error?: string;
};

export type CompanionEcosystemLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<CompanionEcosystemTab, string>;
  overview: Record<string, string>;
  actions: Record<string, string>;
  sections: Record<string, string>;
  performanceLabels: Record<string, string>;
  verificationStatuses: Record<string, string>;
};
