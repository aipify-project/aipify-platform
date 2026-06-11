import { AiEthicsResponsibleUseEngineDashboardPanel } from "@/components/app/ai-ethics-responsible-use-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AiEthicsResponsibleUseEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.aiEthicsResponsibleUseEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AiEthicsResponsibleUseEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          explainabilityRequirements: t(`${p}.explainabilityRequirements`),
          prohibitedExamples: t(`${p}.prohibitedExamples`),
          approvedUseCases: t(`${p}.approvedUseCases`),
          proposedUseCases: t(`${p}.proposedUseCases`),
          restrictedUseCases: t(`${p}.restrictedUseCases`),
          reviewSchedules: t(`${p}.reviewSchedules`),
          oversightTrends: t(`${p}.oversightTrends`),
          integrationNotes: t(`${p}.integrationNotes`),
          approve: t(`${p}.approve`),
          restrict: t(`${p}.restrict`),
          actionFailed: t(`${p}.actionFailed`),
          criticalNote: t(`${p}.criticalNote`),
        }} />
    </div>
  );
}
