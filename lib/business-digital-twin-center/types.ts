import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type TwinSectionKey =
  | "organization_model"
  | "teams"
  | "customers"
  | "vendors"
  | "projects"
  | "systems"
  | "workflows"
  | "dependencies"
  | "simulations";

export type TwinEntity = {
  id: string;
  title: string;
  summary: string;
  owner: string;
  dependencies: string;
  criticality: string;
  statusKey: OperationsStatusKey;
  sectionKey: TwinSectionKey;
  itemType: "entity";
};

export type ProcessMapItem = {
  id: string;
  workflowType: string;
  title: string;
  startLabel: string;
  actionsLabel: string;
  approvalsLabel: string;
  outcomesLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "process";
};

export type DependencyItem = {
  id: string;
  dependencyType: string;
  title: string;
  summary: string;
  statusKey: OperationsStatusKey;
  suggestedAction?: string;
  itemType: "dependency";
};

export type WorkflowSimulation = {
  id: string;
  scenarioType: string;
  title: string;
  prompt: string;
  impactSummary: string;
  statusKey: OperationsStatusKey;
  itemType: "simulation";
};

export type CapacityItem = {
  id: string;
  teamLabel: string;
  workloadPct: number;
  availableResources: string;
  bottleneckLabel: string;
  daysToCapacity?: number | null;
  statusKey: OperationsStatusKey;
  itemType: "capacity";
};

export type OperationalImpact = {
  id: string;
  changeTitle: string;
  impactSummary: string;
  riskSummary: string;
  affectedTeams: string;
  affectedSystems: string;
  statusKey: OperationsStatusKey;
  itemType: "impact";
};

export type ScenarioPlan = {
  id: string;
  scenarioName: string;
  caseType: "best" | "expected" | "worst";
  expectedRevenue: string;
  expectedSupportLoad: string;
  expectedStaffing: string;
  summary: string;
  statusKey: OperationsStatusKey;
  itemType: "scenario";
};

export type CompanionInsight = {
  id: string;
  insightType: string;
  recommendation: string;
  reason: string;
  status: string;
  itemType: "insight";
};

export type ExecutiveTwinDashboard = {
  organizationOverview: string;
  operationalHealth: string;
  dependencyCount: number;
  simulationCount: number;
  strategicRiskCount: number;
};

export type BusinessDigitalTwinCenter = {
  found: boolean;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  executiveDashboard: ExecutiveTwinDashboard;
  sections: {
    organizationModel: TwinEntity[];
    teams: TwinEntity[];
    customers: TwinEntity[];
    vendors: TwinEntity[];
    projects: TwinEntity[];
    systems: TwinEntity[];
    workflows: TwinEntity[];
    dependencies: TwinEntity[];
    simulations: TwinEntity[];
  };
  processMapping: ProcessMapItem[];
  dependencyIntelligence: DependencyItem[];
  workflowSimulations: WorkflowSimulation[];
  capacityIntelligence: CapacityItem[];
  operationalImpacts: OperationalImpact[];
  scenarioPlanning: ScenarioPlan[];
  companionInsights: CompanionInsight[];
  statistics: {
    entityCount: number;
    processCount: number;
    dependencyCount: number;
    simulationCount: number;
    capacityCount: number;
    scenarioCount: number;
    insightCount: number;
  };
  error?: string;
};
