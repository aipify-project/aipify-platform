import { StrategyDashboardPanel } from "@/components/app/strategy";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function StrategyPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "strategyEngine");
  const t = createTranslator(dict);
  const p = "customerApp.strategyEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
        <p className="mt-2 text-sm text-violet-700">{t(`${p}.philosophy`)}</p>
      </div>
      <StrategyDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          healthScore: t(`${p}.healthScore`),
          humanLeadership: t(`${p}.humanLeadership`),
          generateBriefing: t(`${p}.generateBriefing`),
          horizonsSection: t(`${p}.horizonsSection`),
          opportunitiesSection: t(`${p}.opportunitiesSection`),
          risksSection: t(`${p}.risksSection`),
          recommendationsSection: t(`${p}.recommendationsSection`),
          confidence: t(`${p}.confidence`),
          expectedBenefits: t(`${p}.expectedBenefits`),
          mitigation: t(`${p}.mitigation`),
          approve: t(`${p}.approve`),
          dismiss: t(`${p}.dismiss`),
          safetyNote: t(`${p}.safetyNote`),
        }}
      />
    </div>
  );
}
