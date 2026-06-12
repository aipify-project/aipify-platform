import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CompanionGuidance,
  CrossFunctionalCoordination,
  DogfoodingBlueprint,
  ExecutionCascade,
  GoalsOkrEngineCard,
  GoalsOkrEngineDashboard,
  GoalsOkrExport,
  ImplementationBlueprintMeta,
  LeadershipInsights,
  OkrIntervention,
  OrganizationKeyResult,
  OrganizationObjective,
  ProgressVisibility,
  SelfLoveConnection,
  StrategicExecutionEngagementSummary,
  StrategicInitiatives,
  TrustConnection,
  AdaptiveExecution,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseEngagementSummary(data: unknown): StrategicExecutionEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as StrategicExecutionEngagementSummary;
}

function parseSections(data: unknown): GoalsOkrEngineDashboard["sections"] {
  if (typeof data !== "object" || !data) return undefined;
  const s = data as Record<string, unknown>;
  return {
    active_objectives: parseRecordList<OrganizationObjective>(s.active_objectives),
    progress_by_department: parseRecordList<Record<string, unknown>>(s.progress_by_department),
    at_risk_key_results: parseRecordList<OrganizationKeyResult>(s.at_risk_key_results),
    completion_forecasts: parseRecordList<Record<string, unknown>>(s.completion_forecasts),
    strategic_focus_areas: parseRecordList<OrganizationObjective>(s.strategic_focus_areas),
  };
}

export function parseGoalsOkrEngineCard(data: unknown): GoalsOkrEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    active_objectives: typeof d.active_objectives === "number" ? d.active_objectives : undefined,
    at_risk_key_results: typeof d.at_risk_key_results === "number" ? d.at_risk_key_results : undefined,
    avg_progress_pct: typeof d.avg_progress_pct === "number" ? d.avg_progress_pct : undefined,
    strategic_objectives: typeof d.strategic_objectives === "number" ? d.strategic_objectives : undefined,
    implementation_blueprint_phase69: parseBlueprintMeta(d.implementation_blueprint_phase69),
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    execution_note: typeof d.execution_note === "string" ? d.execution_note : undefined,
    ...d,
  } as GoalsOkrEngineCard;
}

export function parseGoalsOkrEngineDashboard(data: unknown): GoalsOkrEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    sections: parseSections(d.sections),
    hierarchy: parseRecordList<Record<string, unknown>>(d.hierarchy),
    key_results: parseRecordList<OrganizationKeyResult>(d.key_results),
    settings: typeof d.settings === "object" && d.settings ? (d.settings as Record<string, unknown>) : undefined,
    executive_summary:
      typeof d.executive_summary === "object" && d.executive_summary
        ? (d.executive_summary as Record<string, unknown>)
        : undefined,
    interventions: parseRecordList<OkrIntervention>(d.interventions),
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, string>)
        : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    implementation_blueprint_phase69: parseBlueprintMeta(d.implementation_blueprint_phase69),
    strategic_execution_note:
      typeof d.strategic_execution_note === "string" ? d.strategic_execution_note : undefined,
    blueprint_distinction_note:
      typeof d.blueprint_distinction_note === "string" ? d.blueprint_distinction_note : undefined,
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_philosophy: typeof d.blueprint_philosophy === "string" ? d.blueprint_philosophy : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    blueprint_objectives: parseRecordList<BlueprintObjective>(d.blueprint_objectives),
    strategic_initiatives:
      typeof d.strategic_initiatives === "object" && d.strategic_initiatives
        ? (d.strategic_initiatives as StrategicInitiatives)
        : undefined,
    execution_cascade:
      typeof d.execution_cascade === "object" && d.execution_cascade
        ? (d.execution_cascade as ExecutionCascade)
        : undefined,
    companion_guidance:
      typeof d.companion_guidance === "object" && d.companion_guidance
        ? (d.companion_guidance as CompanionGuidance)
        : undefined,
    progress_visibility:
      typeof d.progress_visibility === "object" && d.progress_visibility
        ? (d.progress_visibility as ProgressVisibility)
        : undefined,
    adaptive_execution:
      typeof d.adaptive_execution === "object" && d.adaptive_execution
        ? (d.adaptive_execution as AdaptiveExecution)
        : undefined,
    cross_functional_coordination:
      typeof d.cross_functional_coordination === "object" && d.cross_functional_coordination
        ? (d.cross_functional_coordination as CrossFunctionalCoordination)
        : undefined,
    self_love_connection:
      typeof d.self_love_connection === "object" && d.self_love_connection
        ? (d.self_love_connection as SelfLoveConnection)
        : undefined,
    leadership_insights:
      typeof d.leadership_insights === "object" && d.leadership_insights
        ? (d.leadership_insights as LeadershipInsights)
        : undefined,
    trust_connection:
      typeof d.trust_connection === "object" && d.trust_connection
        ? (d.trust_connection as TrustConnection)
        : undefined,
    dogfooding:
      typeof d.dogfooding === "object" && d.dogfooding
        ? (d.dogfooding as DogfoodingBlueprint)
        : undefined,
    blueprint_integration_links: parseRecordList(d.blueprint_integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    success_criteria: parseRecordList<AbosSuccessCriterion>(d.success_criteria),
    vision_phrases: Array.isArray(d.vision_phrases) ? (d.vision_phrases as string[]) : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    ...d,
  } as GoalsOkrEngineDashboard;
}

export function parseGoalsOkrExport(data: unknown): GoalsOkrExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    objectives: parseRecordList<OrganizationObjective>(d.objectives),
    key_results: parseRecordList<OrganizationKeyResult>(d.key_results),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    interventions: parseRecordList<OkrIntervention>(d.interventions),
    ...d,
  } as GoalsOkrExport;
}
