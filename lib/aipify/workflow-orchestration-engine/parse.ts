import type { WorkflowOrchestrationEngineCard, WorkflowOrchestrationEngineDashboard } from "./types";

export function parseWorkflowOrchestrationEngineCard(data: unknown): WorkflowOrchestrationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as WorkflowOrchestrationEngineCard;
}

export function parseWorkflowOrchestrationEngineDashboard(data: unknown): WorkflowOrchestrationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    workflows: Array.isArray(d.workflows) ? d.workflows : undefined,
    templates: Array.isArray(d.templates) ? d.templates : undefined,
    recent_executions: Array.isArray(d.recent_executions) ? d.recent_executions : undefined,
    integration_links:
      typeof d.integration_links === "object" && d.integration_links
        ? (d.integration_links as Record<string, string>)
        : undefined,
    ...d,
  } as WorkflowOrchestrationEngineDashboard;
}
