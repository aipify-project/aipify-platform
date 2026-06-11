/**
 * Integration Engine helpers (Phase A.8).
 * Authoritative enforcement lives in Supabase RPCs (_ige_*).
 */

export const INTEGRATION_STATUSES = ["pending", "active", "disabled", "failed", "archived"] as const;
export type IntegrationStatus = (typeof INTEGRATION_STATUSES)[number];

export const INTEGRATION_SYNC_STATUSES = ["pending", "running", "completed", "failed", "retrying"] as const;
export type IntegrationSyncStatus = (typeof INTEGRATION_SYNC_STATUSES)[number];

export const AVAILABLE_INTEGRATIONS = ["unonight", "email_provider", "knowledge_center_import"] as const;
export type AvailableIntegrationKey = (typeof AVAILABLE_INTEGRATIONS)[number];

export const FUTURE_INTEGRATIONS = [
  "shopify",
  "woocommerce",
  "wordpress",
  "stripe",
  "resend",
  "slack",
  "crm",
  "erp",
] as const;

type IntegrationRpcClient = {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export function isIntegrationHealthy(status?: string, enabled?: boolean): boolean {
  return status === "active" && enabled === true;
}

export async function createIntegration(
  supabase: IntegrationRpcClient,
  params: {
    integration_key: string;
    configuration?: Record<string, unknown>;
    secret?: string;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("create_organization_integration", {
    p_integration_key: params.integration_key,
    p_configuration: params.configuration ?? {},
    p_secret: params.secret ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function updateIntegration(
  supabase: IntegrationRpcClient,
  integrationId: string,
  params: { configuration?: Record<string, unknown>; enabled?: boolean }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("update_organization_integration", {
    p_integration_id: integrationId,
    p_configuration: params.configuration ?? null,
    p_enabled: params.enabled ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function disableIntegration(
  supabase: IntegrationRpcClient,
  integrationId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("disable_organization_integration", {
    p_integration_id: integrationId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function syncIntegration(
  supabase: IntegrationRpcClient,
  integrationId: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("sync_organization_integration", {
    p_integration_id: integrationId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function validateWebhook(
  supabase: IntegrationRpcClient,
  params: {
    integration_id: string;
    event_type: string;
    payload: Record<string, unknown>;
    signature?: string;
  }
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("validate_integration_webhook", {
    p_integration_id: params.integration_id,
    p_event_type: params.event_type,
    p_payload: params.payload,
    p_signature: params.signature ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function connectUnonightPilot(
  supabase: IntegrationRpcClient,
  configuration: Record<string, unknown> = {}
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("connect_unonight_integration", {
    p_configuration: configuration,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function rotateIntegrationCredentials(
  supabase: IntegrationRpcClient,
  integrationId: string,
  newSecret: string
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("rotate_integration_credentials", {
    p_integration_id: integrationId,
    p_new_secret: newSecret,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

/** Audit entries are written server-side via _ige_log — this is a typed action catalog for clients. */
export function createIntegrationAuditEntry(actionType: string, metadata: Record<string, unknown> = {}) {
  return { action_type: actionType, metadata, recorded_server_side: true as const };
}

export function recordSyncResult(
  status: IntegrationSyncStatus,
  recordsProcessed: number,
  errorMessage?: string
) {
  return { status, records_processed: recordsProcessed, error_message: errorMessage ?? null };
}
