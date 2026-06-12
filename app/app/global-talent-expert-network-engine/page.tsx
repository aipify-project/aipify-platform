import { GlobalTalentExpertNetworkEngineDashboardPanel } from "@/components/app/global-talent-expert-network-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GlobalTalentExpertNetworkEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.globalTalentExpertNetworkEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <GlobalTalentExpertNetworkEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          networkScore: t(`${p}.networkScore`),
          distinctionNote: t(`${p}.distinctionNote`),
          discoveryMaturityLevel: t(`${p}.discoveryMaturityLevel`),
          profilesCount: t(`${p}.profilesCount`),
          activeProfiles: t(`${p}.activeProfiles`),
          activeEngagements: t(`${p}.activeEngagements`),
          optInRequired: t(`${p}.optInRequired`),
          executiveApprovalRequired: t(`${p}.executiveApprovalRequired`),
          procurementDisclaimer: t(`${p}.procurementDisclaimer`),
          globalExpertNetworkCenter: t(`${p}.globalExpertNetworkCenter`),
          expertDiscovery: t(`${p}.expertDiscovery`),
          executiveAdvisoryNetwork: t(`${p}.executiveAdvisoryNetwork`),
          growthPartnerMatching: t(`${p}.growthPartnerMatching`),
          specialistCollaboration: t(`${p}.specialistCollaboration`),
          professionalProfileEngine: t(`${p}.professionalProfileEngine`),
          talentCompanion: t(`${p}.talentCompanion`),
          professionalContributions: t(`${p}.professionalContributions`),
          expertProfiles: t(`${p}.expertProfiles`),
          expertEngagements: t(`${p}.expertEngagements`),
          contributionsList: t(`${p}.contributionsList`),
          crossLinks: t(`${p}.crossLinks`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          companionLimitations: t(`${p}.companionLimitations`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
        }}
      />
    </div>
  );
}
