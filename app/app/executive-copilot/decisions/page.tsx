import { ExecutiveCopilotPanel } from "@/components/app/executive-copilot-operations";
import { buildExecutiveCopilotLabels } from "@/lib/customer-executive-copilot-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ExecutiveCopilotDecisionsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "executiveCopilotOperations");
  const labels = buildExecutiveCopilotLabels(createTranslator(dict));
  return (
    <ExecutiveCopilotPanel
      backHref="/app/executive-copilot"
      initialTab="decisions"
      visibleTabs={["decisions", "approvals", "recommendations", "strategy", "overview"]}
      titleOverride={labels.decisionsTitle}
      labels={labels}
    />
  );
}
