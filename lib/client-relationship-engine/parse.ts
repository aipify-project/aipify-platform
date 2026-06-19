export type ClientRelationshipCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  entity_label?: string;
  health_score?: number;
  health_status?: string;
  health_status_label?: string;
  section_count?: number;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  terminology?: Record<string, unknown>[];
  clients?: Record<string, unknown>[];
  duplicate_candidates?: Record<string, unknown>[];
  segments?: Record<string, unknown>[];
  rebooking_rules?: Record<string, unknown>[];
  rebooking_queue?: Record<string, unknown>[];
  recurring_agreements?: Record<string, unknown>[];
  waiting_list?: Record<string, unknown>;
  retention_cases?: Record<string, unknown>[];
  journey_stages?: Record<string, unknown>[];
  journey_events?: Record<string, unknown>[];
  loyalty_accounts?: Record<string, unknown>[];
  loyalty_redemptions?: Record<string, unknown>[];
  memberships?: Record<string, unknown>;
  packages?: Record<string, unknown>;
  referrals?: Record<string, unknown>[];
  campaigns?: Record<string, unknown>[];
  communications?: Record<string, unknown>[];
  feedback?: Record<string, unknown>[];
  recovery_cases?: Record<string, unknown>[];
  automations?: Record<string, unknown>[];
  integrations?: Record<string, unknown>[];
  vacation_continuity?: Record<string, unknown>;
  phase_links?: Record<string, unknown>;
  dashboards?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  audit_recent?: Record<string, unknown>[];
  settings?: Record<string, unknown>;
  section_registry?: Record<string, unknown>[];
};

function arr(raw: unknown): Record<string, unknown>[] {
  return Array.isArray(raw) ? (raw as Record<string, unknown>[]) : [];
}

function obj(raw: unknown): Record<string, unknown> | undefined {
  return typeof raw === "object" && raw && !Array.isArray(raw) ? (raw as Record<string, unknown>) : undefined;
}

export function parseClientRelationshipCenter(raw: unknown): ClientRelationshipCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    entity_label: typeof row.entity_label === "string" ? row.entity_label : undefined,
    health_score: typeof row.health_score === "number" ? row.health_score : undefined,
    health_status: typeof row.health_status === "string" ? row.health_status : undefined,
    health_status_label: typeof row.health_status_label === "string" ? row.health_status_label : undefined,
    section_count: typeof row.section_count === "number" ? row.section_count : undefined,
    stats: obj(row.stats) as Record<string, number | string> | undefined,
    companion_recommendations: arr(row.companion_recommendations),
    terminology: arr(row.terminology),
    clients: arr(row.clients),
    duplicate_candidates: arr(row.duplicate_candidates),
    segments: arr(row.segments),
    rebooking_rules: arr(row.rebooking_rules),
    rebooking_queue: arr(row.rebooking_queue),
    recurring_agreements: arr(row.recurring_agreements),
    waiting_list: obj(row.waiting_list),
    retention_cases: arr(row.retention_cases),
    journey_stages: arr(row.journey_stages),
    journey_events: arr(row.journey_events),
    loyalty_accounts: arr(row.loyalty_accounts),
    loyalty_redemptions: arr(row.loyalty_redemptions),
    memberships: obj(row.memberships),
    packages: obj(row.packages),
    referrals: arr(row.referrals),
    campaigns: arr(row.campaigns),
    communications: arr(row.communications),
    feedback: arr(row.feedback),
    recovery_cases: arr(row.recovery_cases),
    automations: arr(row.automations),
    integrations: arr(row.integrations),
    vacation_continuity: obj(row.vacation_continuity),
    phase_links: obj(row.phase_links),
    dashboards: obj(row.dashboards),
    reports: obj(row.reports),
    audit_recent: arr(row.audit_recent),
    settings: obj(row.settings),
    section_registry: arr(row.section_registry),
  };
}

export type CompanionClientAdvisorBundle = {
  found: boolean;
  error?: string;
  advisor_title?: string;
  advisor_identity?: string;
  privacy_note?: string;
  human_review_required?: boolean;
  insights?: Record<string, unknown>[];
  center?: ClientRelationshipCenter;
};

export function parseCompanionClientAdvisorBundle(raw: unknown): CompanionClientAdvisorBundle {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    advisor_title: typeof row.advisor_title === "string" ? row.advisor_title : undefined,
    advisor_identity: typeof row.advisor_identity === "string" ? row.advisor_identity : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    human_review_required: typeof row.human_review_required === "boolean" ? row.human_review_required : undefined,
    insights: arr(row.insights),
    center: row.center ? parseClientRelationshipCenter(row.center) : undefined,
  };
}
