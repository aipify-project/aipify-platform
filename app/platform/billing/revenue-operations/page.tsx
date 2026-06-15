import { RevenueOperationsPanel } from "@/components/platform/revenue-operations";
import { buildRevenueOperationsLabels } from "@/lib/revenue-operations";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformRevenueOperationsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <RevenueOperationsPanel
      backHref="/platform/billing"
      labels={buildRevenueOperationsLabels(t)}
    />
  );
}
