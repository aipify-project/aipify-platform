import { AipifyInstallEngineDashboardPanel } from "@/components/app/aipify-install-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyInstallEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "aipifyInstallEngine");
  const t = createTranslator(dict);
  const p = "customerApp.aipifyInstallEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyInstallEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          installEngine: t(`${p}.installEngine`),
          installWizard: t(`${p}.installWizard`),
          onboarding: t(`${p}.onboarding`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          completion: t(`${p}.completion`),
          currentStep: t(`${p}.currentStep`),
          discoveries: t(`${p}.discoveries`),
          pendingPermissions: t(`${p}.pendingPermissions`),
          installActions: t(`${p}.installActions`),
          startInstall: t(`${p}.startInstall`),
          advanceStep: t(`${p}.advanceStep`),
          runDiscovery: t(`${p}.runDiscovery`),
          approvePermissions: t(`${p}.approvePermissions`),
          acceptRecommendations: t(`${p}.acceptRecommendations`),
          completeInstall: t(`${p}.completeInstall`),
          status: t(`${p}.status`),
          discoveryResults: t(`${p}.discoveryResults`),
          noDiscoveries: t(`${p}.noDiscoveries`),
          permissionReviews: t(`${p}.permissionReviews`),
          noPermissions: t(`${p}.noPermissions`),
          recommendations: t(`${p}.recommendations`),
          noRecommendations: t(`${p}.noRecommendations`),
          principles: t(`${p}.principles`),
          adoptionJourney: t(`${p}.adoptionJourney`),
          supportedPlatforms: t(`${p}.supportedPlatforms`),
          planned: t(`${p}.planned`),
          successCriteria: t(`${p}.successCriteria`),
          trustConnection: t(`${p}.trustConnection`),
          integrationLinks: t(`${p}.integrationLinks`),
          discoveryObjectives: t(`${p}.discoveryObjectives`),
          supportedEnvironments: t(`${p}.supportedEnvironments`),
          discoveryCapabilities: t(`${p}.discoveryCapabilities`),
          recommendationExperiences: t(`${p}.recommendationExperiences`),
          humanApproval: t(`${p}.humanApproval`),
          blueprintSuccessCriteria: t(`${p}.blueprintSuccessCriteria`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          trustConnectionBlueprint: t(`${p}.trustConnectionBlueprint`),
          engagementSummary: t(`${p}.engagementSummary`),
        }}
      />
    </div>
  );
}
