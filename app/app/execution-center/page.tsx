import { ExecutionOutcomePanel } from "@/components/app/execution-outcome-operations";
import { buildExecutionOutcomeLabels } from "@/lib/customer-execution-outcome-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ExecutionCenterPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "executionOutcomeOperations");
  const labels = buildExecutionOutcomeLabels(createTranslator(dict));
  return <ExecutionOutcomePanel backHref="/app" labels={labels} />;
}
