export type ServiceCheckoutRecord = {
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
};

export type ServiceCheckoutCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  companion_identity?: string;
  organization?: Record<string, unknown>;
  overview?: Record<string, number | boolean | string>;
  open_checkouts?: ServiceCheckoutRecord[];
  completed_sales?: ServiceCheckoutRecord[];
  front_desk_queue?: ServiceCheckoutRecord[];
  transaction_status_catalog?: ServiceCheckoutRecord[];
  companion_recommendations?: Record<string, unknown>[];
  integrations?: Record<string, ServiceCheckoutRecord[]>;
  sections?: Record<string, ServiceCheckoutRecord[]>;
  rows?: ServiceCheckoutRecord[];
  audit_recent?: Record<string, unknown>[];
  routes?: Record<string, string>;
  executive_view?: ServiceCheckoutRecord[];
  since_last_login?: ServiceCheckoutRecord[];
  mobile_access?: Record<string, unknown>;
};

export type CompanionCheckoutAdvisor = {
  found: boolean;
  error?: string;
  companion_identity?: string;
  principle?: string;
  advisor_prompts?: string[];
  open_checkouts?: number;
  pending_payments?: number;
  daily_close_pending?: number;
  front_desk_waiting?: number;
  integrations?: Record<string, string>;
  route?: string;
  privacy_note?: string;
};

function arr(raw: Record<string, unknown>, key: string): ServiceCheckoutRecord[] {
  return Array.isArray(raw[key]) ? (raw[key] as ServiceCheckoutRecord[]) : [];
}

export function parseServiceCheckoutCenter(raw: unknown): ServiceCheckoutCenter {
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
    open_checkouts: arr(row, "open_checkouts"),
    completed_sales: arr(row, "completed_sales"),
    front_desk_queue: arr(row, "front_desk_queue"),
    transaction_status_catalog: arr(row, "transaction_status_catalog"),
    companion_recommendations: Array.isArray(row.companion_recommendations)
      ? (row.companion_recommendations as Record<string, unknown>[])
      : [],
    integrations: typeof row.integrations === "object" && row.integrations
      ? (row.integrations as Record<string, ServiceCheckoutRecord[]>)
      : undefined,
    sections: typeof row.sections === "object" && row.sections
      ? (row.sections as Record<string, ServiceCheckoutRecord[]>)
      : undefined,
    rows: arr(row, "rows"),
    audit_recent: Array.isArray(row.audit_recent) ? (row.audit_recent as Record<string, unknown>[]) : [],
    routes: typeof row.routes === "object" && row.routes ? (row.routes as Record<string, string>) : undefined,
    executive_view: arr(row, "executive_view"),
    since_last_login: arr(row, "since_last_login"),
    mobile_access: typeof row.mobile_access === "object" && row.mobile_access
      ? (row.mobile_access as Record<string, unknown>)
      : undefined,
  };
}

export function parseCompanionCheckoutAdvisor(raw: unknown): CompanionCheckoutAdvisor {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    companion_identity: typeof row.companion_identity === "string" ? row.companion_identity : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    advisor_prompts: Array.isArray(row.advisor_prompts) ? (row.advisor_prompts as string[]) : [],
    open_checkouts: typeof row.open_checkouts === "number" ? row.open_checkouts : undefined,
    pending_payments: typeof row.pending_payments === "number" ? row.pending_payments : undefined,
    daily_close_pending: typeof row.daily_close_pending === "number" ? row.daily_close_pending : undefined,
    front_desk_waiting: typeof row.front_desk_waiting === "number" ? row.front_desk_waiting : undefined,
    integrations: typeof row.integrations === "object" && row.integrations
      ? (row.integrations as Record<string, string>)
      : undefined,
    route: typeof row.route === "string" ? row.route : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
  };
}
