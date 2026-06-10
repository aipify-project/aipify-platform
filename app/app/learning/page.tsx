import { LearningOverviewScaffold } from "@/components/app/install-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppLearningPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["dashboard"]);
  const t = createTranslator(dict);

  return (
    <LearningOverviewScaffold
      title={t("dashboard.installEngine.learning.title")}
      subtitle={t("dashboard.installEngine.learning.subtitle")}
      durationLabel={t("dashboard.installEngine.learning.duration")}
      areas={[
        t("dashboard.installEngine.learning.areas.observe"),
        t("dashboard.installEngine.learning.areas.evaluate"),
        t("dashboard.installEngine.learning.areas.improve"),
        t("dashboard.installEngine.learning.areas.supervised"),
      ]}
    />
  );
}
