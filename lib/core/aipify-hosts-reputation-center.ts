/**
 * Aipify Hosts — Review & Reputation Center (Phase Airbnb 37).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsReputationCenterDashboard(
  supabase: RpcClient,
  section = "review_overview",
  filters?: {
    propertyId?: string | null;
    category?: string | null;
    status?: string | null;
    dateFrom?: string | null;
    dateTo?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_reputation_center_dashboard", {
    p_section: section,
    p_property_id: filters?.propertyId ?? null,
    p_category: filters?.category ?? null,
    p_status: filters?.status ?? null,
    p_date_from: filters?.dateFrom ?? null,
    p_date_to: filters?.dateTo ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsReputationCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_reputation_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAipifyHostsReputationAction(
  supabase: RpcClient,
  params: {
    actionType: string;
    reviewId?: string | null;
    recoveryId?: string | null;
    status?: string | null;
    owner?: string | null;
    notes?: string | null;
    dueDate?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_aipify_hosts_reputation_action", {
    p_action_type: params.actionType,
    p_review_id: params.reviewId ?? null,
    p_recovery_id: params.recoveryId ?? null,
    p_status: params.status ?? null,
    p_owner: params.owner ?? null,
    p_notes: params.notes ?? null,
    p_due_date: params.dueDate ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
