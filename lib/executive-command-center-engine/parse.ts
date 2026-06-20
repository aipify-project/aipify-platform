export type ExecutiveCommandCenter = {
  found: boolean;
  error?: string;
  access_state?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  overall_health_score?: number;
  stats?: Record<string, number | string>;
  activity_since_login?: Record<string, unknown>;
  companion_recommendations?: Record<string, unknown>[];
  since_last_login?: Record<string, unknown>[];
  briefings?: Record<string, unknown>[];
  health?: Record<string, unknown>[];
  alerts?: Record<string, unknown>[];
  opportunities?: Record<string, unknown>[];
  actions?: Record<string, unknown>[];
  timeline?: Record<string, unknown>[];
  board_reports?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  audit_recent?: Record<string, unknown>[];
  mobile_executive?: Record<string, unknown>;
  command_prompts?: string[];
};

export function parseExecutiveCommandCenter(raw: unknown): ExecutiveCommandCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    access_state: typeof row.access_state === "string" ? row.access_state : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    overall_health_score: typeof row.overall_health_score === "number" ? row.overall_health_score : undefined,
    stats: typeof row.stats === "object" && row.stats ? (row.stats as Record<string, number | string>) : {},
    activity_since_login:
      typeof row.activity_since_login === "object" && row.activity_since_login
        ? (row.activity_since_login as Record<string, unknown>)
        : {},
    companion_recommendations: Array.isArray(row.companion_recommendations)
      ? (row.companion_recommendations as Record<string, unknown>[])
      : [],
    since_last_login: Array.isArray(row.since_last_login) ? (row.since_last_login as Record<string, unknown>[]) : [],
    briefings: Array.isArray(row.briefings) ? (row.briefings as Record<string, unknown>[]) : [],
    health: Array.isArray(row.health) ? (row.health as Record<string, unknown>[]) : [],
    alerts: Array.isArray(row.alerts) ? (row.alerts as Record<string, unknown>[]) : [],
    opportunities: Array.isArray(row.opportunities) ? (row.opportunities as Record<string, unknown>[]) : [],
    actions: Array.isArray(row.actions) ? (row.actions as Record<string, unknown>[]) : [],
    timeline: Array.isArray(row.timeline) ? (row.timeline as Record<string, unknown>[]) : [],
    board_reports: Array.isArray(row.board_reports) ? (row.board_reports as Record<string, unknown>[]) : [],
    business_packs: Array.isArray(row.business_packs) ? (row.business_packs as Record<string, unknown>[]) : [],
    audit_recent: Array.isArray(row.audit_recent) ? (row.audit_recent as Record<string, unknown>[]) : [],
    mobile_executive:
      typeof row.mobile_executive === "object" && row.mobile_executive
        ? (row.mobile_executive as Record<string, unknown>)
        : {},
    command_prompts: Array.isArray(row.command_prompts) ? (row.command_prompts as string[]) : [],
  };
}
