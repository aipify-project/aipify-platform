import { KnowledgeEvolutionEnginePanel } from "@/components/app/knowledge-evolution-engine";
import { buildKnowledgeEvolutionEngineLabels } from "@/lib/knowledge-evolution-engine/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function KnowledgeEvolutionPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "knowledgeEvolutionEngine");
  const t = createTranslator(dict);
  const labels = buildKnowledgeEvolutionEngineLabels(t);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <KnowledgeEvolutionEnginePanel labels={labels} />
    </div>
  );
}
