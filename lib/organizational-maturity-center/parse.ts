import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  BenchmarkItem,
  DepartmentItem,
  DomainScore,
  EvolutionEvent,
  ExecutiveMaturityDashboard,
  GrowthPlan,
  MaturityDomainKey,
  MaturityLevelLabel,
  MaturitySectionItem,
  MaturitySectionKey,
  OrganizationalMaturityCenter,
  PackScore,
  RoadmapItem,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asStatus(value: unknown): OperationsStatusKey {
  const key = asString(value, "information");
  const allowed: OperationsStatusKey[] = [
    "completed", "not_allowed", "requires_attention", "information", "restricted", "verified", "waiting",
  ];
  return allowed.includes(key as OperationsStatusKey) ? (key as OperationsStatusKey) : "information";
}

function asLevelLabel(value: unknown): MaturityLevelLabel {
  const key = asString(value, "developing");
  const allowed: MaturityLevelLabel[] = ["emerging", "developing", "structured", "optimized", "world_class"];
  return allowed.includes(key as MaturityLevelLabel) ? (key as MaturityLevelLabel) : "developing";
}

function parseSection(raw: unknown): MaturitySectionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    title: asString(d.title),
    summary: asString(d.summary),
    maturityLevel: asNumber(d.maturity_level, 2),
    maturityLevelLabel: asLevelLabel(d.maturity_level_label),
    explanation: asString(d.explanation),
    statusKey: asStatus(d.status_key),
    sectionKey: asString(d.section_key, "maturity_overview") as MaturitySectionKey,
    itemType: "section",
  };
}

function parseSections(raw: unknown): MaturitySectionItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseSection);
}

function parseDomain(raw: unknown): DomainScore {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    domainKey: asString(d.domain_key, "operations") as MaturityDomainKey,
    maturityLevel: asNumber(d.maturity_level, 2),
    maturityLevelLabel: asLevelLabel(d.maturity_level_label),
    scoreValue: asNumber(d.score_value),
    explanation: asString(d.explanation),
    statusKey: asStatus(d.status_key),
    itemType: "domain",
  };
}

function parseBenchmark(raw: unknown): BenchmarkItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    domainKey: asString(d.domain_key),
    compareType: asString(d.compare_type),
    title: asString(d.title),
    summary: asString(d.summary),
    comparisonLabel: asString(d.comparison_label),
    statusKey: asStatus(d.status_key),
    itemType: "benchmark",
  };
}

function parseDepartment(raw: unknown): DepartmentItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    departmentName: asString(d.department_name),
    dimensionKey: asString(d.dimension_key),
    maturityLevel: asNumber(d.maturity_level, 2),
    maturityLevelLabel: asLevelLabel(d.maturity_level_label),
    title: asString(d.title),
    summary: asString(d.summary),
    statusKey: asStatus(d.status_key),
    itemType: "department",
  };
}

function parseRoadmap(raw: unknown): RoadmapItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    domainKey: asString(d.domain_key),
    currentLevel: asNumber(d.current_level, 2),
    currentLevelLabel: asLevelLabel(d.current_level_label),
    targetLevel: asNumber(d.target_level, 3),
    targetLevelLabel: asLevelLabel(d.target_level_label),
    requiredImprovements: asString(d.required_improvements),
    expectedBenefits: asString(d.expected_benefits),
    status: asString(d.status),
    itemType: "roadmap",
  };
}

function parseEvolution(raw: unknown): EvolutionEvent {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    eventType: asString(d.event_type),
    title: asString(d.title),
    summary: asString(d.summary),
    learningNote: asString(d.learning_note),
    statusKey: asStatus(d.status_key),
    itemType: "evolution",
  };
}

function parseGrowthPlan(raw: unknown): GrowthPlan {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    horizonKey: asString(d.horizon_key),
    domainKey: asString(d.domain_key),
    title: asString(d.title),
    summary: asString(d.summary),
    requiredActions: asString(d.required_actions),
    targetLevel: asNumber(d.target_level, 3),
    targetLevelLabel: asLevelLabel(d.target_level_label),
    statusKey: asStatus(d.status_key),
    itemType: "growth_plan",
  };
}

function parsePack(raw: unknown): PackScore {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    packKey: asString(d.pack_key),
    maturityLevel: asNumber(d.maturity_level, 2),
    maturityLevelLabel: asLevelLabel(d.maturity_level_label),
    title: asString(d.title),
    summary: asString(d.summary),
    explanation: asString(d.explanation),
    statusKey: asStatus(d.status_key),
    itemType: "pack",
  };
}

function parseAreaList(raw: unknown): ExecutiveMaturityDashboard["highestPerformingAreas"] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = asRecord(item);
    return {
      domainKey: asString(d.domain_key),
      maturityLevel: asNumber(d.maturity_level),
      maturityLevelLabel: asString(d.maturity_level_label),
      scoreValue: asNumber(d.score_value),
    };
  });
}

function parsePriorityList(raw: unknown): ExecutiveMaturityDashboard["recommendedPriorities"] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = asRecord(item);
    return {
      domainKey: asString(d.domain_key),
      maturityLevel: asNumber(d.maturity_level),
      explanation: asString(d.explanation),
    };
  });
}

function parseExecutiveDashboard(raw: unknown): ExecutiveMaturityDashboard {
  const d = asRecord(raw);
  return {
    currentMaturityScore: asNumber(d.current_maturity_score),
    currentMaturityLevel: asNumber(d.current_maturity_level, 2),
    currentMaturityLevelLabel: asLevelLabel(d.current_maturity_level_label),
    growthTrend: asString(d.growth_trend, "stable"),
    highestPerformingAreas: parseAreaList(d.highest_performing_areas),
    lowestPerformingAreas: parseAreaList(d.lowest_performing_areas),
    recommendedPriorities: parsePriorityList(d.recommended_priorities),
  };
}

const emptyCenter: OrganizationalMaturityCenter = {
  found: false,
  executiveDashboard: {
    currentMaturityScore: 0,
    currentMaturityLevel: 2,
    currentMaturityLevelLabel: "developing",
    growthTrend: "stable",
    highestPerformingAreas: [],
    lowestPerformingAreas: [],
    recommendedPriorities: [],
  },
  sections: {
    maturityOverview: [],
    departmentMaturity: [],
    processMaturity: [],
    technologyMaturity: [],
    knowledgeMaturity: [],
    governanceMaturity: [],
    customerExperienceMaturity: [],
    improvementRoadmap: [],
  },
  maturityScoring: [],
  benchmarking: [],
  departmentAnalysis: [],
  improvementRoadmaps: [],
  selfEvolution: [],
  growthPlanning: [],
  businessPackMaturity: [],
  statistics: {
    domainCount: 0,
    benchmarkCount: 0,
    roadmapCount: 0,
    evolutionCount: 0,
    growthPlanCount: 0,
    packCount: 0,
  },
};

export function parseOrganizationalMaturityCenter(raw: unknown): OrganizationalMaturityCenter {
  const d = asRecord(raw);
  if (!d.found) {
    return { ...emptyCenter, error: asString(d.error) || undefined };
  }

  const sections = asRecord(d.sections);
  const stats = asRecord(d.statistics);

  return {
    found: true,
    philosophy: asString(d.philosophy) || undefined,
    canExecutive: d.can_executive === true,
    canManage: d.can_manage === true,
    governanceNote: asString(d.governance_note) || undefined,
    privacyNote: asString(d.privacy_note) || undefined,
    executiveDashboard: parseExecutiveDashboard(d.executive_dashboard),
    sections: {
      maturityOverview: parseSections(sections.maturity_overview),
      departmentMaturity: parseSections(sections.department_maturity),
      processMaturity: parseSections(sections.process_maturity),
      technologyMaturity: parseSections(sections.technology_maturity),
      knowledgeMaturity: parseSections(sections.knowledge_maturity),
      governanceMaturity: parseSections(sections.governance_maturity),
      customerExperienceMaturity: parseSections(sections.customer_experience_maturity),
      improvementRoadmap: parseSections(sections.improvement_roadmap),
    },
    maturityScoring: Array.isArray(d.maturity_scoring) ? d.maturity_scoring.map(parseDomain) : [],
    benchmarking: Array.isArray(d.benchmarking) ? d.benchmarking.map(parseBenchmark) : [],
    departmentAnalysis: Array.isArray(d.department_analysis) ? d.department_analysis.map(parseDepartment) : [],
    improvementRoadmaps: Array.isArray(d.improvement_roadmaps) ? d.improvement_roadmaps.map(parseRoadmap) : [],
    selfEvolution: Array.isArray(d.self_evolution) ? d.self_evolution.map(parseEvolution) : [],
    growthPlanning: Array.isArray(d.growth_planning) ? d.growth_planning.map(parseGrowthPlan) : [],
    businessPackMaturity: Array.isArray(d.business_pack_maturity) ? d.business_pack_maturity.map(parsePack) : [],
    statistics: {
      domainCount: asNumber(stats.domain_count),
      benchmarkCount: asNumber(stats.benchmark_count),
      roadmapCount: asNumber(stats.roadmap_count),
      evolutionCount: asNumber(stats.evolution_count),
      growthPlanCount: asNumber(stats.growth_plan_count),
      packCount: asNumber(stats.pack_count),
    },
  };
}

export function parseOrganizationalMaturityAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
