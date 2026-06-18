import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  ExecutiveKnowledgeDashboard,
  IntelligenceEntry,
  KnowledgeCandidate,
  KnowledgeEvolutionEngine,
  KnowledgeEvolutionItem,
  KnowledgeEvolutionSectionKey,
  KnowledgeHealth,
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
    "completed",
    "not_allowed",
    "requires_attention",
    "information",
    "restricted",
    "verified",
    "waiting",
  ];
  return allowed.includes(key as OperationsStatusKey) ? (key as OperationsStatusKey) : "information";
}

function parseItem(raw: unknown): KnowledgeEvolutionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    title: asString(d.title),
    summary: asString(d.summary),
    source: asString(d.source ?? d.signal_type ?? d.source_type),
    owner: asString(d.owner ?? d.owner_label, "Unassigned"),
    department: asString(d.department),
    statusKey: asStatus(d.status_key ?? d.statusKey),
    sectionKey: asString(d.section_key, "missing_knowledge") as KnowledgeEvolutionSectionKey,
    suggestedAction: asString(d.suggested_action) || undefined,
    suggestedImprovementType: asString(d.suggested_improvement_type) || undefined,
    version: asString(d.version ?? d.version_label) || undefined,
    reviewDate: asString(d.review_date) || null,
    lastUpdatedAt: asString(d.last_updated_at) || null,
    usageFrequency: asNumber(d.usage_frequency),
    occurrenceCount: asNumber(d.occurrence_count),
    itemType: asString(d.item_type, "signal"),
  };
}

function parseItems(raw: unknown): KnowledgeEvolutionItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseItem);
}

function parseCandidate(raw: unknown): KnowledgeCandidate {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    title: asString(d.title),
    summary: asString(d.summary),
    candidateType: asString(d.candidate_type),
    sourceType: asString(d.source_type),
    department: asString(d.department),
    owner: asString(d.owner ?? d.owner_label),
    status: asString(d.status),
    version: asString(d.version ?? d.version_label) || undefined,
    reviewDate: asString(d.review_date) || null,
    suggestedAction: asString(d.suggested_action) || undefined,
    approvalRequired: d.approval_required === true,
    itemType: "candidate",
  };
}

function parseIntelligenceList(raw: unknown): IntelligenceEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = asRecord(item);
    return {
      title: asString(d.title),
      usageFrequency: asNumber(d.usage_frequency),
      occurrenceCount: asNumber(d.occurrence_count),
      department: asString(d.department) || undefined,
    };
  });
}

function parseHealth(raw: unknown): KnowledgeHealth {
  const d = asRecord(raw);
  return {
    score: asNumber(d.score, 70),
    label: asString(d.label, "healthy"),
    coveragePct: asNumber(d.coverage_pct),
    freshnessPct: asNumber(d.freshness_pct),
    pendingApprovals: asNumber(d.pending_approvals),
    openGaps: asNumber(d.open_gaps),
  };
}

function parseExecutive(raw: unknown): ExecutiveKnowledgeDashboard {
  const d = asRecord(raw);
  return {
    knowledgeHealth: asNumber(d.knowledge_health),
    knowledgeCoverage: asNumber(d.knowledge_coverage),
    knowledgeRisks: asNumber(d.knowledge_risks),
    knowledgeGrowth: asNumber(d.knowledge_growth),
    pendingApprovals: asNumber(d.pending_approvals),
  };
}

export function parseKnowledgeEvolutionEngine(raw: unknown): KnowledgeEvolutionEngine {
  const d = asRecord(raw);
  if (!d.found) {
    return {
      found: false,
      knowledgeHealth: { score: 0, label: "information", coveragePct: 0, freshnessPct: 0, pendingApprovals: 0, openGaps: 0 },
      sections: {
        knowledgeOpportunities: [],
        missingKnowledge: [],
        suggestedImprovements: [],
        outdatedContent: [],
        highRiskGaps: [],
      },
      supportCandidates: [],
      organizationalIntelligence: {
        mostValuableDocuments: [],
        mostUsedProcedures: [],
        mostSearchedTopics: [],
        mostRequestedInformation: [],
      },
      executiveDashboard: {
        knowledgeHealth: 0,
        knowledgeCoverage: 0,
        knowledgeRisks: 0,
        knowledgeGrowth: 0,
        pendingApprovals: 0,
      },
      statistics: {
        opportunitiesCount: 0,
        missingCount: 0,
        improvementsCount: 0,
        outdatedCount: 0,
        riskCount: 0,
        candidatesCount: 0,
      },
      error: asString(d.error) || undefined,
    };
  }

  const sections = asRecord(d.sections);
  const intel = asRecord(d.organizational_intelligence);
  const stats = asRecord(d.statistics);

  return {
    found: true,
    philosophy: asString(d.philosophy) || undefined,
    canExecutive: d.can_executive === true,
    canManage: d.can_manage === true,
    governanceNote: asString(d.governance_note) || undefined,
    privacyNote: asString(d.privacy_note) || undefined,
    knowledgeHealth: parseHealth(d.knowledge_health),
    sections: {
      knowledgeOpportunities: parseItems(sections.knowledge_opportunities),
      missingKnowledge: parseItems(sections.missing_knowledge),
      suggestedImprovements: parseItems(sections.suggested_improvements),
      outdatedContent: parseItems(sections.outdated_content),
      highRiskGaps: parseItems(sections.high_risk_gaps),
    },
    supportCandidates: Array.isArray(d.support_candidates)
      ? d.support_candidates.map(parseCandidate)
      : [],
    organizationalIntelligence: {
      mostValuableDocuments: parseIntelligenceList(intel.most_valuable_documents),
      mostUsedProcedures: parseIntelligenceList(intel.most_used_procedures),
      mostSearchedTopics: parseIntelligenceList(intel.most_searched_topics),
      mostRequestedInformation: parseIntelligenceList(intel.most_requested_information),
    },
    executiveDashboard: parseExecutive(d.executive_dashboard),
    statistics: {
      opportunitiesCount: asNumber(stats.opportunities_count),
      missingCount: asNumber(stats.missing_count),
      improvementsCount: asNumber(stats.improvements_count),
      outdatedCount: asNumber(stats.outdated_count),
      riskCount: asNumber(stats.risk_count),
      candidatesCount: asNumber(stats.candidates_count),
    },
  };
}

export function parseKnowledgeEvolutionAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
