import { CustomerPresenceCenterPanel } from "@/components/app/presence/CustomerPresenceCenterPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PresencePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp", "branding"]);
  const t = createTranslator(dict);

  return (
    <CustomerPresenceCenterPanel
      locale={locale}
      labels={{
        title: t("customerApp.presence.title"),
        subtitle: t("customerApp.presence.subtitle"),
        loading: t("customerApp.presence.loading"),
        empty: t("customerApp.presence.empty"),
        pulseLabel: t("branding.pulseLabel"),
        sections: {
          briefing: t("customerApp.presence.sections.briefing"),
          timeline: t("customerApp.presence.sections.timeline"),
          feed: t("customerApp.presence.sections.feed"),
        },
        noEvents: t("customerApp.presence.noEvents"),
        commandCenter: t("customerApp.presence.commandCenter"),
        categories: {
          support: t("customerApp.presence.categories.support"),
          automation: t("customerApp.presence.categories.automation"),
          approval: t("customerApp.presence.categories.approval"),
          health: t("customerApp.presence.categories.health"),
          update: t("customerApp.presence.categories.update"),
          presence: t("customerApp.presence.categories.presence"),
          skill: t("customerApp.presence.categories.skill"),
        },
      }}
    />
  );
}
