export type ExecutiveSinceVisit = {
  incidents_resolved: number;
  webhook_failures_fixed: number;
  support_requests_handled: number;
  pending_approvals: number;
  recommendations_discovered: number;
  overall_health: number;
  health_delta: number;
};

export type ExecutiveCards = {
  business_health: { score: number; delta: number };
  ai_activity_today: number;
  time_saved: { hours: number; minutes: number };
  pending_approvals: number;
  customer_satisfaction: number;
  revenue_opportunities: number;
};

export type ExecutiveTimelineEvent = {
  id: string;
  time: string;
  technical_title: string;
  executive_title: string;
  created_at: string;
  href?: string | null;
};

export type ExecutiveSinceLoginBullet = {
  text: string;
  status: "neutral" | "green" | "yellow" | "red";
};

export type ExecutiveSinceLogin = {
  bullets: ExecutiveSinceLoginBullet[];
  footer_status: "green" | "yellow" | "red";
  footer_message: string;
};

export type ExecutiveOperationalHealth = {
  score: number;
  label: string;
  signals: string[];
};

export type ExecutiveRequiresAttentionItem = {
  id: string;
  message: string;
  href: string;
  priority: string;
};

export type ExecutiveMetrics = {
  active_customers: number;
  mrr: number;
  automation_success_pct: number;
  customer_satisfaction: number;
  mrr_trend_pct?: number;
  customers_trend_pct?: number;
};

export type CustomerHealthSnapshotItem = {
  id: string;
  name: string;
  health_score: number;
  status: "healthy" | "needs_review";
  href: string;
};

export type ExecutiveRecommendation = {
  id: string;
  impact_level: "high" | "medium" | "low";
  title: string;
  observation?: string;
  business_impact: string;
  suggested_action: string;
  expected_benefit: string;
  confidence: number;
  action_id: string | null;
  review_href?: string | null;
};

export type ExecutiveInsight = {
  id: string;
  question: string;
  answer: string;
  recommendation: string;
};

export type ExecutiveWorkload = {
  monitoring: number;
  learning: number;
  healing: number;
  automations: number;
  support: number;
};

export type ExecutivePendingApproval = {
  id: string;
  title: string;
  risk_level: string;
  expected_impact: string | null;
  customer_name: string | null;
  affected_customers: number;
  rollback_available: boolean;
  preview_changes: string[];
};

export type ExecutiveWeeklySummary = {
  period_start: string;
  period_end: string;
  health_trend: number;
  revenue_opportunities: number;
  support_trend: string;
  learning_discoveries: number;
  healing_effectiveness: string;
  priorities: string[];
};

export type ExecutiveCenterBundle = {
  since: string;
  since_visit: ExecutiveSinceVisit;
  since_login?: ExecutiveSinceLogin;
  operational_health?: ExecutiveOperationalHealth;
  requires_attention?: ExecutiveRequiresAttentionItem[];
  executive_metrics?: ExecutiveMetrics;
  customer_health_snapshot?: CustomerHealthSnapshotItem[];
  cards: ExecutiveCards;
  timeline: ExecutiveTimelineEvent[];
  recommendations: ExecutiveRecommendation[];
  insights: ExecutiveInsight[];
  workload: ExecutiveWorkload;
  pending_approval_actions: ExecutivePendingApproval[];
  weekly_summary: ExecutiveWeeklySummary;
  monthly_report: { available: boolean; period: string; generated_at: string };
  executive_mode: boolean;
};

const IMPACT_STYLES: Record<string, string> = {
  high: "bg-rose-50 text-rose-700 ring-rose-100",
  medium: "bg-amber-50 text-amber-800 ring-amber-100",
  low: "bg-blue-50 text-blue-700 ring-blue-100",
};

const RISK_STYLES: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-800",
  high: "bg-rose-50 text-rose-700",
  critical: "bg-red-950 text-red-100",
};

function parseStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

export function getExecutiveImpactStyle(level: string): string {
  return IMPACT_STYLES[level] ?? IMPACT_STYLES.medium;
}

export function getExecutiveRiskStyle(level: string): string {
  return RISK_STYLES[level] ?? RISK_STYLES.medium;
}

export function formatTimeSaved(hours: number, minutes: number): string {
  if (hours <= 0 && minutes <= 0) return "0m";
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  return parts.join(" ");
}

function parseSinceLogin(value: unknown): ExecutiveSinceLogin | undefined {
  if (!value || typeof value !== "object") return undefined;
  const raw = value as Record<string, unknown>;
  const bullets = Array.isArray(raw.bullets)
    ? (raw.bullets as Record<string, unknown>[])
        .map((item) => {
          const status = item.status;
          if (
            status !== "neutral" &&
            status !== "green" &&
            status !== "yellow" &&
            status !== "red"
          ) {
            return null;
          }
          return {
            text: String(item.text ?? ""),
            status,
          };
        })
        .filter((item): item is ExecutiveSinceLoginBullet => item !== null)
        .slice(0, 6)
    : [];
  const footerStatus = raw.footer_status;
  return {
    bullets,
    footer_status:
      footerStatus === "yellow" || footerStatus === "red" ? footerStatus : "green",
    footer_message: String(raw.footer_message ?? ""),
  };
}

function parseOperationalHealth(value: unknown): ExecutiveOperationalHealth | undefined {
  if (!value || typeof value !== "object") return undefined;
  const raw = value as Record<string, unknown>;
  return {
    score: Number(raw.score ?? 0),
    label: String(raw.label ?? ""),
    signals: Array.isArray(raw.signals) ? raw.signals.map(String) : [],
  };
}

function parseRequiresAttention(value: unknown): ExecutiveRequiresAttentionItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      return {
        id: String(row.id ?? ""),
        message: String(row.message ?? ""),
        href: String(row.href ?? "/platform/executive"),
        priority: String(row.priority ?? "attention"),
      };
    })
    .filter((item): item is ExecutiveRequiresAttentionItem => item !== null);
}

function parseExecutiveMetrics(value: unknown): ExecutiveMetrics | undefined {
  if (!value || typeof value !== "object") return undefined;
  const raw = value as Record<string, unknown>;
  return {
    active_customers: Number(raw.active_customers ?? 0),
    mrr: Number(raw.mrr ?? 0),
    automation_success_pct: Number(raw.automation_success_pct ?? 0),
    customer_satisfaction: Number(raw.customer_satisfaction ?? 0),
    mrr_trend_pct:
      typeof raw.mrr_trend_pct === "number" ? raw.mrr_trend_pct : undefined,
    customers_trend_pct:
      typeof raw.customers_trend_pct === "number" ? raw.customers_trend_pct : undefined,
  };
}

function parseCustomerHealthSnapshot(value: unknown): CustomerHealthSnapshotItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const status = row.status === "needs_review" ? "needs_review" : "healthy";
      return {
        id: String(row.id ?? ""),
        name: String(row.name ?? ""),
        health_score: Number(row.health_score ?? 0),
        status,
        href: String(row.href ?? "/platform/customers"),
      };
    })
    .filter((item): item is CustomerHealthSnapshotItem => item !== null)
    .slice(0, 5);
}

export function parseExecutiveCenterBundle(data: unknown): ExecutiveCenterBundle {
  const raw = (data ?? {}) as Record<string, unknown>;
  const sinceVisit = (raw.since_visit ?? {}) as Record<string, number>;
  const cards = (raw.cards ?? {}) as Record<string, unknown>;
  const businessHealth = (cards.business_health ?? {}) as Record<string, number>;
  const timeSaved = (cards.time_saved ?? {}) as Record<string, number>;

  return {
    since: String(raw.since ?? new Date().toISOString()),
    since_visit: {
      incidents_resolved: sinceVisit.incidents_resolved ?? 0,
      webhook_failures_fixed: sinceVisit.webhook_failures_fixed ?? 0,
      support_requests_handled: sinceVisit.support_requests_handled ?? 0,
      pending_approvals: sinceVisit.pending_approvals ?? 0,
      recommendations_discovered: sinceVisit.recommendations_discovered ?? 0,
      overall_health: sinceVisit.overall_health ?? 0,
      health_delta: sinceVisit.health_delta ?? 0,
    },
    since_login: parseSinceLogin(raw.since_login),
    operational_health: parseOperationalHealth(raw.operational_health),
    requires_attention: parseRequiresAttention(raw.requires_attention),
    executive_metrics: parseExecutiveMetrics(raw.executive_metrics),
    customer_health_snapshot: parseCustomerHealthSnapshot(raw.customer_health_snapshot),
    cards: {
      business_health: {
        score: businessHealth.score ?? 0,
        delta: businessHealth.delta ?? 0,
      },
      ai_activity_today: Number(cards.ai_activity_today ?? 0),
      time_saved: {
        hours: Number(timeSaved.hours ?? 0),
        minutes: Number(timeSaved.minutes ?? 0),
      },
      pending_approvals: Number(cards.pending_approvals ?? 0),
      customer_satisfaction: Number(cards.customer_satisfaction ?? 0),
      revenue_opportunities: Number(cards.revenue_opportunities ?? 0),
    },
    timeline: Array.isArray(raw.timeline)
      ? (raw.timeline as Record<string, unknown>[]).map((item) => ({
          id: String(item.id ?? ""),
          time: String(item.time ?? ""),
          technical_title: String(item.technical_title ?? ""),
          executive_title: String(item.executive_title ?? item.technical_title ?? ""),
          created_at: String(item.created_at ?? ""),
          href: item.href != null ? String(item.href) : null,
        }))
      : [],
    recommendations: Array.isArray(raw.recommendations)
      ? (raw.recommendations as Record<string, unknown>[]).map((item) => ({
          id: String(item.id ?? ""),
          impact_level: (item.impact_level as ExecutiveRecommendation["impact_level"]) ?? "medium",
          title: String(item.title ?? ""),
          observation: item.observation != null ? String(item.observation) : undefined,
          business_impact: String(item.business_impact ?? ""),
          suggested_action: String(item.suggested_action ?? ""),
          expected_benefit: String(item.expected_benefit ?? ""),
          confidence: Number(item.confidence ?? 0),
          action_id: item.action_id != null ? String(item.action_id) : null,
          review_href: item.review_href != null ? String(item.review_href) : null,
        }))
      : [],
    insights: Array.isArray(raw.insights)
      ? (raw.insights as Record<string, unknown>[]).map((item) => ({
          id: String(item.id ?? ""),
          question: String(item.question ?? ""),
          answer: String(item.answer ?? ""),
          recommendation: String(item.recommendation ?? ""),
        }))
      : [],
    workload: {
      monitoring: Number((raw.workload as Record<string, number>)?.monitoring ?? 0),
      learning: Number((raw.workload as Record<string, number>)?.learning ?? 0),
      healing: Number((raw.workload as Record<string, number>)?.healing ?? 0),
      automations: Number((raw.workload as Record<string, number>)?.automations ?? 0),
      support: Number((raw.workload as Record<string, number>)?.support ?? 0),
    },
    pending_approval_actions: Array.isArray(raw.pending_approval_actions)
      ? (raw.pending_approval_actions as Record<string, unknown>[]).map((item) => ({
          id: String(item.id ?? ""),
          title: String(item.title ?? ""),
          risk_level: String(item.risk_level ?? "medium"),
          expected_impact: item.expected_impact != null ? String(item.expected_impact) : null,
          customer_name: item.customer_name != null ? String(item.customer_name) : null,
          affected_customers: Number(item.affected_customers ?? 0),
          rollback_available: Boolean(item.rollback_available),
          preview_changes: parseStringArray(item.preview_changes),
        }))
      : [],
    weekly_summary: {
      period_start: String((raw.weekly_summary as Record<string, unknown>)?.period_start ?? ""),
      period_end: String((raw.weekly_summary as Record<string, unknown>)?.period_end ?? ""),
      health_trend: Number((raw.weekly_summary as Record<string, number>)?.health_trend ?? 0),
      revenue_opportunities: Number(
        (raw.weekly_summary as Record<string, number>)?.revenue_opportunities ?? 0
      ),
      support_trend: String((raw.weekly_summary as Record<string, string>)?.support_trend ?? ""),
      learning_discoveries: Number(
        (raw.weekly_summary as Record<string, number>)?.learning_discoveries ?? 0
      ),
      healing_effectiveness: String(
        (raw.weekly_summary as Record<string, string>)?.healing_effectiveness ?? ""
      ),
      priorities: parseStringArray((raw.weekly_summary as Record<string, unknown>)?.priorities),
    },
    monthly_report: {
      available: Boolean((raw.monthly_report as Record<string, boolean>)?.available),
      period: String((raw.monthly_report as Record<string, string>)?.period ?? ""),
      generated_at: String((raw.monthly_report as Record<string, string>)?.generated_at ?? ""),
    },
    executive_mode: Boolean(raw.executive_mode),
  };
}
