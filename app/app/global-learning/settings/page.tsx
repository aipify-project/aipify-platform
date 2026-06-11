import { GlobalLearningSettingsPanel } from "@/components/app/global-learning";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GlobalLearningSettingsPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.globalLearning";

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.settingsTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.settingsSubtitle`)}</p>
      </div>
      <GlobalLearningSettingsPanel
        labels={{
          loading: t(`${p}.loading`),
          back: t(`${p}.back`),
          participationMode: t(`${p}.participationMode`),
          learningCategories: t(`${p}.learningCategories`),
          saved: t(`${p}.saved`),
          safetyNote: t(`${p}.safetyNote`),
          mode_none: t(`${p}.modeNone`),
          mode_anonymous_insights: t(`${p}.modeAnonymous`),
          mode_extended: t(`${p}.modeExtended`),
        }}
      />
    </div>
  );
}
