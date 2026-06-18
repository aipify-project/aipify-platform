import { CustomerPresenceCenterPanel } from "@/components/app/presence/CustomerPresenceCenterPanel";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PresencePage() {
  const locale = await getLocale();
  const dict = {
    ...(await getCustomerAppDictionaryForSplits(locale, ["dashboard"])),
    ...(await getDictionary(locale, ["branding"])),
  };
  const t = createTranslator(dict);
  const p = "customerApp.presence";

  return (
    <CustomerPresenceCenterPanel
      locale={locale}
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        empty: t(`${p}.empty`),
        pulseLabel: t("branding.pulseLabel"),
        statusTitle: t(`${p}.statusTitle`),
        statusActive: t(`${p}.statusActive`),
        statusDescription: t(`${p}.statusDescription`),
        lastUpdated: t(`${p}.lastUpdated`),
        lastUpdatedValue: t(`${p}.lastUpdatedValue`),
        metrics: {
          healthScore: t(`${p}.metrics.healthScore`),
          recommendations: t(`${p}.metrics.recommendations`),
          pendingActions: t(`${p}.metrics.pendingActions`),
          companionStatus: t(`${p}.metrics.companionStatus`),
        },
        companionActive: t(`${p}.companionActive`),
        sections: {
          briefing: t(`${p}.sections.briefing`),
          timeline: t(`${p}.sections.timeline`),
          feed: t(`${p}.sections.feed`),
        },
        noEvents: t(`${p}.noEvents`),
        executiveCenter: t(`${p}.executiveCenter`),
        desktopCompanion: t(`${p}.desktopCompanion`),
        categories: {
          support: t(`${p}.categories.support`),
          automation: t(`${p}.categories.automation`),
          approval: t(`${p}.categories.approval`),
          health: t(`${p}.categories.health`),
          update: t(`${p}.categories.update`),
          presence: t(`${p}.categories.presence`),
          skill: t(`${p}.categories.skill`),
        },
        greetings: {
          morning: t("customerApp.greetings.morning"),
          afternoon: t("customerApp.greetings.afternoon"),
          evening: t("customerApp.greetings.evening"),
          late: [
            t("customerApp.greetings.late.workingLate"),
            t("customerApp.greetings.late.onDuty"),
            t("customerApp.greetings.late.stable"),
          ],
        },
      }}
    />
  );
}
