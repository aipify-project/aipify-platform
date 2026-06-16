import { ContinuityPanel } from "@/components/app/app-portal/ContinuityPanel";
import { buildContinuityLabels } from "@/lib/app-portal/continuity";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ContinuityPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <ContinuityPanel labels={buildContinuityLabels(t)} />
    </div>
  );
}
