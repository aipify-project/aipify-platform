import { OutcomesDashboardPanel } from "@/components/app/outcomes";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OutcomesPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.outcomesEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <OutcomesDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          successScore: t(`${p}.successScore`),
          totalValue: t(`${p}.totalValue`),
          generateBriefing: t(`${p}.generateBriefing`),
          scoreComponents: t(`${p}.scoreComponents`),
          openHypotheses: t(`${p}.openHypotheses`),
          noHypotheses: t(`${p}.noHypotheses`),
          validationWindow: t(`${p}.validationWindow`),
          markValidated: t(`${p}.markValidated`),
          markPartial: t(`${p}.markPartial`),
          markFailed: t(`${p}.markFailed`),
          validatedInitiatives: t(`${p}.validatedInitiatives`),
          failedInitiatives: t(`${p}.failedInitiatives`),
          lessonsLearned: t(`${p}.lessonsLearned`),
          roiSummaries: t(`${p}.roiSummaries`),
          initiative: t(`${p}.initiative`),
          estimatedRoi: t(`${p}.estimatedRoi`),
          actualRoi: t(`${p}.actualRoi`),
          variance: t(`${p}.variance`),
          kpiFramework: t(`${p}.kpiFramework`),
          briefings: t(`${p}.briefings`),
          none: t(`${p}.none`),
        }}
      />
    </div>
  );
}
