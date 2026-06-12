import type {
  AbosSuccessCriterion,
  IntegrationLink,
  MemoryCapability,
  MemoryCategoryBlock,
  MemoryLevelSummary,
  OrganizationDecisionRegisterEntry,
  OrganizationMemoryRecord,
  OrganizationMemoryReview,
  OrganizationalMemoryEngineCard,
  OrganizationalMemoryEngineDashboard,
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
