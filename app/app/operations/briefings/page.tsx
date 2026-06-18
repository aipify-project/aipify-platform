import { IntelligenceBriefingsPanel } from "@/components/app/app-portal/IntelligenceBriefingsPanel";
import { buildIntelligenceBriefingsLabels } from "@/lib/app-portal/intelligence-briefings";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IntelligenceBriefingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <IntelligenceBriefingsPanel labels={buildIntelligenceBriefingsLabels(t)} />
    </div>
  );
}
