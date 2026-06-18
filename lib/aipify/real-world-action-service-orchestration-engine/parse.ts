import type {
  ActionAdvisorSignal,
  ActionApproval,
  ActionCatalogItem,
  ActionExecution,
  ActionIntelligenceSignal,
  RealWorldActionServiceOrchestrationCenter,
  ServiceProvider,
} from "./types";

function parseCatalog(raw: unknown): ActionCatalogItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    action_key: typeof d.action_key === "string" ? d.action_key : undefined,
    action_name: typeof d.action_name === "string" ? d.action_name : undefined,
    action_category: typeof d.action_category === "string" ? d.action_category : undefined,
    risk_level: typeof d.risk_level === "string" ? d.risk_level : undefined,
    approval_required: Boolean(d.approval_required),
    description: typeof d.description === "string" ? d.description : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
  };
}

function parseProvider(raw: unknown): ServiceProvider {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    provider_key: typeof d.provider_key === "string" ? d.provider_key : undefined,
    provider_name: typeof d.provider_name === "string" ? d.provider_name : undefined,
    provider_category: typeof d.provider_category === "string" ? d.provider_category : undefined,
    region: typeof d.region === "string" ? d.region : undefined,
    availability_status: typeof d.availability_status === "string" ? d.availability_status : undefined,
    integration_type: typeof d.integration_type === "string" ? d.integration_type : undefined,
    approval_requirements: typeof d.approval_requirements === "string" ? d.approval_requirements : undefined,
    vendor_tier: typeof d.vendor_tier === "string" ? d.vendor_tier : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
  };
}

function parseExecution(raw: unknown): ActionExecution {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    execution_key: typeof d.execution_key === "string" ? d.execution_key : undefined,
    action_name: typeof d.action_name === "string" ? d.action_name : undefined,
    provider_name: typeof d.provider_name === "string" ? d.provider_name : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    risk_level: typeof d.risk_level === "string" ? d.risk_level : undefined,
    estimated_cost: d.estimated_cost != null ? Number(d.estimated_cost) : undefined,
    confirmation_ref: typeof d.confirmation_ref === "string" ? d.confirmation_ref : undefined,
    failure_reason: typeof d.failure_reason === "string" ? d.failure_reason : undefined,
    recovery_status: typeof d.recovery_status === "string" ? d.recovery_status : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
    completed_at: typeof d.completed_at === "string" ? d.completed_at : undefined,
  };
}

function parseApproval(raw: unknown): ActionApproval {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    approval_key: typeof d.approval_key === "string" ? d.approval_key : undefined,
    approval_type: typeof d.approval_type === "string" ? d.approval_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    action_title: typeof d.action_title === "string" ? d.action_title : undefined,
    risk_level: typeof d.risk_level === "string" ? d.risk_level : undefined,
    approver_role: typeof d.approver_role === "string" ? d.approver_role : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

function parseIntelligence(raw: unknown): ActionIntelligenceSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

function parseAdvisor(raw: unknown): ActionAdvisorSignal {
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

export function parseRealWorldActionServiceOrchestrationCenter(
  raw: unknown
): RealWorldActionServiceOrchestrationCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  const catalog = Array.isArray(d.action_catalog) ? d.action_catalog.map(parseCatalog) : [];
  const providers = Array.isArray(d.service_providers) ? d.service_providers.map(parseProvider) : [];
  const executions = Array.isArray(d.executions) ? d.executions.map(parseExecution) : [];
  const approvals = Array.isArray(d.approvals) ? d.approvals.map(parseApproval) : [];
  const intelligence = Array.isArray(d.intelligence_signals)
    ? d.intelligence_signals.map(parseIntelligence)
    : [];
  const advisor = Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseAdvisor) : [];

  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    approvals_route: typeof d.approvals_route === "string" ? d.approvals_route : undefined,
    action_center_route: typeof d.action_center_route === "string" ? d.action_center_route : undefined,
    action_hub_route: typeof d.action_hub_route === "string" ? d.action_hub_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: (d.overview as Record<string, unknown>) ?? {},
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    action_catalog: catalog,
    service_providers: providers,
    executions,
    approvals,
    intelligence_signals: intelligence,
    advisor_signals: advisor,
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    executive_dashboard: (d.executive_dashboard as Record<string, unknown>) ?? {},
    governance: (d.governance as Record<string, unknown>) ?? {},
  };
}
