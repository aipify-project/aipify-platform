import { MemoryGraphPanel } from "@/components/app/memory-graph-operations";
import { buildMemoryGraphLabels } from "@/lib/customer-memory-graph-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MemoryGraphPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "memoryGraphOperations");
  const labels = buildMemoryGraphLabels(createTranslator(dict));
  return <MemoryGraphPanel backHref="/app" labels={labels} />;
}
