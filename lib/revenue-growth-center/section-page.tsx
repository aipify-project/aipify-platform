import { RevenueGrowthCenterPanel } from "@/components/app/revenue-growth-center";
import { buildRevenueGrowthCenterLabels } from "@/lib/revenue-growth-center/labels";
import type { RevenueGrowthSection } from "@/lib/revenue-growth-center";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function RevenueGrowthSectionPage({
  activeSection,
}: {
  activeSection: RevenueGrowthSection;
}) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "revenueGrowthCenter");
  const t = createTranslator(dict);
  const labels = buildRevenueGrowthCenterLabels(t);

  return <RevenueGrowthCenterPanel labels={labels} activeSection={activeSection} />;
}
