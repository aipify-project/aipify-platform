import type { WorkflowProcessCenter } from "./types";

export function parseWorkflowProcessCenter(raw: Record<string, unknown>): WorkflowProcessCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    philosophy: raw.philosophy ? String(raw.philosophy) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    organization: raw.organization as WorkflowProcessCenter["organization"],
    overview: raw.overview as WorkflowProcessCenter["overview"],
    workflows: Array.isArray(raw.workflows) ? (raw.workflows as Record<string, unknown>[]) : [],
    templates: Array.isArray(raw.templates) ? (raw.templates as Record<string, unknown>[]) : [],
    automations: Array.isArray(raw.automations) ? (raw.automations as Record<string, unknown>[]) : [],
    approvals: Array.isArray(raw.approvals) ? (raw.approvals as Record<string, unknown>[]) : [],
    components: Array.isArray(raw.components)
      ? (raw.components as Record<string, unknown>[])
      : Array.isArray(raw.visual_designer)
        ? (raw.visual_designer as Record<string, unknown>[])
        : [],
    process_steps: Array.isArray(raw.process_steps)
      ? (raw.process_steps as Record<string, unknown>[])
      : Array.isArray(raw.process_mapping)
        ? (raw.process_mapping as Record<string, unknown>[])
        : [],
    bottlenecks: Array.isArray(raw.bottlenecks) ? (raw.bottlenecks as Record<string, unknown>[]) : [],
    business_packs: Array.isArray(raw.business_packs) ? (raw.business_packs as Record<string, unknown>[]) : [],
    cross_department: Array.isArray(raw.cross_department) ? (raw.cross_department as Record<string, unknown>[]) : [],
    workflow_analytics: raw.workflow_analytics as Record<string, unknown>,
    executive_dashboard: raw.executive_dashboard as Record<string, unknown>,
    recommendations: Array.isArray(raw.recommendations) ? (raw.recommendations as Record<string, unknown>[]) : [],
    companion: raw.companion as Record<string, unknown>,
    monitoring: raw.monitoring as Record<string, unknown>,
    reports: raw.reports as Record<string, unknown>,
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as WorkflowProcessCenter["audit_recent"])
      : [],
    mobile_access: raw.mobile_access as Record<string, unknown>,
    routes: raw.routes as Record<string, string>,
  };
}
