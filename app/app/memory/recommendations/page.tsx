import { MemoryRecommendationsPanel } from "@/components/app/memory";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MemoryRecommendationsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <MemoryRecommendationsPanel
      labels={{
        title: t("customerApp.memoryEngine.recommendationsTitle"),
        subtitle: t("customerApp.memoryEngine.recommendationsSubtitle"),
        loading: t("customerApp.memoryEngine.loading"),
        back: t("customerApp.memoryEngine.back"),
        empty: t("customerApp.memoryEngine.recommendationsEmpty"),
        open: t("customerApp.memoryEngine.open"),
        accept: t("customerApp.memoryEngine.accept"),
        dismiss: t("customerApp.memoryEngine.dismiss"),
      }}
    />
  );
}
