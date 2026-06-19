import { KnowledgeNetworkPanel } from "@/components/app/knowledge-network-operations";
import { buildKnowledgeNetworkLabels } from "@/lib/knowledge-network-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function KnowledgeNetworkPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "knowledgeNetworkOperations");
  return (
    <KnowledgeNetworkPanel
      backHref="/app"
      labels={buildKnowledgeNetworkLabels(createTranslator(dict))}
    />
  );
}
