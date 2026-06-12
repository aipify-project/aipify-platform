import { InclusionHumanityEngineDashboardPanel } from "@/components/app/inclusion-humanity-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function InclusionHumanityEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.inclusionHumanityEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <InclusionHumanityEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          activePrinciples: t(`${p}.activePrinciples`),
          pendingReflections: t(`${p}.pendingReflections`),
          incidents30Days: t(`${p}.incidents30Days`),
          deEscalationEnabled: t(`${p}.deEscalationEnabled`),
          yes: t(`${p}.yes`),
          no: t(`${p}.no`),
          inclusionSettings: t(`${p}.inclusionSettings`),
          deEscalationToggle: t(`${p}.deEscalationToggle`),
          boundaryFirmness: t(`${p}.boundaryFirmness`),
          firmnessGentle: t(`${p}.firmnessGentle`),
          firmnessBalanced: t(`${p}.firmnessBalanced`),
          firmnessFirm: t(`${p}.firmnessFirm`),
          celebrateWins: t(`${p}.celebrateWins`),
          saveSettings: t(`${p}.saveSettings`),
          saving: t(`${p}.saving`),
          settingsFailed: t(`${p}.settingsFailed`),
          communicationPrinciples: t(`${p}.communicationPrinciples`),
          statedPrinciples: t(`${p}.statedPrinciples`),
          inappropriateBehavior: t(`${p}.inappropriateBehavior`),
          boundaryPrinciples: t(`${p}.boundaryPrinciples`),
          reflections: t(`${p}.reflections`),
          acknowledge: t(`${p}.acknowledge`),
          dismiss: t(`${p}.dismiss`),
          actionFailed: t(`${p}.actionFailed`),
          incidentsSummary: t(`${p}.incidentsSummary`),
          deEscalatedCount: t(`${p}.deEscalatedCount`),
          kcFaqTopics: t(`${p}.kcFaqTopics`),
          integrationLinks: t(`${p}.integrationLinks`),
          exportReport: t(`${p}.exportReport`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
        }}
      />
    </div>
  );
}
