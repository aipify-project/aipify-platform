import { SkillHistoryPanel } from "@/components/app/skills";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SkillHistoryPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["marketplace"]);
  const t = createTranslator(dict);

  return (
    <SkillHistoryPanel
      locale={locale}
      labels={{
        title: t("customerApp.skillStore.historyTitle"),
        subtitle: t("customerApp.skillStore.historySubtitle"),
        loading: t("customerApp.skillStore.loading"),
        empty: t("customerApp.skillStore.historyEmpty"),
        back: t("customerApp.skillStore.back"),
      }}
    />
  );
}
