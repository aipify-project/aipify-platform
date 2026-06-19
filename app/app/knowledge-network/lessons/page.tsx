import { KnowledgeNetworkPanel } from "@/components/app/knowledge-network-operations";
import { buildKnowledgeNetworkLabels } from "@/lib/knowledge-network-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function KnowledgeNetworkLessonsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "knowledgeNetworkOperations");
  const labels = buildKnowledgeNetworkLabels(createTranslator(dict));

  return (
    <KnowledgeNetworkPanel
      backHref="/app/knowledge-network"
      initialTab="lessons_learned"
      visibleTabs={["overview", "lessons_learned", "knowledge_assets", "companion", "executive"]}
      titleOverride={labels.lessonsPage.title}
      subtitleOverride={labels.lessonsPage.subtitle}
      labels={labels}
    />
  );
}
