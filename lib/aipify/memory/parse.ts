import type {
  MemoryEngineCard,
  MemoryPattern,
  MemoryProfile,
  MemoryRecommendation,
  MemorySettings,
} from "./types";

export function parseMemoryEngineCard(data: unknown): MemoryEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: d.enabled as boolean | undefined,
    auto_learn: d.auto_learn as boolean | undefined,
    profile_count: d.profile_count as number | undefined,
    pattern_count: d.pattern_count as number | undefined,
    recommendations: parseMemoryRecommendations(d.recommendations),
    privacy_note: d.privacy_note as string | undefined,
    philosophy: d.philosophy as string | undefined,
  };
}

export function parseMemoryProfiles(data: unknown): MemoryProfile[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const p = row as Record<string, unknown>;
    return {
      id: String(p.id),
      scope_level: String(p.scope_level ?? "user"),
      profile_key: String(p.profile_key ?? ""),
      profile_value: (p.profile_value as Record<string, unknown>) ?? {},
      explanation: p.explanation as string | null | undefined,
      source_module: String(p.source_module ?? ""),
      confidence: Number(p.confidence ?? 0.5),
      last_observed_at: String(p.last_observed_at ?? ""),
    };
  });
}

export function parseMemoryPatterns(data: unknown): MemoryPattern[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const p = row as Record<string, unknown>;
    return {
      id: String(p.id),
      scope_level: String(p.scope_level ?? "tenant"),
      pattern_type: String(p.pattern_type ?? ""),
      title: String(p.title ?? ""),
      description: String(p.description ?? ""),
      frequency_count: Number(p.frequency_count ?? 1),
      confidence: Number(p.confidence ?? 0.5),
      explanation: p.explanation as string | null | undefined,
      last_seen_at: String(p.last_seen_at ?? ""),
    };
  });
}

export function parseMemoryRecommendations(data: unknown): MemoryRecommendation[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.id),
      recommendation_type: String(r.recommendation_type ?? "workflow"),
      title: String(r.title ?? ""),
      summary: String(r.summary ?? ""),
      rationale: String(r.rationale ?? ""),
      action_url: r.action_url as string | null | undefined,
      priority_score: Number(r.priority_score ?? 0),
      status: String(r.status ?? "suggested"),
      created_at: String(r.created_at ?? ""),
    };
  });
}

export function parseMemorySettings(data: unknown): MemorySettings {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    enabled: Boolean(d.enabled ?? true),
    auto_learn: Boolean(d.auto_learn ?? true),
    include_user_preferences: Boolean(d.include_user_preferences ?? true),
    include_team_patterns: Boolean(d.include_team_patterns ?? true),
    include_tenant_rules: Boolean(d.include_tenant_rules ?? true),
    explainability_required: Boolean(d.explainability_required ?? true),
    governance_review_required: Boolean(d.governance_review_required ?? false),
    retention_days: Number(d.retention_days ?? 365),
    excluded_categories: Array.isArray(d.excluded_categories)
      ? (d.excluded_categories as string[])
      : ["password", "secret", "payment", "health"],
    max_profiles_per_user: Number(d.max_profiles_per_user ?? 50),
    max_patterns: Number(d.max_patterns ?? 100),
  };
}
