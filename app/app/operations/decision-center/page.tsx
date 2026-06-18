import { DecisionCenterPanel } from "@/components/app/app-portal/DecisionCenterPanel";
import { buildDecisionCenterLabels } from "@/lib/app-portal/decision-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DecisionCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <DecisionCenterPanel labels={buildDecisionCenterLabels(t)} />
    </div>
  );
}
