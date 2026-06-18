import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type KnowledgeEvolutionSectionKey =
  | "knowledge_opportunities"
  | "missing_knowledge"
  | "suggested_improvements"
  | "outdated_content"
  | "high_risk_gaps";

export type KnowledgeEvolutionItem = {
  id: string;
  title: string;
  summary: string;
  source: string;
  owner: string;
  department: string;
  statusKey: OperationsStatusKey;
  sectionKey: KnowledgeEvolutionSectionKey;
  suggestedAction?: string;
  suggestedImprovementType?: string;
  version?: string;
  reviewDate?: string | null;
  lastUpdatedAt?: string | null;
  usageFrequency?: number;
  occurrenceCount?: number;
  itemType: string;
};

export type KnowledgeCandidate = {
  id: string;
  title: string;
  summary: string;
  candidateType: string;
  sourceType: string;
  department: string;
  owner: string;
  status: string;
  version?: string;
  reviewDate?: string | null;
  suggestedAction?: string;
  approvalRequired?: boolean;
  itemType: "candidate";
};

export type IntelligenceEntry = {
  title: string;
  usageFrequency?: number;
  occurrenceCount?: number;
  department?: string;
};

export type KnowledgeHealth = {
  score: number;
  label: string;
  coveragePct: number;
  freshnessPct: number;
  pendingApprovals: number;
  openGaps: number;
};

export type ExecutiveKnowledgeDashboard = {
  knowledgeHealth: number;
  knowledgeCoverage: number;
  knowledgeRisks: number;
  knowledgeGrowth: number;
  pendingApprovals: number;
};

export type KnowledgeEvolutionEngine = {
  found: boolean;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  knowledgeHealth: KnowledgeHealth;
  sections: {
    knowledgeOpportunities: KnowledgeEvolutionItem[];
    missingKnowledge: KnowledgeEvolutionItem[];
    suggestedImprovements: KnowledgeEvolutionItem[];
    outdatedContent: KnowledgeEvolutionItem[];
    highRiskGaps: KnowledgeEvolutionItem[];
  };
  supportCandidates: KnowledgeCandidate[];
  organizationalIntelligence: {
    mostValuableDocuments: IntelligenceEntry[];
    mostUsedProcedures: IntelligenceEntry[];
    mostSearchedTopics: IntelligenceEntry[];
    mostRequestedInformation: IntelligenceEntry[];
  };
  executiveDashboard: ExecutiveKnowledgeDashboard;
  statistics: {
    opportunitiesCount: number;
    missingCount: number;
    improvementsCount: number;
    outdatedCount: number;
    riskCount: number;
    candidatesCount: number;
  };
  error?: string;
};
