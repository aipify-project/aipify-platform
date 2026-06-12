import type {
  DecisionsCenterBundle,
  DecisionRecommendation,
  DecisionSupportBlueprintPhase60,
} from "./types";

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

function parseBlueprintPhase60(raw: unknown): DecisionSupportBlueprintPhase60 | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const b = raw as Record<string, unknown>;
  return {
    phase: typeof b.phase === "string" ? b.phase : undefined,
    doc: typeof b.doc === "string" ? b.doc : undefined,
    engine_phase: typeof b.engine_phase === "string" ? b.engine_phase : undefined,
    route: typeof b.route === "string" ? b.route : undefined,
    distinction_note: typeof b.distinction_note === "string" ? b.distinction_note : undefined,
    mission: typeof b.mission === "string" ? b.mission : undefined,
    philosophy: typeof b.philosophy === "string" ? b.philosophy : undefined,
    abos_principle: typeof b.abos_principle === "string" ? b.abos_principle : undefined,
    objectives: asArray(b.objectives),
    decision_frameworks: asArray(b.decision_frameworks),
    decision_types: asArray(b.decision_types),
    option_comparison_examples: asArray(b.option_comparison_examples),
    risk_awareness: b.risk_awareness as DecisionSupportBlueprintPhase60["risk_awareness"],
    scenario_exploration: b.scenario_exploration as DecisionSupportBlueprintPhase60["scenario_exploration"],
    self_love_connection: b.self_love_connection as DecisionSupportBlueprintPhase60["self_love_connection"],
    trust_connection: b.trust_connection as DecisionSupportBlueprintPhase60["trust_connection"],
    dogfooding: b.dogfooding as DecisionSupportBlueprintPhase60["dogfooding"],
    success_criteria: asArray(b.success_criteria),
    vision_phrases: asStringArray(b.vision_phrases),
    integration_links: asArray(b.integration_links),
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
    implementation_blueprint_phase60: parseBlueprintPhase60(d.implementation_blueprint_phase60),
  };
}
