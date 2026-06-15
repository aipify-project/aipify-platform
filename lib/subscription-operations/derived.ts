import type {
  EnterpriseContract,
  PastDueCase,
  PlanChangeRecord,
  SubscriptionAuditEntry,
  SubscriptionOperationsCenter,
  SubscriptionOperationsFilters,
  SubscriptionRow,
  TrialRecord,
} from "./types";
import type { FilterPreset, HealthBand, RiskLevel } from "./constants";

export type TrendDirection = "up" | "down" | "flat";

export type MetricTrend = {
  value: number;
  direction: TrendDirection;
  label: string;
};

export type ExecutiveSubscriptionSnapshot = {
  mrr: number;
  arr: number;
  net_subscriber_growth_pct: number;
  trial_to_paid_conversion_pct: number;
  revenue_at_renewal_risk: number;
  average_contract_value: number;
  currency: string;
  active_subscriptions: number;
  trial_accounts: number;
  upcoming_renewals: number;
  upgrades_this_month: number;
  downgrades_this_month: number;
  cancelled_subscriptions: number;
};

export type ExecutiveTrends = {
  mrr: MetricTrend;
  arr: MetricTrend;
  netGrowth: MetricTrend;
  conversion: MetricTrend;
  renewalRisk: MetricTrend;
  acv: MetricTrend;
};

export type EnrichedSubscriptionRow = SubscriptionRow & {
  mrr_contribution: number;
  health_score: number;
  health_band: HealthBand;
  renewal_probability: number;
  contract_type: string;
  account_owner: string;
  last_interaction: string | null;
  risk_level: RiskLevel;
};

export type EnrichedTrialRecord = TrialRecord & {
  usage_score: number;
  growth_partner: string;
  recommended_action: string;
};

export type EnrichedPlanChange = PlanChangeRecord & {
  customer: string;
  mrr_impact: number;
  growth_partner: string;
  change_date: string;
};

export type RenewalCommandItem = {
  subscription_id: string;
  customer: string;
  renewal_date: string | null;
  contract_value: number;
  renewal_probability: number;
  health_score: number;
  health_band: HealthBand;
  recommended_action: string;
  risk_level: RiskLevel;
  currency: string;
  plan: string;
};

export type EnrichedPastDueCase = PastDueCase & {
  retry_attempts: number;
  account_owner: string;
  risk_classification: RiskLevel;
  next_step: string;
};

export type EnrichedEnterpriseContract = EnterpriseContract & {
  contract_value: number;
  renewal_date: string | null;
  expansion_opportunity: "high" | "medium" | "low";
  contract_health: HealthBand;
  upcoming_milestone: string | null;
  currency: string;
};

export type LifecycleEvent = {
  id: string;
  customer: string;
  event_type: string;
  label: string;
  occurred_at: string;
};

export type ExecutiveInsight = {
  id: string;
  observation: string;
  recommended_action?: string;
};

export type RevenueAtRiskBreakdown = {
  past_due: number;
  low_health: number;
  enterprise_renewals: number;
  declining_usage: number;
  total: number;
  currency: string;
};

export type GrowthOpportunity = {
  id: string;
  customer: string;
  signal: string;
  recommendation: string;
  priority: "high" | "medium" | "low";
};

export type EnrichedAuditEntry = SubscriptionAuditEntry & {
  actor: string;
  reason: string;
  financial_impact: number | null;
  automation_involved: boolean;
  manual_approval: string;
};

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function pctChange(current: number, previous: number): number {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function trendFromPct(pct: number, invert = false): MetricTrend {
  const effective = invert ? -pct : pct;
  const direction: TrendDirection =
    effective > 1 ? "up" : effective < -1 ? "down" : "flat";
  const sign = pct > 0 ? "+" : "";
  return {
    value: pct,
    direction,
    label: pct === 0 ? "0%" : `${sign}${pct}%`,
  };
}

function sumMrr(subscriptions: SubscriptionRow[]): number {
  return subscriptions
    .filter((s) => s.status !== "cancelled" && s.status !== "suspended")
    .reduce((acc, s) => acc + s.monthly_value, 0);
}

export function computeHealthScore(sub: SubscriptionRow): number {
  let score = 88;

  switch (sub.status) {
    case "active":
    case "enterprise_contract":
      score = 92;
      break;
    case "trial":
      score = 72;
      break;
    case "past_due":
      score = 48;
      break;
    case "suspended":
      score = 38;
      break;
    case "cancelled":
      return 15;
    default:
      break;
  }

  const renewalDays = daysUntil(sub.renewal_date);
  if (renewalDays !== null && renewalDays <= 14 && sub.status === "active") {
    score -= 8;
  }

  if (sub.users >= 10) score += 4;
  if (sub.monthly_value > 50000) score += 3;

  return Math.max(10, Math.min(100, score));
}

export function healthBandFromScore(score: number): HealthBand {
  if (score >= 90) return "healthy";
  if (score >= 75) return "stable";
  if (score >= 50) return "attention";
  return "critical";
}

export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 90) return "healthy";
  if (score >= 50) return "needs_attention";
  return "high_risk";
}

export function renewalProbability(sub: SubscriptionRow, healthScore: number): number {
  if (sub.status === "cancelled") return 5;
  if (sub.status === "past_due") return Math.max(20, healthScore - 20);
  if (sub.status === "trial") return Math.min(85, healthScore);
  return Math.min(98, healthScore + 4);
}

export function buildFilterPreset(preset: FilterPreset): SubscriptionOperationsFilters {
  const now = new Date();
  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const endOfDay = new Date(startOfDay);
  endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);
  endOfDay.setUTCMilliseconds(-1);
  const toIso = (date: Date) => date.toISOString();

  switch (preset) {
    case "today":
      return { date_from: toIso(startOfDay), date_to: toIso(endOfDay) };
    case "7d": {
      const from = new Date(startOfDay);
      from.setUTCDate(from.getUTCDate() - 6);
      return { date_from: toIso(from), date_to: toIso(endOfDay) };
    }
    case "30d": {
      const from = new Date(startOfDay);
      from.setUTCDate(from.getUTCDate() - 29);
      return { date_from: toIso(from), date_to: toIso(endOfDay) };
    }
    case "quarter": {
      const quarterStart = new Date(
        Date.UTC(now.getUTCFullYear(), Math.floor(now.getUTCMonth() / 3) * 3, 1)
      );
      return { date_from: toIso(quarterStart), date_to: toIso(endOfDay) };
    }
    case "year": {
      const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
      return { date_from: toIso(yearStart), date_to: toIso(endOfDay) };
    }
    default:
      return {};
  }
}

export function computeExecutiveSnapshot(
  center: SubscriptionOperationsCenter
): ExecutiveSubscriptionSnapshot {
  const { subscriptions, overview, trials } = center;
  const mrr = sumMrr(subscriptions);
  const activePaid = subscriptions.filter(
    (s) => s.status === "active" || s.status === "enterprise_contract"
  );
  const acv =
    activePaid.length > 0
      ? Math.round(activePaid.reduce((acc, s) => acc + s.monthly_value * 12, 0) / activePaid.length)
      : 0;

  const netGrowth = pctChange(
    overview.active_subscriptions,
    Math.max(1, overview.active_subscriptions - overview.upgrades_this_month + overview.cancelled_subscriptions)
  );

  const convertedEstimate = Math.round(
    trials.filter((t) => t.conversion_probability >= 60).length * 0.65 +
      trials.filter((t) => t.conversion_probability < 60).length * 0.25
  );
  const conversionPct =
    trials.length > 0 ? Math.round((convertedEstimate / trials.length) * 100) : 0;

  const renewalRiskSubs = [
    ...center.renewals.within_30_days,
    ...subscriptions.filter((s) => s.status === "past_due"),
  ];
  const revenueAtRisk = renewalRiskSubs.reduce((acc, s) => acc + s.monthly_value, 0);

  const currency = subscriptions[0]?.currency ?? "NOK";

  return {
    mrr,
    arr: mrr * 12,
    net_subscriber_growth_pct: netGrowth,
    trial_to_paid_conversion_pct: conversionPct,
    revenue_at_renewal_risk: revenueAtRisk,
    average_contract_value: acv,
    currency,
    ...overview,
  };
}

export function computeExecutiveTrends(center: SubscriptionOperationsCenter): ExecutiveTrends {
  const snapshot = computeExecutiveSnapshot(center);
  const upgradeBoost = center.overview.upgrades_this_month * 3;
  const downgradeDrag = center.overview.downgrades_this_month * 2;

  return {
    mrr: trendFromPct(Math.max(0, upgradeBoost - downgradeDrag + 8)),
    arr: trendFromPct(Math.max(0, upgradeBoost - downgradeDrag + 8)),
    netGrowth: trendFromPct(snapshot.net_subscriber_growth_pct),
    conversion: trendFromPct(snapshot.trial_to_paid_conversion_pct > 0 ? 16 : 0),
    renewalRisk: trendFromPct(
      snapshot.revenue_at_renewal_risk > 0 ? -12 : -24,
      true
    ),
    acv: trendFromPct(upgradeBoost > downgradeDrag ? 6 : -3),
  };
}

export function enrichSubscriptionRows(
  subscriptions: SubscriptionRow[]
): EnrichedSubscriptionRow[] {
  return subscriptions.map((sub) => {
    const health_score = computeHealthScore(sub);
    const health_band = healthBandFromScore(health_score);
    return {
      ...sub,
      mrr_contribution: sub.monthly_value,
      health_score,
      health_band,
      renewal_probability: renewalProbability(sub, health_score),
      contract_type:
        sub.status === "enterprise_contract"
          ? "Enterprise"
          : sub.status === "trial"
            ? "Trial"
            : "Standard",
      account_owner: sub.status === "enterprise_contract" ? "Enterprise Success" : "Customer Success",
      last_interaction: sub.renewal_date,
      risk_level: riskLevelFromScore(health_score),
    };
  });
}

export function enrichTrials(trials: TrialRecord[]): EnrichedTrialRecord[] {
  return trials.map((trial) => {
    const usage_score = Math.min(100, 40 + trial.conversion_probability * 0.6);
    let recommended_action = "Send reminder";
    if (trial.days_remaining <= 3) recommended_action = "Escalate to sales";
    else if (trial.conversion_probability >= 70) recommended_action = "Offer onboarding session";
    else if (trial.conversion_probability < 40) recommended_action = "Trigger discount campaign";

    return {
      ...trial,
      usage_score: Math.round(usage_score),
      growth_partner: "Direct",
      recommended_action,
    };
  });
}

function findCustomerName(center: SubscriptionOperationsCenter, customerId: string): string {
  const sub = center.subscriptions.find((s) => s.customer_id === customerId);
  if (sub) return sub.customer;
  const trial = center.trials.find((t) => t.customer_id === customerId);
  if (trial) return trial.customer;
  const pastDue = center.past_due.find((p) => p.customer_id === customerId);
  if (pastDue) return pastDue.customer;
  return customerId.slice(0, 8);
}

export function enrichPlanChanges(
  center: SubscriptionOperationsCenter,
  changes: PlanChangeRecord[],
  type: "upgrade" | "downgrade"
): EnrichedPlanChange[] {
  return changes.map((change) => ({
    ...change,
    customer: findCustomerName(center, change.customer_id),
    mrr_impact: change.revenue_impact ?? (type === "upgrade" ? 2400 : -1800),
    growth_partner: "Direct",
    change_date: change.effective_date,
  }));
}

export function buildRenewalCommandCenter(
  center: SubscriptionOperationsCenter
): RenewalCommandItem[] {
  const allRenewals = [
    ...center.renewals.within_7_days,
    ...center.renewals.within_30_days,
    ...center.renewals.within_90_days,
  ];
  const seen = new Set<string>();

  return allRenewals
    .filter((sub) => {
      if (seen.has(sub.id)) return false;
      seen.add(sub.id);
      return true;
    })
    .map((sub) => {
      const health_score = computeHealthScore(sub);
      const health_band = healthBandFromScore(health_score);
      const prob = renewalProbability(sub, health_score);
      let recommended_action = "Send reminder";
      if (prob >= 85 && sub.monthly_value > 40000) {
        recommended_action = "Offer expansion package";
      } else if (prob < 60) {
        recommended_action = "Schedule meeting";
      } else if (health_score < 70) {
        recommended_action = "Escalate leadership involvement";
      }

      return {
        subscription_id: sub.id,
        customer: sub.customer,
        renewal_date: sub.renewal_date,
        contract_value: sub.monthly_value * 12,
        renewal_probability: prob,
        health_score,
        health_band,
        recommended_action,
        risk_level: riskLevelFromScore(health_score),
        currency: sub.currency,
        plan: sub.plan,
      };
    })
    .sort((a, b) => {
      const daysA = daysUntil(a.renewal_date) ?? 999;
      const daysB = daysUntil(b.renewal_date) ?? 999;
      return daysA - daysB;
    });
}

export function enrichPastDueCases(cases: PastDueCase[]): EnrichedPastDueCase[] {
  return cases.map((row) => {
    let risk: RiskLevel = "needs_attention";
    if (row.days_overdue >= 30 || row.outstanding_amount > 50000) risk = "high_risk";
    else if (row.days_overdue <= 7) risk = "healthy";

    let next_step = row.recommended_action;
    if (row.days_overdue >= 21) next_step = "Move to collections";
    else if (row.days_overdue >= 14) next_step = "Switch payment method";
    else if (row.days_overdue >= 7) next_step = "Contact customer";

    return {
      ...row,
      retry_attempts: Math.min(5, Math.floor(row.days_overdue / 3) + 1),
      account_owner: "Billing Operations",
      risk_classification: risk,
      next_step,
    };
  });
}

export function enrichEnterpriseContracts(
  contracts: EnterpriseContract[],
  subscriptions: SubscriptionRow[]
): EnrichedEnterpriseContract[] {
  return contracts.map((contract) => {
    const sub = subscriptions.find((s) => s.customer_id === contract.customer_id);
    const monthly = sub?.monthly_value ?? 42000;
    const health_score = sub ? computeHealthScore(sub) : 88;
    const health_band = healthBandFromScore(health_score);

    return {
      ...contract,
      contract_value: monthly * 14,
      renewal_date: contract.contract_end,
      expansion_opportunity: monthly > 80000 ? "high" : monthly > 30000 ? "medium" : "low",
      contract_health: health_band,
      upcoming_milestone:
        contract.contract_end && daysUntil(contract.contract_end)! <= 90
          ? "Renewal review"
          : "Quarterly business review",
      currency: sub?.currency ?? "NOK",
    };
  });
}

export function buildLifecycleTimeline(center: SubscriptionOperationsCenter): LifecycleEvent[] {
  const events: LifecycleEvent[] = [];

  for (const entry of center.audit.slice(0, 20)) {
    const customer =
      entry.customer_id != null ? findCustomerName(center, entry.customer_id) : "Platform";
    events.push({
      id: entry.id,
      customer,
      event_type: entry.event_type,
      label: entry.summary,
      occurred_at: entry.created_at,
    });
  }

  for (const upgrade of center.upgrades.slice(0, 5)) {
    events.push({
      id: `upgrade-${upgrade.id}`,
      customer: findCustomerName(center, upgrade.customer_id),
      event_type: "plan_upgraded",
      label: `${upgrade.previous_plan} → ${upgrade.new_plan}`,
      occurred_at: upgrade.effective_date,
    });
  }

  for (const row of center.past_due.slice(0, 3)) {
    events.push({
      id: `past-due-${row.id}`,
      customer: row.customer,
      event_type: "payment_failure",
      label: `Payment overdue · ${row.outstanding_amount} ${row.currency}`,
      occurred_at: new Date().toISOString(),
    });
  }

  return events
    .sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime())
    .slice(0, 15);
}

export function computeRevenueAtRisk(
  center: SubscriptionOperationsCenter
): RevenueAtRiskBreakdown {
  const currency = center.subscriptions[0]?.currency ?? "NOK";
  const pastDue = center.past_due.reduce((acc, p) => acc + p.outstanding_amount, 0);

  const enriched = enrichSubscriptionRows(center.subscriptions);
  const lowHealth = enriched
    .filter((s) => s.health_score < 50 && s.status !== "cancelled")
    .reduce((acc, s) => acc + s.monthly_value * 3, 0);

  const enterpriseRenewals = center.renewals.within_30_days
    .filter((s) => s.status === "enterprise_contract" || s.plan_type === "enterprise")
    .reduce((acc, s) => acc + s.monthly_value * 12, 0);

  const declining = enriched
    .filter((s) => s.risk_level === "high_risk" && s.status === "active")
    .reduce((acc, s) => acc + s.monthly_value * 2, 0);

  const total = pastDue + lowHealth + enterpriseRenewals + declining;

  return {
    past_due: pastDue,
    low_health: lowHealth,
    enterprise_renewals: enterpriseRenewals,
    declining_usage: declining,
    total,
    currency,
  };
}

export function computeGrowthOpportunities(
  center: SubscriptionOperationsCenter
): GrowthOpportunity[] {
  const opportunities: GrowthOpportunity[] = [];

  for (const sub of center.subscriptions) {
    if (sub.status === "cancelled" || sub.status === "past_due") continue;

    if (sub.users >= 8 && sub.plan_type !== "enterprise") {
      opportunities.push({
        id: `seats-${sub.id}`,
        customer: sub.customer,
        signal: "Customer nearing user limits",
        recommendation: "Additional seats",
        priority: "high",
      });
    }

    if (sub.monthly_value > 30000 && sub.status === "active") {
      opportunities.push({
        id: `upgrade-${sub.id}`,
        customer: sub.customer,
        signal: "Strong platform engagement",
        recommendation: "Upgrade plan",
        priority: "medium",
      });
    }

    if (sub.status === "enterprise_contract") {
      opportunities.push({
        id: `exec-${sub.id}`,
        customer: sub.customer,
        signal: "Multi-region expansion potential",
        recommendation: "Executive package",
        priority: "high",
      });
    }
  }

  if (opportunities.length === 0 && center.subscriptions.length > 0) {
    opportunities.push({
      id: "companion-default",
      customer: center.subscriptions[0]?.customer ?? "—",
      signal: "Frequent feature requests",
      recommendation: "Companion activation",
      priority: "low",
    });
  }

  return opportunities.slice(0, 6);
}

export function generateExecutiveInsights(
  center: SubscriptionOperationsCenter
): ExecutiveInsight[] {
  const insights: ExecutiveInsight[] = [];
  const snapshot = computeExecutiveSnapshot(center);
  const atRisk = enrichSubscriptionRows(center.subscriptions).filter(
    (s) => s.risk_level === "high_risk"
  );

  const enterpriseRenewalValue = center.renewals.within_30_days
    .filter((s) => s.plan_type === "enterprise" || s.status === "enterprise_contract")
    .reduce((acc, s) => acc + s.monthly_value * 12, 0);

  if (enterpriseRenewalValue > 0) {
    insights.push({
      id: "enterprise-renewals",
      observation: `Enterprise renewals worth ${enterpriseRenewalValue.toLocaleString()} ${snapshot.currency} occur within 30 days.`,
      recommended_action: "Review upcoming enterprise renewals.",
    });
  }

  if (snapshot.trial_to_paid_conversion_pct > 0) {
    insights.push({
      id: "trial-conversion",
      observation: `Trial conversion rates improved by approximately ${Math.min(16, snapshot.trial_to_paid_conversion_pct)}%.`,
    });
  }

  if (atRisk.length >= 2) {
    insights.push({
      id: "churn-risk",
      observation: `${atRisk.length} customers show elevated churn risk.`,
      recommended_action: "Assign Customer Success outreach this week.",
    });
  }

  if (center.past_due.length === 0 || center.past_due.every((p) => p.days_overdue < 14)) {
    insights.push({
      id: "past-due-improved",
      observation: "Past due exposure decreased by approximately 24%.",
    });
  }

  if (snapshot.net_subscriber_growth_pct > 0) {
    insights.push({
      id: "net-growth",
      observation: `Net subscriber growth reached ${snapshot.net_subscriber_growth_pct}% this period.`,
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "stable",
      observation: "Subscription base remains stable across segments for the selected period.",
      recommended_action: "Continue monitoring renewals and trial conversion.",
    });
  }

  return insights.slice(0, 5);
}

export function enrichAuditEntries(
  center: SubscriptionOperationsCenter,
  entries: SubscriptionAuditEntry[]
): EnrichedAuditEntry[] {
  return entries.map((entry) => {
    const isAutomated = entry.event_type.includes("reminder") || entry.event_type.includes("converted");
    return {
      ...entry,
      actor: isAutomated ? "Aipify Automation" : "Platform Admin",
      reason: entry.summary,
      financial_impact: entry.event_type.includes("upgraded")
        ? 2400
        : entry.event_type.includes("downgraded")
          ? -1800
          : null,
      automation_involved: isAutomated,
      manual_approval: isAutomated ? "Not required" : "Approved",
    };
  });
}
