import type { AipifyInternalOperationsEngineCard, AipifyInternalOperationsEngineDashboard } from "./types";

export function parseAipifyInternalOperationsEngineCard(data: unknown): AipifyInternalOperationsEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as AipifyInternalOperationsEngineCard;
}

export function parseAipifyInternalOperationsEngineDashboard(data: unknown): AipifyInternalOperationsEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const list = Array.isArray(d.tasks) ? d.tasks as Array<Record<string, unknown>> : [];
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    tasks: list,
    ...d,
  } as AipifyInternalOperationsEngineDashboard;
}
