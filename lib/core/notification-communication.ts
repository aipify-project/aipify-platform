/**
 * Notification & Communication Engine helpers (Phase A.17).
 * Authoritative enforcement lives in Supabase RPCs (_nce_*).
 */

export const NOTIFICATION_CATEGORIES = [
  "support",
  "approvals",
  "tasks",
  "integrations",
  "governance",
  "quality",
  "onboarding",
  "billing",
  "system_alerts",
] as const;

export const NOTIFICATION_PRIORITIES = ["low", "medium", "high", "critical"] as const;
export const NOTIFICATION_STATUSES = ["pending", "delivered", "read", "dismissed", "failed"] as const;
export const DIGEST_TYPES = ["daily", "weekly", "approval", "support"] as const;
export const NOTIFICATION_FREQUENCIES = ["immediate", "daily_digest", "weekly_digest"] as const;
export const DELIVERY_CHANNELS = ["in_app", "dashboard", "email"] as const;

export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number];
export type NotificationPriority = (typeof NOTIFICATION_PRIORITIES)[number];
export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number];
export type DigestType = (typeof DIGEST_TYPES)[number];
export type NotificationFrequency = (typeof NOTIFICATION_FREQUENCIES)[number];
export type DeliveryChannel = (typeof DELIVERY_CHANNELS)[number];

type NotificationRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function isCriticalNotification(priority?: string): boolean {
  return priority === "critical";
}

export function canSendNotifications(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export function canConfigureNotifications(role: string): boolean {
  return role === "owner" || role === "administrator" || role === "manager";
}

export async function sendNotification(
  supabase: NotificationRpcClient,
  params: {
    user_id?: string | null;
    category?: NotificationCategory;
    priority?: NotificationPriority;
    title: string;
    message?: string | null;
    action_url?: string | null;
    recommended_action?: string | null;
    delivery_channels?: DeliveryChannel[];
    metadata?: Record<string, unknown>;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("send_notification", {
    p_user_id: params.user_id ?? null,
    p_category: params.category ?? "system_alerts",
    p_priority: params.priority ?? "medium",
    p_title: params.title,
    p_message: params.message ?? null,
    p_action_url: params.action_url ?? null,
    p_recommended_action: params.recommended_action ?? null,
    p_delivery_channels: params.delivery_channels ?? ["in_app", "dashboard"],
    p_metadata: params.metadata ?? {},
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function sendCriticalAlert(
  supabase: NotificationRpcClient,
  params: {
    title: string;
    message?: string | null;
    action_url?: string | null;
    user_id?: string | null;
    category?: NotificationCategory;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("send_critical_alert", {
    p_title: params.title,
    p_message: params.message ?? null,
    p_action_url: params.action_url ?? null,
    p_user_id: params.user_id ?? null,
    p_category: params.category ?? "system_alerts",
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function markAsRead(
  supabase: NotificationRpcClient,
  notificationId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("mark_notification_read", {
    p_notification_id: notificationId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function dismissNotification(
  supabase: NotificationRpcClient,
  notificationId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("dismiss_notification", {
    p_notification_id: notificationId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getUnreadCount(
  supabase: NotificationRpcClient
): Promise<{ unread: number; critical_unread: number }> {
  const { data, error } = await supabase.rpc("get_notification_unread_count");
  if (error) throw new Error(error.message);
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    unread: Number(d.unread ?? 0),
    critical_unread: Number(d.critical_unread ?? 0),
  };
}

export async function generateDigest(
  supabase: NotificationRpcClient,
  digestType: DigestType = "daily"
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("generate_communication_digest", {
    p_digest_type: digestType,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function saveCommunicationPreferences(
  supabase: NotificationRpcClient,
  preferences: {
    preferred_channels?: DeliveryChannel[];
    frequency?: NotificationFrequency;
    quiet_hours?: Record<string, unknown>;
    category_subscriptions?: Record<string, boolean>;
    critical_bypass_quiet_hours?: boolean;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("save_communication_preferences", {
    p_preferred_channels: preferences.preferred_channels ?? null,
    p_frequency: preferences.frequency ?? null,
    p_quiet_hours: preferences.quiet_hours ?? null,
    p_category_subscriptions: preferences.category_subscriptions ?? null,
    p_critical_bypass_quiet_hours: preferences.critical_bypass_quiet_hours ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createNotificationAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
