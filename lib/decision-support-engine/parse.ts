import type { DecisionsCenterBundle, DecisionRecommendation } from "./types";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asStringArray(value: unknown): string[] {
  return asArray<unknown>(value).filter((v): v is string => typeof v === "string");
}

function parseRecommendation(raw: Record<string, unknown>): DecisionRecommendation {
  return {
    id: String(raw.id ?? ""),
    decision_type: (raw.decision_type as DecisionRecommendation["decision_type"]) ?? "operational",
    domain: (raw.domain as DecisionRecommendation["domain"]) ?? "operational",
    title: String(raw.title ?? ""),
    recommendation: String(raw.recommendation ?? ""),
    reasoning: asStringArray(raw.reasoning),
    confidence: (raw.confidence as DecisionRecommendation["confidence"]) ?? "moderate",
    risk_indicators: asStringArray(raw.risk_indicators),
    evidence: asArray<Record<string, unknown>>(raw.evidence),
    trade_offs: asStringArray(raw.trade_offs),
    created_at: String(raw.created_at ?? ""),
  };
}

export function parseDecisionsCenter(data: unknown): DecisionsCenterBundle {
  if (!data || typeof data !== "object") {
    return { has_customer: false };
  }
  const d = data as Record<string, unknown>;
  const pending = asArray<Record<string, unknown>>(d.pending_decisions).map(parseRecommendation);

  return {
    has_customer: Boolean(d.has_customer),
    settings: d.settings as DecisionsCenterBundle["settings"],
    pending_decisions: pending,
    business_insights: asArray(d.business_insights),
    priority_opportunities: asArray(d.priority_opportunities),
    risk_indicators: asStringArray(d.risk_indicators),
    decision_history: asArray(d.decision_history),
    framework: asStringArray(d.framework),
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    ethical_principles: asStringArray(d.ethical_principles),
    integrations: d.integrations as Record<string, string>,
  };
}
