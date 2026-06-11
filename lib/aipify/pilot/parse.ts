import type {
  PilotChecklistItem,
  PilotDashboard,
  PilotEvent,
  PilotInstallStatus,
  PilotIntegration,
  PilotModule,
  PilotTenantProfile,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parsePilotProfile(raw: unknown): PilotTenantProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  return {
    id: String(r.id ?? ""),
    tenant_id: String(r.tenant_id ?? ""),
    name: String(r.name ?? ""),
    slug: String(r.slug ?? ""),
    tenant_type: String(r.tenant_type ?? "customer"),
    industry: r.industry ? String(r.industry) : null,
    region: r.region ? String(r.region) : null,
    default_language: String(r.default_language ?? "en"),
    supported_languages: Array.isArray(r.supported_languages)
      ? r.supported_languages.map(String)
      : ["en"],
    timezone: String(r.timezone ?? "Europe/Oslo"),
    pilot_status: String(r.pilot_status ?? "setup") as PilotTenantProfile["pilot_status"],
    pilot_stage: Number(r.pilot_stage ?? 1),
    metadata: asRecord(r.metadata),
  };
}

export function parsePilotDashboard(raw: unknown): PilotDashboard | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const checklist = asRecord(r.checklist_summary);
  return {
    tenant_id: String(r.tenant_id ?? ""),
    profile: parsePilotProfile(r.profile),
    setup_completeness_score: Number(r.setup_completeness_score ?? 0),
    safe_mode: Boolean(r.safe_mode),
    governance_mode: String(r.governance_mode ?? "safe"),
    emergency_stop_active: Boolean(r.emergency_stop_active),
    support_ai_mode: String(r.support_ai_mode ?? "disabled"),
    knowledge_articles_count: Number(r.knowledge_articles_count ?? 0),
    open_knowledge_gaps: Number(r.open_knowledge_gaps ?? 0),
    workflows_detected: Number(r.workflows_detected ?? 0),
    integrations_connected: Number(r.integrations_connected ?? 0),
    modules_enabled: Number(r.modules_enabled ?? 0),
    last_discovery_run: r.last_discovery_run
      ? asRecord(r.last_discovery_run)
      : null,
    pending_approvals: Number(r.pending_approvals ?? 0),
    blocked_actions: Number(r.blocked_actions ?? 0),
    checklist_summary: {
      completed: Number(checklist.completed ?? 0),
      total: Number(checklist.total ?? 0),
    },
    next_recommended_step: String(r.next_recommended_step ?? ""),
  };
}

export function parsePilotInstallStatus(raw: unknown): PilotInstallStatus {
  if (!raw || typeof raw !== "object") return { exists: false };
  const r = raw as Record<string, unknown>;
  return {
    exists: Boolean(r.exists),
    slug: r.slug ? String(r.slug) : undefined,
    profile: r.profile ? parsePilotProfile(r.profile) ?? undefined : undefined,
    dashboard: r.dashboard ? parsePilotDashboard(r.dashboard) ?? undefined : undefined,
  };
}

export function parsePilotModules(raw: unknown): PilotModule[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const r = asRecord(item);
    return {
      id: r.id ? String(r.id) : undefined,
      module_key: String(r.module_key ?? ""),
      enabled: Boolean(r.enabled),
      licensed: r.licensed !== undefined ? Boolean(r.licensed) : undefined,
      status: String(r.status ?? "disabled"),
      mode: String(r.mode ?? "safe") as PilotModule["mode"],
      settings: asRecord(r.settings),
      enabled_at: r.enabled_at ? String(r.enabled_at) : null,
      updated_at: r.updated_at ? String(r.updated_at) : undefined,
    };
  });
}

export function parsePilotIntegrations(raw: unknown): PilotIntegration[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const r = asRecord(item);
    return {
      id: r.id ? String(r.id) : undefined,
      integration_key: String(r.integration_key ?? ""),
      display_name: String(r.display_name ?? ""),
      status: String(r.status ?? "not_connected"),
      connection_mode: String(r.connection_mode ?? "api"),
      capabilities: asRecord(r.capabilities),
      last_sync_at: r.last_sync_at ? String(r.last_sync_at) : null,
      error_message: r.error_message ? String(r.error_message) : null,
    };
  });
}

export function parsePilotChecklist(raw: unknown): PilotChecklistItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const r = asRecord(item);
    return {
      id: String(r.id ?? ""),
      checklist_key: String(r.checklist_key ?? ""),
      title: String(r.title ?? ""),
      description: r.description ? String(r.description) : null,
      status: String(r.status ?? "pending") as PilotChecklistItem["status"],
      priority: Number(r.priority ?? 0),
      completed_at: r.completed_at ? String(r.completed_at) : null,
    };
  });
}

export function parsePilotEvents(raw: unknown): PilotEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const r = asRecord(item);
    return {
      id: String(r.id ?? ""),
      event_type: String(r.event_type ?? ""),
      title: String(r.title ?? ""),
      summary: r.summary ? String(r.summary) : null,
      severity: String(r.severity ?? "info"),
      metadata: asRecord(r.metadata),
      created_by: String(r.created_by ?? "system"),
      created_at: String(r.created_at ?? ""),
    };
  });
}
