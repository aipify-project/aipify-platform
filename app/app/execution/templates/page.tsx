import { ExecutionOperationsPanel } from "@/components/app/execution-operations";
import { buildExecutionOperationsLabels } from "@/lib/execution-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ExecutionTemplatesPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const labels = buildExecutionOperationsLabels(createTranslator(dict));
  return (
    <ExecutionOperationsPanel
      labels={labels}
      initialTab="overview"
      titleOverride={labels.templatesTitle}
      subtitleOverride={labels.templatesSubtitle}
      visibleTabs={["overview", "approvals", "reports", "executive"]}
    />
  );
}
