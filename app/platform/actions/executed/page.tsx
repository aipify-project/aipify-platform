import PlatformActionsListPanel from "@/components/platform/PlatformActionsListPanel";
import { buildActionListPanelLabels } from "@/lib/platform/action-page-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ActionsExecutedPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformActionsListPanel
      locale={locale}
      statusFilter="executed"
      showActions
      labels={buildActionListPanelLabels(t, "executed")}
    />
  );
}
