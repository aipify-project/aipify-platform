/**
 * Aipify Hosts — Cleaning Operations Center (Phase Airbnb 34).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsCleaningCenterDashboard(
  supabase: RpcClient,
  section = "todays_cleaning",
  filters?: { propertyId?: string | null; status?: string | null },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_cleaning_center_dashboard", {
    p_section: section,
    p_property_id: filters?.propertyId ?? null,
    p_status: filters?.status ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsCleaningCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_cleaning_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAipifyHostsCleaningAction(
  supabase: RpcClient,
  params: {
    actionType: string;
    cleaningTaskId?: string | null;
    cleanerId?: string | null;
    notes?: string | null;
    issueCategory?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_aipify_hosts_cleaning_action", {
    p_action_type: params.actionType,
    p_cleaning_task_id: params.cleaningTaskId ?? null,
    p_cleaner_id: params.cleanerId ?? null,
    p_notes: params.notes ?? null,
    p_issue_category: params.issueCategory ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
