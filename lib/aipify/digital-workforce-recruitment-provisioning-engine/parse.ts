import type {
  DigitalWorkforceRecruitmentProvisioningCenter,
  WorkforceAdvisorSignal,
  WorkforceForecast,
  WorkforceHiringRequest,
  WorkforcePlan,
  WorkforcePosition,
} from "./types";

function parsePosition(raw: unknown): WorkforcePosition {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    position_key: typeof d.position_key === "string" ? d.position_key : undefined,
    position_name: typeof d.position_name === "string" ? d.position_name : undefined,
    position_type: typeof d.position_type === "string" ? d.position_type : undefined,
    department: typeof d.department === "string" ? d.department : undefined,
    responsibilities: d.responsibilities,
    skills: d.skills,
  };
}

function parseRequest(raw: unknown): WorkforceHiringRequest {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    request_key: typeof d.request_key === "string" ? d.request_key : undefined,
    request_title: typeof d.request_title === "string" ? d.request_title : undefined,
    request_type: typeof d.request_type === "string" ? d.request_type : undefined,
    request_status: typeof d.request_status === "string" ? d.request_status : undefined,
    department: typeof d.department === "string" ? d.department : undefined,
    position_id: typeof d.position_id === "string" ? d.position_id : null,
  };
}

function parsePlan(raw: unknown): WorkforcePlan {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    plan_key: typeof d.plan_key === "string" ? d.plan_key : undefined,
    plan_name: typeof d.plan_name === "string" ? d.plan_name : undefined,
    department: typeof d.department === "string" ? d.department : undefined,
    current_headcount: Number(d.current_headcount ?? 0),
    future_headcount: Number(d.future_headcount ?? 0),
    capacity_utilization: Number(d.capacity_utilization ?? 0),
    gap_type: typeof d.gap_type === "string" ? d.gap_type : undefined,
  };
}

function parseForecast(raw: unknown): WorkforceForecast {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    forecast_key: typeof d.forecast_key === "string" ? d.forecast_key : undefined,
    forecast_title: typeof d.forecast_title === "string" ? d.forecast_title : undefined,
    forecast_horizon: typeof d.forecast_horizon === "string" ? d.forecast_horizon : undefined,
    projected_hires: Number(d.projected_hires ?? 0),
    projected_capacity: Number(d.projected_capacity ?? 0),
  };
}

function parseSignal(raw: unknown): WorkforceAdvisorSignal {
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

export function parseDigitalWorkforceRecruitmentProvisioningCenter(
  raw: unknown
): DigitalWorkforceRecruitmentProvisioningCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    lifecycle_route: typeof d.lifecycle_route === "string" ? d.lifecycle_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview ? (d.overview as Record<string, unknown>) : undefined,
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    positions: Array.isArray(d.positions) ? d.positions.map(parsePosition) : [],
    hiring_requests: Array.isArray(d.hiring_requests) ? d.hiring_requests.map(parseRequest) : [],
    workforce_plans: Array.isArray(d.workforce_plans) ? d.workforce_plans.map(parsePlan) : [],
    forecasts: Array.isArray(d.forecasts) ? d.forecasts.map(parseForecast) : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseSignal) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    operations: typeof d.operations === "object" && d.operations ? (d.operations as Record<string, string>) : undefined,
    executive_dashboard: typeof d.executive_dashboard === "object" && d.executive_dashboard
      ? (d.executive_dashboard as Record<string, unknown>)
      : undefined,
  };
}
