import { KnowledgeEvolutionCenterPanel } from "@/components/platform/platform-knowledge-evolution";
import { buildKnowledgeEvolutionCenterLabels } from "@/lib/platform-knowledge-evolution";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformKnowledgeEvolutionCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <KnowledgeEvolutionCenterPanel
      backHref="/platform"
      labels={buildKnowledgeEvolutionCenterLabels(t)}
    />
  );
}
