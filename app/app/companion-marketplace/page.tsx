import {
  CompanionMarketplaceActionEcosystemPanel,
  CompanionMarketplaceDashboardPanel,
} from "@/components/app/companion-marketplace";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionMarketplacePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.companionMarketplace";
  const ae = "customerApp.companionMarketplaceAction";

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>

      <CompanionMarketplaceActionEcosystemPanel
        labels={{
          title: t(`${ae}.title`),
          subtitle: t(`${ae}.subtitle`),
          loading: t(`${ae}.loading`),
          corePrinciple: t(`${ae}.corePrinciple`),
          philosophyTitle: t(`${ae}.philosophyTitle`),
          expansionPrinciple: t(`${ae}.expansionPrinciple`),
          installedTitle: t(`${ae}.installedTitle`),
          recommendedTitle: t(`${ae}.recommendedTitle`),
          catalogTitle: t(`${ae}.catalogTitle`),
          governanceTitle: t(`${ae}.governanceTitle`),
          usageTitle: t(`${ae}.usageTitle`),
          installationFlowTitle: t(`${ae}.installationFlowTitle`),
          activate: t(`${ae}.activate`),
          deactivate: t(`${ae}.deactivate`),
          activated: t(`${ae}.activated`),
          packageRequired: t(`${ae}.packageRequired`),
          governanceLevel: t(`${ae}.governanceLevel`),
          provider: t(`${ae}.provider`),
          rating: t(`${ae}.rating`),
          pricing: t(`${ae}.pricing`),
          permissions: t(`${ae}.permissions`),
          noRecommendations: t(`${ae}.noRecommendations`),
          noInstalled: t(`${ae}.noInstalled`),
          privacyNote: t(`${ae}.privacyNote`),
          trustAdoptionLink: t(`${ae}.trustAdoptionLink`),
          approvalsLink: t(`${ae}.approvalsLink`),
          billingLink: t(`${ae}.billingLink`),
          categories: {
            personal_actions: t(`${ae}.categories.personal_actions`),
            business_actions: t(`${ae}.categories.business_actions`),
            commerce_actions: t(`${ae}.categories.commerce_actions`),
            companion_skills: t(`${ae}.categories.companion_skills`),
          },
          governanceLevels: {
            "1": t(`${ae}.governanceLevels.1`),
            "2": t(`${ae}.governanceLevels.2`),
            "3": t(`${ae}.governanceLevels.3`),
            "4": t(`${ae}.governanceLevels.4`),
          },
        }}
      />

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
