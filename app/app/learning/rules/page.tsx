import { LearningEngineRulesPanel } from "@/components/app/learning-engine";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function LearningRulesPage() {
  const dict = await getCustomerAppDictionaryForSplits(await getLocale(), ["dashboard"]);
  const t = createTranslator(dict);

  return (
    <LearningEngineRulesPanel
      labels={{
        title: t("customerApp.learningEngine.rulesTitle"),
        subtitle: t("customerApp.learningEngine.rulesSubtitle"),
        loading: t("customerApp.learningEngine.loading"),
        empty: t("customerApp.learningEngine.rulesEmpty"),
        back: t("customerApp.learningEngine.back"),
        active: t("customerApp.learningEngine.active"),
        inactive: t("customerApp.learningEngine.inactive"),
      }}
    />
  );
}
