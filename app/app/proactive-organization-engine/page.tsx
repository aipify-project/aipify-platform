import { ProactiveOrganizationEngineDashboardPanel } from "@/components/app/proactive-organization-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ProactiveOrganizationEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "proactiveOrganizationEngine");
  const t = createTranslator(dict);
  const p = "customerApp.proactiveOrganizationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ProactiveOrganizationEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          proactiveScore: t(`${p}.proactiveScore`),
          humanGovernanceRequired: t(`${p}.humanGovernanceRequired`),
          careNotSurveillance: t(`${p}.careNotSurveillance`),
          signalsActive: t(`${p}.signalsActive`),
          supportOpportunitiesOpen: t(`${p}.supportOpportunitiesOpen`),
          recommendationsPending: t(`${p}.recommendationsPending`),
          pulseIndicators: t(`${p}.pulseIndicators`),
          philosophy: t(`${p}.philosophy`),
          distinctionNote: t(`${p}.distinctionNote`),
          proactiveCenter: t(`${p}.proactiveCenter`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          earlySignals: t(`${p}.earlySignals`),
          supportOpportunities: t(`${p}.supportOpportunities`),
          orgPulse: t(`${p}.orgPulse`),
          preventativeRecommendations: t(`${p}.preventativeRecommendations`),
          preventativeSupport: t(`${p}.preventativeSupport`),
          executiveAnticipation: t(`${p}.executiveAnticipation`),
          proactiveKnowledge: t(`${p}.proactiveKnowledge`),
          proactiveCompanion: t(`${p}.proactiveCompanion`),
          proactiveCompanionLink: t(`${p}.proactiveCompanionLink`),
          companionLimitations: t(`${p}.companionLimitations`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          securityRequirements: t(`${p}.securityRequirements`),
          crossLinks: t(`${p}.crossLinks`),
          privacyNote: t(`${p}.privacyNote`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
        }}
      />
    </div>
  );
}
