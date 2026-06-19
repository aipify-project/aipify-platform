import { MemoryPreferencesPanel } from "@/components/app/memory";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/** Legacy memory preferences — moved from /app/memory/preferences (Phase 594). */
export default async function LegacyMemoryPreferencesPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);

  return (
    <MemoryPreferencesPanel
      labels={{
        title: t("customerApp.memoryEngine.preferencesTitle"),
        subtitle: t("customerApp.memoryEngine.preferencesSubtitle"),
        loading: t("customerApp.memoryEngine.loading"),
        back: t("customerApp.memoryEngine.back"),
        empty: t("customerApp.memoryEngine.preferencesEmpty"),
        delete: t("customerApp.memoryEngine.delete"),
      }}
    />
  );
}
