/**
 * Aipify Hosts — Communication Center (Phase Airbnb 31).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsCommunicationCenterDashboard(
  supabase: RpcClient,
  section = "guest_communications",
  filters?: { propertyId?: string | null; status?: string | null; recipientType?: string | null },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_communication_center_dashboard", {
    p_section: section,
    p_property_id: filters?.propertyId ?? null,
    p_status: filters?.status ?? null,
    p_recipient_type: filters?.recipientType ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsCommunicationCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_communication_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAipifyHostsCommunicationAction(
  supabase: RpcClient,
  params: {
    actionType: string;
    commId?: string | null;
    commType?: string | null;
    templateId?: string | null;
    announcementId?: string | null;
    notes?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_aipify_hosts_communication_action", {
    p_action_type: params.actionType,
    p_comm_id: params.commId ?? null,
    p_comm_type: params.commType ?? "guest",
    p_template_id: params.templateId ?? null,
    p_announcement_id: params.announcementId ?? null,
    p_notes: params.notes ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
