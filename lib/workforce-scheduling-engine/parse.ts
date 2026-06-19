export type WorkforceSchedulingRecord = {
  record_key?: string;
  record_title?: string;
  record_status?: string;
  status_icon?: string;
  status_label?: string;
  domain_key?: string;
  scope_type?: string;
  priority?: string;
  integration_ref?: string;
  summary?: string;
  metadata?: Record<string, unknown>;
  starts_at?: string;
  ends_at?: string;
  attribution_ref?: string;
  commission_ref?: string;
};

export type WorkforceSchedulingCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  companion_identity?: string;
  organization?: Record<string, unknown>;
  overview?: Record<string, number | boolean | string>;
  shifts?: WorkforceSchedulingRecord[];
  coverage_gaps?: WorkforceSchedulingRecord[];
  on_call?: WorkforceSchedulingRecord[];
  shift_status_catalog?: WorkforceSchedulingRecord[];
  companion_recommendations?: Record<string, unknown>[];
  integrations?: Record<string, WorkforceSchedulingRecord[]>;
  sections?: Record<string, WorkforceSchedulingRecord[]>;
  rows?: WorkforceSchedulingRecord[];
  audit_recent?: Record<string, unknown>[];
  routes?: Record<string, string>;
  executive_view?: WorkforceSchedulingRecord[];
  since_last_login?: WorkforceSchedulingRecord[];
  mobile_access?: Record<string, unknown>;
  partner?: Record<string, unknown>;
  coverage?: WorkforceSchedulingRecord[];
  lead_coverage?: WorkforceSchedulingRecord[];
  route?: string;
};

export type CompanionSchedulingAdvisor = {
  found: boolean;
  error?: string;
  companion_identity?: string;
  principle?: string;
  advisor_prompts?: string[];
  coverage_gaps_open?: number;
  open_shifts?: number;
  partially_staffed?: number;
  on_call_active?: number;
  integrations?: Record<string, string>;
  route?: string;
  privacy_note?: string;
};

function arr(raw: Record<string, unknown>, key: string): WorkforceSchedulingRecord[] {
  return Array.isArray(raw[key]) ? (raw[key] as WorkforceSchedulingRecord[]) : [];
}

export function parseWorkforceSchedulingCenter(raw: unknown): WorkforceSchedulingCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    companion_identity: typeof row.companion_identity === "string" ? row.companion_identity : undefined,
    organization: typeof row.organization === "object" && row.organization ? (row.organization as Record<string, unknown>) : undefined,
    overview: typeof row.overview === "object" && row.overview ? (row.overview as Record<string, number | boolean | string>) : undefined,
    shifts: arr(row, "shifts"),
    coverage_gaps: arr(row, "coverage_gaps"),
    on_call: arr(row, "on_call"),
    shift_status_catalog: arr(row, "shift_status_catalog"),
    companion_recommendations: Array.isArray(row.companion_recommendations)
      ? (row.companion_recommendations as Record<string, unknown>[])
      : [],
    integrations: typeof row.integrations === "object" && row.integrations
      ? (row.integrations as Record<string, WorkforceSchedulingRecord[]>)
      : undefined,
    sections: typeof row.sections === "object" && row.sections
      ? (row.sections as Record<string, WorkforceSchedulingRecord[]>)
      : undefined,
    rows: arr(row, "rows"),
    audit_recent: Array.isArray(row.audit_recent) ? (row.audit_recent as Record<string, unknown>[]) : [],
    routes: typeof row.routes === "object" && row.routes ? (row.routes as Record<string, string>) : undefined,
    executive_view: arr(row, "executive_view"),
    since_last_login: arr(row, "since_last_login"),
    mobile_access: typeof row.mobile_access === "object" && row.mobile_access
      ? (row.mobile_access as Record<string, unknown>)
      : undefined,
    partner: typeof row.partner === "object" && row.partner ? (row.partner as Record<string, unknown>) : undefined,
    coverage: arr(row, "coverage"),
    lead_coverage: arr(row, "lead_coverage"),
    route: typeof row.route === "string" ? row.route : undefined,
  };
}

export function parseCompanionSchedulingAdvisor(raw: unknown): CompanionSchedulingAdvisor {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    companion_identity: typeof row.companion_identity === "string" ? row.companion_identity : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    advisor_prompts: Array.isArray(row.advisor_prompts) ? (row.advisor_prompts as string[]) : [],
    coverage_gaps_open: typeof row.coverage_gaps_open === "number" ? row.coverage_gaps_open : undefined,
    open_shifts: typeof row.open_shifts === "number" ? row.open_shifts : undefined,
    partially_staffed: typeof row.partially_staffed === "number" ? row.partially_staffed : undefined,
    on_call_active: typeof row.on_call_active === "number" ? row.on_call_active : undefined,
    integrations: typeof row.integrations === "object" && row.integrations
      ? (row.integrations as Record<string, string>)
      : undefined,
    route: typeof row.route === "string" ? row.route : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
  };
}
