import type {
  ExecutionActionCatalogItem,
  ExecutionOperationsCenter,
  ExecutionQueueItem,
  ExecutionRequest,
  ExecutionTemplate,
} from "./types";

function parseCatalog(row: Record<string, unknown>): ExecutionActionCatalogItem {
  return {
    id: String(row.id ?? ""),
    action_key: row.action_key ? String(row.action_key) : undefined,
    action_type: String(row.action_type ?? ""),
    action_category: row.action_category ? String(row.action_category) : undefined,
    title: String(row.title ?? ""),
    description: row.description ? String(row.description) : undefined,
    risk_level: row.risk_level ? String(row.risk_level) : undefined,
    requires_approval: row.requires_approval === true,
    business_pack_key: row.business_pack_key ? String(row.business_pack_key) : undefined,
    domain_scope: row.domain_scope ? String(row.domain_scope) : undefined,
    is_active: row.is_active !== false,
  };
}

function parseRequest(row: Record<string, unknown>): ExecutionRequest {
  return {
    id: String(row.id ?? ""),
    action_type: String(row.action_type ?? ""),
    action_category: row.action_category ? String(row.action_category) : undefined,
    title: String(row.title ?? ""),
    summary: row.summary ? String(row.summary) : undefined,
    status: row.status ? String(row.status) : undefined,
    risk_level: row.risk_level ? String(row.risk_level) : undefined,
    approval_status: row.approval_status ? String(row.approval_status) : undefined,
    domain_scope: row.domain_scope ? String(row.domain_scope) : undefined,
    business_pack_key: row.business_pack_key ? String(row.business_pack_key) : undefined,
    payload: row.payload,
    result: row.result,
    created_at: row.created_at ? String(row.created_at) : undefined,
    executed_at: row.executed_at ? String(row.executed_at) : undefined,
  };
}

export function parseExecutionOperationsCenter(row: Record<string, unknown>): ExecutionOperationsCenter {
  return {
    found: row.found === true,
    principle: row.principle ? String(row.principle) : undefined,
    philosophy: row.philosophy ? String(row.philosophy) : undefined,
    overview: row.overview as Record<string, string | number | undefined> | undefined,
    execution_workflow: Array.isArray(row.execution_workflow) ? row.execution_workflow.map(String) : undefined,
    action_catalog: Array.isArray(row.action_catalog)
      ? row.action_catalog.map((r) => parseCatalog(r as Record<string, unknown>))
      : undefined,
    pending_actions: Array.isArray(row.pending_actions)
      ? row.pending_actions.map((r) => parseRequest(r as Record<string, unknown>))
      : undefined,
    approved_actions: Array.isArray(row.approved_actions)
      ? row.approved_actions.map((r) => parseRequest(r as Record<string, unknown>))
      : undefined,
    execution_history: Array.isArray(row.execution_history)
      ? row.execution_history.map((r) => parseRequest(r as Record<string, unknown>))
      : undefined,
    execution_queue: Array.isArray(row.execution_queue)
      ? row.execution_queue.map((q) => {
          const item = q as Record<string, unknown>;
          return {
            id: String(item.id ?? ""),
            request_id: item.request_id ? String(item.request_id) : undefined,
            queue_status: item.queue_status ? String(item.queue_status) : undefined,
            step_label: item.step_label ? String(item.step_label) : undefined,
            execution_time_ms: item.execution_time_ms != null ? Number(item.execution_time_ms) : undefined,
            retry_count: item.retry_count != null ? Number(item.retry_count) : undefined,
            error_summary: item.error_summary ? String(item.error_summary) : undefined,
            request_title: item.request_title ? String(item.request_title) : undefined,
            started_at: item.started_at ? String(item.started_at) : undefined,
            completed_at: item.completed_at ? String(item.completed_at) : undefined,
          } satisfies ExecutionQueueItem;
        })
      : undefined,
    execution_templates: Array.isArray(row.execution_templates)
      ? row.execution_templates.map((t) => {
          const item = t as Record<string, unknown>;
          return {
            id: String(item.id ?? ""),
            template_key: item.template_key ? String(item.template_key) : undefined,
            title: String(item.title ?? ""),
            description: item.description ? String(item.description) : undefined,
            template_category: item.template_category ? String(item.template_category) : undefined,
            steps: item.steps,
            approval_chain: item.approval_chain,
          } satisfies ExecutionTemplate;
        })
      : undefined,
    permission_engine: row.permission_engine as Record<string, unknown> | undefined,
    approval_escalation: row.approval_escalation as Record<string, unknown> | undefined,
    meeting_orchestration: row.meeting_orchestration as Record<string, unknown> | undefined,
    communication_actions: row.communication_actions as Record<string, unknown> | undefined,
    document_actions: row.document_actions as Record<string, unknown> | undefined,
    task_orchestration: row.task_orchestration as Record<string, unknown> | undefined,
    multi_step_execution: row.multi_step_execution as Record<string, unknown> | undefined,
    external_action_framework: row.external_action_framework as Record<string, unknown> | undefined,
    domain_awareness: row.domain_awareness as Record<string, unknown> | undefined,
    business_pack_integration: row.business_pack_integration as Record<string, unknown> | undefined,
    execution_monitoring: row.execution_monitoring as Record<string, unknown> | undefined,
    executive_dashboard: row.executive_dashboard as Record<string, unknown> | undefined,
    companion_assistant: row.companion_assistant as Record<string, unknown> | undefined,
    reports: row.reports as Record<string, unknown> | undefined,
    integrations: row.integrations as Record<string, unknown> | undefined,
    mobile_access: row.mobile_access as Record<string, unknown> | undefined,
    audit_recent: Array.isArray(row.audit_recent)
      ? row.audit_recent.map((entry) => {
          const e = entry as Record<string, unknown>;
          return {
            action: String(e.action ?? ""),
            summary: String(e.summary ?? ""),
            section: e.section ? String(e.section) : undefined,
            created_at: e.created_at ? String(e.created_at) : undefined,
          };
        })
      : undefined,
    routes: row.routes as Record<string, string> | undefined,
    error: row.error ? String(row.error) : undefined,
  };
}

export function parseExecutionSearchResults(row: Record<string, unknown>): ExecutionActionCatalogItem[] {
  if (row.found !== true || !Array.isArray(row.results)) return [];
  return row.results.map((r) => parseCatalog(r as Record<string, unknown>));
}
