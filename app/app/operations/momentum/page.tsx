import { MomentumPanel } from "@/components/app/app-portal/MomentumPanel";
import { buildMomentumLabels } from "@/lib/app-portal/momentum";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MomentumPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <MomentumPanel labels={buildMomentumLabels(t)} />
    </div>
  );
}
