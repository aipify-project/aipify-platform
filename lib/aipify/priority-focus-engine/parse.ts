import type {
  FocusRecommendation,
  PriorityFocusDimension,
  PriorityFocusEngineCard,
  PriorityFocusEngineDashboard,
  PriorityFocusExport,
  PriorityFocusItem,
  PriorityFocusLevel,
  PriorityFocusSettings,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseSettings(data: unknown): PriorityFocusSettings | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as PriorityFocusSettings;
}

export function parsePriorityFocusEngineCard(data: unknown): PriorityFocusEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as PriorityFocusEngineCard;
}

export function parsePriorityFocusEngineDashboard(data: unknown): PriorityFocusEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    self_love_note: typeof d.self_love_note === "string" ? d.self_love_note : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    priority_dimensions: parseRecordList<PriorityFocusDimension>(d.priority_dimensions),
    priority_levels: parseRecordList<PriorityFocusLevel>(d.priority_levels),
    focus_support: Array.isArray(d.focus_support) ? (d.focus_support as string[]) : undefined,
    proactive_companion_examples: parseRecordList<{ example?: string }>(d.proactive_companion_examples),
    executive_insights_summary:
      typeof d.executive_insights_summary === "object" && d.executive_insights_summary
        ? (d.executive_insights_summary as Record<string, unknown>)
        : undefined,
    active_items_by_level:
      typeof d.active_items_by_level === "object" && d.active_items_by_level
        ? (d.active_items_by_level as Record<string, number>)
        : undefined,
    settings: parseSettings(d.settings),
    active_items: parseRecordList<PriorityFocusItem>(d.active_items),
    focus_recommendations: parseRecordList<FocusRecommendation>(d.focus_recommendations),
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
  } as PriorityFocusEngineDashboard;
}

export function parsePriorityFocusItems(data: unknown): PriorityFocusItem[] {
  return parseRecordList<PriorityFocusItem>(data) ?? [];
}

export function parseFocusRecommendations(data: unknown): FocusRecommendation[] {
  return parseRecordList<FocusRecommendation>(data) ?? [];
}

export function parsePriorityFocusExport(data: unknown): PriorityFocusExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    manifest_type: typeof d.manifest_type === "string" ? d.manifest_type : undefined,
    format: typeof d.format === "string" ? d.format : undefined,
    settings: parseSettings(d.settings),
    priority_dimensions: parseRecordList<PriorityFocusDimension>(d.priority_dimensions),
    priority_levels: parseRecordList<PriorityFocusLevel>(d.priority_levels),
    focus_support: Array.isArray(d.focus_support) ? (d.focus_support as string[]) : undefined,
    executive_insights_summary:
      typeof d.executive_insights_summary === "object" && d.executive_insights_summary
        ? (d.executive_insights_summary as Record<string, unknown>)
        : undefined,
    active_items_by_level:
      typeof d.active_items_by_level === "object" && d.active_items_by_level
        ? (d.active_items_by_level as Record<string, number>)
        : undefined,
    active_items: parseRecordList<PriorityFocusItem>(d.active_items),
    focus_recommendations: parseRecordList<FocusRecommendation>(d.focus_recommendations),
    permissions:
      typeof d.permissions === "object" && d.permissions
        ? (d.permissions as Record<string, unknown>)
        : undefined,
    ...d,
  } as PriorityFocusExport;
}
