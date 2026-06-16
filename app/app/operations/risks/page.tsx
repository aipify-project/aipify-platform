import { RisksPanel } from "@/components/app/app-portal/RisksPanel";
import { buildRisksLabels } from "@/lib/app-portal/risks";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function RisksPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <RisksPanel labels={buildRisksLabels(t)} />
    </div>
  );
}
