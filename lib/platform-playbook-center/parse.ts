import {
  APPROVAL_ROLES,
  CONDITION_KEYS,
  DESIGNER_TRIGGER_TYPES,
  EXECUTION_OUTCOMES,
  LEGACY_TRIGGER_MAP,
  PLAYBOOK_CATEGORIES,
  PLAYBOOK_PRIORITIES,
  PLAYBOOK_STATUSES,
  STEP_ACTION_TYPES,
  STEP_KINDS,
} from "./constants";
import type {
  DesignerTriggerType,
  PlaybookCategory,
  PlaybookPriority,
  PlaybookStatus,
  StepActionType,
  StepKind,
} from "./constants";
import type {
  Playbook,
  PlaybookApprovalCheckpoint,
  PlaybookAuditEntry,
  PlaybookCondition,
  PlaybookExecution,
  PlaybookExecutionStep,
  PlaybookFilters,
  PlaybookNotificationConfig,
  PlaybookOverview,
  PlaybookStep,
  PlatformPlaybookCenter,
  PlatformPlaybookDesigner,
  PlaybookTestResult,
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

function parseTrigger(value: unknown): DesignerTriggerType {
  const str = asString(value, "manual_start");
  if (DESIGNER_TRIGGER_TYPES.includes(str as DesignerTriggerType)) return str as DesignerTriggerType;
  return LEGACY_TRIGGER_MAP[str] ?? "manual_start";
}

function parseNotificationConfig(raw: unknown): PlaybookNotificationConfig {
  const row = asRecord(raw) ?? {};
  return {
    on_start: row.on_start !== false,
    on_approval: row.on_approval !== false,
    on_complete: row.on_complete !== false,
    on_failure: row.on_failure !== false,
  };
}

function parseOverview(raw: unknown): PlaybookOverview {
  const row = asRecord(raw) ?? {};
  return {
    active_playbooks: asNumber(row.active_playbooks),
    scheduled_automations: asNumber(row.scheduled_automations ?? row.scheduled_workflows),
    running_automations: asNumber(row.running_automations ?? row.automations_running),
    failed_executions: asNumber(row.failed_executions),
    pending_approvals: asNumber(row.pending_approvals),
    recently_completed: asNumber(row.recently_completed ?? row.most_used_playbooks),
  };
}

function parseCondition(raw: unknown): PlaybookCondition | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    condition_key: parseEnum(row.condition_key, CONDITION_KEYS, "customer_plan_enterprise"),
    operator: asString(row.operator, "equals"),
    condition_value: asString(row.condition_value),
    sort_order: asNumber(row.sort_order, 1),
  };
}

function parseApproval(raw: unknown): PlaybookApprovalCheckpoint | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    approval_role: parseEnum(row.approval_role, APPROVAL_ROLES, "platform_admin"),
    label: asString(row.label),
    step_order: asNumber(row.step_order, 1),
  };
}

function parseStep(raw: unknown): PlaybookStep | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    step_order: asNumber(row.step_order, 1),
    action_type: parseEnum(row.action_type, STEP_ACTION_TYPES, "create_task"),
    step_kind: parseEnum(row.step_kind, STEP_KINDS, "action"),
    label: asString(row.label),
  };
}

function parsePlaybook(raw: unknown): Playbook | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    name: asString(row.name),
    category: parseEnum(row.category, PLAYBOOK_CATEGORIES, "support_operations"),
    description: asString(row.description),
    owner: asString(row.owner),
    department: asString(row.department),
    priority: parseEnum(row.priority, PLAYBOOK_PRIORITIES, "normal"),
    trigger_type: parseTrigger(row.trigger_type),
    status: parseEnum(row.status, PLAYBOOK_STATUSES, "draft"),
    condition_summary: asString(row.condition_summary),
    requires_approval: asBool(row.requires_approval),
    completion_rule: asString(row.completion_rule, "All steps complete successfully"),
    notification_config: parseNotificationConfig(row.notification_config),
    is_template: asBool(row.is_template),
    last_executed_at: row.last_executed_at ? asString(row.last_executed_at) : null,
    steps: Array.isArray(row.steps)
      ? row.steps.map(parseStep).filter((s): s is PlaybookStep => s != null)
      : [],
    conditions: Array.isArray(row.conditions)
      ? row.conditions.map(parseCondition).filter((c): c is PlaybookCondition => c != null)
      : [],
    approvals: Array.isArray(row.approvals)
      ? row.approvals.map(parseApproval).filter((a): a is PlaybookApprovalCheckpoint => a != null)
      : [],
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
  };
}

function parseExecutionStep(raw: unknown): PlaybookExecutionStep | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    step_label: asString(row.step_label),
    step_status: parseEnum(row.step_status, ["pending", "completed", "failed", "skipped"] as const, "pending"),
    completed_at: row.completed_at ? asString(row.completed_at) : null,
  };
}

function parseExecution(raw: unknown): PlaybookExecution | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    playbook_id: asString(row.playbook_id),
    playbook_name: asString(row.playbook_name),
    trigger_event: asString(row.trigger_event),
    outcome: parseEnum(row.outcome, EXECUTION_OUTCOMES, "successful"),
    started_by: asString(row.started_by),
    current_status: parseEnum(row.current_status, ["running", "paused", "completed", "failed", "test"] as const, "running"),
    completed_steps: asNumber(row.completed_steps),
    failed_steps: asNumber(row.failed_steps),
    duration_seconds: asNumber(row.duration_seconds),
    owner: asString(row.owner),
    manual_intervention: asBool(row.manual_intervention),
    approval_status: row.approval_status ? asString(row.approval_status) : null,
    executed_at: asString(row.executed_at),
    completed_at: row.completed_at ? asString(row.completed_at) : null,
    steps: Array.isArray(row.steps)
      ? row.steps.map(parseExecutionStep).filter((s): s is PlaybookExecutionStep => s != null)
      : [],
  };
}

function parseAudit(raw: unknown): PlaybookAuditEntry | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
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
  if (filters.department) params.set("department", filters.department);
  if (filters.outcome) params.set("outcome", filters.outcome);
  if (filters.playbook_id) params.set("playbook_id", filters.playbook_id);
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
      trigger_type: filters.trigger_type ? parseTrigger(filters.trigger_type) : undefined,
      owner: filters.owner ? asString(filters.owner) : undefined,
      department: filters.department ? asString(filters.department) : undefined,
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

function parseTestResult(raw: unknown): PlaybookTestResult | undefined {
  const row = asRecord(raw);
  if (!row) return undefined;
  return {
    execution_id: asString(row.execution_id),
    mode: asString(row.mode, "test"),
    valid: asBool(row.valid),
    message: asString(row.message),
  };
}

export function parsePlatformPlaybookDesigner(raw: unknown): PlatformPlaybookDesigner | null {
  const row = asRecord(raw);
  if (!row || !row.has_access) return null;
  const superRow = asRecord(row.super) ?? {};
  const playbookRaw = row.playbook;

  return {
    has_access: true,
    surface: asString(row.surface, "platform") as PlatformPlaybookDesigner["surface"],
    principle: asString(row.principle),
    playbook:
      playbookRaw && playbookRaw !== null && typeof playbookRaw === "object"
        ? parsePlaybook(playbookRaw)
        : null,
    templates: parseArray(row.templates, parsePlaybook),
    executions: parseArray(row.executions, parseExecution),
    audit: parseArray(row.audit, parseAudit),
    super: {
      total_playbooks: asNumber(superRow.total_playbooks),
      active_playbooks: asNumber(superRow.active_playbooks),
      failed_executions_7d: asNumber(superRow.failed_executions_7d),
      templates_published: asNumber(superRow.templates_published),
    },
    test_result: parseTestResult(row.test_result),
  };
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}
