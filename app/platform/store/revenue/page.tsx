import { PlatformAppStoreRevenuePanel } from "@/components/platform/app-store/PlatformAppStoreRevenuePanel";
import { buildPlatformAppStoreRevenueLabels } from "@/lib/app-store/labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformAppStoreRevenuePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformAppStoreRevenueLabels(t);

  return <PlatformAppStoreRevenuePanel labels={labels} />;
}
