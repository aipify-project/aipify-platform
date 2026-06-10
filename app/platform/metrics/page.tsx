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
        days: t("platform.metrics.days"),
        percent: t("platform.metrics.percent"),
        none: t("platform.metrics.none"),
        sections: {
          revenue: t("platform.metrics.sections.revenue"),
          customers: t("platform.metrics.sections.customers"),
          installations: t("platform.metrics.sections.installations"),
          aiActivity: t("platform.metrics.sections.aiActivity"),
          growth: t("platform.metrics.sections.growth"),
        },
        metrics: {
          mrr: t("platform.metrics.cards.mrr"),
          arr: t("platform.metrics.cards.arr"),
          trialConversion: t("platform.metrics.cards.trialConversion"),
          outstanding: t("platform.metrics.cards.outstanding"),
          arpc: t("platform.metrics.cards.arpc"),
          totalCustomers: t("platform.metrics.cards.totalCustomers"),
          activeCustomers: t("platform.metrics.cards.activeCustomers"),
          trialCustomers: t("platform.metrics.cards.trialCustomers"),
          pausedCustomers: t("platform.metrics.cards.pausedCustomers"),
          cancelledCustomers: t("platform.metrics.cards.cancelledCustomers"),
          overdueCustomers: t("platform.metrics.cards.overdueCustomers"),
          totalInstallations: t("platform.metrics.cards.totalInstallations"),
          activeInstallations: t("platform.metrics.cards.activeInstallations"),
          failedInstallations: t("platform.metrics.cards.failedInstallations"),
          avgInstallations: t("platform.metrics.cards.avgInstallations"),
          supportHandled: t("platform.metrics.cards.supportHandled"),
          automatedTasks: t("platform.metrics.cards.automatedTasks"),
          aiRecommendations: t("platform.metrics.cards.aiRecommendations"),
          avgResponseTime: t("platform.metrics.cards.avgResponseTime"),
          newCustomers30d: t("platform.metrics.cards.newCustomers30d"),
          newInstallations30d: t("platform.metrics.cards.newInstallations30d"),
          mostUsedModules: t("platform.metrics.cards.mostUsedModules"),
          retentionRate: t("platform.metrics.cards.retentionRate"),
        },
        pulseLabel: t("branding.pulseLabel"),
      }}
    />
  );
}
