import type {
  AutomationExecution,
  AutomationOperationsCenter,
  AutomationTemplate,
  AutomationWorkflow,
} from "./types";

function parseWorkflow(row: Record<string, unknown>): AutomationWorkflow {
  return {
    id: String(row.id ?? ""),
    workflow_number: row.workflow_number ? String(row.workflow_number) : undefined,
    name: String(row.name ?? ""),
    description: row.description ? String(row.description) : undefined,
    status: String(row.status ?? "draft"),
    trigger_type: String(row.trigger_type ?? "manual"),
    trigger_config: row.trigger_config as Record<string, unknown> | undefined,
    conditions: Array.isArray(row.conditions) ? row.conditions : undefined,
    actions: Array.isArray(row.actions) ? row.actions : undefined,
    approvals_required: row.approvals_required === true,
    business_pack_key: row.business_pack_key ? String(row.business_pack_key) : undefined,
    execution_count: row.execution_count != null ? Number(row.execution_count) : undefined,
    success_count: row.success_count != null ? Number(row.success_count) : undefined,
    failure_count: row.failure_count != null ? Number(row.failure_count) : undefined,
  };
}

function parseList<T>(value: unknown, parser: (row: Record<string, unknown>) => T): T[] {
  if (!Array.isArray(value)) return [];
  return value.map((row) => parser(row as Record<string, unknown>));
}

export function parseAutomationOperationsCenter(row: Record<string, unknown>): AutomationOperationsCenter {
  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    safety_controls: row.safety_controls as Record<string, unknown> | undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    workflows: parseList(row.workflows, parseWorkflow) as AutomationWorkflow[],
    triggers: parseList(row.triggers, (r) => ({ key: String(r.key ?? ""), label: String(r.label ?? "") })),
    actions: parseList(row.actions, (r) => ({ key: String(r.key ?? ""), label: String(r.label ?? "") })),
    conditions: row.conditions as Record<string, unknown> | undefined,
    approvals: Array.isArray(row.approvals) ? (row.approvals as Record<string, unknown>[]) : undefined,
    templates: parseList(row.templates, (r) => ({
      id: String(r.id ?? ""),
      template_key: String(r.template_key ?? ""),
      title: String(r.title ?? ""),
      description: r.description ? String(r.description) : undefined,
      category: String(r.category ?? "custom"),
      trigger_type: String(r.trigger_type ?? "manual"),
      business_pack_key: r.business_pack_key ? String(r.business_pack_key) : undefined,
      reusable: r.reusable === true,
    })) as AutomationTemplate[],
    history: parseList(row.history, (r) => ({
      id: String(r.id ?? ""),
      execution_number: r.execution_number ? String(r.execution_number) : undefined,
      workflow_id: r.workflow_id ? String(r.workflow_id) : undefined,
      status: String(r.status ?? "pending"),
      result_summary: r.result_summary ? String(r.result_summary) : undefined,
      error_message: r.error_message ? String(r.error_message) : undefined,
      duration_ms: r.duration_ms != null ? Number(r.duration_ms) : undefined,
      retry_count: r.retry_count != null ? Number(r.retry_count) : undefined,
      started_at: r.started_at ? String(r.started_at) : undefined,
      completed_at: r.completed_at ? String(r.completed_at) : undefined,
    })) as AutomationExecution[],
    monitoring: row.monitoring as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    companion_integration: row.companion_integration as Record<string, unknown> | undefined,
    companion_insights: row.companion_insights as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return { action: String(e.action ?? ""), summary: String(e.summary ?? ""), created_at: e.created_at ? String(e.created_at) : undefined };
        })
      : undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error ? String(row.error) : undefined,
  };
}
