import type { Translator } from "@/lib/i18n/translate";
import {
  EXPANSION_TYPES,
  FORECAST_PERIODS,
  GOAL_PERIODS,
  PIPELINE_STAGES,
  SCENARIO_KEYS,
} from "./constants";
import type { GrowthPartnerForecastLabels } from "./types";

export function buildGrowthPartnerForecastLabels(
  t: Translator,
  namespace: string
): GrowthPartnerForecastLabels {
  const mapKeys = <K extends string>(keys: readonly K[], suffix: string) =>
    Object.fromEntries(keys.map((k) => [k, t(`${namespace}.${suffix}.${k}`)])) as Record<K, string>;

  return {
    title: t(`${namespace}.title`),
    subtitle: t(`${namespace}.subtitle`),
    loading: t(`${namespace}.loading`),
    back: t(`${namespace}.back`),
    principle: t(`${namespace}.principle`),
    emptyState: t(`${namespace}.emptyState`),
    overview: {
      forecastedMonthlyRevenue: t(`${namespace}.overview.forecastedMonthlyRevenue`),
      forecastedAnnualRevenue: t(`${namespace}.overview.forecastedAnnualRevenue`),
      activeOpportunitiesValue: t(`${namespace}.overview.activeOpportunitiesValue`),
      expectedCommissions: t(`${namespace}.overview.expectedCommissions`),
      renewalOpportunities: t(`${namespace}.overview.renewalOpportunities`),
      expansionOpportunities: t(`${namespace}.overview.expansionOpportunities`),
      weightedPipeline: t(`${namespace}.overview.weightedPipeline`),
      qualifiedPipeline: t(`${namespace}.overview.qualifiedPipeline`),
      proposalStage: t(`${namespace}.overview.proposalStage`),
      negotiationStage: t(`${namespace}.overview.negotiationStage`),
    },
    sections: {
      overview: t(`${namespace}.sections.overview`),
      pipeline: t(`${namespace}.sections.pipeline`),
      renewals: t(`${namespace}.sections.renewals`),
      expansions: t(`${namespace}.sections.expansions`),
      goals: t(`${namespace}.sections.goals`),
      scenarios: t(`${namespace}.sections.scenarios`),
      probabilities: t(`${namespace}.sections.probabilities`),
      recommendations: t(`${namespace}.sections.recommendations`),
      audit: t(`${namespace}.sections.audit`),
      reporting: t(`${namespace}.sections.reporting`),
    },
    table: {
      company: t(`${namespace}.table.company`),
      stage: t(`${namespace}.table.stage`),
      value: t(`${namespace}.table.value`),
      weighted: t(`${namespace}.table.weighted`),
      closeDate: t(`${namespace}.table.closeDate`),
      customer: t(`${namespace}.table.customer`),
      renewalDate: t(`${namespace}.table.renewalDate`),
      probability: t(`${namespace}.table.probability`),
      target: t(`${namespace}.table.target`),
      current: t(`${namespace}.table.current`),
      progress: t(`${namespace}.table.progress`),
      period: t(`${namespace}.table.period`),
      revenue: t(`${namespace}.table.revenue`),
      commissions: t(`${namespace}.table.commissions`),
      actions: t(`${namespace}.table.actions`),
    },
    pipelineStages: mapKeys(PIPELINE_STAGES, "pipelineStages"),
    forecastPeriods: mapKeys(FORECAST_PERIODS, "forecastPeriods"),
    scenarios: mapKeys(SCENARIO_KEYS, "scenarios"),
    goalPeriods: mapKeys(GOAL_PERIODS, "goalPeriods"),
    expansionTypes: mapKeys(EXPANSION_TYPES, "expansionTypes"),
    probabilities: {
      discovery: t(`${namespace}.probabilities.discovery`),
      demonstration: t(`${namespace}.probabilities.demonstration`),
      proposal: t(`${namespace}.probabilities.proposal`),
      negotiation: t(`${namespace}.probabilities.negotiation`),
      verbal_agreement: t(`${namespace}.probabilities.verbalAgreement`),
    },
    recommendations: {
      focus_renewals: t(`${namespace}.recommendations.focusRenewals`),
      pipeline_activity: t(`${namespace}.recommendations.pipelineActivity`),
      expansion_detected: t(`${namespace}.recommendations.expansionDetected`),
      retention_improvement: t(`${namespace}.recommendations.retentionImprovement`),
    },
    quickActions: {
      exportPdf: t(`${namespace}.quickActions.exportPdf`),
      exportExcel: t(`${namespace}.quickActions.exportExcel`),
      exportCsv: t(`${namespace}.quickActions.exportCsv`),
      regenerate: t(`${namespace}.quickActions.regenerate`),
    },
    youDecide: t(`${namespace}.youDecide`),
  };
}
