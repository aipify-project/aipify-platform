import { KnowledgeNetworkPanel } from "@/components/app/knowledge-network-operations";
import { buildKnowledgeNetworkLabels } from "@/lib/knowledge-network-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function KnowledgeNetworkExperiencePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "knowledgeNetworkOperations");
  const labels = buildKnowledgeNetworkLabels(createTranslator(dict));

  return (
    <KnowledgeNetworkPanel
      backHref="/app/knowledge-network"
      initialTab="experience"
      visibleTabs={["overview", "experience", "best_practices", "playbooks", "companion"]}
      titleOverride={labels.experiencePage.title}
      subtitleOverride={labels.experiencePage.subtitle}
      labels={labels}
    />
  );
}
