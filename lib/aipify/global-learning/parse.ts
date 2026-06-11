import type {
  ContributionExport,
  EvolutionBoard,
  EvolutionProposal,
  GlobalLearningCard,
  GlobalLearningContribution,
  GlobalLearningDashboard,
  GlobalLearningPattern,
  GlobalLearningSettings,
} from "./types";

export function parseGlobalLearningSettings(data: unknown): GlobalLearningSettings {
  const s = (data ?? {}) as Record<string, unknown>;
  return {
    tenant_id: String(s.tenant_id ?? ""),
    participation_mode: String(s.participation_mode ?? "anonymous_insights"),
    enabled_categories: Array.isArray(s.enabled_categories)
      ? (s.enabled_categories as string[])
      : [],
    extended_consent_at: s.extended_consent_at as string | null | undefined,
    review_before_submit: Boolean(s.review_before_submit ?? false),
    created_at: s.created_at as string | undefined,
    updated_at: s.updated_at as string | undefined,
  };
}

export function parseGlobalLearningContribution(row: unknown): GlobalLearningContribution {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    category: String(s.category ?? ""),
    learning_type: String(s.learning_type ?? ""),
    signal_count: Number(s.signal_count ?? 0),
    last_signal_at: s.last_signal_at as string | null | undefined,
  };
}

export function parseGlobalLearningCard(data: unknown): GlobalLearningCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    participation_mode: d.participation_mode as string | undefined,
    contribution_count: d.contribution_count as number | undefined,
    philosophy: d.philosophy as string | undefined,
    privacy_note: d.privacy_note as string | undefined,
  };
}

export function parseGlobalLearningDashboard(data: unknown): GlobalLearningDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    settings: d.settings ? parseGlobalLearningSettings(d.settings) : undefined,
    contributions: Array.isArray(d.contributions)
      ? (d.contributions as unknown[]).map(parseGlobalLearningContribution)
      : [],
    intelligence_levels: d.intelligence_levels as GlobalLearningDashboard["intelligence_levels"],
    total_contributions: d.total_contributions as number | undefined,
    pending_proposals: d.pending_proposals as number | undefined,
  };
}

export function parseGlobalLearningPattern(row: unknown): GlobalLearningPattern {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    pattern_type: String(s.pattern_type ?? ""),
    category: String(s.category ?? ""),
    frequency: Number(s.frequency ?? 0),
    trend_direction: String(s.trend_direction ?? "stable"),
    confidence: Number(s.confidence ?? 0),
    status: String(s.status ?? "active"),
    metadata: s.metadata as Record<string, unknown> | undefined,
  };
}

export function parseEvolutionProposal(row: unknown): EvolutionProposal {
  const s = (row ?? {}) as Record<string, unknown>;
  const feedback = s.tenant_feedback as Record<string, unknown> | null | undefined;
  return {
    id: String(s.id ?? ""),
    proposal_type: String(s.proposal_type ?? ""),
    title: String(s.title ?? ""),
    summary: s.summary as string | null | undefined,
    rationale: s.rationale as string | null | undefined,
    expected_value: s.expected_value as string | null | undefined,
    risk_level: String(s.risk_level ?? "low"),
    status: String(s.status ?? "pending"),
    explainability: s.explainability as Record<string, unknown> | undefined,
    tenant_feedback: feedback
      ? {
          decision: feedback.decision as string | undefined,
          rejected_reason: feedback.rejected_reason as string | null | undefined,
        }
      : null,
  };
}

export function parseEvolutionBoard(data: unknown): EvolutionBoard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    proposals: Array.isArray(d.proposals)
      ? (d.proposals as unknown[]).map(parseEvolutionProposal)
      : [],
    trend_summaries: Array.isArray(d.trend_summaries)
      ? (d.trend_summaries as unknown[]).map(parseGlobalLearningPattern)
      : [],
    philosophy: d.philosophy as string | undefined,
  };
}

export function parseContributionExport(data: unknown): ContributionExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    exported_at: d.exported_at as string | undefined,
    participation_mode: d.participation_mode as string | undefined,
    contributions: Array.isArray(d.contributions)
      ? (d.contributions as unknown[]).map(parseGlobalLearningContribution)
      : [],
    note: d.note as string | undefined,
  };
}
