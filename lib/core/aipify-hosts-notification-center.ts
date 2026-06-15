/**
 * Aipify Hosts — Notification Center (Phase Airbnb 20).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsNotificationCenterDashboard(
  supabase: RpcClient,
  section = "all_notifications",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_notification_center_dashboard", { p_section: section });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsNotificationCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_notification_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateAipifyHostsNotificationStatus(
  supabase: RpcClient,
  notificationId: string,
  status: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_aipify_hosts_notification_status", {
    p_notification_id: notificationId,
    p_status: status,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function acknowledgeAipifyHostsCriticalAlert(
  supabase: RpcClient,
  notificationId: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("acknowledge_aipify_hosts_critical_alert", {
    p_notification_id: notificationId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateAipifyHostsNotificationPreferences(
  supabase: RpcClient,
  prefs: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_aipify_hosts_notification_preferences", prefs);
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
