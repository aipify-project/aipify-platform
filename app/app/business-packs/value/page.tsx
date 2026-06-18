import { BusinessPackValuePanel } from "@/components/app/app-portal/BusinessPackValuePanel";
import { buildPackValueLabels } from "@/lib/app-portal/business-pack-value";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessPackValuePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <BusinessPackValuePanel labels={buildPackValueLabels(t)} />
    </div>
  );
}
