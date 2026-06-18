import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type MaturityLevelLabel =
  | "emerging"
  | "developing"
  | "structured"
  | "optimized"
  | "world_class";

export type MaturitySectionKey =
  | "maturity_overview"
  | "department_maturity"
  | "process_maturity"
  | "technology_maturity"
  | "knowledge_maturity"
  | "governance_maturity"
  | "customer_experience_maturity"
  | "improvement_roadmap";

export type MaturityDomainKey =
  | "operations"
  | "finance"
  | "support"
  | "sales"
  | "knowledge"
  | "security"
  | "governance"
  | "automation";

export type MaturitySectionItem = {
  id: string;
  title: string;
  summary: string;
  maturityLevel: number;
  maturityLevelLabel: MaturityLevelLabel;
  explanation: string;
  statusKey: OperationsStatusKey;
  sectionKey: MaturitySectionKey;
  itemType: "section";
};

export type DomainScore = {
  id: string;
  domainKey: MaturityDomainKey;
  maturityLevel: number;
  maturityLevelLabel: MaturityLevelLabel;
  scoreValue: number;
  explanation: string;
  statusKey: OperationsStatusKey;
  itemType: "domain";
};

export type BenchmarkItem = {
  id: string;
  domainKey: string;
  compareType: string;
  title: string;
  summary: string;
  comparisonLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "benchmark";
};

export type DepartmentItem = {
  id: string;
  departmentName: string;
  dimensionKey: string;
  maturityLevel: number;
  maturityLevelLabel: MaturityLevelLabel;
  title: string;
  summary: string;
  statusKey: OperationsStatusKey;
  itemType: "department";
};

export type RoadmapItem = {
  id: string;
  domainKey: string;
  currentLevel: number;
  currentLevelLabel: MaturityLevelLabel;
  targetLevel: number;
  targetLevelLabel: MaturityLevelLabel;
  requiredImprovements: string;
  expectedBenefits: string;
  status: string;
  itemType: "roadmap";
};

export type EvolutionEvent = {
  id: string;
  eventType: string;
  title: string;
  summary: string;
  learningNote: string;
  statusKey: OperationsStatusKey;
  itemType: "evolution";
};

export type GrowthPlan = {
  id: string;
  horizonKey: string;
  domainKey: string;
  title: string;
  summary: string;
  requiredActions: string;
  targetLevel: number;
  targetLevelLabel: MaturityLevelLabel;
  statusKey: OperationsStatusKey;
  itemType: "growth_plan";
};

export type PackScore = {
  id: string;
  packKey: string;
  maturityLevel: number;
  maturityLevelLabel: MaturityLevelLabel;
  title: string;
  summary: string;
  explanation: string;
  statusKey: OperationsStatusKey;
  itemType: "pack";
};

export type ExecutiveMaturityDashboard = {
  currentMaturityScore: number;
  currentMaturityLevel: number;
  currentMaturityLevelLabel: MaturityLevelLabel;
  growthTrend: string;
  highestPerformingAreas: Array<{ domainKey: string; maturityLevel: number; maturityLevelLabel: string; scoreValue: number }>;
  lowestPerformingAreas: Array<{ domainKey: string; maturityLevel: number; maturityLevelLabel: string; scoreValue: number }>;
  recommendedPriorities: Array<{ domainKey: string; maturityLevel: number; explanation: string }>;
};

export type OrganizationalMaturityCenter = {
  found: boolean;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  executiveDashboard: ExecutiveMaturityDashboard;
  sections: {
    maturityOverview: MaturitySectionItem[];
    departmentMaturity: MaturitySectionItem[];
    processMaturity: MaturitySectionItem[];
    technologyMaturity: MaturitySectionItem[];
    knowledgeMaturity: MaturitySectionItem[];
    governanceMaturity: MaturitySectionItem[];
    customerExperienceMaturity: MaturitySectionItem[];
    improvementRoadmap: MaturitySectionItem[];
  };
  maturityScoring: DomainScore[];
  benchmarking: BenchmarkItem[];
  departmentAnalysis: DepartmentItem[];
  improvementRoadmaps: RoadmapItem[];
  selfEvolution: EvolutionEvent[];
  growthPlanning: GrowthPlan[];
  businessPackMaturity: PackScore[];
  statistics: {
    domainCount: number;
    benchmarkCount: number;
    roadmapCount: number;
    evolutionCount: number;
    growthPlanCount: number;
    packCount: number;
  };
  error?: string;
};
