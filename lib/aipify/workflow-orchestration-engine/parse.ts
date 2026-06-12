import type { WorkflowOrchestrationEngineCard, WorkflowOrchestrationEngineDashboard } from "./types";

function asArray<T>(value: unknown): T[] | undefined {
  return Array.isArray(value) ? (value as T[]) : undefined;
}

function asObject(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : undefined;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function parseWorkflowOrchestrationEngineCard(data: unknown): WorkflowOrchestrationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: asString(d.philosophy),
    active_workflows: typeof d.active_workflows === "number" ? d.active_workflows : undefined,
    approval_bottlenecks: typeof d.approval_bottlenecks === "number" ? d.approval_bottlenecks : undefined,
    implementation_blueprint_phase40: asObject(d.implementation_blueprint_phase40) as WorkflowOrchestrationEngineCard["implementation_blueprint_phase40"],
    autonomous_workflow_phase: typeof d.autonomous_workflow_phase === "number" ? d.autonomous_workflow_phase : undefined,
    workflow_abos_principle: asString(d.workflow_abos_principle),
    workflow_orchestration_summary: asObject(d.workflow_orchestration_summary) as WorkflowOrchestrationEngineCard["workflow_orchestration_summary"],
    blueprint_note: asString(d.blueprint_note),
    ...d,
  } as WorkflowOrchestrationEngineCard;
}

export function parseWorkflowOrchestrationEngineDashboard(data: unknown): WorkflowOrchestrationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: asString(d.philosophy),
    safety_note: asString(d.safety_note),
    principles: asArray<string>(d.principles),
    summary: asObject(d.summary),
    workflows: asArray(d.workflows),
    templates: asArray(d.templates),
    recent_executions: asArray(d.recent_executions),
    integration_links: asObject(d.integration_links) as WorkflowOrchestrationEngineDashboard["integration_links"],
    implementation_blueprint_phase40: asObject(d.implementation_blueprint_phase40) as WorkflowOrchestrationEngineDashboard["implementation_blueprint_phase40"],
    autonomous_workflow_mission: asString(d.autonomous_workflow_mission),
    autonomous_workflow_philosophy: asString(d.autonomous_workflow_philosophy),
    workflow_objectives: asArray(d.workflow_objectives) as WorkflowOrchestrationEngineDashboard["workflow_objectives"],
    workflow_examples: asArray(d.workflow_examples) as WorkflowOrchestrationEngineDashboard["workflow_examples"],
    approval_principles: asObject(d.approval_principles) as WorkflowOrchestrationEngineDashboard["approval_principles"],
    explainability_principles: asObject(d.explainability_principles) as WorkflowOrchestrationEngineDashboard["explainability_principles"],
    workflow_marketplace_connection: asObject(d.workflow_marketplace_connection) as WorkflowOrchestrationEngineDashboard["workflow_marketplace_connection"],
    workflow_self_love_connection: asObject(d.workflow_self_love_connection) as WorkflowOrchestrationEngineDashboard["workflow_self_love_connection"],
    workflow_dogfooding: asObject(d.workflow_dogfooding) as WorkflowOrchestrationEngineDashboard["workflow_dogfooding"],
    workflow_orchestration_summary: asObject(d.workflow_orchestration_summary) as WorkflowOrchestrationEngineDashboard["workflow_orchestration_summary"],
    workflow_success_criteria: asArray(d.workflow_success_criteria) as WorkflowOrchestrationEngineDashboard["workflow_success_criteria"],
    workflow_vision_phrases: asArray<string>(d.workflow_vision_phrases),
    workflow_abos_principle: asString(d.workflow_abos_principle),
    workflow_distinction_note: asString(d.workflow_distinction_note),
    workflow_integration_links: asArray(d.workflow_integration_links) as WorkflowOrchestrationEngineDashboard["workflow_integration_links"],
    ...d,
  } as WorkflowOrchestrationEngineDashboard;
}
