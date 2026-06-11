import type {
  LearningAuditEntry,
  LearningEngineCard,
  LearningEngineDashboard,
  LearningEngineSettings,
  LearningEvent,
  LearningPattern,
  LearningRule,
} from "./types";

function parseEvent(row: unknown): LearningEvent {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    id: String(s.id ?? ""),
    source_module: String(s.source_module ?? ""),
    source_id: s.source_id as string | null | undefined,
    event_type: String(s.event_type ?? ""),
    user_decision: s.user_decision as string | null | undefined,
    outcome: s.outcome as string | null | undefined,
    explanation: String(s.explanation ?? ""),
    created_at: String(s.created_at ?? ""),
  };
}

function parsePattern(row: unknown): LearningPattern {
  const s = (row ?? {}) as Record<string, unknown>;
  return {
    pattern_key: String(s.pattern_key ?? ""),
    source_module: String(s.source_module ?? ""),
    current_score: Number(s.current_score ?? 0),
    positive_count: Number(s.positive_count ?? 0),
    negative_count: Number(s.negative_count ?? 0),
    explanation: String(s.explanation ?? ""),
  };
}

export function parseLearningEngineCard(data: unknown): LearningEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: d.enabled as boolean | undefined,
    total_events: d.total_events as number | undefined,
    positive_feedback: d.positive_feedback as number | undefined,
    negative_feedback: d.negative_feedback as number | undefined,
    philosophy: d.philosophy as string | undefined,
    privacy_note: d.privacy_note as string | undefined,
  };
}

export function parseLearningEngineDashboard(data: unknown): LearningEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const m = (d.metrics ?? {}) as Record<string, unknown>;
  const list = (key: string, parser: (r: unknown) => unknown) =>
    Array.isArray(d[key]) ? (d[key] as unknown[]).map(parser) : [];
  return {
    has_customer: Boolean(d.has_customer),
    metrics: {
      total_events: Number(m.total_events ?? 0),
      positive_feedback: Number(m.positive_feedback ?? 0),
      negative_feedback: Number(m.negative_feedback ?? 0),
      false_positives_reduced: Number(m.false_positives_reduced ?? 0),
      suggestions_improved: Number(m.suggestions_improved ?? 0),
      automations_improved: Number(m.automations_improved ?? 0),
      noisy_notifications_reduced: Number(m.noisy_notifications_reduced ?? 0),
    },
    top_patterns: list("top_patterns", parsePattern) as LearningPattern[],
    recent_priority_adjustments: list("recent_priority_adjustments", parseEvent) as LearningEvent[],
    recent_events: list("recent_events", parseEvent) as LearningEvent[],
  };
}

export function parseLearningEvents(data: unknown): LearningEvent[] {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!Array.isArray(d.events)) return [];
  return (d.events as unknown[]).map(parseEvent);
}

export function parseLearningRules(data: unknown): LearningRule[] {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!Array.isArray(d.rules)) return [];
  return (d.rules as unknown[]).map((row) => {
    const s = row as Record<string, unknown>;
    return {
      id: String(s.id ?? ""),
      rule_key: String(s.rule_key ?? ""),
      source_module: String(s.source_module ?? ""),
      title: String(s.title ?? ""),
      description: String(s.description ?? ""),
      requires_review: Boolean(s.requires_review),
      is_active: Boolean(s.is_active),
      updated_at: String(s.updated_at ?? ""),
    };
  });
}

export function parseLearningAuditLog(data: unknown): LearningAuditEntry[] {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!Array.isArray(d.logs)) return [];
  return (d.logs as unknown[]).map((row) => {
    const s = row as Record<string, unknown>;
    return {
      id: String(s.id ?? ""),
      action_type: String(s.action_type ?? ""),
      action_summary: String(s.action_summary ?? ""),
      created_at: String(s.created_at ?? ""),
    };
  });
}

export function parseLearningEngineSettings(data: unknown): LearningEngineSettings {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    enabled: Boolean(d.enabled ?? true),
    allow_support_learning: Boolean(d.allow_support_learning ?? true),
    allow_quality_learning: Boolean(d.allow_quality_learning ?? true),
    allow_automation_learning: Boolean(d.allow_automation_learning ?? true),
    allow_notification_learning: Boolean(d.allow_notification_learning ?? true),
    allow_briefing_learning: Boolean(d.allow_briefing_learning ?? true),
    allow_action_learning: Boolean(d.allow_action_learning ?? true),
    require_admin_review_rules: Boolean(d.require_admin_review_rules ?? true),
    retention_days: Number(d.retention_days ?? 365),
  };
}
