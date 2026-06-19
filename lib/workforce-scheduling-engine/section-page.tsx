import { WorkforceSchedulingPanel } from "@/components/app/workforce-scheduling";
import { buildWorkforceSchedulingLabels } from "@/lib/workforce-scheduling-engine/labels";
import type { Wfs608Section } from "@/lib/workforce-scheduling-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function WorkforceSchedulingSectionPage({ activeSection }: { activeSection: Wfs608Section }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "workforceScheduling");
  const t = createTranslator(dict);
  return <WorkforceSchedulingPanel labels={buildWorkforceSchedulingLabels(t)} activeSection={activeSection} />;
}
