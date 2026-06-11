import type { StrategicIntelligenceFoundationEngineCard, StrategicIntelligenceFoundationEngineDashboard } from "./types";

export function parseStrategicIntelligenceFoundationEngineCard(data: unknown): StrategicIntelligenceFoundationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as StrategicIntelligenceFoundationEngineCard;
}

export function parseStrategicIntelligenceFoundationEngineDashboard(data: unknown): StrategicIntelligenceFoundationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    ...d,
  } as StrategicIntelligenceFoundationEngineDashboard;
}
