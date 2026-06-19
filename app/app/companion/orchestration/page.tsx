import { CompanionOrchestrationOperationsPanel } from "@/components/app/companion-orchestration-operations";
import { buildCompanionOrchestrationOperationsLabels } from "@/lib/customer-companion-orchestration-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionOrchestrationPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "companionOrchestrationOperations");
  return (
    <CompanionOrchestrationOperationsPanel
      backHref="/app/companion"
      labels={buildCompanionOrchestrationOperationsLabels(createTranslator(dict))}
    />
  );
}
