import { normalizeHostsPlanKey } from "@/lib/aipify/aipify-hosts";
import type {
  AipifyHostsCompanionCard,
  AipifyHostsCompanionDashboard,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

export function parseAipifyHostsCompanionDashboard(data: unknown): AipifyHostsCompanionDashboard | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!d.has_customer) return null;

  const snapshot = (typeof d.command_snapshot === "object" && d.command_snapshot
    ? d.command_snapshot
    : {}) as Record<string, unknown>;
  const morning = (typeof d.morning_briefing === "object" && d.morning_briefing
    ? d.morning_briefing
    : {}) as Record<string, unknown>;
  const evening = (typeof d.evening_briefing === "object" && d.evening_briefing
    ? d.evening_briefing
    : {}) as Record<string, unknown>;
  const perf = (typeof d.performance_insights === "object" && d.performance_insights
    ? d.performance_insights
    : {}) as Record<string, unknown>;

  return {
    has_customer: true,
    enabled: Boolean(d.enabled),
    package_key: normalizeHostsPlanKey(typeof d.package_key === "string" ? d.package_key : undefined),
    property_count: Number(d.property_count ?? 0),
    human_oversight_required: Boolean(d.human_oversight_required ?? true),
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    vision: typeof d.vision === "string" ? d.vision : "",
    modules: asArray(d.modules),
    governance: (typeof d.governance === "object" && d.governance
      ? d.governance
      : {
          principle: "",
          approval_required: true,
          audit_required: true,
          recommendations_only: true,
        }) as AipifyHostsCompanionDashboard["governance"],
    success_metrics: asArray(d.success_metrics),
    knowledge_categories: asArray<string>(d.knowledge_categories),
    command_snapshot: {
      arrivals_today: Number(snapshot.arrivals_today ?? 0),
      departures_today: Number(snapshot.departures_today ?? 0),
      pending_approvals: Number(snapshot.pending_approvals ?? 0),
      revenue_snapshot: Number(snapshot.revenue_snapshot ?? 0),
      property_health_score: Number(snapshot.property_health_score ?? 0),
      guest_alerts: Number(snapshot.guest_alerts ?? 0),
      team_activity_count: Number(snapshot.team_activity_count ?? 0),
      maintenance_tasks: Number(snapshot.maintenance_tasks ?? 0),
      occupancy_forecast_pct: Number(snapshot.occupancy_forecast_pct ?? 0),
    },
    morning_briefing: {
      greeting: typeof morning.greeting === "string" ? morning.greeting : "",
      overview_lines: asArray<string>(morning.overview_lines),
      recommended_actions: asArray<string>(morning.recommended_actions),
    },
    evening_briefing: {
      summary_lines: asArray<string>(evening.summary_lines),
    },
    since_last_login: asArray(d.since_last_login),
    pending_approvals: asArray(d.pending_approvals),
    recommendations: asArray(d.recommendations),
    companion_prompts: asArray<string>(d.companion_prompts),
    memory_insights: asArray<string>(d.memory_insights),
    notification_categories: asArray<string>(d.notification_categories),
    performance_insights: {
      response_speed_score: Number(perf.response_speed_score ?? 0),
      approval_efficiency_score: Number(perf.approval_efficiency_score ?? 0),
      operational_consistency_score: Number(perf.operational_consistency_score ?? 0),
      guest_satisfaction_score: Number(perf.guest_satisfaction_score ?? 0),
    },
    executive_questions: asArray<string>(d.executive_questions),
  };
}

export function parseAipifyHostsCompanionCard(data: unknown): AipifyHostsCompanionCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: d.enabled !== undefined ? Boolean(d.enabled) : undefined,
    package_key: typeof d.package_key === "string" ? d.package_key : undefined,
    property_count: d.property_count !== undefined ? Number(d.property_count) : undefined,
    human_oversight_required: d.human_oversight_required !== undefined ? Boolean(d.human_oversight_required) : undefined,
    positioning: typeof d.positioning === "string" ? d.positioning : undefined,
    route: typeof d.route === "string" ? d.route : undefined,
  };
}
