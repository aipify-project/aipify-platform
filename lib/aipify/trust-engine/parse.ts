import type {
  DecisionExplanation,
  ExplanationDetail,
  ExplanationEvent,
  TrustCard,
  TrustDashboard,
  TrustScoreResult,
} from "./types";

export function parseDecisionExplanation(row: unknown): DecisionExplanation {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    decision_id: String(s.decision_id ?? ""),
    decision_type: String(s.decision_type ?? ""),
    source_module: String(s.source_module ?? ""),
    summary: String(s.summary ?? ""),
    reasoning: s.reasoning as string | null | undefined,
    information_used: Array.isArray(s.information_used) ? (s.information_used as string[]) : [],
    rules_applied: Array.isArray(s.rules_applied) ? (s.rules_applied as string[]) : [],
    confidence_level: String(s.confidence_level ?? "medium"),
    alternatives_considered: Array.isArray(s.alternatives_considered)
      ? (s.alternatives_considered as string[])
      : [],
    recommended_actions: Array.isArray(s.recommended_actions)
      ? (s.recommended_actions as string[])
      : [],
    explanation_layers: s.explanation_layers as Record<string, string> | undefined,
    overridden: Boolean(s.overridden),
    escalated: Boolean(s.escalated),
    created_at: s.created_at as string | undefined,
  };
}

export function parseExplanationEvent(row: unknown): ExplanationEvent {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    event_type: String(s.event_type ?? ""),
    actor: s.actor as string | undefined,
    metadata: s.metadata as Record<string, unknown> | undefined,
    created_at: s.created_at as string | undefined,
  };
}

export function parseTrustCard(data: unknown): TrustCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    trust_score: d.trust_score as number | undefined,
    explanation_count: d.explanation_count as number | undefined,
    philosophy: d.philosophy as string | undefined,
    mission: d.mission as string | undefined,
    abos_principle: d.abos_principle as string | undefined,
    privacy_note: d.privacy_note as string | undefined,
  };
}

function parseExplainabilityFramework(row: unknown): TrustDashboard["explainability_framework"] {
  const s = (row ?? {}) as Record<string, unknown>;
  if (!s.why && !s.sources) return undefined;
  return {
    why: String(s.why ?? ""),
    sources: String(s.sources ?? ""),
    assumptions: String(s.assumptions ?? ""),
    alternatives: String(s.alternatives ?? ""),
    confidence: String(s.confidence ?? ""),
  };
}

function parseConfidenceCommunication(row: unknown): TrustDashboard["confidence_communication"] {
  if (!Array.isArray(row)) return undefined;
  return row.map((item) => {
    const s = (item ?? {}) as Record<string, unknown>;
    return {
      level: String(s.level ?? ""),
      label: String(s.label ?? ""),
      when: String(s.when ?? ""),
      example: String(s.example ?? ""),
    };
  });
}

function parseIntegrationLinks(row: unknown): TrustDashboard["integration_links"] {
  if (!Array.isArray(row)) return undefined;
  return row.map((item) => {
    const s = (item ?? {}) as Record<string, unknown>;
    return {
      label: String(s.label ?? ""),
      route: String(s.route ?? ""),
      description: String(s.description ?? ""),
    };
  });
}

export function parseTrustDashboard(data: unknown): TrustDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    trust_score: d.trust_score as number | undefined,
    coverage: d.coverage as number | undefined,
    view_rate: d.view_rate as number | undefined,
    override_rate: d.override_rate as number | undefined,
    escalations: d.escalations as number | undefined,
    explanations: Array.isArray(d.explanations)
      ? (d.explanations as unknown[]).map(parseDecisionExplanation)
      : [],
    metrics: Array.isArray(d.metrics) ? (d.metrics as TrustDashboard["metrics"]) : [],
    recent_feedback: Array.isArray(d.recent_feedback)
      ? (d.recent_feedback as TrustDashboard["recent_feedback"])
      : [],
    philosophy: d.philosophy as string | undefined,
    mission: d.mission as string | undefined,
    abos_principle: d.abos_principle as string | undefined,
    self_love_note: d.self_love_note as string | undefined,
    explainability_framework: parseExplainabilityFramework(d.explainability_framework),
    transparency_requirements: Array.isArray(d.transparency_requirements)
      ? (d.transparency_requirements as string[])
      : undefined,
    confidence_communication: parseConfidenceCommunication(d.confidence_communication),
    accountability_principles: Array.isArray(d.accountability_principles)
      ? (d.accountability_principles as string[])
      : undefined,
    auditability_fields: Array.isArray(d.auditability_fields)
      ? (d.auditability_fields as string[])
      : undefined,
    consistency_monitoring: Array.isArray(d.consistency_monitoring)
      ? (d.consistency_monitoring as string[])
      : undefined,
    relationship_intelligence_note: d.relationship_intelligence_note as string | undefined,
    integration_links: parseIntegrationLinks(d.integration_links),
    privacy_note: d.privacy_note as string | undefined,
  };
}

export function parseExplanationDetail(data: unknown): ExplanationDetail | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!d.explanation || d.error) return null;
  return {
    explanation: parseDecisionExplanation(d.explanation),
    events: Array.isArray(d.events) ? (d.events as unknown[]).map(parseExplanationEvent) : [],
  };
}

export function parseDecisionExplanations(data: unknown): DecisionExplanation[] {
  const d = (data ?? {}) as Record<string, unknown>;
  return Array.isArray(d.explanations)
    ? (d.explanations as unknown[]).map(parseDecisionExplanation)
    : [];
}

export function parseTrustScoreResult(data: unknown): TrustScoreResult {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    trust_score: d.trust_score as number | undefined,
    explanation_coverage: d.explanation_coverage as number | undefined,
    view_rate: d.view_rate as number | undefined,
    satisfaction: d.satisfaction as number | undefined,
    override_rate: d.override_rate as number | undefined,
    escalations: d.escalations as number | undefined,
    total_explanations: d.total_explanations as number | undefined,
  };
}
