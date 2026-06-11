import type { ComplianceRegulatoryReadinessEngineCard, ComplianceRegulatoryReadinessEngineDashboard } from "./types";

export function parseComplianceRegulatoryReadinessEngineCard(data: unknown): ComplianceRegulatoryReadinessEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as ComplianceRegulatoryReadinessEngineCard;
}

export function parseComplianceRegulatoryReadinessEngineDashboard(data: unknown): ComplianceRegulatoryReadinessEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    ...d,
  } as ComplianceRegulatoryReadinessEngineDashboard;
}
