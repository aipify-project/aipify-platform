import type { OperationsCenterFoundationEngineCard, OperationsCenterFoundationEngineDashboard } from "./types";

export function parseOperationsCenterFoundationEngineCard(data: unknown): OperationsCenterFoundationEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as OperationsCenterFoundationEngineCard;
}

export function parseOperationsCenterFoundationEngineDashboard(data: unknown): OperationsCenterFoundationEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    ...d,
  } as OperationsCenterFoundationEngineDashboard;
}
