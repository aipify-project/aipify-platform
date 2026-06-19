import { KnowledgeFabricCenterPanel } from "@/components/app/knowledge-fabric-center";
import { buildKnowledgeFabricCenterLabels } from "@/lib/knowledge-fabric-center-engine/labels";
import type { Kftw597Section } from "@/lib/knowledge-fabric-center-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function KnowledgeFabricCenterSectionPage({ activeSection }: { activeSection: Kftw597Section }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "knowledgeFabricCenter");
  const t = createTranslator(dict);
  return <KnowledgeFabricCenterPanel labels={buildKnowledgeFabricCenterLabels(t)} activeSection={activeSection} />;
}
