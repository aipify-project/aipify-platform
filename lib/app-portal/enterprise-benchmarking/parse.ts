import type {
  BenchmarkAssessmentResult,
  BenchmarkDimensionCard,
  BenchmarkDimensionDetail,
  BenchmarkInsights,
  BenchmarkOverview,
  BenchmarkRecommendation,
  BenchmarkTimelineEvent,
} from "./types";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : typeof v === "string" ? Number(v) || fb : fb;
}

function parseStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x));
}

function parseRecommendations(raw: unknown): BenchmarkRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key), dimension_key: str(d.dimension_key) || undefined };
  });
}

function parseInsightItems(raw: unknown): { dimension_key?: string; name?: string; score?: number }[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      dimension_key: str(d.dimension_key) || undefined,
      name: str(d.name) || undefined,
      score: num(d.score) || undefined,
    };
  });
}

function parseInsights(raw: unknown): BenchmarkInsights | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    strongest_dimensions: parseInsightItems(d.strongest_dimensions),
    lowest_dimensions: parseInsightItems(d.lowest_dimensions),
    improving_rapidly: parseInsightItems(d.improving_rapidly),
    limited_progress: parseInsightItems(d.limited_progress),
    cross_functional_patterns: parseStringArray(d.cross_functional_patterns),
  };
}

function parseDimensionCard(raw: unknown): BenchmarkDimensionCard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    id: str(d.id || d.dimension_key),
    dimension_key: str(d.dimension_key),
    name: str(d.name),
    organizational_area: str(d.organizational_area),
    maturity_level: num(d.maturity_level),
    maturity_level_label: str(d.maturity_level_label),
    maturity_score: num(d.maturity_score),
    priority_level: str(d.priority_level),
    strengths: parseStringArray(d.strengths),
    improvement_opportunities: parseStringArray(d.improvement_opportunities),
    recommended_actions: parseStringArray(d.recommended_actions),
    related_capabilities: parseStringArray(d.related_capabilities),
    learning_resources: parseStringArray(d.learning_resources),
    historical_trend: Array.isArray(d.historical_trend) ? d.historical_trend : [],
    last_assessed_at: str(d.last_assessed_at) || null,
  };
}

function parseFocusAreas(raw: unknown): { dimension_key: string; name: string }[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { dimension_key: str(d.dimension_key), name: str(d.name) };
  });
}

function parseTimeline(raw: unknown): BenchmarkTimelineEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      dimension_key: str(d.dimension_key) || undefined,
      event_type: str(d.event_type),
      description: str(d.description),
      created_at: str(d.created_at),
    };
  });
}

export function parseBenchmarkOverview(data: unknown): BenchmarkOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_full: d.can_full === true,
    can_view: d.can_view === true,
    can_assess: d.can_assess === true,
    has_maturity_data: d.has_maturity_data === true,
    overall_maturity_score: num(d.overall_maturity_score),
    operational_maturity_score: num(d.operational_maturity_score),
    governance_maturity_score: num(d.governance_maturity_score),
    learning_maturity_score: num(d.learning_maturity_score),
    executive_intelligence_score: num(d.executive_intelligence_score),
    business_pack_maturity_score: num(d.business_pack_maturity_score),
    recommended_focus_areas: parseFocusAreas(d.recommended_focus_areas),
    executive_summary: str(d.executive_summary),
    dimensions: Array.isArray(d.dimensions) ? d.dimensions.map((x) => parseDimensionCard(x)).filter(Boolean) as BenchmarkDimensionCard[] : [],
    insights: parseInsights(d.insights),
    recommendations: parseRecommendations(d.recommendations),
    anonymized_benchmark_note: str(d.anonymized_benchmark_note),
    principle: str(d.principle),
  };
}

export function parseBenchmarkDimensionDetail(data: unknown): BenchmarkDimensionDetail {
  if (!data || typeof data !== "object") {
    return {
      found: false, id: "", dimension_key: "", name: "", organizational_area: "",
      maturity_level: 1, maturity_level_label: "emerging", maturity_score: 0, priority_level: "moderate",
    };
  }
  const d = data as Record<string, unknown>;
  const card = parseDimensionCard(d);
  const assessments = Array.isArray(d.assessment_history)
    ? d.assessment_history.map((item) => {
        const a = item as Record<string, unknown>;
        return {
          id: str(a.id),
          maturity_level: num(a.maturity_level),
          assessor_name: str(a.assessor_name),
          assessment_notes: str(a.assessment_notes),
          assessed_at: str(a.assessed_at) || undefined,
        };
      })
    : [];
  return {
    found: d.found === true,
    ...(card ?? {
      id: str(d.dimension_key), dimension_key: str(d.dimension_key), name: str(d.name),
      organizational_area: str(d.organizational_area), maturity_level: num(d.maturity_level),
      maturity_level_label: str(d.maturity_level_label), maturity_score: num(d.maturity_score),
      priority_level: str(d.priority_level),
    }),
    assessment_history: assessments,
    can_assess: d.can_assess === true,
    recommendations: parseRecommendations(d.recommendations),
  };
}

export function parseBenchmarkRecommendations(data: unknown): BenchmarkRecommendation[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseRecommendations(d.recommendations);
}

export function parseBenchmarkTimeline(data: unknown): BenchmarkTimelineEvent[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseTimeline(d.events);
}

export function parseBenchmarkAssessmentResult(data: unknown): BenchmarkAssessmentResult {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    assessment_id: str(d.assessment_id) || undefined,
    dimension_key: str(d.dimension_key) || undefined,
    maturity_level: num(d.maturity_level) || undefined,
    message: str(d.message) || undefined,
  };
}
