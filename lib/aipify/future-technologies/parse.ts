import type {
  FutureTechnologiesActionResult,
  FutureTechnologiesBriefingResult,
  FutureTechnologiesCard,
  FutureTechnologiesDashboard,
} from "./types";

export function parseFutureTechnologiesCard(data: unknown): FutureTechnologiesCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    future_readiness_score: Number(d.future_readiness_score ?? 0),
    active_initiatives: Number(d.active_initiatives ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
  };
}

export function parseFutureTechnologiesDashboard(data: unknown): FutureTechnologiesDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    observatory_enabled: Boolean(d.observatory_enabled ?? true),
    scenario_planning_enabled: Boolean(d.scenario_planning_enabled ?? true),
    voice_readiness_tracking: Boolean(d.voice_readiness_tracking ?? true),
    multimodal_exploration: Boolean(d.multimodal_exploration ?? true),
    human_approval_required: Boolean(d.human_approval_required ?? true),
    interoperability_focus: Boolean(d.interoperability_focus ?? true),
    future_readiness_score: Number(d.future_readiness_score ?? 0),
    avg_technology_relevance: Number(d.avg_technology_relevance ?? 0),
    active_initiatives: Number(d.active_initiatives ?? 0),
    open_pilot_opportunities: Number(d.open_pilot_opportunities ?? 0),
    observation_areas: Array.isArray(d.observation_areas) ? (d.observation_areas as string[]) : [],
    emerging_interfaces: Array.isArray(d.emerging_interfaces)
      ? (d.emerging_interfaces as FutureTechnologiesDashboard["emerging_interfaces"])
      : [],
    technology_observations: Array.isArray(d.technology_observations)
      ? (d.technology_observations as FutureTechnologiesDashboard["technology_observations"])
      : [],
    trend_reports: Array.isArray(d.trend_reports) ? (d.trend_reports as FutureTechnologiesDashboard["trend_reports"]) : [],
    emerging_initiatives: Array.isArray(d.emerging_initiatives)
      ? (d.emerging_initiatives as FutureTechnologiesDashboard["emerging_initiatives"])
      : [],
    pilot_opportunities: Array.isArray(d.pilot_opportunities)
      ? (d.pilot_opportunities as FutureTechnologiesDashboard["pilot_opportunities"])
      : [],
    readiness_assessments: Array.isArray(d.readiness_assessments)
      ? (d.readiness_assessments as FutureTechnologiesDashboard["readiness_assessments"])
      : [],
    scenario_plans: Array.isArray(d.scenario_plans) ? (d.scenario_plans as FutureTechnologiesDashboard["scenario_plans"]) : [],
    recommendations: Array.isArray(d.recommendations)
      ? (d.recommendations as FutureTechnologiesDashboard["recommendations"])
      : [],
    responsible_adoption_principles: Array.isArray(d.responsible_adoption_principles)
      ? (d.responsible_adoption_principles as string[])
      : [],
    automation_evolution_principles: Array.isArray(d.automation_evolution_principles)
      ? (d.automation_evolution_principles as string[])
      : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as FutureTechnologiesDashboard["briefings"]) : [],
    integrations: typeof d.integrations === "object" && d.integrations
      ? (d.integrations as Record<string, string>)
      : undefined,
  };
}

export function parseFutureTechnologiesActionResult(data: unknown): FutureTechnologiesActionResult {
  return (data ?? {}) as FutureTechnologiesActionResult;
}

export function parseFutureTechnologiesBriefingResult(data: unknown): FutureTechnologiesBriefingResult {
  return (data ?? {}) as FutureTechnologiesBriefingResult;
}
