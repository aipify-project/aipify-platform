import type {
  ScenarioActionResult,
  ScenarioCard,
  ScenarioComparison,
  ScenarioDetail,
  ScenarioInsightItem,
  ScenarioOverview,
  ScenarioRecommendation,
  ScenarioSimulation,
  ScenarioTimelineEvent,
} from "./types";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function parseStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x));
}

function parseRecommendations(raw: unknown): ScenarioRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key) };
  });
}

function parseInsightItems(raw: unknown): ScenarioInsightItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), title: str(d.title) };
  });
}

function parseScenarioCard(raw: unknown): ScenarioCard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    id: str(d.id),
    scenario_key: str(d.scenario_key),
    title: str(d.title),
    category: str(d.category),
    scenario_type: str(d.scenario_type),
    summary: str(d.summary),
    assumptions: parseStringArray(d.assumptions),
    variables: parseStringArray(d.variables),
    projected_outcomes: parseStringArray(d.projected_outcomes),
    organizational_area: str(d.organizational_area),
    planning_status: str(d.planning_status),
    confidence_level: str(d.confidence_level),
    time_horizon: str(d.time_horizon),
    last_simulated_at: str(d.last_simulated_at) || null,
    updated_at: str(d.updated_at) || undefined,
  };
}

function parseComparisons(raw: unknown): ScenarioComparison[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      comparison_key: str(d.comparison_key),
      title: str(d.title),
      comparison_summary: str(d.comparison_summary),
      scenario_ids: parseStringArray(d.scenario_ids),
    };
  });
}

function parseSimulations(raw: unknown): ScenarioSimulation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      simulation_key: str(d.simulation_key),
      title: str(d.title),
      summary: str(d.summary),
      outcome_summary: str(d.outcome_summary),
      risk_notes: parseStringArray(d.risk_notes),
      opportunity_notes: parseStringArray(d.opportunity_notes),
      simulated_at: str(d.simulated_at) || undefined,
    };
  });
}

function parseTimeline(raw: unknown): ScenarioTimelineEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      scenario_id: str(d.scenario_id) || undefined,
      event_type: str(d.event_type),
      description: str(d.description),
      created_at: str(d.created_at),
    };
  });
}

export function parseScenarioOverview(data: unknown): ScenarioOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_full: d.can_full === true,
    can_view: d.can_view === true,
    can_simulate: d.can_simulate === true,
    can_compare: d.can_compare === true,
    can_review: d.can_review === true,
    has_scenario_data: d.has_scenario_data === true,
    planning_summary: str(d.planning_summary),
    executive_summary: str(d.executive_summary),
    strategic_priorities: parseInsightItems(d.strategic_priorities),
    risk_scenarios: parseInsightItems(d.risk_scenarios),
    simulation_isolation_note: str(d.simulation_isolation_note),
    simulation_lab_route: str(d.simulation_lab_route) || "/app/simulations",
    scenarios: Array.isArray(d.scenarios)
      ? d.scenarios.map((x) => parseScenarioCard(x)).filter(Boolean) as ScenarioCard[]
      : [],
    comparisons: parseComparisons(d.comparisons),
    recommendations: parseRecommendations(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseScenarioDetail(data: unknown): ScenarioDetail {
  if (!data || typeof data !== "object") {
    return {
      found: false, id: "", scenario_key: "", title: "", category: "",
      scenario_type: "expected", summary: "", organizational_area: "",
      planning_status: "draft", time_horizon: "next_quarter",
    };
  }
  const d = data as Record<string, unknown>;
  const card = parseScenarioCard(d);
  return {
    found: d.found === true,
    ...(card ?? {
      id: str(d.id), scenario_key: str(d.scenario_key), title: str(d.title),
      category: str(d.category), scenario_type: str(d.scenario_type),
      summary: str(d.summary), organizational_area: str(d.organizational_area),
      planning_status: str(d.planning_status), time_horizon: str(d.time_horizon),
    }),
    can_simulate: d.can_simulate === true,
    can_review: d.can_review === true,
    simulations: parseSimulations(d.simulations),
    isolation_note: str(d.isolation_note),
  };
}

export function parseScenarioTimeline(data: unknown): ScenarioTimelineEvent[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseTimeline(d.events);
}

export function parseScenarioActionResult(data: unknown): ScenarioActionResult {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    message: str(d.message) || undefined,
    simulation_id: str(d.simulation_id) || undefined,
    comparison_id: str(d.comparison_id) || undefined,
    scenario_id: str(d.scenario_id) || undefined,
  };
}
