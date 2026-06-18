import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  BusinessDigitalTwinCenter,
  CapacityItem,
  CompanionInsight,
  DependencyItem,
  ExecutiveTwinDashboard,
  OperationalImpact,
  ProcessMapItem,
  ScenarioPlan,
  TwinEntity,
  TwinSectionKey,
  WorkflowSimulation,
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

function parseEntity(raw: unknown): TwinEntity {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    title: asString(d.title),
    summary: asString(d.summary),
    owner: asString(d.owner ?? d.owner_label),
    dependencies: asString(d.dependencies),
    criticality: asString(d.criticality, "medium"),
    statusKey: asStatus(d.status_key),
    sectionKey: asString(d.section_key, "organization_model") as TwinSectionKey,
    itemType: "entity",
  };
}

function parseEntities(raw: unknown): TwinEntity[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseEntity);
}

function parseProcess(raw: unknown): ProcessMapItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    workflowType: asString(d.workflow_type),
    title: asString(d.title),
    startLabel: asString(d.start_label),
    actionsLabel: asString(d.actions_label),
    approvalsLabel: asString(d.approvals_label),
    outcomesLabel: asString(d.outcomes_label),
    statusKey: asStatus(d.status_key),
    itemType: "process",
  };
}

function parseDependency(raw: unknown): DependencyItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    dependencyType: asString(d.dependency_type),
    title: asString(d.title),
    summary: asString(d.summary),
    statusKey: asStatus(d.status_key),
    suggestedAction: asString(d.suggested_action) || undefined,
    itemType: "dependency",
  };
}

function parseSimulation(raw: unknown): WorkflowSimulation {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    scenarioType: asString(d.scenario_type),
    title: asString(d.title),
    prompt: asString(d.prompt),
    impactSummary: asString(d.impact_summary),
    statusKey: asStatus(d.status_key),
    itemType: "simulation",
  };
}

function parseCapacity(raw: unknown): CapacityItem {
  const d = asRecord(raw);
  const days = d.days_to_capacity;
  return {
    id: asString(d.id),
    teamLabel: asString(d.team_label),
    workloadPct: asNumber(d.workload_pct),
    availableResources: asString(d.available_resources),
    bottleneckLabel: asString(d.bottleneck_label),
    daysToCapacity: days === null || days === undefined ? null : asNumber(days),
    statusKey: asStatus(d.status_key),
    itemType: "capacity",
  };
}

function parseImpact(raw: unknown): OperationalImpact {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    changeTitle: asString(d.change_title),
    impactSummary: asString(d.impact_summary),
    riskSummary: asString(d.risk_summary),
    affectedTeams: asString(d.affected_teams),
    affectedSystems: asString(d.affected_systems),
    statusKey: asStatus(d.status_key),
    itemType: "impact",
  };
}

function parseScenario(raw: unknown): ScenarioPlan {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    scenarioName: asString(d.scenario_name),
    caseType: asString(d.case_type, "expected") as ScenarioPlan["caseType"],
    expectedRevenue: asString(d.expected_revenue),
    expectedSupportLoad: asString(d.expected_support_load),
    expectedStaffing: asString(d.expected_staffing),
    summary: asString(d.summary),
    statusKey: asStatus(d.status_key),
    itemType: "scenario",
  };
}

function parseInsight(raw: unknown): CompanionInsight {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    insightType: asString(d.insight_type),
    recommendation: asString(d.recommendation),
    reason: asString(d.reason),
    status: asString(d.status),
    itemType: "insight",
  };
}

function parseExecutiveDashboard(raw: unknown): ExecutiveTwinDashboard {
  const d = asRecord(raw);
  return {
    organizationOverview: asString(d.organization_overview),
    operationalHealth: asString(d.operational_health),
    dependencyCount: asNumber(d.dependency_count),
    simulationCount: asNumber(d.simulation_count),
    strategicRiskCount: asNumber(d.strategic_risk_count),
  };
}

const emptyCenter: BusinessDigitalTwinCenter = {
  found: false,
  executiveDashboard: {
    organizationOverview: "",
    operationalHealth: "",
    dependencyCount: 0,
    simulationCount: 0,
    strategicRiskCount: 0,
  },
  sections: {
    organizationModel: [],
    teams: [],
    customers: [],
    vendors: [],
    projects: [],
    systems: [],
    workflows: [],
    dependencies: [],
    simulations: [],
  },
  processMapping: [],
  dependencyIntelligence: [],
  workflowSimulations: [],
  capacityIntelligence: [],
  operationalImpacts: [],
  scenarioPlanning: [],
  companionInsights: [],
  statistics: {
    entityCount: 0,
    processCount: 0,
    dependencyCount: 0,
    simulationCount: 0,
    capacityCount: 0,
    scenarioCount: 0,
    insightCount: 0,
  },
};

export function parseBusinessDigitalTwinCenter(raw: unknown): BusinessDigitalTwinCenter {
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
      organizationModel: parseEntities(sections.organization_model),
      teams: parseEntities(sections.teams),
      customers: parseEntities(sections.customers),
      vendors: parseEntities(sections.vendors),
      projects: parseEntities(sections.projects),
      systems: parseEntities(sections.systems),
      workflows: parseEntities(sections.workflows),
      dependencies: parseEntities(sections.dependencies),
      simulations: parseEntities(sections.simulations),
    },
    processMapping: Array.isArray(d.process_mapping) ? d.process_mapping.map(parseProcess) : [],
    dependencyIntelligence: Array.isArray(d.dependency_intelligence) ? d.dependency_intelligence.map(parseDependency) : [],
    workflowSimulations: Array.isArray(d.workflow_simulations) ? d.workflow_simulations.map(parseSimulation) : [],
    capacityIntelligence: Array.isArray(d.capacity_intelligence) ? d.capacity_intelligence.map(parseCapacity) : [],
    operationalImpacts: Array.isArray(d.operational_impacts) ? d.operational_impacts.map(parseImpact) : [],
    scenarioPlanning: Array.isArray(d.scenario_planning) ? d.scenario_planning.map(parseScenario) : [],
    companionInsights: Array.isArray(d.companion_insights) ? d.companion_insights.map(parseInsight) : [],
    statistics: {
      entityCount: asNumber(stats.entity_count),
      processCount: asNumber(stats.process_count),
      dependencyCount: asNumber(stats.dependency_count),
      simulationCount: asNumber(stats.simulation_count),
      capacityCount: asNumber(stats.capacity_count),
      scenarioCount: asNumber(stats.scenario_count),
      insightCount: asNumber(stats.insight_count),
    },
  };
}

export function parseBusinessDigitalTwinAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
