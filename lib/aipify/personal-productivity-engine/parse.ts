import type {
  PersonalProductivityBriefing,
  PersonalProductivityExport,
  PersonalProductivityEngineCard,
  PersonalProductivityEngineDashboard,
  PersonalProductivityProfile,
  PersonalProductivityReminder,
  ProductivityRecommendation,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSections(data: unknown): PersonalProductivityEngineDashboard["sections"] {
  if (typeof data !== "object" || !data) return undefined;
  const s = data as Record<string, unknown>;
  return {
    todays_priorities: parseRecordList<Record<string, unknown>>(s.todays_priorities),
    upcoming_commitments: parseRecordList<Record<string, unknown>>(s.upcoming_commitments),
    overdue_work: parseRecordList<Record<string, unknown>>(s.overdue_work),
    completion_trends: parseRecordList<Record<string, unknown>>(s.completion_trends),
    focus_recommendations: parseRecordList<ProductivityRecommendation>(s.focus_recommendations),
    daily_briefing:
      typeof s.daily_briefing === "object" && s.daily_briefing
        ? (s.daily_briefing as Record<string, unknown>)
        : undefined,
  };
}

export function parsePersonalProductivityEngineCard(data: unknown): PersonalProductivityEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as PersonalProductivityEngineCard;
}

export function parsePersonalProductivityEngineDashboard(
  data: unknown
): PersonalProductivityEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    sections: parseSections(d.sections),
    reminders: parseRecordList<PersonalProductivityReminder>(d.reminders),
    recommendations: parseRecordList<ProductivityRecommendation>(d.recommendations),
    profile:
      typeof d.profile === "object" && d.profile ? (d.profile as PersonalProductivityProfile) : undefined,
    settings: typeof d.settings === "object" && d.settings ? (d.settings as Record<string, unknown>) : undefined,
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, string>)
        : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    ...d,
  } as PersonalProductivityEngineDashboard;
}

export function parsePersonalProductivityBriefing(data: unknown): Record<string, unknown> {
  const d = (data ?? {}) as Record<string, unknown>;
  return d;
}

export function parsePersonalProductivityExport(data: unknown): PersonalProductivityExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    profile:
      typeof d.profile === "object" && d.profile ? (d.profile as PersonalProductivityProfile) : undefined,
    briefings: parseRecordList<PersonalProductivityBriefing>(d.briefings),
    reminders: parseRecordList<PersonalProductivityReminder>(d.reminders),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    recommendations: parseRecordList<ProductivityRecommendation>(d.recommendations),
    metadata_only: d.metadata_only === true,
    ...d,
  } as PersonalProductivityExport;
}
