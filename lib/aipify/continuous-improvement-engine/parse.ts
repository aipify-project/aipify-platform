import type { ContinuousImprovementEngineCard, ContinuousImprovementEngineDashboard } from "./types";

export function parseContinuousImprovementEngineCard(data: unknown): ContinuousImprovementEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as ContinuousImprovementEngineCard;
}

export function parseContinuousImprovementEngineDashboard(data: unknown): ContinuousImprovementEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    ...d,
  } as ContinuousImprovementEngineDashboard;
}
