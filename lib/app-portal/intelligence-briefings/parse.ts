import type {
  BriefingDetail,
  BriefingInsight,
  BriefingItem,
  BriefingListResponse,
  BriefingPriority,
  BriefingRecommendation,
  BriefingType,
  OrgStatus,
} from "./types";
import { BRIEFING_PRIORITIES, BRIEFING_TYPES, ORG_STATUSES } from "./types";

const TYPES = new Set<BriefingType>(BRIEFING_TYPES);
const PRIORITIES = new Set<BriefingPriority>(BRIEFING_PRIORITIES);
const STATUSES = new Set<OrgStatus>(ORG_STATUSES);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function parseInsights(raw: unknown): BriefingInsight[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const row = item as Record<string, unknown>;
    return { id: str(row.id), text: str(row.text) };
  });
}

function parseRecs(raw: unknown): BriefingRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const row = item as Record<string, unknown>;
    return { id: str(row.id), key: str(row.key), priority: str(row.priority) };
  });
}

function parseBriefingItem(raw: unknown, full = false): BriefingItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const type = str(d.briefing_type, "executive_briefing") as BriefingType;
  const priority = str(d.priority_level, "informational") as BriefingPriority;
  const orgStatus = str(d.org_status, "stable") as OrgStatus;
  return {
    id: str(d.id),
    title: str(d.title),
    briefing_type: TYPES.has(type) ? type : "executive_briefing",
    reporting_period_start: str(d.reporting_period_start) || null,
    reporting_period_end: str(d.reporting_period_end) || null,
    generated_at: str(d.generated_at),
    audience: str(d.audience, "leadership"),
    priority_level: PRIORITIES.has(priority) ? priority : "informational",
    org_status: STATUSES.has(orgStatus) ? orgStatus : "stable",
    executive_summary: full ? str(d.executive_summary) : str(d.executive_summary).slice(0, 500),
    key_insights: parseInsights(d.key_insights),
    risks: parseInsights(d.risks),
    opportunities: parseInsights(d.opportunities),
    recommended_actions: parseRecs(d.recommended_actions),
    related_initiative_ids: Array.isArray(d.related_initiative_ids) ? d.related_initiative_ids.map(String) : [],
    related_follow_up_ids: Array.isArray(d.related_follow_up_ids) ? d.related_follow_up_ids.map(String) : [],
    related_commitment_ids: Array.isArray(d.related_commitment_ids) ? d.related_commitment_ids.map(String) : [],
    related_decision_ids: Array.isArray(d.related_decision_ids) ? d.related_decision_ids.map(String) : [],
    notes: str(d.notes),
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

export function parseBriefingList(data: unknown): BriefingListResponse {
  if (!data || typeof data !== "object") return { found: false, items: [] };
  const d = data as Record<string, unknown>;
  const dash = d.dashboard as Record<string, unknown> | undefined;
  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    items: Array.isArray(d.items) ? d.items.map((i) => parseBriefingItem(i)) : [],
    dashboard: dash
      ? {
          latest_briefing: dash.latest_briefing ? parseBriefingItem(dash.latest_briefing) : null,
          previous_briefings: Array.isArray(dash.previous_briefings)
            ? dash.previous_briefings.map((i) => parseBriefingItem(i))
            : [],
          priority_items: Array.isArray(dash.priority_items)
            ? dash.priority_items.map((p) => {
                const row = p as Record<string, unknown>;
                return {
                  id: str(row.id),
                  title: str(row.title),
                  priority_level: str(row.priority_level),
                  org_status: str(row.org_status),
                };
              })
            : [],
          emerging_opportunities: parseInsights(dash.emerging_opportunities),
          emerging_risks: parseInsights(dash.emerging_risks),
          recommended_next_actions: parseRecs(dash.recommended_next_actions),
        }
      : undefined,
    recommendations: parseRecs(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseBriefingDetail(data: unknown): BriefingDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (d.found !== true) return { found: false };
  const rel = (raw: unknown) =>
    Array.isArray(raw)
      ? raw.map((r) => {
          const row = r as Record<string, unknown>;
          return { id: str(row.id), title: str(row.title), status: str(row.status) };
        })
      : [];
  return {
    found: true,
    can_manage: d.can_manage === true,
    briefing: d.briefing ? parseBriefingItem(d.briefing, true) : undefined,
    related_initiatives: rel(d.related_initiatives),
    related_commitments: rel(d.related_commitments),
    related_decisions: rel(d.related_decisions),
    related_follow_ups: rel(d.related_follow_ups),
    activity_timeline: Array.isArray(d.activity_timeline)
      ? d.activity_timeline.map((a) => {
          const row = a as Record<string, unknown>;
          return {
            id: str(row.id),
            event_type: str(row.event_type),
            description: str(row.description),
            created_at: str(row.created_at),
          };
        })
      : [],
    recommendations: parseRecs(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseBriefingItemResponse(data: unknown): BriefingItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  const briefing = d.briefing ?? d;
  if (!briefing || typeof briefing !== "object") return null;
  return parseBriefingItem(briefing, true);
}
