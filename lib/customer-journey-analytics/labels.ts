import type { Translator } from "@/lib/i18n/translate";
import {
  COMPANY_SIZES,
  CUSTOMER_SEGMENTS,
  DROP_OFF_TYPES,
  EXPORT_FORMATS,
  INDUSTRIES,
  JOURNEY_STAGES,
  PLAN_TYPES,
  RECOMMENDATION_TYPES,
  TRENDS,
} from "./constants";
import type { CustomerJourneyAnalyticsLabels } from "./types";

export function buildCustomerJourneyAnalyticsLabels(t: Translator): CustomerJourneyAnalyticsLabels {
  const p = "platform.customerJourneyAnalytics";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    emptyState: t(`${p}.emptyState`),
    sections: {
      overview: t(`${p}.sections.overview`),
      funnel: t(`${p}.sections.funnel`),
      dropOffs: t(`${p}.sections.dropOffs`),
      journeys: t(`${p}.sections.journeys`),
      timeline: t(`${p}.sections.timeline`),
      commonPaths: t(`${p}.sections.commonPaths`),
      recommendations: t(`${p}.sections.recommendations`),
      audit: t(`${p}.sections.audit`),
      filters: t(`${p}.sections.filters`),
      exports: t(`${p}.sections.exports`),
    },
    overview: {
      newRegistrations: t(`${p}.overview.newRegistrations`),
      onboardingCompletionRate: t(`${p}.overview.onboardingCompletionRate`),
      trialConversionRate: t(`${p}.overview.trialConversionRate`),
      timeToFirstValue: t(`${p}.overview.timeToFirstValue`),
      expansionRate: t(`${p}.overview.expansionRate`),
      dropOffRate: t(`${p}.overview.dropOffRate`),
      days: t(`${p}.overview.days`),
    },
    funnel: {
      from: t(`${p}.funnel.from`),
      to: t(`${p}.funnel.to`),
      entered: t(`${p}.funnel.entered`),
      converted: t(`${p}.funnel.converted`),
      conversionRate: t(`${p}.funnel.conversionRate`),
    },
    table: {
      company: t(`${p}.table.company`),
      currentStage: t(`${p}.table.currentStage`),
      trend: t(`${p}.table.trend`),
      lastActivity: t(`${p}.table.lastActivity`),
      subscriptionPlan: t(`${p}.table.subscriptionPlan`),
      country: t(`${p}.table.country`),
      milestones: t(`${p}.table.milestones`),
      customer: t(`${p}.table.customer`),
      dropOffType: t(`${p}.table.dropOffType`),
      stage: t(`${p}.table.stage`),
      message: t(`${p}.table.message`),
      path: t(`${p}.table.path`),
      conversionRate: t(`${p}.table.conversionRate`),
      customers: t(`${p}.table.customers`),
      abandonmentPoint: t(`${p}.table.abandonmentPoint`),
      completedAt: t(`${p}.table.completedAt`),
      delayDays: t(`${p}.table.delayDays`),
      supportInteraction: t(`${p}.table.supportInteraction`),
      impactScore: t(`${p}.table.impactScore`),
    },
    stages: Object.fromEntries(
      JOURNEY_STAGES.map((stage) => [stage, t(`${p}.stages.${stage}`)])
    ) as CustomerJourneyAnalyticsLabels["stages"],
    dropOffTypes: Object.fromEntries(
      DROP_OFF_TYPES.map((type) => [type, t(`${p}.dropOffTypes.${type}`)])
    ) as CustomerJourneyAnalyticsLabels["dropOffTypes"],
    recommendationTypes: Object.fromEntries(
      RECOMMENDATION_TYPES.map((type) => [type, t(`${p}.recommendationTypes.${type}`)])
    ) as CustomerJourneyAnalyticsLabels["recommendationTypes"],
    trends: Object.fromEntries(
      TRENDS.map((trend) => [trend, t(`${p}.trends.${trend}`)])
    ) as CustomerJourneyAnalyticsLabels["trends"],
    filters: {
      country: t(`${p}.filters.country`),
      industry: t(`${p}.filters.industry`),
      companySize: t(`${p}.filters.companySize`),
      plan: t(`${p}.filters.plan`),
      customerSegment: t(`${p}.filters.customerSegment`),
      allCountries: t(`${p}.filters.allCountries`),
      allIndustries: t(`${p}.filters.allIndustries`),
      allSizes: t(`${p}.filters.allSizes`),
      allPlans: t(`${p}.filters.allPlans`),
      allSegments: t(`${p}.filters.allSegments`),
      apply: t(`${p}.filters.apply`),
      viewTimeline: t(`${p}.filters.viewTimeline`),
      clearTimeline: t(`${p}.filters.clearTimeline`),
    },
    plans: Object.fromEntries(
      PLAN_TYPES.map((plan) => [plan, t(`${p}.plans.${plan}`)])
    ) as CustomerJourneyAnalyticsLabels["plans"],
    companySizes: Object.fromEntries(
      COMPANY_SIZES.map((size) => [size, t(`${p}.companySizes.${size}`)])
    ) as CustomerJourneyAnalyticsLabels["companySizes"],
    segments: Object.fromEntries(
      CUSTOMER_SEGMENTS.map((segment) => [segment, t(`${p}.segments.${segment}`)])
    ) as CustomerJourneyAnalyticsLabels["segments"],
    industries: Object.fromEntries(
      INDUSTRIES.map((industry) => [industry, t(`${p}.industries.${industry}`)])
    ) as CustomerJourneyAnalyticsLabels["industries"],
    actions: {
      accept: t(`${p}.actions.accept`),
      dismiss: t(`${p}.actions.dismiss`),
      resolve: t(`${p}.actions.resolve`),
      recalculate: t(`${p}.actions.recalculate`),
      applying: t(`${p}.actions.applying`),
      viewJourney: t(`${p}.actions.viewJourney`),
    },
    exports: {
      csv: t(`${p}.exports.csv`),
      excel: t(`${p}.exports.excel`),
      pdf: t(`${p}.exports.pdf`),
      exporting: t(`${p}.exports.exporting`),
    },
    exportFormats: Object.fromEntries(
      EXPORT_FORMATS.map((format) => [format, t(`${p}.exportFormats.${format}`)])
    ) as CustomerJourneyAnalyticsLabels["exportFormats"],
  };
}
