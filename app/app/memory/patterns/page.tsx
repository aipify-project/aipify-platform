import { MemoryPatternsPanel } from "@/components/app/memory";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MemoryPatternsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);

  return (
    <MemoryPatternsPanel
      labels={{
        title: t("customerApp.memoryEngine.patternsTitle"),
        subtitle: t("customerApp.memoryEngine.patternsSubtitle"),
        loading: t("customerApp.memoryEngine.loading"),
        back: t("customerApp.memoryEngine.back"),
        empty: t("customerApp.memoryEngine.patternsEmpty"),
        explanation: t("customerApp.memoryEngine.explanation"),
      }}
    />
  );
}
