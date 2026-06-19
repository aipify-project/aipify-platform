import { AutomationOperationsPanel } from "@/components/app/automation-operations";
import { buildAutomationOperationsLabels } from "@/lib/automation-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AutomationTemplatesPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildAutomationOperationsLabels(t);

  return (
    <AutomationOperationsPanel
      labels={labels}
      initialTab="templates"
      titleOverride={labels.templatesTitle}
      visibleTabs={["overview", "templates", "workflows", "conditions", "reports"]}
    />
  );
}
