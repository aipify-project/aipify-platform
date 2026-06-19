export type DeveloperPortalTab =
  | "overview"
  | "documentation"
  | "apis"
  | "sdks"
  | "testing"
  | "publishing"
  | "analytics"
  | "audit";

export type DeveloperPortalCenter = {
  found: boolean;
  principle?: string;
  section?: string;
  overview?: Record<string, string | number | undefined>;
  publishers?: Record<string, unknown>[];
  extensions?: Record<string, unknown>[];
  sdk_modules?: Record<string, unknown>[];
  documentation?: Record<string, unknown>;
  certification_statuses?: Record<string, string>;
  audit_recent?: { event_type: string; summary: string; created_at?: string }[];
  routes?: Record<string, string>;
  mobile_access?: Record<string, unknown>;
  error?: string;
};

export type DeveloperPortalLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<DeveloperPortalTab, string>;
  overview: Record<string, string>;
  actions: Record<string, string>;
};
