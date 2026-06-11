import type {
  ContinuousImprovementEngineCard,
  ContinuousImprovementEngineDashboard,
  ImprovementInitiativeRecord,
  ImprovementReviewCycleRecord,
  ImprovementSuccessMeasurementRecord,
  ImprovementSuggestion,
} from "./types";

export function parseContinuousImprovementEngineCard(data: unknown): ContinuousImprovementEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return { has_organization: Boolean(d.has_organization), ...d } as ContinuousImprovementEngineCard;
}

function parseInitiatives(raw: unknown): ImprovementInitiativeRecord[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  return raw as ImprovementInitiativeRecord[];
}

function parseReviewCycles(raw: unknown): ImprovementReviewCycleRecord[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  return raw as ImprovementReviewCycleRecord[];
}

function parseSuccessMeasurements(raw: unknown): ImprovementSuccessMeasurementRecord[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  return raw as ImprovementSuccessMeasurementRecord[];
}

export function parseImprovementSuggestions(data: unknown): ImprovementSuggestion[] {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!Array.isArray(d.suggestions)) return [];
  return d.suggestions as ImprovementSuggestion[];
}

export function parseContinuousImprovementEngineDashboard(data: unknown): ContinuousImprovementEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    items: Array.isArray(d.items) ? (d.items as Record<string, unknown>[]) : undefined,
    initiatives: parseInitiatives(d.initiatives),
    review_cycles: parseReviewCycles(d.review_cycles),
    success_measurements: parseSuccessMeasurements(d.success_measurements),
    trends: typeof d.trends === "object" && d.trends ? (d.trends as Record<string, unknown>) : undefined,
    memory_integration:
      typeof d.memory_integration === "object" && d.memory_integration
        ? (d.memory_integration as Record<string, unknown>)
        : undefined,
    recent_feedback: Array.isArray(d.recent_feedback) ? (d.recent_feedback as Record<string, unknown>[]) : undefined,
    outcomes: Array.isArray(d.outcomes) ? (d.outcomes as Record<string, unknown>[]) : undefined,
  };
}
