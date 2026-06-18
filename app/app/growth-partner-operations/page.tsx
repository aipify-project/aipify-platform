import { GrowthPartnerOperationsDashboardPanel } from "@/components/app/growth-partner-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GrowthPartnerOperationsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "growthPartnerOperations");
  const t = createTranslator(dict);
  const p = "customerApp.growthPartnerOperations";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <GrowthPartnerOperationsDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          partnerHealthScore: t(`${p}.partnerHealthScore`),
          humanOversightRequired: t(`${p}.humanOversightRequired`),
          activeCustomers: t(`${p}.activeCustomers`),
          upcomingRenewals: t(`${p}.upcomingRenewals`),
          implementationsInProgress: t(`${p}.implementationsInProgress`),
          openRenewalItems: t(`${p}.openRenewalItems`),
          operationsCenterModules: t(`${p}.operationsCenterModules`),
          customerPortfolio: t(`${p}.customerPortfolio`),
          healthScore: t(`${p}.healthScore`),
          trainingProgress: t(`${p}.trainingProgress`),
          companionsDeployed: t(`${p}.companionsDeployed`),
          implementationCenter: t(`${p}.implementationCenter`),
          implementationProgress: t(`${p}.implementationProgress`),
          progress: t(`${p}.progress`),
          trainingAcademy: t(`${p}.trainingAcademy`),
          certificationFramework: t(`${p}.certificationFramework`),
          renewalCenter: t(`${p}.renewalCenter`),
          partnerHealthScores: t(`${p}.partnerHealthScores`),
          customerRetention: t(`${p}.customerRetention`),
          implementationSuccess: t(`${p}.implementationSuccess`),
          trainingEffectiveness: t(`${p}.trainingEffectiveness`),
          governanceCompliance: t(`${p}.governanceCompliance`),
          partnerGrowth: t(`${p}.partnerGrowth`),
          partnerInsights: t(`${p}.partnerInsights`),
          companionAdaptation: t(`${p}.companionAdaptation`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          limitationPrinciples: t(`${p}.limitationPrinciples`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
          partnerCertification: t(`${p}.partnerCertification`),
          partnerSuccessEngine: t(`${p}.partnerSuccessEngine`),
          companionMarketplace: t(`${p}.companionMarketplace`),
          marketplace: t(`${p}.marketplace`),
          learningTrainingEngine: t(`${p}.learningTrainingEngine`),
          twoFactorSettings: t(`${p}.twoFactorSettings`),
        }}
      />
    </div>
  );
}
