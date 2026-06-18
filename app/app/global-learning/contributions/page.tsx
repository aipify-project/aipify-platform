import { GlobalLearningContributionsPanel } from "@/components/app/global-learning";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GlobalLearningContributionsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "globalLearning");
  const t = createTranslator(dict);
  const p = "customerApp.globalLearning";

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.contributionsTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.contributionsSubtitle`)}</p>
      </div>
      <GlobalLearningContributionsPanel
        labels={{
          loading: t(`${p}.loading`),
          back: t(`${p}.back`),
          mode: t(`${p}.mode`),
          signals: t(`${p}.signals`),
          noContributions: t(`${p}.noContributions`),
          transparencyNote: t(`${p}.transparencyNote`),
        }}
      />
    </div>
  );
}
