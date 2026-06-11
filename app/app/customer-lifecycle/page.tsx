import { CustomerLifecycleDashboardPanel } from "@/components/app/customer-lifecycle";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CustomerLifecyclePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.customerLifecycle";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CustomerLifecycleDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          successScore: t(`${p}.successScore`),
          currentStage: t(`${p}.currentStage`),
          generateBriefing: t(`${p}.generateBriefing`),
          lifecycleStages: t(`${p}.lifecycleStages`),
          scoreComponents: t(`${p}.scoreComponents`),
          quickWins: t(`${p}.quickWins`),
          milestones: t(`${p}.milestones`),
          positiveSignals: t(`${p}.positiveSignals`),
          riskSignals: t(`${p}.riskSignals`),
          recommendations: t(`${p}.recommendations`),
          noRecommendations: t(`${p}.noRecommendations`),
          accept: t(`${p}.accept`),
          dismiss: t(`${p}.dismiss`),
          playbooks: t(`${p}.playbooks`),
          briefings: t(`${p}.briefings`),
        }}
      />
    </div>
  );
}
