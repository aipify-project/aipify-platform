import type {
  ProactiveCompanionAssistanceCategory,
  ProactiveCompanionEngineCard,
  ProactiveCompanionEngineDashboard,
  ProactiveCompanionExport,
  ProactiveCompanionNudge,
  ProactiveCompanionSettings,
  ProactiveCompanionStyleExample,
  ProactiveCompanionUserPreferences,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): ProactiveCompanionSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ProactiveCompanionSettings;
}

function parseUserPreferences(data: unknown): ProactiveCompanionUserPreferences | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ProactiveCompanionUserPreferences;
}

export function parseProactiveCompanionEngineCard(data: unknown): ProactiveCompanionEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as ProactiveCompanionEngineCard;
}

export function parseProactiveCompanionEngineDashboard(
  data: unknown
): ProactiveCompanionEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    assistance_categories: parseRecordList<ProactiveCompanionAssistanceCategory>(d.assistance_categories),
    companion_style_examples: parseRecordList<ProactiveCompanionStyleExample>(d.companion_style_examples),
    boundaries: Array.isArray(d.boundaries) ? (d.boundaries as string[]) : undefined,
    settings: parseSettings(d.settings),
    user_preferences: parseUserPreferences(d.user_preferences),
    preference_summary:
      typeof d.preference_summary === "object" && d.preference_summary
        ? (d.preference_summary as Record<string, unknown>)
        : undefined,
    active_nudges: parseRecordList<ProactiveCompanionNudge>(d.active_nudges),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    integration_links:
      typeof d.integration_links === "object" && d.integration_links
        ? (d.integration_links as Record<string, unknown>)
        : undefined,
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as ProactiveCompanionEngineDashboard;
}

export function parseProactiveCompanionNudges(data: unknown): ProactiveCompanionNudge[] {
  return parseRecordList<ProactiveCompanionNudge>(data) ?? [];
}

export function parseProactiveCompanionExport(data: unknown): ProactiveCompanionExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    format: typeof d.format === "string" ? d.format : undefined,
    settings: parseSettings(d.settings),
    preference_summary:
      typeof d.preference_summary === "object" && d.preference_summary
        ? (d.preference_summary as Record<string, unknown>)
        : undefined,
    assistance_categories: parseRecordList<ProactiveCompanionAssistanceCategory>(d.assistance_categories),
    boundaries: Array.isArray(d.boundaries) ? (d.boundaries as string[]) : undefined,
    active_nudges: parseRecordList<ProactiveCompanionNudge>(d.active_nudges),
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as ProactiveCompanionExport;
}

export function parseProactiveCompanionUserPreferences(
  data: unknown
): ProactiveCompanionUserPreferences {
  const d = (data ?? {}) as Record<string, unknown>;
  return parseUserPreferences(d) ?? (d as ProactiveCompanionUserPreferences);
}
