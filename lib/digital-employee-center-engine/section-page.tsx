import { DigitalEmployeeCenterPanel } from "@/components/app/digital-employee-center";
import { buildDigitalEmployeeCenterLabels } from "@/lib/digital-employee-center-engine/labels";
import type { Dewf598Section } from "@/lib/digital-employee-center-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function DigitalEmployeeCenterSectionPage({ activeSection }: { activeSection: Dewf598Section }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "digitalEmployeeCenter");
  const t = createTranslator(dict);
  return <DigitalEmployeeCenterPanel labels={buildDigitalEmployeeCenterLabels(t)} activeSection={activeSection} />;
}
