import {
  APPROVAL_ROLES,
  AUDIENCES,
  CALENDAR_EVENT_TYPES,
  CHANGE_LOG_CATEGORIES,
  COMMUNICATION_CHANNELS,
  RELEASE_STATUSES,
  RELEASE_TYPES,
  RISK_LEVELS,
} from "./constants";
import type {
  ApprovalRole,
  Audience,
  CalendarEventType,
  ChangeLogCategory,
  CommunicationChannel,
  ReleaseStatus,
  ReleaseType,
  RiskLevel,
} from "./constants";
import type {
  CalendarEvent,
  ChangeLogEntry,
  ReleaseApproval,
  ReleaseAuditEntry,
  ReleaseCenter,
  ReleaseCenterFilters,
  ReleaseCommunication,
  ReleaseOverview,
  ReleaseRecord,
  ReleaseRollback,
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

function asBool(value: unknown): boolean {
  return value === true;
}

function parseEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  const str = asString(value, fallback);
  return (allowed.includes(str as T) ? str : fallback) as T;
}

function parseOverview(raw: unknown): ReleaseOverview {
  const row = asRecord(raw) ?? {};
  return {
    upcoming_releases: asNumber(row.upcoming_releases),
    releases_in_testing: asNumber(row.releases_in_testing),
    production_releases: asNumber(row.production_releases),
    emergency_hotfixes: asNumber(row.emergency_hotfixes),
    notifications_pending: asNumber(row.notifications_pending),
    recently_completed: asNumber(row.recently_completed),
  };
}

function parseChangeLogEntry(raw: unknown): ChangeLogEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    release_id: asString(row.release_id),
    release_name: row.release_name ? asString(row.release_name) : undefined,
    version: asString(row.version),
    category: parseEnum(row.category, CHANGE_LOG_CATEGORIES, "improvement"),
    summary: asString(row.summary),
    release_date: row.release_date ? asString(row.release_date) : null,
    status: parseEnum(row.status, RELEASE_STATUSES, "planned"),
    audience: parseEnum(row.audience, AUDIENCES, "all_customers"),
  };
}

function parseApproval(raw: unknown): ReleaseApproval | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    approval_role: parseEnum(row.approval_role, APPROVAL_ROLES, "super_admin"),
    approver: asString(row.approver),
    status: asString(row.status),
    notes: asString(row.notes),
    decided_at: row.decided_at ? asString(row.decided_at) : null,
  };
}

function parseCommunication(raw: unknown): ReleaseCommunication | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    channel: parseEnum(row.channel, COMMUNICATION_CHANNELS, "customer_portal"),
    audience: parseEnum(row.audience, AUDIENCES, "all_customers"),
    status: asString(row.status),
    published_at: row.published_at ? asString(row.published_at) : null,
  };
}

function parseRollback(raw: unknown): ReleaseRollback | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    rollback_reason: asString(row.rollback_reason),
    impact_assessment: asString(row.impact_assessment),
    resolution_notes: asString(row.resolution_notes),
    recovery_actions: asString(row.recovery_actions),
    created_at: asString(row.created_at),
  };
}

function parseRelease(raw: unknown): ReleaseRecord | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  const plans = Array.isArray(row.target_plans)
    ? row.target_plans.map((p) => asString(p)).filter(Boolean)
    : [];
  return {
    id: asString(row.id),
    release_name: asString(row.release_name),
    release_version: asString(row.release_version),
    release_type: parseEnum(row.release_type, RELEASE_TYPES, "minor"),
    description: asString(row.description),
    planned_date: row.planned_date ? asString(row.planned_date) : null,
    actual_date: row.actual_date ? asString(row.actual_date) : null,
    owner: asString(row.owner),
    risk_level: parseEnum(row.risk_level, RISK_LEVELS, "medium"),
    status: parseEnum(row.status, RELEASE_STATUSES, "planned"),
    audience: parseEnum(row.audience, AUDIENCES, "all_customers"),
    target_plans: plans,
    requires_approval: asBool(row.requires_approval),
    approval_status: asString(row.approval_status, "not_required"),
    notifications_pending: asBool(row.notifications_pending),
    change_log: Array.isArray(row.change_log)
      ? row.change_log.map(parseChangeLogEntry).filter((e): e is ChangeLogEntry => e != null)
      : [],
    approvals: Array.isArray(row.approvals)
      ? row.approvals.map(parseApproval).filter((a): a is ReleaseApproval => a != null)
      : [],
    communications: Array.isArray(row.communications)
      ? row.communications.map(parseCommunication).filter((c): c is ReleaseCommunication => c != null)
      : [],
    rollbacks: Array.isArray(row.rollbacks)
      ? row.rollbacks.map(parseRollback).filter((r): r is ReleaseRollback => r != null)
      : [],
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
  };
}

function parseCalendarEvent(raw: unknown): CalendarEvent | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    event_type: parseEnum(row.event_type, CALENDAR_EVENT_TYPES, "upcoming_release"),
    title: asString(row.title),
    summary: asString(row.summary),
    starts_at: asString(row.starts_at),
    ends_at: row.ends_at ? asString(row.ends_at) : null,
    release_id: row.release_id ? asString(row.release_id) : null,
  };
}

function parseAudit(raw: unknown): ReleaseAuditEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    release_id: row.release_id ? asString(row.release_id) : null,
    event_type: asString(row.event_type),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

function parseArray<T>(raw: unknown, parser: (item: unknown) => T | null): T[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parser).filter((item): item is T => item != null);
}

export function buildReleaseFilterQuery(filters: ReleaseCenterFilters): string {
  const params = new URLSearchParams();
  if (filters.release_type) params.set("release_type", filters.release_type);
  if (filters.status) params.set("status", filters.status);
  if (filters.owner) params.set("owner", filters.owner);
  if (filters.audience) params.set("audience", filters.audience);
  if (filters.date_from) params.set("date_from", filters.date_from);
  if (filters.date_to) params.set("date_to", filters.date_to);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function parseReleaseCenter(raw: unknown): ReleaseCenter | null {
  const row = asRecord(raw);
  if (!row || !row.overview) return null;
  const filters = asRecord(row.filters) ?? {};

  return {
    principle: asString(
      row.principle,
      "Customers should never wonder what changed. Transparency builds trust. Communication reduces uncertainty."
    ),
    filters: {
      release_type: filters.release_type
        ? parseEnum(filters.release_type, RELEASE_TYPES, "minor")
        : undefined,
      status: filters.status ? parseEnum(filters.status, RELEASE_STATUSES, "planned") : undefined,
      owner: filters.owner ? asString(filters.owner) : undefined,
      audience: filters.audience ? parseEnum(filters.audience, AUDIENCES, "all_customers") : undefined,
      date_from: filters.date_from ? asString(filters.date_from) : undefined,
      date_to: filters.date_to ? asString(filters.date_to) : undefined,
    },
    overview: parseOverview(row.overview),
    releases: parseArray(row.releases, parseRelease),
    change_log: parseArray(row.change_log, parseChangeLogEntry),
    calendar: parseArray(row.calendar, parseCalendarEvent),
    audit: parseArray(row.audit, parseAudit),
  };
}
