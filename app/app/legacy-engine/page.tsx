import { LegacyEngineDashboardPanel } from "@/components/app/legacy-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function LegacyEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "legacyEngine");
  const t = createTranslator(dict);
  const p = "customerApp.legacyEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <LegacyEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          storyCount: t(`${p}.storyCount`),
          milestoneCount: t(`${p}.milestoneCount`),
          uncelebratedMilestones: t(`${p}.uncelebratedMilestones`),
          celebrateMilestones: t(`${p}.celebrateMilestones`),
          yes: t(`${p}.yes`),
          no: t(`${p}.no`),
          legacyDimensions: t(`${p}.legacyDimensions`),
          storytellingExamples: t(`${p}.storytellingExamples`),
          recentStories: t(`${p}.recentStories`),
          recentMilestones: t(`${p}.recentMilestones`),
          milestoneExamples: t(`${p}.milestoneExamples`),
          celebrated: t(`${p}.celebrated`),
          acknowledgeMilestone: t(`${p}.acknowledgeMilestone`),
          acknowledging: t(`${p}.acknowledging`),
          acknowledgeFailed: t(`${p}.acknowledgeFailed`),
          selfLoveNote: t(`${p}.selfLoveNote`),
          trustNote: t(`${p}.trustNote`),
          legacySettings: t(`${p}.legacySettings`),
          celebrateMilestonesToggle: t(`${p}.celebrateMilestonesToggle`),
          preserveStoriesToggle: t(`${p}.preserveStoriesToggle`),
          saveSettings: t(`${p}.saveSettings`),
          saving: t(`${p}.saving`),
          settingsFailed: t(`${p}.settingsFailed`),
          integrationLinks: t(`${p}.integrationLinks`),
          exportReport: t(`${p}.exportReport`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
          blueprintPhase83Title: t(`${p}.blueprint.phase83.title`),
          blueprintDistinctionNote: t(`${p}.blueprint.phase83.distinctionNote`),
          blueprintEngagementSummary: t(`${p}.blueprint.phase83.engagementSummary`),
          blueprintObjectives: t(`${p}.blueprint.phase83.objectives`),
          blueprintStewardshipQuestions: t(`${p}.blueprint.phase83.stewardshipQuestions`),
          blueprintSustainableGrowth: t(`${p}.blueprint.phase83.sustainableGrowth`),
          blueprintLegacyAwareness: t(`${p}.blueprint.phase83.legacyAwareness`),
          blueprintCompanionGuidance: t(`${p}.blueprint.phase83.companionGuidance`),
          blueprintLeadershipInsights: t(`${p}.blueprint.phase83.leadershipInsights`),
          blueprintSelfLoveConnection: t(`${p}.blueprint.phase83.selfLoveConnection`),
          blueprintTrustConnection: t(`${p}.blueprint.phase83.trustConnection`),
          blueprintSuccessCriteria: t(`${p}.blueprint.phase83.successCriteria`),
          blueprintVisionPhrases: t(`${p}.blueprint.phase83.visionPhrases`),
          blueprintIntegrationLinks: t(`${p}.blueprint.phase83.integrationLinks`),
          criterionMet: t(`${p}.blueprint.phase83.criterionMet`),
          criterionPending: t(`${p}.blueprint.phase83.criterionPending`),
        }}
      />
    </div>
  );
}
