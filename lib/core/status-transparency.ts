/**
 * Status & Transparency Engine helpers (Phase A.27).
 * Authoritative enforcement lives in Supabase RPCs (_ste_*).
 * Distinct from A.19 Observability — customer-facing status communication.
 */

export const STATUS_COMPONENTS = [
  "authentication",
  "support_ai",
  "admin_assistant",
  "knowledge_center",
  "integrations",
  "notifications",
  "dashboard",
  "api_platform",
  "platform",
] as const;

export const SERVICE_STATUSES = [
  "operational",
  "degraded_performance",
  "partial_outage",
  "major_outage",
  "maintenance",
] as const;

export const STATUS_SEVERITIES = ["informational", "low", "medium", "high", "critical"] as const;

export type StatusComponent = (typeof STATUS_COMPONENTS)[number];
export type ServiceStatus = (typeof SERVICE_STATUSES)[number];
export type StatusSeverity = (typeof STATUS_SEVERITIES)[number];

type StatusRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function isCriticalStatus(status?: string): boolean {
  return status === "major_outage" || status === "partial_outage";
}

export function canManageStatus(role: string): boolean {
  return role === "owner" || role === "administrator";
}

export function canPublishIncidents(role: string): boolean {
  return role === "owner" || role === "administrator" || role === "manager";
}

export async function recordStatusEvent(
  supabase: StatusRpcClient,
  params: {
    component: StatusComponent;
    status?: ServiceStatus;
    severity?: StatusSeverity;
    title: string;
    description?: string | null;
    public_visibility?: boolean;
    metadata?: Record<string, unknown>;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("record_status_event", {
    p_component: params.component,
    p_status: params.status ?? "operational",
    p_severity: params.severity ?? "informational",
    p_title: params.title,
    p_description: params.description ?? null,
    p_public_visibility: params.public_visibility ?? true,
    p_metadata: params.metadata ?? {},
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function publishStatusIncident(
  supabase: StatusRpcClient,
  params: {
    title: string;
    description?: string | null;
    component?: StatusComponent;
    severity?: StatusSeverity;
    status?: ServiceStatus;
    public_visibility?: boolean;
    metadata?: Record<string, unknown>;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("publish_status_incident", {
    p_title: params.title,
    p_description: params.description ?? null,
    p_component: params.component ?? "platform",
    p_severity: params.severity ?? "high",
    p_status: params.status ?? "partial_outage",
    p_public_visibility: params.public_visibility ?? true,
    p_metadata: params.metadata ?? {},
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateStatusIncident(
  supabase: StatusRpcClient,
  eventId: string,
  message: string,
  updateType = "update",
  publicVisibility = true
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_status_incident", {
    p_event_id: eventId,
    p_message: message,
    p_update_type: updateType,
    p_public_visibility: publicVisibility,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function resolveStatusIncident(
  supabase: StatusRpcClient,
  eventId: string,
  resolutionMessage?: string | null
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("resolve_status_incident", {
    p_event_id: eventId,
    p_resolution_message: resolutionMessage ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function publishMaintenanceNotice(
  supabase: StatusRpcClient,
  params: {
    title: string;
    description?: string | null;
    component?: StatusComponent;
    estimated_duration_minutes?: number;
    affected_services?: string[];
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("publish_maintenance_notice", {
    p_title: params.title,
    p_description: params.description ?? null,
    p_component: params.component ?? "platform",
    p_estimated_duration_minutes: params.estimated_duration_minutes ?? 60,
    p_affected_services: params.affected_services ?? [],
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPlatformStatusSummary(
  supabase: StatusRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_platform_status_summary");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPublicStatus(
  supabase: StatusRpcClient
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_public_status");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function saveStatusTransparencySettings(
  supabase: StatusRpcClient,
  settings: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("save_status_transparency_settings", {
    p_public_status_page_enabled: settings.public_status_page_enabled ?? null,
    p_tenant_notices_enabled: settings.tenant_notices_enabled ?? null,
    p_auto_publish_from_observability: settings.auto_publish_from_observability ?? null,
    p_critical_bypass_quiet_hours: settings.critical_bypass_quiet_hours ?? null,
    p_enabled_components: settings.enabled_components ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export function createStatusTransparencyAuditEntry(
  actionType: string,
  metadata: Record<string, unknown> = {}
) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}
