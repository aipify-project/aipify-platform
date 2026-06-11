import type { LaunchReadinessEngineCard, LaunchReadinessEngineDashboard } from "./types";

export function parseLaunchReadinessEngineCard(data: unknown): LaunchReadinessEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as LaunchReadinessEngineCard;
}

export function parseLaunchReadinessEngineDashboard(data: unknown): LaunchReadinessEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const list = Array.isArray(d.checklist) ? d.checklist as Array<Record<string, unknown>> : [];
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    checklist: list,
    ...d,
  } as LaunchReadinessEngineDashboard;
}
