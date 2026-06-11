import { ActionHubPanel } from "@/components/app/action-hub";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ActionsHubPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <ActionHubPanel
      labels={{
        title: t("customerApp.actionHub.title"),
        subtitle: t("customerApp.actionHub.subtitle"),
        loading: t("customerApp.actionHub.loading"),
        empty: t("customerApp.actionHub.empty"),
        myActions: t("customerApp.actionHub.myActions"),
        teamActions: t("customerApp.actionHub.teamActions"),
        recommended: t("customerApp.actionHub.recommended"),
        critical: t("customerApp.actionHub.critical"),
        blocked: t("customerApp.actionHub.blocked"),
        completed: t("customerApp.actionHub.completed"),
        sectionEmpty: t("customerApp.actionHub.sectionEmpty"),
        inbox: t("customerApp.actionHub.inbox"),
        recommendedLink: t("customerApp.actionHub.recommendedLink"),
        completedLink: t("customerApp.actionHub.completedLink"),
        settings: t("customerApp.actionHub.settingsLink"),
        refresh: t("customerApp.actionHub.refresh"),
        privacy: t("customerApp.actionHub.privacy"),
        start: t("customerApp.actionHub.start"),
        complete: t("customerApp.actionHub.complete"),
        dismiss: t("customerApp.actionHub.dismiss"),
        goToSource: t("customerApp.actionHub.goToSource"),
      }}
    />
  );
}
