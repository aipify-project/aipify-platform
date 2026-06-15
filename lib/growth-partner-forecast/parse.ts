import {
  EXPANSION_TYPES,
  FORECAST_PERIODS,
  GOAL_PERIODS,
  PIPELINE_STAGES,
  SCENARIO_KEYS,
} from "./constants";
import type {
  ExpansionForecast,
  ForecastAuditEntry,
  ForecastGoal,
  ForecastOverview,
  ForecastRecommendation,
  ForecastScenario,
  GrowthPartnerForecastCenter,
  PipelineForecast,
  PipelineOpportunity,
  RenewalForecast,
} from "./types";

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asString(value: unknown, fallback = ""): string {
  return value == null ? fallback : String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function parseEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  const str = asString(value, fallback);
  return (allowed.includes(str as T) ? str : fallback) as T;
}

function parseOverview(raw: unknown): ForecastOverview {
  const row = asRecord(raw) ?? {};
  return {
    forecasted_monthly_revenue: asNumber(row.forecasted_monthly_revenue),
    forecasted_annual_revenue: asNumber(row.forecasted_annual_revenue),
    active_opportunities_value: asNumber(row.active_opportunities_value),
    expected_commissions: asNumber(row.expected_commissions),
    renewal_opportunities: asNumber(row.renewal_opportunities),
    expansion_opportunities: asNumber(row.expansion_opportunities),
    weighted_pipeline_value: asNumber(row.weighted_pipeline_value),
  };
}

function parseOpportunity(raw: unknown): PipelineOpportunity | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    company_name: asString(row.company_name),
    pipeline_stage: parseEnum(row.pipeline_stage, PIPELINE_STAGES, "discovery"),
    estimated_value: asNumber(row.estimated_value),
    expected_close_date: row.expected_close_date ? asString(row.expected_close_date) : null,
    opportunity_type: asString(row.opportunity_type),
    weighted_value: asNumber(row.weighted_value),
  };
}

function parsePipeline(raw: unknown): PipelineForecast {
  const row = asRecord(raw) ?? {};
  return {
    qualified: asNumber(row.qualified),
    proposal_stage: asNumber(row.proposal_stage),
    negotiation_stage: asNumber(row.negotiation_stage),
    weighted_value: asNumber(row.weighted_value),
    opportunities: Array.isArray(row.opportunities)
      ? row.opportunities.map(parseOpportunity).filter((o): o is PipelineOpportunity => o != null)
      : [],
  };
}

function parseRenewal(raw: unknown): RenewalForecast | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    customer_name: asString(row.customer_name),
    renewal_date: asString(row.renewal_date),
    renewal_value: asNumber(row.renewal_value),
    renewal_probability: asNumber(row.renewal_probability),
    requires_attention: row.requires_attention === true,
  };
}

function parseExpansion(raw: unknown): ExpansionForecast | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    customer_name: asString(row.customer_name),
    expansion_type: parseEnum(row.expansion_type, EXPANSION_TYPES, "additional_users"),
    estimated_value: asNumber(row.estimated_value),
    probability: asNumber(row.probability),
  };
}

function parseGoal(raw: unknown): ForecastGoal | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    goal_period: parseEnum(row.goal_period, GOAL_PERIODS, "monthly"),
    period_key: asString(row.period_key),
    target_revenue: asNumber(row.target_revenue),
    current_revenue: asNumber(row.current_revenue),
    progress_pct: asNumber(row.progress_pct),
  };
}

function parseScenario(raw: unknown): ForecastScenario | null {
  const row = asRecord(raw);
  if (!row?.scenario_key) return null;
  return {
    scenario_key: parseEnum(row.scenario_key, SCENARIO_KEYS, "expected"),
    forecast_period: parseEnum(row.forecast_period, FORECAST_PERIODS, "next_30_days"),
    projected_revenue: asNumber(row.projected_revenue),
    projected_commissions: asNumber(row.projected_commissions),
  };
}

function parseRecommendation(raw: unknown): ForecastRecommendation | null {
  const row = asRecord(raw);
  if (!row?.key) return null;
  return { key: asString(row.key), message_key: asString(row.message_key, asString(row.key)) };
}

function parseAudit(raw: unknown): ForecastAuditEntry | null {
  const row = asRecord(raw);
  if (!row?.id) return null;
  return {
    id: asString(row.id),
    event_type: asString(row.event_type),
    summary: asString(row.summary),
    created_at: asString(row.created_at),
  };
}

export function parseGrowthPartnerForecastCenter(raw: unknown): GrowthPartnerForecastCenter {
  const row = asRecord(raw) ?? {};
  if (!row.has_access) return { has_access: false };

  return {
    has_access: true,
    surface: asString(row.surface) as GrowthPartnerForecastCenter["surface"],
    tenant_id: row.tenant_id ? asString(row.tenant_id) : undefined,
    overview: parseOverview(row.overview),
    pipeline: parsePipeline(row.pipeline),
    renewals: Array.isArray(row.renewals)
      ? row.renewals.map(parseRenewal).filter((r): r is RenewalForecast => r != null)
      : [],
    expansions: Array.isArray(row.expansions)
      ? row.expansions.map(parseExpansion).filter((e): e is ExpansionForecast => e != null)
      : [],
    goals: Array.isArray(row.goals)
      ? row.goals.map(parseGoal).filter((g): g is ForecastGoal => g != null)
      : [],
    scenarios: Array.isArray(row.scenarios)
      ? row.scenarios.map(parseScenario).filter((s): s is ForecastScenario => s != null)
      : [],
    forecast_periods: Array.isArray(row.forecast_periods)
      ? row.forecast_periods.map((p) => asString(p))
      : [],
    probability_assumptions: asRecord(row.probability_assumptions) as Record<string, number> | undefined,
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map(parseRecommendation).filter((r): r is ForecastRecommendation => r != null)
      : [],
    audit: Array.isArray(row.audit)
      ? row.audit.map(parseAudit).filter((a): a is ForecastAuditEntry => a != null)
      : [],
    partners: Array.isArray(row.partners)
      ? row.partners.map((p) => {
          const item = asRecord(p) ?? {};
          return {
            tenant_id: asString(item.tenant_id),
            forecasted_annual: asNumber(item.forecasted_annual),
            weighted_pipeline: asNumber(item.weighted_pipeline),
          };
        })
      : [],
    principle: asString(row.principle),
  };
}
