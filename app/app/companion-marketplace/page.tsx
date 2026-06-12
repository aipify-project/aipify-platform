import { CompanionMarketplaceDashboardPanel } from "@/components/app/companion-marketplace";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionMarketplacePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.companionMarketplace";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CompanionMarketplaceDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          marketplaceScore: t(`${p}.marketplaceScore`),
          humanApprovalRequired: t(`${p}.humanApprovalRequired`),
          activeDeployments: t(`${p}.activeDeployments`),
          catalogItems: t(`${p}.catalogItems`),
          userSatisfaction: t(`${p}.userSatisfaction`),
          policyCompliance: t(`${p}.policyCompliance`),
          marketplaceCategories: t(`${p}.marketplaceCategories`),
          companionDirectory: t(`${p}.companionDirectory`),
          deploymentFlow: t(`${p}.deploymentFlow`),
          governanceLayers: t(`${p}.governanceLayers`),
          healthMetrics: t(`${p}.healthMetrics`),
          recommendationQuality: t(`${p}.recommendationQuality`),
          escalationFrequency: t(`${p}.escalationFrequency`),
          responseAccuracy: t(`${p}.responseAccuracy`),
          adoptionRate: t(`${p}.adoptionRate`),
          workflowEfficiency: t(`${p}.workflowEfficiency`),
          knowledgeUtilization: t(`${p}.knowledgeUtilization`),
          enterpriseCenter: t(`${p}.enterpriseCenter`),
          enterpriseCenterNote: t(`${p}.enterpriseCenterNote`),
          twoFactorLink: t(`${p}.twoFactorLink`),
          companionAdaptation: t(`${p}.companionAdaptation`),
          crossLinks: t(`${p}.crossLinks`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          limitationPrinciples: t(`${p}.limitationPrinciples`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
        }}
      />
    </div>
  );
}
