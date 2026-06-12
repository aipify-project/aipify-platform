import { CompanionBriefingPageIntro } from "@/components/app/briefing";
import { CustomerLifecycleDashboardPanel } from "@/components/app/customer-lifecycle";
import { buildCompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CustomerLifecyclePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.customerLifecycle";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <CompanionBriefingPageIntro
        title={t(`${p}.title`)}
        subtitle={t(`${p}.subtitle`)}
        context="customer_success"
        labels={buildCompanionBriefingLabels(t)}
      />
      <CustomerLifecycleDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          successScore: t(`${p}.successScore`),
          currentStage: t(`${p}.currentStage`),
          generateBriefing: t(`${p}.generateBriefing`),
          lifecycleStages: t(`${p}.lifecycleStages`),
          scoreComponents: t(`${p}.scoreComponents`),
          quickWins: t(`${p}.quickWins`),
          milestones: t(`${p}.milestones`),
          positiveSignals: t(`${p}.positiveSignals`),
          riskSignals: t(`${p}.riskSignals`),
          recommendations: t(`${p}.recommendations`),
          noRecommendations: t(`${p}.noRecommendations`),
          accept: t(`${p}.accept`),
          dismiss: t(`${p}.dismiss`),
          playbooks: t(`${p}.playbooks`),
          briefings: t(`${p}.briefings`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          customerJourneyStages: t(`${p}.customerJourneyStages`),
          journeyInsights: t(`${p}.journeyInsights`),
          customerExperienceDashboard: t(`${p}.customerExperienceDashboard`),
          onboardingIntelligence: t(`${p}.onboardingIntelligence`),
          adoptionIntelligence: t(`${p}.adoptionIntelligence`),
          companionGuidance: t(`${p}.companionGuidance`),
          notGenericAi: t(`${p}.notGenericAi`),
          privacyPrinciples: t(`${p}.privacyPrinciples`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
          customerSuccessEngine: t(`${p}.customerSuccessEngine`),
          customerOnboarding: t(`${p}.customerOnboarding`),
          growthPartners: t(`${p}.growthPartners`),
          meetingCompanion: t(`${p}.meetingCompanion`),
          valueRealization: t(`${p}.valueRealization`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          engagementMilestones: t(`${p}.engagementMilestones`),
          engagementQuickWins: t(`${p}.engagementQuickWins`),
          engagementRecommendations: t(`${p}.engagementRecommendations`),
          engagementOnboarding: t(`${p}.engagementOnboarding`),
        }}
      />
    </div>
  );
}
