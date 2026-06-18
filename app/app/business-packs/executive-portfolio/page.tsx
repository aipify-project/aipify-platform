import { BusinessPackExecutivePortfolioPanel } from "@/components/app/app-portal/BusinessPackExecutivePortfolioPanel";
import { buildExecutivePortfolioLabels } from "@/lib/app-portal/business-pack-executive-portfolio";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BusinessPackExecutivePortfolioPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <BusinessPackExecutivePortfolioPanel labels={buildExecutivePortfolioLabels(t)} />
    </div>
  );
}
