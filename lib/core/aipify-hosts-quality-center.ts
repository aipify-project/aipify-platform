/**
 * Aipify Hosts — Quality Center (Phase Airbnb 22).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsQualityCenterDashboard(
  supabase: RpcClient,
  section = "upcoming_inspections",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_quality_center_dashboard", { p_section: section });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsQualityCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_quality_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function scheduleAipifyHostsInspection(
  supabase: RpcClient,
  params: {
    inspectionType: string;
    propertyId?: string | null;
    assignedInspector?: string | null;
    scheduledDate?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("schedule_aipify_hosts_inspection", {
    p_inspection_type: params.inspectionType,
    p_property_id: params.propertyId ?? null,
    p_assigned_inspector: params.assignedInspector ?? null,
    p_scheduled_date: params.scheduledDate ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateAipifyHostsInspectionStatus(
  supabase: RpcClient,
  inspectionId: string,
  status: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_aipify_hosts_inspection_status", {
    p_inspection_id: inspectionId,
    p_status: status,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function recordAipifyHostsInspectionOutcome(
  supabase: RpcClient,
  inspectionId: string,
  outcome: string,
  checklistResults?: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("record_aipify_hosts_inspection_outcome", {
    p_inspection_id: inspectionId,
    p_outcome: outcome,
    p_checklist_results: checklistResults ?? {},
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createAipifyHostsQualityReview(
  supabase: RpcClient,
  params: {
    inspectionId: string;
    propertyScore?: number;
    inspectorNotes?: string | null;
    recommendedActions?: string | null;
    improvementOpportunities?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_aipify_hosts_quality_review", {
    p_inspection_id: params.inspectionId,
    p_property_score: params.propertyScore ?? 0,
    p_inspector_notes: params.inspectorNotes ?? null,
    p_recommended_actions: params.recommendedActions ?? null,
    p_improvement_opportunities: params.improvementOpportunities ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createAipifyHostsInspectionCorrectiveAction(
  supabase: RpcClient,
  params: {
    inspectionId: string;
    actionSummary: string;
    assignedOwner?: string | null;
    dueDate?: string | null;
    createTask?: boolean;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_aipify_hosts_inspection_corrective_action", {
    p_inspection_id: params.inspectionId,
    p_action_summary: params.actionSummary,
    p_assigned_owner: params.assignedOwner ?? null,
    p_due_date: params.dueDate ?? null,
    p_create_task: params.createTask ?? true,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function escalateAipifyHostsInspectionFinding(
  supabase: RpcClient,
  inspectionId: string,
  actionId?: string | null,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("escalate_aipify_hosts_inspection_finding", {
    p_inspection_id: inspectionId,
    p_action_id: actionId ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function addAipifyHostsInspectionPhotoEvidence(
  supabase: RpcClient,
  params: {
    inspectionId: string;
    checklistCategory: string;
    referenceLabel: string;
    caption?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("add_aipify_hosts_inspection_photo_evidence", {
    p_inspection_id: params.inspectionId,
    p_checklist_category: params.checklistCategory,
    p_reference_label: params.referenceLabel,
    p_caption: params.caption ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
