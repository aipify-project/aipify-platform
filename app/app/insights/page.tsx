import { IntelligenceInsightsPanel } from "@/components/app/organizational-intelligence/IntelligenceInsightsPanel";
import { INSIGHT_SEVERITIES, INSIGHT_TYPES } from "@/lib/aipify/organizational-intelligence";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function InsightsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);

  const severities = Object.fromEntries(
    INSIGHT_SEVERITIES.map((s) => [s, t(`customerApp.insights.severities.${s}`)])
  );
  const insightTypes = Object.fromEntries(
    INSIGHT_TYPES.map((type) => [type, t(`customerApp.insights.types.${type}`)])
  );
  const healthBands = {
    healthy: t("customerApp.insights.healthBands.healthy"),
    good: t("customerApp.insights.healthBands.good"),
    needs_attention: t("customerApp.insights.healthBands.needs_attention"),
    risky: t("customerApp.insights.healthBands.risky"),
    critical: t("customerApp.insights.healthBands.critical"),
  };

  return (
    <IntelligenceInsightsPanel
      labels={{
        title: t("customerApp.insights.title"),
        subtitle: t("customerApp.insights.subtitle"),
        loading: t("customerApp.insights.loading"),
        back: t("customerApp.insights.back"),
        privacy: t("customerApp.insights.privacy"),
        upgradeTitle: t("customerApp.insights.upgrade.title"),
        upgradeBody: t("customerApp.insights.upgrade.body"),
        upgradeCta: t("customerApp.insights.upgrade.cta"),
        refresh: t("customerApp.insights.refresh"),
        notEnabledTitle: t("customerApp.insights.notEnabled.title"),
        notEnabledBody: t("customerApp.insights.notEnabled.body"),
        enableCta: t("customerApp.insights.notEnabled.cta"),
        healthScore: t("customerApp.insights.healthScore"),
        strongestArea: t("customerApp.insights.strongestArea"),
        weakestArea: t("customerApp.insights.weakestArea"),
        openRisks: t("customerApp.insights.openRisks"),
        recommendedActions: t("customerApp.insights.recommendedActions"),
        noInsights: t("customerApp.insights.noInsights"),
        healthBands,
        severities,
        insightTypes,
        actions: {
          acknowledge: t("customerApp.insights.actions.acknowledge"),
          resolve: t("customerApp.insights.actions.resolve"),
          dismiss: t("customerApp.insights.actions.dismiss"),
          snooze: t("customerApp.insights.actions.snooze"),
        },
        links: {
          organization: t("customerApp.insights.links.organization"),
          workflows: t("customerApp.insights.links.workflows"),
          settings: t("customerApp.insights.links.settings"),
        },
      }}
    />
  );
}
