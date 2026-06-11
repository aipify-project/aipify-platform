import { EvolutionBoardPanel } from "@/components/app/global-learning";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EvolutionPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.evolution";

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <EvolutionBoardPanel
        labels={{
          loading: t(`${p}.loading`),
          back: t(`${p}.back`),
          trendSummaries: t(`${p}.trendSummaries`),
          proposals: t(`${p}.proposals`),
          noProposals: t(`${p}.noProposals`),
          signals: t(`${p}.signals`),
          expectedValue: t(`${p}.expectedValue`),
          confidence: t(`${p}.confidence`),
          recommendedAction: t(`${p}.recommendedAction`),
          yourFeedback: t(`${p}.yourFeedback`),
          approve: t(`${p}.approve`),
          reject: t(`${p}.reject`),
          snooze: t(`${p}.snooze`),
          requestInfo: t(`${p}.requestInfo`),
        }}
      />
    </div>
  );
}
