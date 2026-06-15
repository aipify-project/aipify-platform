import { ProductRoadmapCenterPanel } from "@/components/platform/product-roadmap";
import { buildProductRoadmapCenterLabels } from "@/lib/product-roadmap";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformRoadmapCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <ProductRoadmapCenterPanel
      backHref="/platform/product/feedback-center"
      labels={buildProductRoadmapCenterLabels(t)}
    />
  );
}
