import type {
  ConstructionAdvisorSignal,
  ConstructionProject,
  ConstructionProjectFieldOperationsCenter,
} from "./types";

function parseProject(raw: unknown): ConstructionProject {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    project_key: typeof d.project_key === "string" ? d.project_key : undefined,
    project_name: typeof d.project_name === "string" ? d.project_name : undefined,
    customer_name: typeof d.customer_name === "string" ? d.customer_name : undefined,
    project_type: typeof d.project_type === "string" ? d.project_type : undefined,
    location: typeof d.location === "string" ? d.location : undefined,
    budget_amount: Number(d.budget_amount ?? 0),
    project_status: typeof d.project_status === "string" ? d.project_status : undefined,
    completion_percent: Number(d.completion_percent ?? 0),
    profitability_label: typeof d.profitability_label === "string" ? d.profitability_label : undefined,
  };
}

function parseSignal(raw: unknown): ConstructionAdvisorSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    effort: typeof d.effort === "string" ? d.effort : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

export function parseConstructionProjectFieldOperationsCenter(
  raw: unknown
): ConstructionProjectFieldOperationsCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    industry_packs_route: typeof d.industry_packs_route === "string" ? d.industry_packs_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview ? (d.overview as Record<string, unknown>) : undefined,
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    projects: Array.isArray(d.projects) ? d.projects.map(parseProject) : [],
    sites: Array.isArray(d.sites) ? (d.sites as Array<Record<string, unknown>>) : [],
    workforce: Array.isArray(d.workforce) ? (d.workforce as Array<Record<string, unknown>>) : [],
    equipment: Array.isArray(d.equipment) ? (d.equipment as Array<Record<string, unknown>>) : [],
    materials: Array.isArray(d.materials) ? (d.materials as Array<Record<string, unknown>>) : [],
    safety_incidents: Array.isArray(d.safety_incidents)
      ? (d.safety_incidents as Array<Record<string, unknown>>)
      : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseSignal) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    operations: typeof d.operations === "object" && d.operations ? (d.operations as Record<string, string>) : undefined,
    executive_dashboard: typeof d.executive_dashboard === "object" && d.executive_dashboard
      ? (d.executive_dashboard as Record<string, unknown>)
      : undefined,
  };
}
