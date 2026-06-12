import type {
  AdaptiveOrganizationContinuousOptimizationBlueprint,
  AdaptiveOrganizationExperimentRecord,
  ContinuousImprovementEngineCard,
  ContinuousImprovementEngineDashboard,
  ContinuousImprovementOrganizationalEvolutionBlueprint,
  FatigueSignalRecord,
  ImprovementInitiativeRecord,
  ImprovementPortfolioRecord,
  ImprovementReviewCycleRecord,
  ImprovementSuccessMeasurementRecord,
  ImprovementSuggestion,
} from "./types";

function parseBlueprint(
  raw: unknown,
): ContinuousImprovementOrganizationalEvolutionBlueprint | undefined {
  if (typeof raw !== "object" || !raw) return undefined;
  return raw as ContinuousImprovementOrganizationalEvolutionBlueprint;
}

function parsePhase134Blueprint(
  raw: unknown,
): AdaptiveOrganizationContinuousOptimizationBlueprint | undefined {
  if (typeof raw !== "object" || !raw) return undefined;
  return raw as AdaptiveOrganizationContinuousOptimizationBlueprint;
}

function parseArray<T>(raw: unknown): T[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  return raw as T[];
}

export function parseContinuousImprovementEngineCard(data: unknown): ContinuousImprovementEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    active_improvements: typeof d.active_improvements === "number" ? d.active_improvements : undefined,
    initiatives_active: typeof d.initiatives_active === "number" ? d.initiatives_active : undefined,
    continuous_improvement_organizational_evolution_blueprint: parseBlueprint(
      d.continuous_improvement_organizational_evolution_blueprint,
    ),
    implementation_blueprint_phase134: parsePhase134Blueprint(d.implementation_blueprint_phase134),
    experiments_active: typeof d.experiments_active === "number" ? d.experiments_active : undefined,
    ...d,
  } as ContinuousImprovementEngineCard;
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
    continuous_improvement_organizational_evolution_blueprint: parseBlueprint(
      d.continuous_improvement_organizational_evolution_blueprint,
    ),
    implementation_blueprint_phase134: parsePhase134Blueprint(d.implementation_blueprint_phase134),
    experiments: parseArray<AdaptiveOrganizationExperimentRecord>(d.experiments),
    improvement_portfolio: parseArray<ImprovementPortfolioRecord>(d.improvement_portfolio),
    fatigue_signals: parseArray<FatigueSignalRecord>(d.fatigue_signals),
  };
}

export function parseContinuousImprovementOrganizationalEvolutionBlueprint(
  data: unknown,
): ContinuousImprovementOrganizationalEvolutionBlueprint | undefined {
  return parseBlueprint(data);
}

export function parseAdaptiveOrganizationContinuousOptimizationBlueprint(
  data: unknown,
): AdaptiveOrganizationContinuousOptimizationBlueprint | undefined {
  return parsePhase134Blueprint(data);
}
