import PlatformMetricsPanel from "@/components/platform/PlatformMetricsPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformMetricsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <PlatformMetricsPanel
      labels={{
        title: t("platform.metrics.title"),
        subtitle: t("platform.metrics.subtitle"),
        loading: t("platform.metrics.loading"),
        empty: t("platform.metrics.empty"),
        currency: t("platform.metrics.currency"),
        seconds: t("platform.metrics.seconds"),
        percent: t("platform.metrics.percent"),
        pulseLabel: t("branding.pulseLabel"),
        executive: {
          title: t("platform.metrics.executive.title"),
          mrr: t("platform.metrics.executive.mrr"),
          mrrSubtitle: t("platform.metrics.executive.mrrSubtitle"),
          activeCustomers: t("platform.metrics.executive.activeCustomers"),
          activeSubtitle: t("platform.metrics.executive.activeSubtitle"),
          trialsEnding: t("platform.metrics.executive.trialsEnding"),
          trialsSubtitle: t("platform.metrics.executive.trialsSubtitle"),
          systemHealth: t("platform.metrics.executive.systemHealth"),
          healthHealthy: t("platform.metrics.executive.healthHealthy"),
          healthStable: t("platform.metrics.executive.healthStable"),
          healthAttention: t("platform.metrics.executive.healthAttention"),
          trendUp: t("platform.metrics.executive.trendUp"),
          trendFlat: t("platform.metrics.executive.trendFlat"),
          last30Days: t("platform.metrics.executive.last30Days"),
        },
        revenueGrowth: {
          title: t("platform.metrics.revenueGrowth.title"),
          mrrChart: t("platform.metrics.revenueGrowth.mrrChart"),
          mrrChartHint: t("platform.metrics.revenueGrowth.mrrChartHint"),
          customerGrowth: t("platform.metrics.revenueGrowth.customerGrowth"),
          customerGrowthHint: t("platform.metrics.revenueGrowth.customerGrowthHint"),
          trialConversion: t("platform.metrics.revenueGrowth.trialConversion"),
          trialConversionHint: t("platform.metrics.revenueGrowth.trialConversionHint"),
          monthLabels: [
            t("platform.metrics.revenueGrowth.monthLabels.0"),
            t("platform.metrics.revenueGrowth.monthLabels.1"),
            t("platform.metrics.revenueGrowth.monthLabels.2"),
            t("platform.metrics.revenueGrowth.monthLabels.3"),
            t("platform.metrics.revenueGrowth.monthLabels.4"),
            t("platform.metrics.revenueGrowth.monthLabels.5"),
          ],
        },
        customerInsights: {
          title: t("platform.metrics.customerInsights.title"),
          total: t("platform.metrics.customerInsights.total"),
          active: t("platform.metrics.customerInsights.active"),
          trial: t("platform.metrics.customerInsights.trial"),
          paused: t("platform.metrics.customerInsights.paused"),
          cancelled: t("platform.metrics.customerInsights.cancelled"),
          overdue: t("platform.metrics.customerInsights.overdue"),
        },
        operations: {
          title: t("platform.metrics.operations.title"),
          supportHandled: t("platform.metrics.operations.supportHandled"),
          automatedTasks: t("platform.metrics.operations.automatedTasks"),
          aiRecommendations: t("platform.metrics.operations.aiRecommendations"),
          avgResponseTime: t("platform.metrics.operations.avgResponseTime"),
        },
        installations: {
          title: t("platform.metrics.installations.title"),
          total: t("platform.metrics.installations.total"),
          active: t("platform.metrics.installations.active"),
          failed: t("platform.metrics.installations.failed"),
          average: t("platform.metrics.installations.average"),
          mostActive: t("platform.metrics.installations.mostActive"),
          mostActiveValue: t("platform.metrics.installations.mostActiveValue"),
        },
        recommendations: {
          title: t("platform.metrics.recommendations.title"),
          inactiveModules: t("platform.metrics.recommendations.inactiveModules"),
          trialsExpiring: t("platform.metrics.recommendations.trialsExpiring"),
          bestPlan: t("platform.metrics.recommendations.bestPlan"),
          supportAiImpact: t("platform.metrics.recommendations.supportAiImpact"),
        },
      }}
    />
  );
}
