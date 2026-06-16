import { ResiliencePanel } from "@/components/app/app-portal/ResiliencePanel";
import { buildResilienceLabels } from "@/lib/app-portal/resilience";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ResiliencePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <ResiliencePanel labels={buildResilienceLabels(t)} />
    </div>
  );
}
