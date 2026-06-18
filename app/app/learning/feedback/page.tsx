import { LearningEngineEventsPanel } from "@/components/app/learning-engine";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function LearningFeedbackPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);

  return (
    <LearningEngineEventsPanel
      locale={locale}
      labels={{
        title: t("customerApp.learningEngine.feedbackTitle"),
        loading: t("customerApp.learningEngine.loading"),
        empty: t("customerApp.learningEngine.feedbackEmpty"),
        back: t("customerApp.learningEngine.back"),
      }}
    />
  );
}
