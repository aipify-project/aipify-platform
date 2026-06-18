import { BusinessPackCommandCenterPanel } from "@/components/app/app-portal/BusinessPackCommandCenterPanel";
import { buildPackCommandLabels } from "@/lib/app-portal/business-pack-command-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessPackCommandCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <BusinessPackCommandCenterPanel labels={buildPackCommandLabels(t)} />
    </div>
  );
}
