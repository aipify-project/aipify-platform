import { SystemHealthPanel } from "@/components/app/system-health";
import { buildSystemHealthLabels } from "@/lib/reliability-operations-engine/labels";
import type { Rel604CustomerSection } from "@/lib/reliability-operations-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function SystemHealthSectionPage({ activeSection }: { activeSection: Rel604CustomerSection }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "systemHealth");
  const t = createTranslator(dict);
  return <SystemHealthPanel labels={buildSystemHealthLabels(t)} activeSection={activeSection} />;
}
