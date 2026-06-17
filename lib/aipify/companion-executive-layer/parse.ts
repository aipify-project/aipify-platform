import type { ExecutiveCompanionDashboard, ExecutiveInsight, ExecutivePriority, ExecutiveTimelineEvent, IntelligenceModule } from "./types";

function str(v: unknown, fb = ""): string { return typeof v === "string" ? v : fb; }
function num(v: unknown, fb = 0): number { return typeof v === "number" ? v : fb; }
function bool(v: unknown): boolean { return v === true; }

export function parseExecutiveCompanionDashboard(data: unknown): ExecutiveCompanionDashboard {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const priorities = Array.isArray(d.priorities)
    ? d.priorities.map((i) => {
        const x = i as Record<string, unknown>;
        return {
          id: str(x.id),
          title: str(x.title),
          description: str(x.description),
          focus_area: str(x.focus_area),
          priority_level: str(x.priority_level),
          rank_order: num(x.rank_order),
          due_date: str(x.due_date) || null,
        } satisfies ExecutivePriority;
      })
    : [];
  const actions = Array.isArray(d.actions)
    ? d.actions.map((i) => {
        const x = i as Record<string, unknown>;
        return {
          id: str(x.id),
          action_type: str(x.action_type),
          title: str(x.title),
          description: str(x.description),
          priority: str(x.priority),
          status: str(x.status),
          due_date: str(x.due_date) || null,
        };
      })
    : [];
  const insights = Array.isArray(d.insights)
    ? d.insights.map((i) => {
        const x = i as Record<string, unknown>;
        return {
          id: str(x.id) || undefined,
          insight_type: str(x.insight_type) || undefined,
          observation: str(x.observation),
          explanation: str(x.explanation) || undefined,
          impact: str(x.impact),
          recommendation: str(x.recommendation),
          effort: str(x.effort),
          potential_value: str(x.potential_value),
          source_module: str(x.source_module) || undefined,
        } satisfies ExecutiveInsight;
      })
    : [];
  const timeline = Array.isArray(d.timeline)
    ? d.timeline.map((i) => {
        const e = i as Record<string, unknown>;
        return {
          id: str(e.id),
          event_type: str(e.event_type),
          description: str(e.description),
          created_at: str(e.created_at),
        } satisfies ExecutiveTimelineEvent;
      })
    : [];
  const intelligence_modules = Array.isArray(d.intelligence_modules)
    ? d.intelligence_modules.map((m) => {
        const x = m as Record<string, unknown>;
        return { key: str(x.key), label: str(x.label) || undefined, status: str(x.status) || undefined };
      })
    : [];
  return {
    found: bool(d.found),
    has_briefing: bool(d.has_briefing),
    role: str(d.role) || undefined,
    can_full: bool(d.can_full),
    can_limited: bool(d.can_limited),
    workspace_view: str(d.workspace_view) || undefined,
    executive_health_score: num(d.executive_health_score),
    organizational_health_score: num(d.organizational_health_score),
    executive_readiness_score: num(d.executive_readiness_score),
    risk_count: num(d.risk_count),
    opportunity_count: num(d.opportunity_count),
    daily_opening: str(d.daily_opening) || undefined,
    executive_summary: str(d.executive_summary) || undefined,
    organizational_summary: str(d.organizational_summary) || undefined,
    priorities,
    actions,
    insights,
    timeline,
    intelligence_modules,
    usage_example: str(d.usage_example),
    privacy_note: str(d.privacy_note),
    principle: str(d.principle),
    golden_rule: str(d.golden_rule),
  };
}

export function parseExecutiveCompanionBriefing(data: unknown): {
  found: boolean;
  period?: string;
  daily_opening?: string;
  executive_summary?: string;
  organizational_summary?: string;
  generated_at?: string;
} {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: bool(d.found),
    period: str(d.period) || undefined,
    daily_opening: str(d.daily_opening) || undefined,
    executive_summary: str(d.executive_summary) || undefined,
    organizational_summary: str(d.organizational_summary) || undefined,
    generated_at: str(d.generated_at) || undefined,
  };
}

export function parseExecutiveCompanionPriorities(data: unknown): {
  found: boolean;
  focus_limit?: number;
  priorities: ExecutivePriority[];
} {
  if (!data || typeof data !== "object") return { found: false, priorities: [] };
  const d = data as Record<string, unknown>;
  const priorities = Array.isArray(d.priorities)
    ? d.priorities.map((i) => {
        const x = i as Record<string, unknown>;
        return {
          id: str(x.id),
          title: str(x.title),
          description: str(x.description),
          focus_area: str(x.focus_area),
          priority_level: str(x.priority_level),
          rank_order: num(x.rank_order),
          due_date: str(x.due_date) || null,
        };
      })
    : [];
  return { found: bool(d.found), focus_limit: num(d.focus_limit, 5), priorities };
}

export function parseExecutiveCompanionRelationships(data: unknown): {
  found: boolean;
  relationships: Record<string, unknown>[];
  recognition_opportunities: Record<string, unknown>[];
} {
  if (!data || typeof data !== "object") return { found: false, relationships: [], recognition_opportunities: [] };
  const d = data as Record<string, unknown>;
  return {
    found: bool(d.found),
    relationships: Array.isArray(d.relationships) ? (d.relationships as Record<string, unknown>[]) : [],
    recognition_opportunities: Array.isArray(d.recognition_opportunities)
      ? (d.recognition_opportunities as Record<string, unknown>[])
      : [],
  };
}

export function parseExecutiveCompanionIntelligence(data: unknown): {
  found: boolean;
  modules: IntelligenceModule[];
  decision_support: ExecutiveInsight[];
} {
  if (!data || typeof data !== "object") return { found: false, modules: [], decision_support: [] };
  const d = data as Record<string, unknown>;
  const modules = Array.isArray(d.modules)
    ? d.modules.map((m) => {
        const x = m as Record<string, unknown>;
        return { key: str(x.key), label: str(x.label) || undefined, summary: str(x.summary) || undefined };
      })
    : [];
  const decision_support = Array.isArray(d.decision_support)
    ? d.decision_support.map((i) => {
        const x = i as Record<string, unknown>;
        return {
          observation: str(x.observation),
          explanation: str(x.explanation) || undefined,
          impact: str(x.impact),
          recommendation: str(x.recommendation),
          effort: str(x.effort),
          potential_value: str(x.potential_value),
        };
      })
    : [];
  return { found: bool(d.found), modules, decision_support };
}

export function parseExecutiveBriefingAction(data: unknown): { ok: boolean; briefing_id?: string } {
  if (!data || typeof data !== "object") return { ok: false };
  const d = data as Record<string, unknown>;
  return { ok: bool(d.ok), briefing_id: str(d.briefing_id) || undefined };
}
