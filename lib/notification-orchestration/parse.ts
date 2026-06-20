import type {
  ExecutiveAlertItem,
  NotificationItem,
  NotificationOrchestrationCenter,
  NotificationPreferences,
} from "./types";

function mapArr(arr: unknown) {
  return Array.isArray(arr) ? (arr as Record<string, unknown>[]) : [];
}

function parseNotification(row: Record<string, unknown>): NotificationItem {
  return {
    id: String(row.id ?? ""),
    notification_type: String(row.notification_type ?? "information"),
    priority: String(row.priority ?? "normal"),
    status: String(row.status ?? "pending"),
    summary: String(row.summary ?? ""),
    source: typeof row.source === "string" ? row.source : null,
    read_at: typeof row.read_at === "string" ? row.read_at : null,
    created_at: String(row.created_at ?? ""),
  };
}

function parseExecutiveAlert(row: Record<string, unknown>): ExecutiveAlertItem {
  return {
    id: String(row.id ?? ""),
    alert_number: typeof row.alert_number === "string" ? row.alert_number : null,
    alert_type: String(row.alert_type ?? "custom"),
    priority: String(row.priority ?? "high"),
    status: String(row.status ?? "active"),
    title: String(row.title ?? ""),
    summary: typeof row.summary === "string" ? row.summary : null,
    created_at: typeof row.created_at === "string" ? row.created_at : null,
  };
}

export function parseNotificationOrchestrationCenter(data: unknown): NotificationOrchestrationCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) {
    return {
      found: false,
      access_state: typeof row.access_state === "string" ? row.access_state : undefined,
      error: typeof row.error === "string" ? row.error : undefined,
    };
  }

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    philosophy: typeof row.philosophy === "string" ? row.philosophy : undefined,
    overview: row.overview as Record<string, unknown> | undefined,
    inbox: mapArr(row.inbox).map(parseNotification),
    unread: mapArr(row.unread).map(parseNotification),
    priority: mapArr(row.priority).map(parseNotification),
    approvals: mapArr(row.approvals),
    tasks: mapArr(row.tasks).map(parseNotification),
    system_alerts: mapArr(row.system_alerts).map(parseNotification),
    executive_alerts: mapArr(row.executive_alerts).map(parseExecutiveAlert),
    preferences: row.preferences as NotificationPreferences | undefined,
    routing_rules: mapArr(row.routing_rules),
    digests: mapArr(row.digests),
    history: mapArr(row.history),
    reports: row.reports as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? (row.audit_recent as Record<string, unknown>[]).map((a) => ({
          action: String(a.action ?? ""),
          summary: String(a.summary ?? ""),
          created_at: String(a.created_at ?? ""),
        }))
      : [],
    sections: Array.isArray(row.sections) ? (row.sections as string[]) : [],
    routes: row.routes as Record<string, string> | undefined,
  };
}
