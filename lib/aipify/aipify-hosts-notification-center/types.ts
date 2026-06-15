export type HostsNotificationCenterSectionKey =
  | "all_notifications"
  | "critical_alerts"
  | "operational_updates"
  | "guest_activity"
  | "team_activity"
  | "notification_settings";

export type HostsNotificationRow = {
  id: string;
  notification_key: string;
  category: string;
  priority: string;
  status: string;
  title: string;
  message: string;
  requires_attention: boolean;
  acknowledged: boolean;
  created_at: string;
};

export type HostsNotificationStats = {
  unread_count: number;
  critical_alerts: number;
  requires_attention: number;
};

export type HostsNotificationPreferences = {
  channel_in_app: boolean;
  channel_email: boolean;
  channel_push: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  min_priority: string;
  escalate_critical_to_owner: boolean;
  escalate_critical_to_property_manager: boolean;
  repeat_critical_alerts: boolean;
};

export type HostsNotificationCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  categories: string[];
  priorities: string[];
  notification_statuses: string[];
  delivery_channels: string[];
  stats: HostsNotificationStats;
  preferences: HostsNotificationPreferences;
  all_notifications: HostsNotificationRow[];
  critical_alerts: HostsNotificationRow[];
  operational_updates: HostsNotificationRow[];
  guest_activity: HostsNotificationRow[];
  team_activity: HostsNotificationRow[];
  recent_activity: HostsNotificationRow[];
};

export type HostsNotificationCenterActionResult = {
  success: boolean;
  notification_id?: string;
  status?: string;
};
