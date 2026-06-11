import type {
  AgentAccessEvent,
  AgentJob,
  AgentRegisterResult,
  AipifyAgent,
  DataResidencyPolicy,
  EnterpriseConnector,
  EnterpriseDeploymentCard,
  EnterpriseDeploymentDashboard,
  TenantDeploymentBundle,
  TenantDeploymentSettings,
} from "./types";

function parseAgent(row: unknown): AipifyAgent {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    agent_name: String(s.agent_name ?? ""),
    deployment_mode: String(s.deployment_mode ?? ""),
    status: String(s.status ?? ""),
    version: s.version as string | null | undefined,
    host_info: (s.host_info as Record<string, unknown>) ?? {},
    capabilities: (s.capabilities as Record<string, unknown>) ?? {},
    last_seen_at: s.last_seen_at as string | null | undefined,
    last_health_check_at: s.last_health_check_at as string | null | undefined,
    created_at: s.created_at as string | undefined,
  };
}

function parseJob(row: unknown): AgentJob {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    job_type: String(s.job_type ?? ""),
    status: String(s.status ?? ""),
    agent_id: s.agent_id as string | undefined,
    payload: (s.payload as Record<string, unknown>) ?? {},
    queued_at: s.queued_at as string | undefined,
    completed_at: s.completed_at as string | null | undefined,
    error_message: s.error_message as string | null | undefined,
  };
}

function parseEvent(row: unknown): AgentAccessEvent {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    event_type: String(s.event_type ?? ""),
    agent_id: s.agent_id as string | null | undefined,
    metadata: (s.metadata as Record<string, unknown>) ?? {},
    created_at: String(s.created_at ?? ""),
  };
}

function parseSettings(row: unknown): TenantDeploymentSettings {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    deployment_mode: s.deployment_mode as string | undefined,
    data_residency_mode: s.data_residency_mode as string | undefined,
    connectivity_mode: s.connectivity_mode as string | undefined,
    local_agent_required: s.local_agent_required as boolean | undefined,
    cloud_sync_allowed: s.cloud_sync_allowed as boolean | undefined,
    raw_data_cloud_sync_allowed: s.raw_data_cloud_sync_allowed as boolean | undefined,
    redaction_required: s.redaction_required as boolean | undefined,
    local_knowledge_enabled: s.local_knowledge_enabled as boolean | undefined,
    local_memory_enabled: s.local_memory_enabled as boolean | undefined,
    enterprise_governance_enabled: s.enterprise_governance_enabled as boolean | undefined,
    desktop_endpoint_mode: s.desktop_endpoint_mode as string | undefined,
    custom_desktop_endpoint_url: s.custom_desktop_endpoint_url as string | null | undefined,
  };
}

export function parseEnterpriseDeploymentCard(data: unknown): EnterpriseDeploymentCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    deployment_mode: d.deployment_mode as string | undefined,
    data_residency_mode: d.data_residency_mode as string | undefined,
    local_agent_required: d.local_agent_required as boolean | undefined,
    agents_online: d.agents_online as number | undefined,
    jobs_queued: d.jobs_queued as number | undefined,
    has_enterprise_access: d.has_enterprise_access as boolean | undefined,
    philosophy: d.philosophy as string | undefined,
    privacy_note: d.privacy_note as string | undefined,
  };
}

export function parseEnterpriseDeploymentDashboard(data: unknown): EnterpriseDeploymentDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const list = (key: string, parser: (r: unknown) => unknown) =>
    Array.isArray(d[key]) ? (d[key] as unknown[]).map(parser) : [];
  return {
    has_customer: Boolean(d.has_customer),
    has_enterprise_access: d.has_enterprise_access as boolean | undefined,
    upgrade_required: d.upgrade_required as boolean | undefined,
    settings: parseSettings(d.settings),
    agents: list("agents", parseAgent) as AipifyAgent[],
    recent_jobs: list("recent_jobs", parseJob) as AgentJob[],
    recent_agent_events: list("recent_agent_events", parseEvent) as AgentAccessEvent[],
  };
}

export function parseTenantDeploymentBundle(data: unknown): TenantDeploymentBundle {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    has_enterprise_access: d.has_enterprise_access as boolean | undefined,
    upgrade_required: d.upgrade_required as boolean | undefined,
    settings: parseSettings(d.settings),
  };
}

export function parseAipifyAgents(data: unknown): AipifyAgent[] {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!Array.isArray(d.agents)) return [];
  return (d.agents as unknown[]).map(parseAgent);
}

export function parseDataResidencyPolicies(data: unknown): DataResidencyPolicy[] {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!Array.isArray(d.policies)) return [];
  return (d.policies as unknown[]).map((row) => {
    const s = (row ?? {}) as Record<string, unknown>;
    return {
      id: s.id as string | undefined,
      policy_key: String(s.policy_key ?? ""),
      description: s.description as string | null | undefined,
      data_category: String(s.data_category ?? ""),
      storage_location: String(s.storage_location ?? ""),
      cloud_sync_allowed: Boolean(s.cloud_sync_allowed),
      redaction_required: Boolean(s.redaction_required),
      retention_days: s.retention_days as number | null | undefined,
    };
  });
}

export function parseEnterpriseConnectors(data: unknown): EnterpriseConnector[] {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!Array.isArray(d.connectors)) return [];
  return (d.connectors as unknown[]).map((row) => {
    const s = (row ?? {}) as Record<string, unknown>;
    return {
      id: s.id as string | undefined,
      connector_key: String(s.connector_key ?? ""),
      display_name: String(s.display_name ?? ""),
      requires_agent: Boolean(s.requires_agent),
      supported_deployment_modes: Array.isArray(s.supported_deployment_modes)
        ? (s.supported_deployment_modes as string[])
        : [],
      status: String(s.status ?? ""),
      permissions: (s.permissions as Record<string, unknown>) ?? {},
      config_ref: s.config_ref as string | null | undefined,
    };
  });
}

export function parseAgentRegisterResult(data: unknown): AgentRegisterResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    agent_id: String(d.agent_id ?? ""),
    agent_key: String(d.agent_key ?? ""),
    agent_name: String(d.agent_name ?? ""),
    deployment_mode: String(d.deployment_mode ?? ""),
    status: String(d.status ?? ""),
  };
}
