export type ContinuityStatus = {
  status_key?: string;
  status_icon?: string;
  status_label?: string;
  summary?: string;
};

export type BusinessContinuityCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  continuity_status?: ContinuityStatus;
  readiness_score?: number;
  phase_integrations?: Record<string, unknown>[];
  governance_rules?: Record<string, unknown>[];
  routes?: Record<string, string>;
  executive_dashboard?: Record<string, number | string>;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  executive_metrics?: Record<string, unknown>[];
  since_last_login_integration?: Record<string, unknown>;
  continuity_plans?: Record<string, unknown>[];
  plan_review_cycles?: Record<string, unknown>[];
  critical_operations?: Record<string, unknown>[];
  continuity_scopes?: Record<string, unknown>[];
  business_impact_assessments?: Record<string, unknown>[];
  recovery_objectives?: Record<string, unknown>[];
  crisis_modes?: Record<string, unknown>[];
  crisis_command?: Record<string, unknown>[];
  crisis_timeline?: Record<string, unknown>[];
  crisis_decisions?: Record<string, unknown>[];
  minimum_operating_modes?: Record<string, unknown>[];
  temporary_workflows?: Record<string, unknown>[];
  recovery_plans?: Record<string, unknown>[];
  recovery_tasks?: Record<string, unknown>[];
  return_to_normal?: Record<string, unknown>[];
  post_crisis_reviews?: Record<string, unknown>[];
  emergency_contacts?: Record<string, unknown>[];
  communications?: Record<string, unknown>[];
  dependencies?: Record<string, unknown>[];
  supplier_continuity?: Record<string, unknown>[];
  connected_app_continuity?: Record<string, unknown>[];
  domain_continuity?: Record<string, unknown>[];
  exercises?: Record<string, unknown>[];
  readiness_scores?: Record<string, unknown>[];
  critical_documents?: Record<string, unknown>[];
  data_continuity?: Record<string, unknown>[];
  financial_continuity?: Record<string, unknown>[];
  customer_service_continuity?: Record<string, unknown>[];
  sales_continuity?: Record<string, unknown>[];
  partner_commission_protection?: Record<string, unknown>[];
  reports?: Record<string, unknown>[];
  audit_recent?: Record<string, unknown>[];
};

export type PartnerBusinessContinuityCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  customer_ownership_note?: string;
  continuity_status?: ContinuityStatus;
  readiness_score?: number;
  routes?: Record<string, string>;
  executive_dashboard?: Record<string, number | string>;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  portfolio_continuity?: Record<string, unknown>[];
  commission_protection?: Record<string, unknown>[];
  referral_continuity?: Record<string, unknown>[];
  communications?: Record<string, unknown>[];
  readiness_scores?: Record<string, unknown>[];
  reports?: Record<string, unknown>[];
  audit_recent?: Record<string, unknown>[];
};

function arr(row: Record<string, unknown>, key: string) {
  return Array.isArray(row[key]) ? (row[key] as Record<string, unknown>[]) : [];
}

function obj(row: Record<string, unknown>, key: string) {
  return typeof row[key] === "object" && row[key] ? (row[key] as Record<string, number | string>) : {};
}

function status(row: Record<string, unknown>, key: string): ContinuityStatus | undefined {
  const v = row[key];
  if (typeof v !== "object" || !v) return undefined;
  return v as ContinuityStatus;
}

export function parseBusinessContinuityCenter(raw: unknown): BusinessContinuityCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    continuity_status: status(row, "continuity_status"),
    readiness_score: typeof row.readiness_score === "number" ? row.readiness_score : undefined,
    phase_integrations: arr(row, "phase_integrations"),
    governance_rules: arr(row, "governance_rules"),
    routes: typeof row.routes === "object" && row.routes ? (row.routes as Record<string, string>) : {},
    executive_dashboard: obj(row, "executive_dashboard"),
    stats: obj(row, "stats"),
    companion_recommendations: arr(row, "companion_recommendations"),
    executive_metrics: arr(row, "executive_metrics"),
    since_last_login_integration:
      typeof row.since_last_login_integration === "object" && row.since_last_login_integration
        ? (row.since_last_login_integration as Record<string, unknown>)
        : {},
    continuity_plans: arr(row, "continuity_plans"),
    plan_review_cycles: arr(row, "plan_review_cycles"),
    critical_operations: arr(row, "critical_operations"),
    continuity_scopes: arr(row, "continuity_scopes"),
    business_impact_assessments: arr(row, "business_impact_assessments"),
    recovery_objectives: arr(row, "recovery_objectives"),
    crisis_modes: arr(row, "crisis_modes"),
    crisis_command: arr(row, "crisis_command"),
    crisis_timeline: arr(row, "crisis_timeline"),
    crisis_decisions: arr(row, "crisis_decisions"),
    minimum_operating_modes: arr(row, "minimum_operating_modes"),
    temporary_workflows: arr(row, "temporary_workflows"),
    recovery_plans: arr(row, "recovery_plans"),
    recovery_tasks: arr(row, "recovery_tasks"),
    return_to_normal: arr(row, "return_to_normal"),
    post_crisis_reviews: arr(row, "post_crisis_reviews"),
    emergency_contacts: arr(row, "emergency_contacts"),
    communications: arr(row, "communications"),
    dependencies: arr(row, "dependencies"),
    supplier_continuity: arr(row, "supplier_continuity"),
    connected_app_continuity: arr(row, "connected_app_continuity"),
    domain_continuity: arr(row, "domain_continuity"),
    exercises: arr(row, "exercises"),
    readiness_scores: arr(row, "readiness_scores"),
    critical_documents: arr(row, "critical_documents"),
    data_continuity: arr(row, "data_continuity"),
    financial_continuity: arr(row, "financial_continuity"),
    customer_service_continuity: arr(row, "customer_service_continuity"),
    sales_continuity: arr(row, "sales_continuity"),
    partner_commission_protection: arr(row, "partner_commission_protection"),
    reports: arr(row, "reports"),
    audit_recent: arr(row, "audit_recent"),
  };
}

export function parsePartnerBusinessContinuityCenter(raw: unknown): PartnerBusinessContinuityCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    customer_ownership_note:
      typeof row.customer_ownership_note === "string" ? row.customer_ownership_note : undefined,
    continuity_status: status(row, "continuity_status"),
    readiness_score: typeof row.readiness_score === "number" ? row.readiness_score : undefined,
    routes: typeof row.routes === "object" && row.routes ? (row.routes as Record<string, string>) : {},
    executive_dashboard: obj(row, "executive_dashboard"),
    stats: obj(row, "stats"),
    companion_recommendations: arr(row, "companion_recommendations"),
    portfolio_continuity: arr(row, "portfolio_continuity"),
    commission_protection: arr(row, "commission_protection"),
    referral_continuity: arr(row, "referral_continuity"),
    communications: arr(row, "communications"),
    readiness_scores: arr(row, "readiness_scores"),
    reports: arr(row, "reports"),
    audit_recent: arr(row, "audit_recent"),
  };
}
