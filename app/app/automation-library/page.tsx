import { AutomationLibraryPanel } from "@/components/app/adaptive-automation/AutomationLibraryPanel";
import { AUTOMATION_RISK_LEVELS } from "@/lib/aipify/adaptive-automation";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AutomationLibraryPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const riskLevels = Object.fromEntries(
    AUTOMATION_RISK_LEVELS.map((r) => [r, t(`customerApp.automation.risk.${r}`)])
  );

  return (
    <AutomationLibraryPanel
      labels={{
        title: t("customerApp.automation.library.title"),
        subtitle: t("customerApp.automation.library.subtitle"),
        loading: t("customerApp.automation.library.loading"),
        back: t("customerApp.automation.library.back"),
        createFromTemplate: t("customerApp.automation.library.createFromTemplate"),
        empty: t("customerApp.automation.library.empty"),
        riskLevels,
        global: t("customerApp.automation.library.global"),
        tenant: t("customerApp.automation.library.tenant"),
      }}
    />
  );
}
