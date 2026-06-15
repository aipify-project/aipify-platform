import type {
  HostsNotificationCenterActionResult,
  HostsNotificationCenterDashboard,
  HostsNotificationPreferences,
  HostsNotificationRow,
  HostsNotificationStats,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function parseNotifications(data: unknown): HostsNotificationRow[] {
  return asArray<unknown>(data)
    .map((row) => {
      const d = row as Record<string, unknown>;
      if (!d.id) return null;
      return {
        id: String(d.id),
        notification_key: typeof d.notification_key === "string" ? d.notification_key : "",
        category: typeof d.category === "string" ? d.category : "",
        priority: typeof d.priority === "string" ? d.priority : "",
        status: typeof d.status === "string" ? d.status : "",
        title: typeof d.title === "string" ? d.title : "",
        message: typeof d.message === "string" ? d.message : "",
        requires_attention: Boolean(d.requires_attention),
        acknowledged: Boolean(d.acknowledged),
        created_at: typeof d.created_at === "string" ? d.created_at : "",
      };
    })
    .filter((r): r is HostsNotificationRow => r !== null);
}

function parseStats(data: unknown): HostsNotificationStats {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    unread_count: Number(d.unread_count ?? 0),
    critical_alerts: Number(d.critical_alerts ?? 0),
    requires_attention: Number(d.requires_attention ?? 0),
  };
}

function parsePreferences(data: unknown): HostsNotificationPreferences {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    channel_in_app: Boolean(d.channel_in_app ?? true),
    channel_email: Boolean(d.channel_email ?? true),
    channel_push: Boolean(d.channel_push ?? false),
    quiet_hours_enabled: Boolean(d.quiet_hours_enabled ?? false),
    quiet_hours_start: typeof d.quiet_hours_start === "string" ? d.quiet_hours_start : "22:00",
    quiet_hours_end: typeof d.quiet_hours_end === "string" ? d.quiet_hours_end : "07:00",
    min_priority: typeof d.min_priority === "string" ? d.min_priority : "informational",
    escalate_critical_to_owner: Boolean(d.escalate_critical_to_owner ?? true),
    escalate_critical_to_property_manager: Boolean(d.escalate_critical_to_property_manager ?? true),
    repeat_critical_alerts: Boolean(d.repeat_critical_alerts ?? true),
  };
}

export function parseAipifyHostsNotificationCenterDashboard(data: unknown): HostsNotificationCenterDashboard | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (!d.has_customer) return null;
  return {
    has_customer: true,
    enabled: Boolean(d.enabled ?? true),
    package_key: typeof d.package_key === "string" ? d.package_key : "hosts_solo",
    active_section: typeof d.active_section === "string" ? d.active_section : "all_notifications",
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    governance: (d.governance as Record<string, boolean>) ?? {},
    sections: asArray<{ key: string; label: string }>(d.sections),
    categories: asArray<string>(d.categories),
    priorities: asArray<string>(d.priorities),
    notification_statuses: asArray<string>(d.notification_statuses),
    delivery_channels: asArray<string>(d.delivery_channels),
    stats: parseStats(d.stats),
    preferences: parsePreferences(d.preferences),
    all_notifications: parseNotifications(d.all_notifications),
    critical_alerts: parseNotifications(d.critical_alerts),
    operational_updates: parseNotifications(d.operational_updates),
    guest_activity: parseNotifications(d.guest_activity),
    team_activity: parseNotifications(d.team_activity),
    recent_activity: parseNotifications(d.recent_activity),
  };
}

export function parseAipifyHostsNotificationCenterActionResult(data: unknown): HostsNotificationCenterActionResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    success: Boolean(d.success),
    notification_id: d.notification_id != null ? String(d.notification_id) : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
  };
}
