import { BusinessPackEcosystemIntelligencePanel } from "@/components/app/app-portal/BusinessPackEcosystemIntelligencePanel";
import { buildEcosystemLabels } from "@/lib/app-portal/business-pack-ecosystem-intelligence";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessPackEcosystemIntelligencePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <BusinessPackEcosystemIntelligencePanel labels={buildEcosystemLabels(t)} />
    </div>
  );
}
