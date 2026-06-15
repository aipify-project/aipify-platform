/**
 * Aipify Hosts — Incident Center (Phase Airbnb 21).
 */

type RpcClient = {
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function getAipifyHostsIncidentCenterDashboard(
  supabase: RpcClient,
  section = "active_incidents",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_incident_center_dashboard", { p_section: section });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getAipifyHostsIncidentCenterCard(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_aipify_hosts_incident_center_card");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function createAipifyHostsIncident(
  supabase: RpcClient,
  params: {
    incidentType: string;
    description: string;
    propertyId?: string | null;
    severity?: string;
    reportedBy?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_aipify_hosts_incident", {
    p_incident_type: params.incidentType,
    p_description: params.description,
    p_property_id: params.propertyId ?? null,
    p_severity: params.severity ?? "medium",
    p_reported_by: params.reportedBy ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateAipifyHostsIncidentStatus(
  supabase: RpcClient,
  incidentId: string,
  status: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_aipify_hosts_incident_status", {
    p_incident_id: incidentId,
    p_status: status,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateAipifyHostsIncidentSeverity(
  supabase: RpcClient,
  incidentId: string,
  severity: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_aipify_hosts_incident_severity", {
    p_incident_id: incidentId,
    p_severity: severity,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function assignAipifyHostsIncidentOwner(
  supabase: RpcClient,
  incidentId: string,
  owner: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("assign_aipify_hosts_incident_owner", {
    p_incident_id: incidentId,
    p_owner: owner,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function escalateAipifyHostsIncident(
  supabase: RpcClient,
  incidentId: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("escalate_aipify_hosts_incident", {
    p_incident_id: incidentId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function reportAipifyHostsEmergencyEvent(
  supabase: RpcClient,
  params: {
    eventType: string;
    description: string;
    propertyId?: string | null;
    reportedBy?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("report_aipify_hosts_emergency_event", {
    p_event_type: params.eventType,
    p_description: params.description,
    p_property_id: params.propertyId ?? null,
    p_reported_by: params.reportedBy ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function performAipifyHostsIncidentRecoveryAction(
  supabase: RpcClient,
  params: {
    incidentId: string;
    actionType: string;
    summary?: string | null;
    assigneeRole?: string | null;
    playbookKey?: string | null;
  },
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("perform_aipify_hosts_incident_recovery_action", {
    p_incident_id: params.incidentId,
    p_action_type: params.actionType,
    p_summary: params.summary ?? null,
    p_assignee_role: params.assigneeRole ?? null,
    p_playbook_key: params.playbookKey ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function initiateAipifyHostsIncidentPlaybook(
  supabase: RpcClient,
  incidentId: string,
  playbookKey: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("initiate_aipify_hosts_incident_playbook", {
    p_incident_id: incidentId,
    p_playbook_key: playbookKey,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
