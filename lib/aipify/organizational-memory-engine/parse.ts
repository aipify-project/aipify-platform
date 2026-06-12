import type {
  AbosSuccessCriterion,
  ContinuityBlueprintSection,
  ContinuityMemoryCategory,
  ContinuityObjective,
  ContinuitySummary,
  IntegrationLink,
  MemoryCapability,
  MemoryCategoryBlock,
  MemoryContinuitySettings,
  MemoryLegacyCategory,
  MemoryLegacyBlueprintSection,
  MemoryLegacyEngagementSummary,
  MemoryLevelSummary,
  OrganizationDecisionRegisterEntry,
  OrganizationMemoryRecord,
  OrganizationMemoryReview,
  OrganizationalMemoryEngineCard,
  OrganizationalMemoryEngineDashboard,
  OrganizationalMemoryLegacyBlueprint,
  OrganizationalMemorySummary,
  RecurringTheme,
} from "./types";

function asRecordList<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function parseOrganizationalMemoryEngineCard(
  data: unknown
): OrganizationalMemoryEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    active_records: typeof d.active_records === "number" ? d.active_records : undefined,
    pending_reviews: typeof d.pending_reviews === "number" ? d.pending_reviews : undefined,
    philosophy: asString(d.philosophy) || undefined,
  };
}

export function parseOrganizationalMemoryEngineDashboard(
  data: unknown
): OrganizationalMemoryEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const summary =
    typeof d.summary === "object" && d.summary
      ? (d.summary as OrganizationalMemorySummary)
      : undefined;

  return {
    has_organization: Boolean(d.has_organization),
    philosophy: asString(d.philosophy) || undefined,
    mission: asString(d.mission) || undefined,
    abos_principle: asString(d.abos_principle) || undefined,
    vision: asString(d.vision) || undefined,
    knowledge_vs_memory_note: asString(d.knowledge_vs_memory_note) || undefined,
    core_philosophy: Array.isArray(d.core_philosophy) ? (d.core_philosophy as string[]) : undefined,
    memory_categories: asRecordList<MemoryCategoryBlock>(d.memory_categories),
    memory_capabilities: asRecordList<MemoryCapability>(d.memory_capabilities),
    capability_examples: Array.isArray(d.capability_examples)
      ? (d.capability_examples as string[])
      : undefined,
    self_love_note: asString(d.self_love_note) || undefined,
    trust_connection:
      typeof d.trust_connection === "object" && d.trust_connection
        ? (d.trust_connection as OrganizationalMemoryEngineDashboard["trust_connection"])
        : undefined,
    distinction_note: asString(d.distinction_note) || undefined,
    success_criteria: asRecordList<AbosSuccessCriterion>(d.success_criteria),
    integration_links: asRecordList<IntegrationLink>(d.integration_links),
    memory_levels: asRecordList<MemoryLevelSummary>(d.memory_levels),
    knowledge_domains: Array.isArray(d.knowledge_domains)
      ? (d.knowledge_domains as string[])
      : undefined,
    approved_sources: Array.isArray(d.approved_sources)
      ? (d.approved_sources as string[])
      : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    settings:
      typeof d.settings === "object" && d.settings
        ? (d.settings as OrganizationalMemoryEngineDashboard["settings"])
        : undefined,
    summary,
    recent_learnings: asRecordList<OrganizationMemoryRecord>(d.recent_learnings),
    recurring_themes: asRecordList<RecurringTheme>(d.recurring_themes),
    frequently_referenced: asRecordList<OrganizationMemoryRecord>(d.frequently_referenced),
    archived_decisions: asRecordList<OrganizationDecisionRegisterEntry>(d.archived_decisions),
    recommended_reviews: asRecordList<OrganizationMemoryReview>(d.recommended_reviews),
    privacy_note: asString(d.privacy_note) || undefined,
    implementation_blueprint_phase55:
      typeof d.implementation_blueprint_phase55 === "object" && d.implementation_blueprint_phase55
        ? (d.implementation_blueprint_phase55 as OrganizationalMemoryEngineDashboard["implementation_blueprint_phase55"])
        : undefined,
    continuity_mission: asString(d.continuity_mission) || undefined,
    continuity_philosophy: asString(d.continuity_philosophy) || undefined,
    continuity_abos_principle: asString(d.continuity_abos_principle) || undefined,
    continuity_objectives: asRecordList<ContinuityObjective>(d.continuity_objectives),
    continuity_memory_categories: asRecordList<ContinuityMemoryCategory>(d.continuity_memory_categories),
    organizational_continuity:
      typeof d.organizational_continuity === "object" && d.organizational_continuity
        ? (d.organizational_continuity as ContinuityBlueprintSection)
        : undefined,
    individual_continuity:
      typeof d.individual_continuity === "object" && d.individual_continuity
        ? (d.individual_continuity as ContinuityBlueprintSection)
        : undefined,
    memory_management:
      typeof d.memory_management === "object" && d.memory_management
        ? (d.memory_management as ContinuityBlueprintSection)
        : undefined,
    continuity_self_love_connection:
      typeof d.continuity_self_love_connection === "object" && d.continuity_self_love_connection
        ? (d.continuity_self_love_connection as ContinuityBlueprintSection)
        : undefined,
    continuity_trust_privacy:
      typeof d.continuity_trust_privacy === "object" && d.continuity_trust_privacy
        ? (d.continuity_trust_privacy as ContinuityBlueprintSection)
        : undefined,
    continuity_companion_principles:
      typeof d.continuity_companion_principles === "object" && d.continuity_companion_principles
        ? (d.continuity_companion_principles as ContinuityBlueprintSection)
        : undefined,
    continuity_settings:
      typeof d.continuity_settings === "object" && d.continuity_settings
        ? (d.continuity_settings as MemoryContinuitySettings)
        : undefined,
    continuity_summary:
      typeof d.continuity_summary === "object" && d.continuity_summary
        ? (d.continuity_summary as ContinuitySummary)
        : undefined,
    continuity_dogfooding:
      typeof d.continuity_dogfooding === "object" && d.continuity_dogfooding
        ? (d.continuity_dogfooding as Record<string, unknown>)
        : undefined,
    mcebp_integration_links: asRecordList<IntegrationLink>(d.mcebp_integration_links),
    continuity_success_criteria: asRecordList<AbosSuccessCriterion>(d.continuity_success_criteria),
    continuity_vision_phrases: Array.isArray(d.continuity_vision_phrases)
      ? (d.continuity_vision_phrases as string[])
      : undefined,
    continuity_distinction_note: asString(d.continuity_distinction_note) || undefined,
    implementation_blueprint_phase94:
      typeof d.implementation_blueprint_phase94 === "object" && d.implementation_blueprint_phase94
        ? (d.implementation_blueprint_phase94 as OrganizationalMemoryEngineDashboard["implementation_blueprint_phase94"])
        : undefined,
    organizational_memory_legacy_blueprint:
      typeof d.organizational_memory_legacy_blueprint === "object" &&
      d.organizational_memory_legacy_blueprint
        ? (d.organizational_memory_legacy_blueprint as OrganizationalMemoryLegacyBlueprint)
        : undefined,
    memory_legacy_distinction_note: asString(d.memory_legacy_distinction_note) || undefined,
    memory_legacy_mission: asString(d.memory_legacy_mission) || undefined,
    memory_legacy_philosophy: asString(d.memory_legacy_philosophy) || undefined,
    memory_legacy_abos_principle: asString(d.memory_legacy_abos_principle) || undefined,
    memory_legacy_objectives: asRecordList<ContinuityObjective>(d.memory_legacy_objectives),
    memory_legacy_categories: asRecordList<MemoryLegacyCategory>(d.memory_legacy_categories),
    memory_legacy_questions:
      typeof d.memory_legacy_questions === "object" && d.memory_legacy_questions
        ? (d.memory_legacy_questions as MemoryLegacyBlueprintSection)
        : undefined,
    memory_legacy_preservation:
      typeof d.memory_legacy_preservation === "object" && d.memory_legacy_preservation
        ? (d.memory_legacy_preservation as MemoryLegacyBlueprintSection)
        : undefined,
    memory_legacy_companion_guidance:
      typeof d.memory_legacy_companion_guidance === "object" && d.memory_legacy_companion_guidance
        ? (d.memory_legacy_companion_guidance as MemoryLegacyBlueprintSection)
        : undefined,
    memory_legacy_meeting_companion_connection:
      typeof d.memory_legacy_meeting_companion_connection === "object" &&
      d.memory_legacy_meeting_companion_connection
        ? (d.memory_legacy_meeting_companion_connection as MemoryLegacyBlueprintSection)
        : undefined,
    memory_legacy_knowledge_center_connection:
      typeof d.memory_legacy_knowledge_center_connection === "object" &&
      d.memory_legacy_knowledge_center_connection
        ? (d.memory_legacy_knowledge_center_connection as MemoryLegacyBlueprintSection)
        : undefined,
    memory_legacy_self_love_connection:
      typeof d.memory_legacy_self_love_connection === "object" &&
      d.memory_legacy_self_love_connection
        ? (d.memory_legacy_self_love_connection as MemoryLegacyBlueprintSection)
        : undefined,
    memory_legacy_trust_connection:
      typeof d.memory_legacy_trust_connection === "object" && d.memory_legacy_trust_connection
        ? (d.memory_legacy_trust_connection as MemoryLegacyBlueprintSection)
        : undefined,
    memory_legacy_privacy_principles:
      typeof d.memory_legacy_privacy_principles === "object" && d.memory_legacy_privacy_principles
        ? (d.memory_legacy_privacy_principles as MemoryLegacyBlueprintSection)
        : undefined,
    memory_legacy_dogfooding:
      typeof d.memory_legacy_dogfooding === "object" && d.memory_legacy_dogfooding
        ? (d.memory_legacy_dogfooding as Record<string, unknown>)
        : undefined,
    omlebp94_integration_links: asRecordList<IntegrationLink>(d.omlebp94_integration_links),
    memory_legacy_engagement_summary:
      typeof d.memory_legacy_engagement_summary === "object" && d.memory_legacy_engagement_summary
        ? (d.memory_legacy_engagement_summary as MemoryLegacyEngagementSummary)
        : undefined,
    memory_legacy_success_criteria: asRecordList<AbosSuccessCriterion>(
      d.memory_legacy_success_criteria
    ),
    memory_legacy_vision: asString(d.memory_legacy_vision) || undefined,
    memory_legacy_vision_phrases: Array.isArray(d.memory_legacy_vision_phrases)
      ? (d.memory_legacy_vision_phrases as string[])
      : undefined,
    memory_legacy_privacy_note: asString(d.memory_legacy_privacy_note) || undefined,
  };
}

export function parseOrganizationMemoryRecords(data: unknown): OrganizationMemoryRecord[] {
  return asRecordList<OrganizationMemoryRecord>(data);
}

export function parseOrganizationDecisionEntries(
  data: unknown
): OrganizationDecisionRegisterEntry[] {
  return asRecordList<OrganizationDecisionRegisterEntry>(data);
}
