import type {
  AbosSuccessCriterion,
  AssumptionReview,
  BlueprintObjective,
  DecisionIntelligenceBlueprint,
  DecisionIntelligenceCard,
  DecisionIntelligenceDashboard,
  DecisionJournal,
  DecisionWorkspace,
  EngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  LimitationPrinciples,
  OutcomeLearning,
  SelfLoveConnection,
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

function parseWorkspaces(data: unknown): DecisionWorkspace[] {
  if (!Array.isArray(data)) return [];
  return data as DecisionWorkspace[];
}

function parseJournals(data: unknown): DecisionJournal[] {
  if (!Array.isArray(data)) return [];
  return data as DecisionJournal[];
}

function parseAssumptions(data: unknown): AssumptionReview[] {
  if (!Array.isArray(data)) return [];
  return data as AssumptionReview[];
}

function parseOutcomeLearnings(data: unknown): OutcomeLearning[] {
  if (!Array.isArray(data)) return [];
  return data as OutcomeLearning[];
}

function parseLimitationPrinciples(data: unknown): LimitationPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LimitationPrinciples;
}

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveConnection;
}

function parseEngagementSummary(data: unknown): EngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as EngagementSummary;
}

function parseBlueprintBlock(data: unknown): DecisionIntelligenceBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as DecisionIntelligenceBlueprint;
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

function parseRecordArray(data: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(data)) return [];
  return data as Array<Record<string, unknown>>;
}

export function parseDecisionIntelligenceCard(data: unknown): DecisionIntelligenceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    decision_quality_score: Number(d.decision_quality_score ?? 0),
    active_workspaces: Number(d.active_workspaces ?? 0),
    journal_entries: Number(d.journal_entries ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    intelligence_center_enabled: Boolean(d.intelligence_center_enabled ?? true),
    implementation_blueprint_phase125: parseBlueprintMeta(d.implementation_blueprint_phase125),
    decision_intelligence_mission:
      typeof d.decision_intelligence_mission === "string" ? d.decision_intelligence_mission : undefined,
    decision_intelligence_abos_principle:
      typeof d.decision_intelligence_abos_principle === "string"
        ? d.decision_intelligence_abos_principle
        : undefined,
    decision_intelligence_engagement_summary: parseEngagementSummary(d.decision_intelligence_engagement_summary),
    decision_intelligence_vision_note:
      typeof d.decision_intelligence_vision_note === "string" ? d.decision_intelligence_vision_note : undefined,
  };
}

export function parseDecisionIntelligenceDashboard(data: unknown): DecisionIntelligenceDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    intelligence_center_enabled: Boolean(d.intelligence_center_enabled ?? true),
    advisory_briefings_enabled: Boolean(d.advisory_briefings_enabled ?? true),
    assumption_reviews_enabled: Boolean(d.assumption_reviews_enabled ?? true),
    tradeoff_analysis_enabled: Boolean(d.tradeoff_analysis_enabled ?? true),
    outcome_tracking_enabled: Boolean(d.outcome_tracking_enabled ?? true),
    reflection_sessions_enabled: Boolean(d.reflection_sessions_enabled ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    decision_quality_score: Number(d.decision_quality_score ?? 0),
    active_workspaces: Number(d.active_workspaces ?? 0),
    journal_entries: Number(d.journal_entries ?? 0),
    assumption_reviews: Number(d.assumption_reviews ?? 0),
    outcome_learnings: Number(d.outcome_learnings ?? 0),
    intelligence_center_capabilities_count: Number(d.intelligence_center_capabilities_count ?? 0),
    workspace_fields_count: Number(d.workspace_fields_count ?? 0),
    assumption_types_count: Number(d.assumption_types_count ?? 0),
    workspaces: parseWorkspaces(d.workspaces),
    journals: parseJournals(d.journals),
    assumptions: parseAssumptions(d.assumptions),
    outcome_learnings_list: parseOutcomeLearnings(d.outcome_learnings_list),
    workspace_field_scaffolds: parseRecordArray(d.workspace_field_scaffolds),
    assumption_type_scaffolds: parseRecordArray(d.assumption_type_scaffolds),
    tradeoff_question_scaffolds: parseRecordArray(d.tradeoff_question_scaffolds),
    stakeholder_group_scaffolds: parseRecordArray(d.stakeholder_group_scaffolds),
    integration_links: parseIntegrationLinks(d.integration_links),
    implementation_blueprint_phase125: parseBlueprintMeta(d.implementation_blueprint_phase125),
    decision_intelligence_blueprint: parseBlueprintBlock(d.decision_intelligence_blueprint),
    decision_intelligence_mission:
      typeof d.decision_intelligence_mission === "string" ? d.decision_intelligence_mission : undefined,
    decision_intelligence_philosophy:
      typeof d.decision_intelligence_philosophy === "string" ? d.decision_intelligence_philosophy : undefined,
    decision_intelligence_abos_principle:
      typeof d.decision_intelligence_abos_principle === "string"
        ? d.decision_intelligence_abos_principle
        : undefined,
    decision_intelligence_objectives: parseObjectives(d.decision_intelligence_objectives),
    decision_intelligence_center: parseRecord(d.decision_intelligence_center),
    decision_workspaces: parseRecord(d.decision_workspaces),
    executive_advisory_companion: parseRecord(d.executive_advisory_companion),
    assumption_intelligence: parseRecord(d.assumption_intelligence),
    tradeoff_analysis: parseRecord(d.tradeoff_analysis),
    stakeholder_impact: parseRecord(d.stakeholder_impact),
    decision_journal: parseRecord(d.decision_journal),
    outcome_learning: parseRecord(d.outcome_learning),
    executive_reflection: parseRecord(d.executive_reflection),
    companion_limitations: parseRecord(d.companion_limitations),
    self_love_in_decisions: parseSelfLoveConnection(d.self_love_in_decisions),
    decision_knowledge_library: parseRecord(d.decision_knowledge_library),
    deibp125_cross_links: parseIntegrationLinks(d.deibp125_cross_links),
    limitation_principles: parseLimitationPrinciples(d.limitation_principles),
    companion_adaptation: parseRecord(d.companion_adaptation),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    success_criteria: parseSuccessCriteria(d.success_criteria),
    success_metrics: parseRecordArray(d.success_metrics),
    decision_intelligence_vision:
      typeof d.decision_intelligence_vision === "string" ? d.decision_intelligence_vision : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
  };
}
