import type {
  ProfessionalServicesAdvisorSignal,
  ProfessionalServicesClient,
  ProfessionalServicesConsultant,
  ProfessionalServicesConsultingClientDeliveryCenter,
  ProfessionalServicesProject,
} from "./types";

function parseClient(raw: unknown): ProfessionalServicesClient {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    client_key: typeof d.client_key === "string" ? d.client_key : undefined,
    client_name: typeof d.client_name === "string" ? d.client_name : undefined,
    client_status: typeof d.client_status === "string" ? d.client_status : undefined,
    health_score: Number(d.health_score ?? 0),
    satisfaction_score: typeof d.satisfaction_score === "number" ? d.satisfaction_score : null,
    revenue_total: Number(d.revenue_total ?? 0),
    project_count: Number(d.project_count ?? 0),
  };
}

function parseProject(raw: unknown): ProfessionalServicesProject {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    project_key: typeof d.project_key === "string" ? d.project_key : undefined,
    project_name: typeof d.project_name === "string" ? d.project_name : undefined,
    project_status: typeof d.project_status === "string" ? d.project_status : undefined,
    budget_amount: Number(d.budget_amount ?? 0),
    revenue_amount: Number(d.revenue_amount ?? 0),
    gross_margin_percent: Number(d.gross_margin_percent ?? 0),
    client_id: typeof d.client_id === "string" ? d.client_id : null,
    owner_name: typeof d.owner_name === "string" ? d.owner_name : undefined,
    consultant_id: typeof d.consultant_id === "string" ? d.consultant_id : null,
    satisfaction_score: typeof d.satisfaction_score === "number" ? d.satisfaction_score : null,
  };
}

function parseConsultant(raw: unknown): ProfessionalServicesConsultant {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    consultant_key: typeof d.consultant_key === "string" ? d.consultant_key : undefined,
    full_name: typeof d.full_name === "string" ? d.full_name : undefined,
    availability_status: typeof d.availability_status === "string" ? d.availability_status : undefined,
    utilization_percent: Number(d.utilization_percent ?? 0),
    performance_score: Number(d.performance_score ?? 0),
    project_count: Number(d.project_count ?? 0),
  };
}

function parseSignal(raw: unknown): ProfessionalServicesAdvisorSignal {
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

export function parseProfessionalServicesConsultingClientDeliveryCenter(
  raw: unknown
): ProfessionalServicesConsultingClientDeliveryCenter {
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
    clients: Array.isArray(d.clients) ? d.clients.map(parseClient) : [],
    projects: Array.isArray(d.projects) ? d.projects.map(parseProject) : [],
    consultants: Array.isArray(d.consultants) ? d.consultants.map(parseConsultant) : [],
    deliverables: Array.isArray(d.deliverables) ? (d.deliverables as Array<Record<string, unknown>>) : [],
    expansion_opportunities: Array.isArray(d.expansion_opportunities)
      ? (d.expansion_opportunities as Array<Record<string, unknown>>)
      : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseSignal) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    operations: typeof d.operations === "object" && d.operations ? (d.operations as Record<string, string>) : undefined,
    executive_dashboard: typeof d.executive_dashboard === "object" && d.executive_dashboard
      ? (d.executive_dashboard as Record<string, unknown>)
      : undefined,
  };
}
