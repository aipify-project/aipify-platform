import {
  EXECUTION_OUTCOMES,
  PLAYBOOK_CATEGORIES,
  PLAYBOOK_STATUSES,
  STEP_ACTION_TYPES,
  TRIGGER_TYPES,
} from "./constants";
import type {
  ExecutionOutcome,
  PlaybookCategory,
  PlaybookStatus,
  StepActionType,
  TriggerType,
} from "./constants";
import type {
  Playbook,
  PlaybookAuditEntry,
  PlaybookExecution,
  PlaybookFilters,
  PlaybookOverview,
  PlaybookStep,
  PlatformPlaybookCenter,
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
  const str = asString(value, fallback);
  return (allowed.includes(str as T) ? str : fallback) as T;
}

function parseOverview(raw: unknown): PlaybookOverview {
  const row = asRecord(raw) ?? {};
  return {
    active_playbooks: asNumber(row.active_playbooks),
    automations_running: asNumber(row.automations_running),
    failed_executions: asNumber(row.failed_executions),
    manual_interventions: asNumber(row.manual_interventions),
    scheduled_workflows: asNumber(row.scheduled_workflows),
    most_used_playbooks: asNumber(row.most_used_playbooks),
  };
}

function parseStep(raw: unknown): PlaybookStep | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    step_order: asNumber(row.step_order, 1),
    action_type: parseEnum(row.action_type, STEP_ACTION_TYPES, "create_task"),
    label: asString(row.label),
  };
}

function parsePlaybook(raw: unknown): Playbook | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    name: asString(row.name),
    category: parseEnum(row.category, PLAYBOOK_CATEGORIES, "support_operations"),
    description: asString(row.description),
    owner: asString(row.owner),
    trigger_type: parseEnum(row.trigger_type, TRIGGER_TYPES, "manual"),
    status: parseEnum(row.status, PLAYBOOK_STATUSES, "draft"),
    condition_summary: asString(row.condition_summary),
    requires_approval: asBool(row.requires_approval),
    is_template: asBool(row.is_template),
    last_executed_at: row.last_executed_at ? asString(row.last_executed_at) : null,
    steps: Array.isArray(row.steps)
      ? row.steps.map(parseStep).filter((s): s is PlaybookStep => s != null)
      : [],
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
  };
}

function parseExecution(raw: unknown): PlaybookExecution | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    playbook_id: asString(row.playbook_id),
    playbook_name: asString(row.playbook_name),
    trigger_event: asString(row.trigger_event),
    outcome: parseEnum(row.outcome, EXECUTION_OUTCOMES, "successful"),
    duration_seconds: asNumber(row.duration_seconds),
    owner: asString(row.owner),
    manual_intervention: asBool(row.manual_intervention),
    approval_status: row.approval_status ? asString(row.approval_status) : null,
    executed_at: asString(row.executed_at),
  };
}

function parseAudit(raw: unknown): PlaybookAuditEntry | null {
  const row = asRecord(raw);
  if (!row || !row.id) return null;
  return {
    id: asString(row.id),
    playbook_id: row.playbook_id ? asString(row.playbook_id) : null,
    event_type: asString(row.event_type),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

function parseArray<T>(raw: unknown, parser: (item: unknown) => T | null): T[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parser).filter((item): item is T => item != null);
}

export function buildPlaybookFilterQuery(filters: PlaybookFilters): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.status) params.set("status", filters.status);
  if (filters.trigger_type) params.set("trigger_type", filters.trigger_type);
  if (filters.owner) params.set("owner", filters.owner);
  if (filters.outcome) params.set("outcome", filters.outcome);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function parsePlatformPlaybookCenter(raw: unknown): PlatformPlaybookCenter | null {
  const row = asRecord(raw);
  if (!row || !row.overview) return null;
  const filters = asRecord(row.filters) ?? {};

  return {
    principle: asString(
      row.principle,
      "The best organizations do not rely solely on memory. They build repeatable systems that help people perform consistently and confidently."
    ),
    filters: {
      category: filters.category
        ? parseEnum(filters.category, PLAYBOOK_CATEGORIES, "support_operations")
        : undefined,
      status: filters.status ? parseEnum(filters.status, PLAYBOOK_STATUSES, "draft") : undefined,
      trigger_type: filters.trigger_type
        ? parseEnum(filters.trigger_type, TRIGGER_TYPES, "manual")
        : undefined,
      owner: filters.owner ? asString(filters.owner) : undefined,
      outcome: filters.outcome
        ? parseEnum(filters.outcome, EXECUTION_OUTCOMES, "successful")
        : undefined,
    },
    overview: parseOverview(row.overview),
    playbooks: parseArray(row.playbooks, parsePlaybook),
    templates: parseArray(row.templates, parsePlaybook),
    executions: parseArray(row.executions, parseExecution),
    audit: parseArray(row.audit, parseAudit),
  };
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}
