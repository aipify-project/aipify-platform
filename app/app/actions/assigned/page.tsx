import { ActionHubQueuePanel } from "@/components/app/action-hub";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ActionsAssignedPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <ActionHubQueuePanel
      mode="assigned"
      labels={{
        inboxTitle: t("customerApp.actionHub.inboxTitle"),
        assignedTitle: t("customerApp.actionHub.assignedTitle"),
        recommendedTitle: t("customerApp.actionHub.recommendedTitle"),
        completedTitle: t("customerApp.actionHub.completedTitle"),
        loading: t("customerApp.actionHub.loading"),
        empty: t("customerApp.actionHub.assignedEmpty"),
        back: t("customerApp.actionHub.back"),
        start: t("customerApp.actionHub.start"),
        complete: t("customerApp.actionHub.complete"),
        dismiss: t("customerApp.actionHub.dismiss"),
        goToSource: t("customerApp.actionHub.goToSource"),
      }}
    />
  );
}
