import { KnowledgeGraphPanel } from "@/components/app/knowledge-graph-operations";
import { buildKnowledgeGraphLabels } from "@/lib/knowledge-graph-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function KnowledgeGraphPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildKnowledgeGraphLabels(t);
  return <KnowledgeGraphPanel labels={labels} />;
}
