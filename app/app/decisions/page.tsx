import { DecisionMemoryPanel } from "@/components/app/decision-memory-operations";
import { buildDecisionMemoryLabels } from "@/lib/customer-decision-memory-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DecisionsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "decisionMemoryOperations");
  const labels = buildDecisionMemoryLabels(createTranslator(dict));
  return <DecisionMemoryPanel backHref="/app" labels={labels} />;
}
