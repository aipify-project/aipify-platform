import type {
  LegalAdvisorSignal,
  LegalCase,
  LegalClient,
  LegalComplianceCaseOperationsCenter,
  LegalContract,
} from "./types";

function parseCase(raw: unknown): LegalCase {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    case_key: typeof d.case_key === "string" ? d.case_key : undefined,
    case_number: typeof d.case_number === "string" ? d.case_number : undefined,
    case_title: typeof d.case_title === "string" ? d.case_title : undefined,
    case_type: typeof d.case_type === "string" ? d.case_type : undefined,
    case_status: typeof d.case_status === "string" ? d.case_status : undefined,
    priority: typeof d.priority === "string" ? d.priority : undefined,
    risk_level: typeof d.risk_level === "string" ? d.risk_level : undefined,
    deadline_at: typeof d.deadline_at === "string" ? d.deadline_at : null,
    client_id: typeof d.client_id === "string" ? d.client_id : null,
    assigned_team: typeof d.assigned_team === "string" ? d.assigned_team : undefined,
  };
}

function parseClient(raw: unknown): LegalClient {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    client_key: typeof d.client_key === "string" ? d.client_key : undefined,
    client_name: typeof d.client_name === "string" ? d.client_name : undefined,
    organization_label: typeof d.organization_label === "string" ? d.organization_label : undefined,
    compliance_status: typeof d.compliance_status === "string" ? d.compliance_status : undefined,
    case_count: Number(d.case_count ?? 0),
  };
}

function parseContract(raw: unknown): LegalContract {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    contract_key: typeof d.contract_key === "string" ? d.contract_key : undefined,
    contract_name: typeof d.contract_name === "string" ? d.contract_name : undefined,
    contract_status: typeof d.contract_status === "string" ? d.contract_status : undefined,
    parties_label: typeof d.parties_label === "string" ? d.parties_label : undefined,
    renewal_date: typeof d.renewal_date === "string" ? d.renewal_date : null,
    expiration_date: typeof d.expiration_date === "string" ? d.expiration_date : null,
    risk_status: typeof d.risk_status === "string" ? d.risk_status : undefined,
    client_id: typeof d.client_id === "string" ? d.client_id : null,
  };
}

function parseSignal(raw: unknown): LegalAdvisorSignal {
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

export function parseLegalComplianceCaseOperationsCenter(raw: unknown): LegalComplianceCaseOperationsCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    governance_note: typeof d.governance_note === "string" ? d.governance_note : undefined,
    disclaimer: typeof d.disclaimer === "string" ? d.disclaimer : undefined,
    industry_packs_route: typeof d.industry_packs_route === "string" ? d.industry_packs_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview ? (d.overview as Record<string, unknown>) : undefined,
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    cases: Array.isArray(d.cases) ? d.cases.map(parseCase) : [],
    clients: Array.isArray(d.clients) ? d.clients.map(parseClient) : [],
    contracts: Array.isArray(d.contracts) ? d.contracts.map(parseContract) : [],
    compliance_reviews: Array.isArray(d.compliance_reviews)
      ? (d.compliance_reviews as Array<Record<string, unknown>>)
      : [],
    deadlines: Array.isArray(d.deadlines) ? (d.deadlines as Array<Record<string, unknown>>) : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseSignal) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    operations: typeof d.operations === "object" && d.operations ? (d.operations as Record<string, string>) : undefined,
    executive_dashboard: typeof d.executive_dashboard === "object" && d.executive_dashboard
      ? (d.executive_dashboard as Record<string, unknown>)
      : undefined,
  };
}
