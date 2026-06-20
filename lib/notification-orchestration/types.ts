export type NotificationItem = {
  id: string;
  notification_type: string;
  priority: string;
  status: string;
  summary: string;
  source?: string | null;
  read_at?: string | null;
  created_at: string;
};

export type ExecutiveAlertItem = {
  id: string;
  alert_number?: string | null;
  alert_type: string;
  priority: string;
  status: string;
  title: string;
  summary?: string | null;
  created_at?: string | null;
};

export type NotificationPreferences = {
  frequency?: string;
  channels?: unknown[];
  categories?: unknown[];
  language?: string;
  quiet_hours_start?: string | null;
  quiet_hours_end?: string | null;
};

import type { AppOrganizationContextState } from "@/lib/tenant/resolve-app-organization-context";

export type NotificationOrchestrationCenter = {
  found: boolean;
  access_state?: AppOrganizationContextState | string;
  error?: string;
  principle?: string;
  philosophy?: string;
  overview?: Record<string, unknown>;
  inbox?: NotificationItem[];
  unread?: NotificationItem[];
  priority?: NotificationItem[];
  approvals?: Record<string, unknown>[];
  tasks?: NotificationItem[];
  system_alerts?: NotificationItem[];
  executive_alerts?: ExecutiveAlertItem[];
  preferences?: NotificationPreferences;
  routing_rules?: Record<string, unknown>[];
  digests?: Record<string, unknown>[];
  history?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  audit_recent?: { action: string; summary: string; created_at: string }[];
  sections?: string[];
  routes?: Record<string, string>;
};
