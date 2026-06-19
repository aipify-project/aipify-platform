import { ClientRelationshipPanel } from "@/components/app/client-relationship";
import { buildClientRelationshipLabels } from "@/lib/client-relationship-engine/labels";
import type { Crm611Section } from "@/lib/client-relationship-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function ClientRelationshipSectionPage({
  activeSection,
}: {
  activeSection: Crm611Section;
}) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "clientRelationships");
  const t = createTranslator(dict);
  return <ClientRelationshipPanel labels={buildClientRelationshipLabels(t)} activeSection={activeSection} />;
}
