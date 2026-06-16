import { PrioritizationEnginePanel } from "@/components/app/app-portal/PrioritizationEnginePanel";
import { buildPrioritizationEngineLabels } from "@/lib/app-portal/prioritization-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PrioritizationEnginePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <PrioritizationEnginePanel labels={buildPrioritizationEngineLabels(t)} />
    </div>
  );
}
