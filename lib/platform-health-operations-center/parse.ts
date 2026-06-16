import {
  ALERT_CATEGORIES,
  ALERT_RESOLUTION_STATUSES,
  ALERT_SEVERITIES,
  DEPLOYMENT_STATUSES,
  INCIDENT_SEVERITIES,
  INCIDENT_STATUSES,
  SERVICE_STATUSES,
} from "./constants";
import type {
  PlatformHealthAlert,
  PlatformHealthAuditEntry,
  PlatformHealthDeployment,
  PlatformHealthExecutiveSummary,
  PlatformHealthIncident,
  PlatformHealthIncidentNote,
  PlatformHealthOperationsCenter,
  PlatformHealthResolvedIncident,
  PlatformHealthService,
} from "./types";

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asString(value: unknown, fallback = ""): string {
  return value == null ? fallback : String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function parseEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  const key = asString(value, fallback);
  return (allowed.includes(key as T) ? key : fallback) as T;
}

function parseService(raw: unknown): PlatformHealthService | null {
  const row = asRecord(raw);
  if (!row || !row.key) return null;
  return {
    key: asString(row.key),
    label: asString(row.label),
    status: parseEnum(row.status, SERVICE_STATUSES, "operational"),
    checked_at: asString(row.checked_at),
  };
}

function parseExecutiveSummary(raw: unknown): PlatformHealthExecutiveSummary {
  const row = asRecord(raw) ?? {};
  return {
    active_organizations: asNumber(row.active_organizations),
    active_subscriptions: asNumber(row.active_subscriptions),
    platform_uptime_pct: asNumber(row.platform_uptime_pct, 99.9),
    open_incidents: asNumber(row.open_incidents),
    resolved_incidents_this_month: asNumber(row.resolved_incidents_this_month),
    critical_alerts: asNumber(row.critical_alerts),
  };
}

function parseNote(raw: unknown): PlatformHealthIncidentNote | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    note: asString(row.note),
    created_at: asString(row.created_at),
  };
}

function parseIncident(raw: unknown): PlatformHealthIncident | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  const notes = Array.isArray(row.notes)
    ? row.notes.map(parseNote).filter((n): n is PlatformHealthIncidentNote => n !== null)
    : [];
  return {
    id: asString(row.id),
    title: asString(row.title),
    summary: asString(row.summary),
    service_key: asString(row.service_key, "platform"),
    severity: parseEnum(row.severity, INCIDENT_SEVERITIES, "medium"),
    status: parseEnum(row.status, INCIDENT_STATUSES, "investigating"),
    created_at: asString(row.created_at),
    resolved_at: row.resolved_at ? asString(row.resolved_at) : null,
    notes,
  };
}

function parseResolvedIncident(raw: unknown): PlatformHealthResolvedIncident | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    title: asString(row.title),
    severity: parseEnum(row.severity, INCIDENT_SEVERITIES, "medium"),
    status: parseEnum(row.status, INCIDENT_STATUSES, "resolved"),
    resolved_at: row.resolved_at ? asString(row.resolved_at) : null,
  };
}

function parseAlert(raw: unknown): PlatformHealthAlert | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    title: asString(row.title),
    category: parseEnum(row.category, ALERT_CATEGORIES, "service_interruption"),
    severity: parseEnum(row.severity, ALERT_SEVERITIES, "medium"),
    resolution_status: parseEnum(
      row.resolution_status,
      ALERT_RESOLUTION_STATUSES,
      "open"
    ),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
    resolved_at: row.resolved_at ? asString(row.resolved_at) : null,
  };
}

function parseDeployment(raw: unknown): PlatformHealthDeployment | null {
  const row = asRecord(raw);
  if (!row || !row.version) return null;
  return {
    id: row.id ? asString(row.id) : undefined,
    version: asString(row.version),
    previous_version: row.previous_version ? asString(row.previous_version) : null,
    deployed_at: asString(row.deployed_at),
    initiator: asString(row.initiator),
    status: parseEnum(row.status, DEPLOYMENT_STATUSES, "successful"),
  };
}

function parseAudit(raw: unknown): PlatformHealthAuditEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    action: asString(row.action),
    previous_state: asRecord(row.previous_state) ?? {},
    new_state: asRecord(row.new_state) ?? {},
    created_at: asString(row.created_at),
  };
}

export function parsePlatformHealthOperationsCenter(
  raw: unknown
): PlatformHealthOperationsCenter | null {
  const row = asRecord(raw);
  if (!row) return null;

  const services = Array.isArray(row.services)
    ? row.services.map(parseService).filter((s): s is PlatformHealthService => s !== null)
    : [];
  const incidents = Array.isArray(row.incidents)
    ? row.incidents.map(parseIncident).filter((i): i is PlatformHealthIncident => i !== null)
    : [];
  const resolvedIncidents = Array.isArray(row.resolved_incidents)
    ? row.resolved_incidents
        .map(parseResolvedIncident)
        .filter((i): i is PlatformHealthResolvedIncident => i !== null)
    : [];
  const alerts = Array.isArray(row.alerts)
    ? row.alerts.map(parseAlert).filter((a): a is PlatformHealthAlert => a !== null)
    : [];
  const deploymentHistory = Array.isArray(row.deployment_history)
    ? row.deployment_history
        .map(parseDeployment)
        .filter((d): d is PlatformHealthDeployment => d !== null)
    : [];
  const auditLogs = Array.isArray(row.audit_logs)
    ? row.audit_logs.map(parseAudit).filter((a): a is PlatformHealthAuditEntry => a !== null)
    : [];

  const deployment = parseDeployment(row.deployment) ?? {
    version: "—",
    previous_version: null,
    deployed_at: "",
    initiator: "",
    status: "successful" as const,
  };

  return {
    principle: asString(row.principle),
    services,
    executive_summary: parseExecutiveSummary(row.executive_summary),
    incidents,
    resolved_incidents: resolvedIncidents,
    alerts,
    deployment,
    deployment_history: deploymentHistory,
    audit_logs: auditLogs,
    can_manage: asBool(row.can_manage, false),
  };
}
