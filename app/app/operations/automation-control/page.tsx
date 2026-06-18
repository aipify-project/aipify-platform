import { AutomationControlCenterPanel } from "@/components/app/automation-control/AutomationControlCenterPanel";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AutomationControlCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["commandCenter"]);
  const t = createTranslator(dict);
  const p = "customerApp.automationControlCenter";

  return (
    <AutomationControlCenterPanel
      locale={locale}
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        operationsLink: t(`${p}.operationsLink`),
        adaptiveAutomationLink: t(`${p}.adaptiveAutomationLink`),
        sections: {
          executiveOverview: t(`${p}.sections.executiveOverview`),
          aipifyInsights: t(`${p}.sections.aipifyInsights`),
          businessAutomations: t(`${p}.sections.businessAutomations`),
          selfHealingCenter: t(`${p}.sections.selfHealingCenter`),
          activityFeed: t(`${p}.sections.activityFeed`),
          recommendations: t(`${p}.sections.recommendations`),
          analytics: t(`${p}.sections.analytics`),
        },
        metrics: {
          activeAutomations: t(`${p}.metrics.activeAutomations`),
          needsAttention: t(`${p}.metrics.needsAttention`),
          timeSaved: t(`${p}.metrics.timeSaved`),
          selfHealingSaved: t(`${p}.metrics.selfHealingSaved`),
          avgHealth: t(`${p}.metrics.avgHealth`),
          reviewsOverdue: t(`${p}.metrics.reviewsOverdue`),
        },
        classifications: {
          customer: t(`${p}.classifications.customer`),
          operations: t(`${p}.classifications.operations`),
          financial: t(`${p}.classifications.financial`),
          executive: t(`${p}.classifications.executive`),
          self_healing: t(`${p}.classifications.self_healing`),
        },
        healthBands: {
          excellent: t(`${p}.healthBands.excellent`),
          good: t(`${p}.healthBands.good`),
          attention_needed: t(`${p}.healthBands.attention_needed`),
          critical: t(`${p}.healthBands.critical`),
        },
        reviewStates: {
          recently_reviewed: t(`${p}.reviewStates.recently_reviewed`),
          review_recommended: t(`${p}.reviewStates.review_recommended`),
          review_overdue: t(`${p}.reviewStates.review_overdue`),
        },
        activityLevels: {
          informational: t(`${p}.activityLevels.informational`),
          success: t(`${p}.activityLevels.success`),
          warning: t(`${p}.activityLevels.warning`),
          critical: t(`${p}.activityLevels.critical`),
        },
        detail: {
          overview: t(`${p}.detail.overview`),
          performance: t(`${p}.detail.performance`),
          businessValue: t(`${p}.detail.businessValue`),
          explanation: t(`${p}.detail.explanation`),
          ownership: t(`${p}.detail.ownership`),
          timeline: t(`${p}.detail.timeline`),
          successRate: t(`${p}.detail.successRate`),
          executions: t(`${p}.detail.executions`),
          avgRuntime: t(`${p}.detail.avgRuntime`),
          failures: t(`${p}.detail.failures`),
          owner: t(`${p}.detail.owner`),
          department: t(`${p}.detail.department`),
          escalation: t(`${p}.detail.escalation`),
          approvalStatus: t(`${p}.detail.approvalStatus`),
          markReviewed: t(`${p}.detail.markReviewed`),
          close: t(`${p}.detail.close`),
          whatDoesThisDo: t(`${p}.detail.whatDoesThisDo`),
        },
        dismiss: t(`${p}.dismiss`),
        emptyRecommendations: t(`${p}.emptyRecommendations`),
        privacyNote: t(`${p}.privacyNote`),
        timeSavedEstimate: t(`${p}.timeSavedEstimate`),
        selfHealingEstimate: t(`${p}.selfHealingEstimate`),
      }}
    />
  );
}
