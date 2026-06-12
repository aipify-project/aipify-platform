import type {
  AbosSuccessCriterion,
  AdaptationPrinciples,
  AdaptiveLearningOrganizationalCapabilityBlueprint,
  AdaptiveLearningPathway,
  AdaptiveOrganizationalEngagementSummary,
  CapabilityQuestionsBlueprint,
  CommunityLearningConnection,
  CompanionExample,
  CompanionGuidanceBlueprint,
  IntegrationLink,
  KnowledgeReinforcementBlueprint,
  LeadershipInsightsBlueprint,
  LearningEngineCard,
  LearningEngineDashboard,
  LearningEngineSettings,
  LearningEngagementSummary,
  LearningEvent,
  LearningObjective,
  LearningPattern,
  LearningRule,
  LearningAuditEntry,
  LearningSignalsBlueprint,
  LearningSourcesBlueprint,
  PrivacyPrinciplesBlueprint,
  SelfLoveConnection,
  TrustConnection,
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

function parseStringArray(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as IntegrationLink[];
}

function parseLearningObjectives(data: unknown): LearningObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as LearningObjective[];
}

function parseLearningSources(data: unknown): LearningSourcesBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LearningSourcesBlueprint;
}

function parseAdaptationPrinciples(data: unknown): AdaptationPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as AdaptationPrinciples;
}

function parseCompanionExamples(data: unknown): CompanionExample[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as CompanionExample[];
}

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveConnection;
}

function parseTrustConnection(data: unknown): TrustConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as TrustConnection;
}

function parseEngagementSummary(data: unknown): LearningEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LearningEngagementSummary;
}

function parseAdaptiveEngagementSummary(data: unknown): AdaptiveOrganizationalEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  const d = data as Record<string, unknown>;
  return {
    ...(d as AdaptiveOrganizationalEngagementSummary),
    operational_engagement: parseEngagementSummary(d.operational_engagement),
  };
}

function parseLearningSignals(data: unknown): LearningSignalsBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LearningSignalsBlueprint;
}

function parseCapabilityQuestions(data: unknown): CapabilityQuestionsBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CapabilityQuestionsBlueprint;
}

function parseAdaptivePathways(data: unknown): AdaptiveLearningPathway[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AdaptiveLearningPathway[];
}

function parseCompanionGuidance(data: unknown): CompanionGuidanceBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CompanionGuidanceBlueprint;
}

function parseKnowledgeReinforcement(data: unknown): KnowledgeReinforcementBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as KnowledgeReinforcementBlueprint;
}

function parseCommunityLearning(data: unknown): CommunityLearningConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CommunityLearningConnection;
}

function parseLeadershipInsights(data: unknown): LeadershipInsightsBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as LeadershipInsightsBlueprint;
}

function parsePrivacyPrinciples(data: unknown): PrivacyPrinciplesBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as PrivacyPrinciplesBlueprint;
}

function parseAdaptiveBlueprintBlock(data: unknown): AdaptiveLearningOrganizationalCapabilityBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  const d = data as Record<string, unknown>;
  return {
    ...(d as AdaptiveLearningOrganizationalCapabilityBlueprint),
    objectives: parseLearningObjectives(d.objectives),
    learning_signals: parseLearningSignals(d.learning_signals),
    capability_questions: parseCapabilityQuestions(d.capability_questions),
    adaptive_learning_pathways: parseAdaptivePathways(d.adaptive_learning_pathways),
    companion_guidance: parseCompanionGuidance(d.companion_guidance),
    knowledge_reinforcement: parseKnowledgeReinforcement(d.knowledge_reinforcement),
    community_learning_connection: parseCommunityLearning(d.community_learning_connection),
    self_love_connection: parseSelfLoveConnection(d.self_love_connection),
    leadership_insights: parseLeadershipInsights(d.leadership_insights),
    trust_connection: parseTrustConnection(d.trust_connection),
    privacy_principles: parsePrivacyPrinciples(d.privacy_principles),
    integration_links: parseIntegrationLinks(d.integration_links),
    success_criteria: parseSuccessCriteria(d.success_criteria),
    vision_phrases: parseStringArray(d.vision_phrases),
    engagement_summary: parseAdaptiveEngagementSummary(d.engagement_summary),
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
    mission: d.mission as string | undefined,
    abos_principle: d.abos_principle as string | undefined,
    core_principle: d.core_principle as string | undefined,
    implementation_blueprint: d.implementation_blueprint as LearningEngineCard["implementation_blueprint"],
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: d.blueprint_note as string | undefined,
    implementation_blueprint_phase93: d.implementation_blueprint_phase93 as LearningEngineCard["implementation_blueprint"],
    adaptive_organizational_mission: d.adaptive_organizational_mission as string | undefined,
    adaptive_organizational_abos_principle: d.adaptive_organizational_abos_principle as string | undefined,
    adaptive_organizational_engagement_summary: parseAdaptiveEngagementSummary(d.adaptive_organizational_engagement_summary),
    adaptive_organizational_note: d.adaptive_organizational_note as string | undefined,
    adaptive_organizational_vision_note: d.adaptive_organizational_vision_note as string | undefined,
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
    implementation_blueprint: d.implementation_blueprint as LearningEngineDashboard["implementation_blueprint"],
    mission: d.mission as string | undefined,
    philosophy: d.philosophy as string | undefined,
    abos_principle: d.abos_principle as string | undefined,
    core_principle: d.core_principle as string | undefined,
    vision: d.vision as string | undefined,
    learning_engine_note: d.learning_engine_note as string | undefined,
    distinction_note: d.distinction_note as string | undefined,
    learning_objectives: parseLearningObjectives(d.learning_objectives),
    learning_sources: parseLearningSources(d.learning_sources),
    adaptation_principles: parseAdaptationPrinciples(d.adaptation_principles),
    companion_examples: parseCompanionExamples(d.companion_examples),
    self_love_connection: parseSelfLoveConnection(d.self_love_connection),
    trust_connection: parseTrustConnection(d.trust_connection),
    dogfooding: d.dogfooding as LearningEngineDashboard["dogfooding"],
    integration_links: parseIntegrationLinks(d.integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    success_criteria: parseSuccessCriteria(d.success_criteria),
    vision_phrases: parseStringArray(d.vision_phrases),
    privacy_note: d.privacy_note as string | undefined,
    principles: parseStringArray(d.principles),
    implementation_blueprint_phase93: d.implementation_blueprint_phase93 as LearningEngineDashboard["implementation_blueprint_phase93"],
    adaptive_learning_organizational_capability_engine_note: d.adaptive_learning_organizational_capability_engine_note as string | undefined,
    adaptive_learning_organizational_capability_blueprint: parseAdaptiveBlueprintBlock(d.adaptive_learning_organizational_capability_blueprint),
    adaptive_organizational_distinction_note: d.adaptive_organizational_distinction_note as string | undefined,
    adaptive_organizational_mission: d.adaptive_organizational_mission as string | undefined,
    adaptive_organizational_philosophy: d.adaptive_organizational_philosophy as string | undefined,
    adaptive_organizational_abos_principle: d.adaptive_organizational_abos_principle as string | undefined,
    adaptive_organizational_objectives: parseLearningObjectives(d.adaptive_organizational_objectives),
    adaptive_organizational_learning_signals: parseLearningSignals(d.adaptive_organizational_learning_signals),
    adaptive_organizational_capability_questions: parseCapabilityQuestions(d.adaptive_organizational_capability_questions),
    adaptive_organizational_pathways: parseAdaptivePathways(d.adaptive_organizational_pathways),
    adaptive_organizational_companion_guidance: parseCompanionGuidance(d.adaptive_organizational_companion_guidance),
    adaptive_organizational_knowledge_reinforcement: parseKnowledgeReinforcement(d.adaptive_organizational_knowledge_reinforcement),
    adaptive_organizational_community_learning: parseCommunityLearning(d.adaptive_organizational_community_learning),
    adaptive_organizational_self_love_connection: parseSelfLoveConnection(d.adaptive_organizational_self_love_connection),
    adaptive_organizational_leadership_insights: parseLeadershipInsights(d.adaptive_organizational_leadership_insights),
    adaptive_organizational_trust_connection: parseTrustConnection(d.adaptive_organizational_trust_connection),
    adaptive_organizational_privacy_principles: parsePrivacyPrinciples(d.adaptive_organizational_privacy_principles),
    adaptive_organizational_dogfooding: d.adaptive_organizational_dogfooding as LearningEngineDashboard["adaptive_organizational_dogfooding"],
    adaptive_organizational_integration_links: parseIntegrationLinks(d.adaptive_organizational_integration_links),
    adaptive_organizational_engagement_summary: parseAdaptiveEngagementSummary(d.adaptive_organizational_engagement_summary),
    adaptive_organizational_success_criteria: parseSuccessCriteria(d.adaptive_organizational_success_criteria),
    adaptive_organizational_vision: d.adaptive_organizational_vision as string | undefined,
    adaptive_organizational_vision_phrases: parseStringArray(d.adaptive_organizational_vision_phrases),
    adaptive_organizational_privacy_note: d.adaptive_organizational_privacy_note as string | undefined,
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
