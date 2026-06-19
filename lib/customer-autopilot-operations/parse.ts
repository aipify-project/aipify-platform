import type { AutopilotCenter, AutopilotQueueItem } from "./types";

function parseQueueItem(raw: Record<string, unknown>): AutopilotQueueItem {
  return {
    queue_key: String(raw.queue_key ?? ""),
    queue_title: String(raw.queue_title ?? ""),
    queue_status: raw.queue_status ? String(raw.queue_status) : undefined,
    workflow_key: raw.workflow_key ? String(raw.workflow_key) : undefined,
    action_key: raw.action_key ? String(raw.action_key) : undefined,
    summary: raw.summary ? String(raw.summary) : undefined,
  };
}

export function parseAutopilotCenter(raw: Record<string, unknown>): AutopilotCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as AutopilotCenter["organization"],
    settings: raw.settings as Record<string, unknown>,
    overview: raw.overview as AutopilotCenter["overview"],
    policies: Array.isArray(raw.policies) ? (raw.policies as Record<string, unknown>[]) : [],
    automation_rules: Array.isArray(raw.automation_rules) ? (raw.automation_rules as Record<string, unknown>[]) : [],
    approval_chains: Array.isArray(raw.approval_chains) ? (raw.approval_chains as Record<string, unknown>[]) : [],
    prepared_actions: Array.isArray(raw.prepared_actions) ? (raw.prepared_actions as Record<string, unknown>[]) : [],
    execution_queue: Array.isArray(raw.execution_queue)
      ? (raw.execution_queue as Record<string, unknown>[]).map(parseQueueItem)
      : [],
    workflows: Array.isArray(raw.workflows) ? (raw.workflows as Record<string, unknown>[]) : [],
    schedules: Array.isArray(raw.schedules) ? (raw.schedules as Record<string, unknown>[]) : [],
    watchtower: Array.isArray(raw.watchtower) ? (raw.watchtower as Record<string, unknown>[]) : [],
    boundaries: Array.isArray(raw.boundaries) ? (raw.boundaries as Record<string, unknown>[]) : [],
    insights: raw.insights as Record<string, unknown>,
    reports: raw.reports as Record<string, unknown>,
    executive_dashboard: raw.executive_dashboard as Record<string, unknown>,
    integrations: raw.integrations as Record<string, unknown>,
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as AutopilotCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
    notifications: raw.notifications as Record<string, unknown>,
  };
}
