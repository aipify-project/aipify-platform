import type {
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
    self_love_note: asString(d.self_love_note) || undefined,
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
