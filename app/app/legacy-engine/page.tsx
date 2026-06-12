import { LegacyEngineDashboardPanel } from "@/components/app/legacy-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function LegacyEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
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
        }}
      />
    </div>
  );
}
