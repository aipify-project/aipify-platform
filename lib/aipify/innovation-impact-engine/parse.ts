import type { InnovationImpactEngineCard, InnovationImpactEngineDashboard } from "./types";

export function parseInnovationImpactEngineCard(data: unknown): InnovationImpactEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as InnovationImpactEngineCard;
}

export function parseInnovationImpactEngineDashboard(data: unknown): InnovationImpactEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    ...d,
  } as InnovationImpactEngineDashboard;
}
