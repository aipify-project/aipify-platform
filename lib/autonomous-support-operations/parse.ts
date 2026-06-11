import type { SupportOperationsCenter } from "./types";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asStringArray(value: unknown): string[] {
  return asArray<unknown>(value).filter((v): v is string => typeof v === "string");
}

export function parseSupportOperationsCenter(data: unknown): SupportOperationsCenter {
  if (!data || typeof data !== "object") {
    return { has_customer: false };
  }
  const d = data as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    settings: d.settings as SupportOperationsCenter["settings"],
    autonomy_levels: asArray(d.autonomy_levels),
    readiness: d.readiness as SupportOperationsCenter["readiness"],
    categories: asArray(d.categories),
    open_cases: asArray(d.open_cases),
    performance: d.performance as Record<string, unknown>,
    knowledge_gaps: asArray(d.knowledge_gaps),
    proactive_alerts: asArray(d.proactive_alerts),
    approval_queue: asArray(d.approval_queue),
    high_risk_cases: asArray(d.high_risk_cases),
    audit_log: asArray(d.audit_log),
    ethical_principles: asStringArray(d.ethical_principles),
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    integrations: d.integrations as Record<string, string>,
  };
}
