import { GlobalLearningDashboardPanel } from "@/components/app/global-learning";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GlobalLearningPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.globalLearning";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <GlobalLearningDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          settings: t(`${p}.settings`),
          contributions: t(`${p}.contributions`),
          evolutionBoard: t(`${p}.evolutionBoard`),
          participation: t(`${p}.participation`),
          defaultMode: t(`${p}.defaultMode`),
          anonymizedSignals: t(`${p}.anonymizedSignals`),
          pendingProposals: t(`${p}.pendingProposals`),
          intelligenceLevels: t(`${p}.intelligenceLevels`),
          local: t(`${p}.levelLocal`),
          organizational: t(`${p}.levelOrganizational`),
          global: t(`${p}.levelGlobal`),
          principle: t(`${p}.principle`),
        }}
      />
    </div>
  );
}
