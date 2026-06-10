import PlatformSelfHealingPanel from "@/components/platform/PlatformSelfHealingPanel";
import { buildIntelligencePresenceLabels } from "@/lib/platform/intelligence-presence-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IntelligenceSelfHealingPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform", "branding"]);
  const t = createTranslator(dict);

  return (
    <PlatformSelfHealingPanel
      locale={locale}
      labels={{
        title: t("platform.intelligence.selfHealing.title"),
        subtitle: t("platform.intelligence.selfHealing.subtitle"),
        loading: t("platform.intelligence.selfHealing.loading"),
        pulseLabel: t("branding.pulseLabel"),
        presence: buildIntelligencePresenceLabels(t, "selfHealing"),
        metrics: {
          attempts: t("platform.intelligence.selfHealing.metrics.attempts"),
          successful: t("platform.intelligence.selfHealing.metrics.successful"),
          failed: t("platform.intelligence.selfHealing.metrics.failed"),
          escalated: t("platform.intelligence.selfHealing.metrics.escalated"),
          avgResolution: t("platform.intelligence.selfHealing.metrics.avgResolution"),
          mostCommonIncident: t("platform.intelligence.selfHealing.metrics.mostCommonIncident"),
          topPattern: t("platform.intelligence.selfHealing.metrics.topPattern"),
        },
        strategies: {
          title: t("platform.intelligence.selfHealing.strategies.title"),
          autoExecute: t("platform.intelligence.selfHealing.strategies.autoExecute"),
          manualApproval: t("platform.intelligence.selfHealing.strategies.manualApproval"),
          locked: t("platform.intelligence.selfHealing.strategies.locked"),
          lastExecuted: t("platform.intelligence.selfHealing.strategies.lastExecuted"),
          successRate: t("platform.intelligence.selfHealing.strategies.successRate"),
          failureCount: t("platform.intelligence.selfHealing.strategies.failureCount"),
          avgResolution: t("platform.intelligence.selfHealing.strategies.avgResolution"),
          empty: t("platform.intelligence.selfHealing.strategies.empty"),
        },
        recentRuns: {
          title: t("platform.intelligence.selfHealing.recentRuns.title"),
          empty: t("platform.intelligence.selfHealing.recentRuns.empty"),
        },
        riskLevels: {
          low: t("platform.intelligence.selfHealing.riskLevels.low"),
          medium: t("platform.intelligence.selfHealing.riskLevels.medium"),
          high: t("platform.intelligence.selfHealing.riskLevels.high"),
          critical: t("platform.intelligence.selfHealing.riskLevels.critical"),
        },
      }}
    />
  );
}
