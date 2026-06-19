import { ServiceIntakePanel } from "@/components/app/service-intake";
import { buildServiceIntakeLabels } from "@/lib/service-intake-engine/labels";
import type { ServiceIntakeSection } from "@/lib/service-intake-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
export async function ServiceIntakeSectionPage({ activeSection }: { activeSection: ServiceIntakeSection }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "serviceIntake");
  const t = createTranslator(dict);
  return <ServiceIntakePanel labels={buildServiceIntakeLabels(t)} activeSection={activeSection} />;
}
