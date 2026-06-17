import type {
  PartnerCommissionsDashboard,
  PartnerCommissionsForecast,
  PartnerCommissionsMilestones,
  PartnerCommissionsSummary,
  PartnerCommissionRecord,
} from "./types";

function asRecord(data: unknown): Record<string, unknown> {
  return data && typeof data === "object" ? (data as Record<string, unknown>) : {};
}

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

function asStringArray(data: unknown): string[] {
  return asArray<unknown>(data).map(String);
}

function parseRecords(data: unknown): PartnerCommissionRecord[] {
  return asArray<unknown>(data).map((row) => {
    const r = asRecord(row);
    const explanation = asRecord(r.explanation);
    return {
      id: String(r.id ?? ""),
      commission_key: String(r.commission_key ?? ""),
      sale_reference: String(r.sale_reference ?? ""),
      customer: String(r.customer ?? ""),
      package: String(r.package ?? ""),
      sale_value: Number(r.sale_value ?? 0),
      commission_rate_pct: Number(r.commission_rate_pct ?? 0),
      commission_amount: Number(r.commission_amount ?? 0),
      status: String(r.status ?? "pending"),
      tier_label: String(r.tier_label ?? ""),
      record_date: String(r.record_date ?? ""),
      explanation: {
        why_earned: String(explanation.why_earned ?? ""),
        customer: String(explanation.customer ?? ""),
        package: String(explanation.package ?? ""),
        tier_applied: String(explanation.tier_applied ?? ""),
        calculation: String(explanation.calculation ?? ""),
        renewal_note: String(explanation.renewal_note ?? ""),
        formula: String(explanation.formula ?? ""),
      },
    };
  });
}

export function parsePartnerCommissionsDashboard(data: unknown): PartnerCommissionsDashboard | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  const milestone = asRecord(d.milestone);
  const motivation = asRecord(d.motivation);
  const filters = asRecord(d.filters);
  return {
    has_access: true,
    org_id: String(d.org_id ?? ""),
    positioning: String(d.positioning ?? ""),
    access: asRecord(d.access) as Record<string, boolean | string>,
    current_commission_level: String(d.current_commission_level ?? ""),
    current_commission_rate_pct: Number(d.current_commission_rate_pct ?? 0),
    this_month_earnings: Number(d.this_month_earnings ?? 0),
    pending_commissions: Number(d.pending_commissions ?? 0),
    approved_commissions: Number(d.approved_commissions ?? 0),
    paid_commissions: Number(d.paid_commissions ?? 0),
    milestone: {
      current_tier: String(milestone.current_tier ?? ""),
      next_tier: String(milestone.next_tier ?? ""),
      sales_remaining: Number(milestone.sales_remaining ?? 0),
      potential_commission_increase_pct: Number(milestone.potential_commission_increase_pct ?? 0),
      milestone_message: String(milestone.milestone_message ?? ""),
    },
    motivation: {
      current_performance: String(motivation.current_performance ?? ""),
      next_goal: String(motivation.next_goal ?? ""),
      potential_earnings_note: String(motivation.potential_earnings_note ?? ""),
      leaderboard_position: String(motivation.leaderboard_position ?? ""),
    },
    records: parseRecords(d.records),
    timeline: asArray<unknown>(d.timeline).map((row) => {
      const t = asRecord(row);
      return {
        id: String(t.id ?? ""),
        event_type: String(t.event_type ?? ""),
        title: String(t.title ?? ""),
        summary: String(t.summary ?? ""),
        created_at: String(t.created_at ?? ""),
      };
    }),
    filters: {
      statuses: asStringArray(filters.statuses),
      packages: asStringArray(filters.packages),
      tiers: asArray<unknown>(filters.tiers).map(Number),
    },
  };
}

export function parsePartnerCommissionsSummary(data: unknown): PartnerCommissionsSummary | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  const insights = asRecord(d.performance_insights);
  const totals = asRecord(d.totals);
  return {
    has_access: true,
    performance_insights: {
      best_performing_month: String(insights.best_performing_month ?? ""),
      average_sale_value: Number(insights.average_sale_value ?? 0),
      conversion_rate_pct: Number(insights.conversion_rate_pct ?? 0),
      tier_progress_pct: Number(insights.tier_progress_pct ?? 0),
      milestone_achievements: String(insights.milestone_achievements ?? ""),
    },
    totals: {
      pending: Number(totals.pending ?? 0),
      approved: Number(totals.approved ?? 0),
      paid: Number(totals.paid ?? 0),
    },
  };
}

export function parsePartnerCommissionsMilestones(data: unknown): PartnerCommissionsMilestones | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  const current = asRecord(d.current_tier);
  const next = asRecord(d.next_tier);
  return {
    has_access: true,
    current_tier: {
      tier_number: Number(current.tier_number ?? 1),
      tier_label: String(current.tier_label ?? ""),
      rate_pct: Number(current.rate_pct ?? 0),
      qualifying_sales: Number(current.qualifying_sales ?? 0),
    },
    next_tier: {
      tier_number: next.tier_number != null ? Number(next.tier_number) : null,
      tier_label: String(next.tier_label ?? ""),
      rate_pct: Number(next.rate_pct ?? 0),
      sales_remaining: Number(next.sales_remaining ?? 0),
      potential_increase_pct: Number(next.potential_increase_pct ?? 0),
      estimated_opportunity: String(next.estimated_opportunity ?? ""),
    },
    tiers: asArray<unknown>(d.tiers).map((row) => {
      const t = asRecord(row);
      return {
        tier_number: Number(t.tier_number ?? 0),
        tier_label: String(t.tier_label ?? ""),
        min_sales: Number(t.min_sales ?? 0),
        max_sales: t.max_sales != null ? Number(t.max_sales) : null,
        commission_rate_pct: Number(t.commission_rate_pct ?? 0),
      };
    }),
  };
}

export function parsePartnerCommissionsForecast(data: unknown): PartnerCommissionsForecast | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  return {
    has_access: true,
    estimated_earnings: Number(d.estimated_earnings ?? 0),
    tier_projection: String(d.tier_projection ?? ""),
    sales_needed: Number(d.sales_needed ?? 0),
    growth_opportunities: asStringArray(d.growth_opportunities),
    forecast_note: String(d.forecast_note ?? ""),
  };
}
