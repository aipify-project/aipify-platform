import { AbsenceCoveragePanel } from "@/components/app/absence-coverage";
import { buildAbsenceCoverageLabels } from "@/lib/absence-coverage-engine/labels";
import type { Vac606Section } from "@/lib/absence-coverage-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function AbsenceCoverageSectionPage({ activeSection }: { activeSection: Vac606Section }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "absenceCoverage");
  const t = createTranslator(dict);
  return <AbsenceCoveragePanel labels={buildAbsenceCoverageLabels(t)} activeSection={activeSection} />;
}
