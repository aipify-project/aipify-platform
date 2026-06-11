import type { CustomerSuccessEngineCard, CustomerSuccessEngineDashboard } from "./types";

export function parseCustomerSuccessEngineCard(data: unknown): CustomerSuccessEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as CustomerSuccessEngineCard;
}

export function parseCustomerSuccessEngineDashboard(data: unknown): CustomerSuccessEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const list = Array.isArray(d.interventions) ? d.interventions as Array<Record<string, unknown>> : [];
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    interventions: list,
    ...d,
  } as CustomerSuccessEngineDashboard;
}
