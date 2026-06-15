/**
 * Aipify Hosts — Document Center (Phase Airbnb 25).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsDocumentCenterDashboard(
  supabase: RpcClient,
  params: {
    section?: string;
    search?: string | null;
    propertyId?: string | null;
    category?: string | null;
    status?: string | null;
  } = {},
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_document_center_dashboard", {
    p_section: params.section ?? "property_documents",
    p_search: params.search ?? null,
    p_property_id: params.propertyId ?? null,
    p_category: params.category ?? null,
    p_status: params.status ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsDocumentCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_document_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function uploadAipifyHostsDocument(
  supabase: RpcClient,
  params: {
    documentName: string;
    category: string;
    propertyId?: string | null;
    expirationDate?: string | null;
    fileLabel?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("upload_aipify_hosts_document", {
    p_document_name: params.documentName,
    p_category: params.category,
    p_property_id: params.propertyId ?? null,
    p_expiration_date: params.expirationDate ?? null,
    p_file_label: params.fileLabel ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAipifyHostsDocumentAction(
  supabase: RpcClient,
  params: {
    documentId: string;
    actionType: string;
    changeNotes?: string | null;
    fileLabel?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_aipify_hosts_document_action", {
    p_document_id: params.documentId,
    p_action_type: params.actionType,
    p_change_notes: params.changeNotes ?? null,
    p_file_label: params.fileLabel ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
