import type {
  ContextDimensionSummary,
  ContextIntelligenceEngineCard,
  ContextIntelligenceEngineDashboard,
  ContextIntelligenceSummary,
  OrganizationContextGap,
} from "./types";

function asRecordList<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function parseContextIntelligenceEngineCard(
  data: unknown
): ContextIntelligenceEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    open_gaps: typeof d.open_gaps === "number" ? d.open_gaps : undefined,
    dimensions_monitored:
      typeof d.dimensions_monitored === "number" ? d.dimensions_monitored : undefined,
    philosophy: asString(d.philosophy) || undefined,
  };
}

export function parseContextIntelligenceEngineDashboard(
  data: unknown
): ContextIntelligenceEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const summary =
    typeof d.summary === "object" && d.summary
      ? (d.summary as ContextIntelligenceSummary)
      : undefined;

  return {
    has_organization: Boolean(d.has_organization),
    philosophy: asString(d.philosophy) || undefined,
    mission: asString(d.mission) || undefined,
    abos_principle: asString(d.abos_principle) || undefined,
    self_love_note: asString(d.self_love_note) || undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    settings:
      typeof d.settings === "object" && d.settings
        ? (d.settings as ContextIntelligenceEngineDashboard["settings"])
        : undefined,
    summary,
    context_dimensions: asRecordList<ContextDimensionSummary>(d.context_dimensions),
    context_gaps: asRecordList<OrganizationContextGap>(d.context_gaps),
    integration_links:
      typeof d.integration_links === "object" && d.integration_links
        ? (d.integration_links as ContextIntelligenceEngineDashboard["integration_links"])
        : undefined,
    privacy_note: asString(d.privacy_note) || undefined,
  };
}

export function parseOrganizationContextGaps(data: unknown): OrganizationContextGap[] {
  return asRecordList<OrganizationContextGap>(data);
}

export function parseOrganizationContextGap(data: unknown): OrganizationContextGap | null {
  if (!data || typeof data !== "object") return null;
  return data as OrganizationContextGap;
}
