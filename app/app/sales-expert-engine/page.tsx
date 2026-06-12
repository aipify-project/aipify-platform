import {
  SalesExpertEngineDashboardPanel,
  SalesExpertPortalNoticePanel,
} from "@/components/app/sales-expert-engine";
import { buildSalesExpertPortalLabels } from "@/lib/aipify/sales-expert-engine/faq-sections";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SalesExpertEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.salesExpertEngine";

  const labels = buildSalesExpertPortalLabels(t, p);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <SalesExpertPortalNoticePanel labels={labels} />
      <SalesExpertEngineDashboardPanel labels={labels} />
    </div>
  );
}
