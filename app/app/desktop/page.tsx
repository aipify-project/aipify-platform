import { DesktopCompanionBlueprintPanel, DesktopCompanionPanel } from "@/components/app/desktop";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DesktopPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <div className="space-y-8">
      <DesktopCompanionPanel
        labels={{
          title: t("customerApp.desktop.title"),
          subtitle: t("customerApp.desktop.subtitle"),
          loading: t("customerApp.desktop.loading"),
          empty: t("customerApp.desktop.empty"),
          summary: t("customerApp.desktop.summary"),
          notifications: t("customerApp.desktop.notifications"),
          noNotifications: t("customerApp.desktop.noNotifications"),
          refresh: t("customerApp.desktop.refresh"),
          settings: t("customerApp.desktop.settings"),
          modes: t("customerApp.desktop.modes"),
          history: t("customerApp.desktop.history"),
          reminders: t("customerApp.desktop.remindersTitle"),
          mode: t("customerApp.desktop.mode"),
          unread: t("customerApp.desktop.unread"),
          open: t("customerApp.desktop.open"),
          dismiss: t("customerApp.desktop.dismiss"),
          privacy: t("customerApp.desktop.privacy"),
          back: t("customerApp.desktop.back"),
          historyTitle: t("customerApp.desktop.historyTitle"),
          chat: {
            title: t("customerApp.desktop.chat.title"),
            hint: t("customerApp.desktop.chat.hint"),
            empty: t("customerApp.desktop.chat.empty"),
            placeholder: t("customerApp.desktop.chat.placeholder"),
            send: t("customerApp.desktop.chat.send"),
            openLink: t("customerApp.desktop.chat.openLink"),
            disabled: t("customerApp.desktop.chat.disabled"),
          },
        }}
      />
      <div className="mx-auto max-w-6xl px-6 pb-8">
        <DesktopCompanionBlueprintPanel
          labels={{
            loading: t("customerApp.desktop.blueprint.loading"),
            engineTitle: t("customerApp.desktop.blueprint.engineTitle"),
            mission: t("customerApp.desktop.blueprint.mission"),
            philosophy: t("customerApp.desktop.blueprint.philosophy"),
            abosPrinciple: t("customerApp.desktop.blueprint.abosPrinciple"),
            distinctionNote: t("customerApp.desktop.blueprint.distinctionNote"),
            companionExperiences: t("customerApp.desktop.blueprint.companionExperiences"),
            miniPanel: t("customerApp.desktop.blueprint.miniPanel"),
            successCriteria: t("customerApp.desktop.blueprint.successCriteria"),
            selfLove: t("customerApp.desktop.blueprint.selfLove"),
            trust: t("customerApp.desktop.blueprint.trust"),
            configuration: t("customerApp.desktop.blueprint.configuration"),
            sinceLastTime: t("customerApp.desktop.blueprint.sinceLastTime"),
            integrationLinks: t("customerApp.desktop.blueprint.integrationLinks"),
            visionPhrases: t("customerApp.desktop.blueprint.visionPhrases"),
            engagement: t("customerApp.desktop.blueprint.engagement"),
            open: t("customerApp.desktop.blueprint.open"),
            met: t("customerApp.desktop.blueprint.met"),
            notMet: t("customerApp.desktop.blueprint.notMet"),
            sinceSource: t("customerApp.desktop.blueprint.sinceSource"),
            noSinceLastTime: t("customerApp.desktop.blueprint.noSinceLastTime"),
          }}
        />
      </div>
    </div>
  );
}
