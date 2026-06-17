import { IntelligenceCommandCenterPanel } from "@/components/app/app-portal/IntelligenceCommandCenterPanel";
import { buildICCLabels } from "@/lib/app-portal/intelligence-command-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IntelligenceCommandCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <IntelligenceCommandCenterPanel labels={buildICCLabels(t)} />
    </div>
  );
}
