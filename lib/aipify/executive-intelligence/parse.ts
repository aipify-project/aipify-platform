import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  ExecutiveIntelligenceBlueprint,
  ExecutiveIntelligenceCard,
  ExecutiveIntelligenceDashboard,
  ExecutiveIntelligenceEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
} from "./types";

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseObjectives(data: unknown): BlueprintObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as BlueprintObjective[];
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] {
  if (!Array.isArray(data)) return [];
  return data as IntegrationLink[];
}

function parseLimitationPrinciples(data: unknown): LimitationPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LimitationPrinciples;
}

function parseEngagementSummary(data: unknown): ExecutiveIntelligenceEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ExecutiveIntelligenceEngagementSummary;
}

function parseBlueprintBlock(data: unknown): ExecutiveIntelligenceBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ExecutiveIntelligenceBlueprint;
}

function parseRecordArray(data: unknown): Record<string, unknown>[] {
  if (!Array.isArray(data)) return [];
  return data as Record<string, unknown>[];
}

export function parseExecutiveIntelligenceCard(data: unknown): ExecutiveIntelligenceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    intelligence_score: Number(d.intelligence_score ?? 0),
    briefings_ready: Number(d.briefings_ready ?? 0),
    priorities_active: Number(d.priorities_active ?? 0),
    risks_active: Number(d.risks_active ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_decision_required: Boolean(d.human_decision_required ?? true),
    companion_enabled: Boolean(d.companion_enabled ?? true),
    overload_aware_mode: Boolean(d.overload_aware_mode ?? true),
    implementation_blueprint: parseBlueprintMeta(d.implementation_blueprint),
    executive_intelligence_mission:
      typeof d.executive_intelligence_mission === "string" ? d.executive_intelligence_mission : undefined,
    executive_intelligence_abos_principle:
      typeof d.executive_intelligence_abos_principle === "string"
        ? d.executive_intelligence_abos_principle
        : undefined,
    executive_intelligence_engagement_summary: parseEngagementSummary(d.executive_intelligence_engagement_summary),
    executive_intelligence_note:
      typeof d.executive_intelligence_note === "string" ? d.executive_intelligence_note : undefined,
    executive_intelligence_vision_note:
      typeof d.executive_intelligence_vision_note === "string" ? d.executive_intelligence_vision_note : undefined,
  };
}

export function parseExecutiveIntelligenceDashboard(data: unknown): ExecutiveIntelligenceDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    intelligence_center_enabled: Boolean(d.intelligence_center_enabled ?? true),
    companion_enabled: Boolean(d.companion_enabled ?? true),
    daily_briefing_enabled: Boolean(d.daily_briefing_enabled ?? true),
    weekly_review_enabled: Boolean(d.weekly_review_enabled ?? true),
    overload_aware_mode: Boolean(d.overload_aware_mode ?? true),
    human_decision_required: Boolean(d.human_decision_required ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    intelligence_score: Number(d.intelligence_score ?? 0),
    briefings_ready: Number(d.briefings_ready ?? 0),
    memory_entries_active: Number(d.memory_entries_active ?? 0),
    priorities_active: Number(d.priorities_active ?? 0),
    risks_active: Number(d.risks_active ?? 0),
    opportunities_active: Number(d.opportunities_active ?? 0),
    health_indicators: Number(d.health_indicators ?? 0),
    avg_priority_progress: Number(d.avg_priority_progress ?? 0),
    dashboard_sections: parseRecordArray(d.dashboard_sections),
    briefings: Array.isArray(d.briefings) ? (d.briefings as ExecutiveIntelligenceDashboard["briefings"]) : [],
    memory_entries: Array.isArray(d.memory_entries)
      ? (d.memory_entries as ExecutiveIntelligenceDashboard["memory_entries"])
      : [],
    priority_items: Array.isArray(d.priority_items)
      ? (d.priority_items as ExecutiveIntelligenceDashboard["priority_items"])
      : [],
    risk_signals: Array.isArray(d.risk_signals)
      ? (d.risk_signals as ExecutiveIntelligenceDashboard["risk_signals"])
      : [],
    opportunity_signals: Array.isArray(d.opportunity_signals)
      ? (d.opportunity_signals as ExecutiveIntelligenceDashboard["opportunity_signals"])
      : [],
    health_snapshots: Array.isArray(d.health_snapshots)
      ? (d.health_snapshots as ExecutiveIntelligenceDashboard["health_snapshots"])
      : [],
    decision_support_meta: parseRecordArray(d.decision_support_meta),
    companion_supports: parseRecordArray(d.companion_supports),
    companion_limitations: parseRecordArray(d.companion_limitations),
    communication_support_types: parseRecordArray(d.communication_support_types),
    self_love_leadership: parseRecordArray(d.self_love_leadership),
    integration_links: parseIntegrationLinks(d.integration_links ?? d.exibp121_cross_links),
    implementation_blueprint: parseBlueprintBlock(d.implementation_blueprint),
    executive_intelligence_blueprint: parseBlueprintBlock(d.executive_intelligence_blueprint),
    executive_intelligence_mission:
      typeof d.executive_intelligence_mission === "string" ? d.executive_intelligence_mission : undefined,
    executive_intelligence_philosophy:
      typeof d.executive_intelligence_philosophy === "string" ? d.executive_intelligence_philosophy : undefined,
    executive_intelligence_abos_principle:
      typeof d.executive_intelligence_abos_principle === "string"
        ? d.executive_intelligence_abos_principle
        : undefined,
    executive_intelligence_objectives: parseObjectives(d.executive_intelligence_objectives),
    executive_intelligence_intelligence_center: parseRecordArray(d.executive_intelligence_intelligence_center),
    executive_intelligence_limitation_principles: parseLimitationPrinciples(
      d.executive_intelligence_limitation_principles,
    ),
    executive_intelligence_companion_adaptation: d.executive_intelligence_companion_adaptation as
      | ExecutiveIntelligenceDashboard["executive_intelligence_companion_adaptation"]
      | undefined,
    executive_intelligence_engagement_summary: parseEngagementSummary(d.executive_intelligence_engagement_summary),
    executive_intelligence_success_criteria: parseSuccessCriteria(d.executive_intelligence_success_criteria),
    executive_intelligence_success_metrics: Array.isArray(d.executive_intelligence_success_metrics)
      ? (d.executive_intelligence_success_metrics as Record<string, unknown>[])
      : undefined,
    exibp121_cross_links: parseIntegrationLinks(d.exibp121_cross_links),
    executive_intelligence_vision:
      typeof d.executive_intelligence_vision === "string" ? d.executive_intelligence_vision : undefined,
    executive_intelligence_privacy_note:
      typeof d.executive_intelligence_privacy_note === "string" ? d.executive_intelligence_privacy_note : undefined,
    executive_intelligence_engine_note:
      typeof d.executive_intelligence_engine_note === "string" ? d.executive_intelligence_engine_note : undefined,
  };
}
