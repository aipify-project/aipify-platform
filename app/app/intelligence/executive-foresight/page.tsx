import { ExecutiveForesightPanel } from "@/components/app/app-portal/ExecutiveForesightPanel";
import { buildExecutiveForesightLabels } from "@/lib/app-portal/executive-foresight";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ExecutiveForesightPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <ExecutiveForesightPanel labels={buildExecutiveForesightLabels(t)} />
    </div>
  );
}
