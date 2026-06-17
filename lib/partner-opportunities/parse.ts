import type {
  PartnerOpportunitiesForecast,
  PartnerOpportunitiesOverview,
  PartnerOpportunitiesPipeline,
  PartnerOpportunity,
  PartnerOpportunityDetail,
} from "./types";

function asRecord(data: unknown): Record<string, unknown> {
  return data && typeof data === "object" ? (data as Record<string, unknown>) : {};
}

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

export function parsePartnerOpportunity(data: unknown): PartnerOpportunity {
  const o = asRecord(data);
  return {
    id: String(o.id ?? ""),
    opportunity_key: String(o.opportunity_key ?? ""),
    company_name: String(o.company_name ?? ""),
    contact_person: String(o.contact_person ?? ""),
    contact_email: String(o.contact_email ?? ""),
    contact_phone: String(o.contact_phone ?? ""),
    country_code: String(o.country_code ?? ""),
    industry: String(o.industry ?? ""),
    opportunity_value: Number(o.opportunity_value ?? 0),
    expected_close_date: String(o.expected_close_date ?? ""),
    stage_key: String(o.stage_key ?? ""),
    stage_label: String(o.stage_label ?? ""),
    owner_auth_user_id: String(o.owner_auth_user_id ?? ""),
    owner_name: String(o.owner_name ?? ""),
    next_action: String(o.next_action ?? ""),
    next_action_due: String(o.next_action_due ?? ""),
    last_activity_at: String(o.last_activity_at ?? ""),
    health_score_label: String(o.health_score_label ?? ""),
    health_score_pct: Number(o.health_score_pct ?? 0),
    potential_commission: Number(o.potential_commission ?? 0),
    insights: asArray<string>(o.insights).map(String),
    created_at: String(o.created_at ?? ""),
    updated_at: String(o.updated_at ?? ""),
  };
}

export function parsePartnerOpportunitiesOverview(data: unknown): PartnerOpportunitiesOverview | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  const dashboard = d.dashboard ? asRecord(d.dashboard) : null;
  const performance = d.performance ? asRecord(d.performance) : null;
  const empty = d.empty_state ? asRecord(d.empty_state) : null;

  return {
    has_access: true,
    can_write: Boolean(d.can_write),
    team_role: d.team_role ? String(d.team_role) : undefined,
    access_denied: Boolean(d.access_denied),
    positioning: d.positioning ? String(d.positioning) : undefined,
    dashboard: dashboard
      ? {
          active_opportunities: Number(dashboard.active_opportunities ?? 0),
          new_opportunities: Number(dashboard.new_opportunities ?? 0),
          qualified_opportunities: Number(dashboard.qualified_opportunities ?? 0),
          proposal_opportunities: Number(dashboard.proposal_opportunities ?? 0),
          closed_won: Number(dashboard.closed_won ?? 0),
          closed_lost: Number(dashboard.closed_lost ?? 0),
          pipeline_value: Number(dashboard.pipeline_value ?? 0),
        }
      : undefined,
    performance: performance
      ? {
          conversion_rate_pct: Number(performance.conversion_rate_pct ?? 0),
          average_deal_size: Number(performance.average_deal_size ?? 0),
          win_rate_pct: Number(performance.win_rate_pct ?? 0),
          pipeline_growth: Number(performance.pipeline_growth ?? 0),
        }
      : undefined,
    opportunities: asArray<unknown>(d.opportunities).map(parsePartnerOpportunity),
    stages: asArray<unknown>(d.stages).map((row) => {
      const s = asRecord(row);
      return {
        stage_key: String(s.stage_key ?? ""),
        stage_label: String(s.stage_label ?? ""),
        sort_order: Number(s.sort_order ?? 0),
        weight_pct: Number(s.weight_pct ?? 0),
      };
    }),
    empty_state: empty
      ? {
          title: String(empty.title ?? ""),
          message: String(empty.message ?? ""),
          cta: String(empty.cta ?? ""),
        }
      : undefined,
  };
}

export function parsePartnerOpportunityDetail(data: unknown): PartnerOpportunityDetail | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  return {
    has_access: true,
    can_write: Boolean(d.can_write),
    opportunity: d.opportunity ? parsePartnerOpportunity(d.opportunity) : undefined,
    timeline: asArray<unknown>(d.timeline).map((row) => {
      const t = asRecord(row);
      return {
        id: String(t.id ?? ""),
        activity_type: String(t.activity_type ?? ""),
        title: String(t.title ?? ""),
        summary: String(t.summary ?? ""),
        created_at: String(t.created_at ?? ""),
      };
    }),
    stage_history: asArray<unknown>(d.stage_history).map((row) => {
      const h = asRecord(row);
      return {
        from_stage: String(h.from_stage ?? ""),
        to_stage: String(h.to_stage ?? ""),
        created_at: String(h.created_at ?? ""),
      };
    }),
  };
}

export function parsePartnerOpportunitiesPipeline(data: unknown): PartnerOpportunitiesPipeline | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  const kanbanRaw = asRecord(d.kanban);
  const kanban: Record<string, PartnerOpportunity[]> = {};
  for (const [key, value] of Object.entries(kanbanRaw)) {
    kanban[key] = parseOpportunityList(value);
  }
  return { has_access: true, kanban };
}

function parseOpportunityList(data: unknown): PartnerOpportunity[] {
  return asArray<unknown>(data).map(parsePartnerOpportunity);
}

export function parsePartnerOpportunitiesForecast(data: unknown): PartnerOpportunitiesForecast | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  return {
    has_access: true,
    expected_revenue: Number(d.expected_revenue ?? 0),
    weighted_revenue: Number(d.weighted_revenue ?? 0),
    potential_commission: Number(d.potential_commission ?? 0),
    by_month: asArray<unknown>(d.by_month).map((row) => {
      const m = asRecord(row);
      return {
        month: String(m.month ?? ""),
        value: Number(m.value ?? 0),
        weighted: Number(m.weighted ?? 0),
      };
    }),
  };
}
