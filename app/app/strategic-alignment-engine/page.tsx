import { StrategicAlignmentEngineDashboardPanel } from "@/components/app/strategic-alignment-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function StrategicAlignmentEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.strategicAlignmentEngine";
  const b = `${p}.blueprint.phase68`;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <StrategicAlignmentEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          objectives: t(`${p}.objectives`),
          snapshots: t(`${p}.snapshots`),
          executiveSummary: t(`${p}.executiveSummary`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          targetDate: t(`${p}.targetDate`),
          activate: t(`${p}.activate`),
          activating: t(`${p}.activating`),
          activateFailed: t(`${p}.activateFailed`),
          recordReview: t(`${p}.recordReview`),
          reviewing: t(`${p}.reviewing`),
          reviewFailed: t(`${p}.reviewFailed`),
          detectMisalignment: t(`${p}.detectMisalignment`),
          detecting: t(`${p}.detecting`),
          detectFailed: t(`${p}.detectFailed`),
          exportReport: t(`${p}.exportReport`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
          blueprintObjectives: t(`${b}.objectives`),
          alignmentQuestions: t(`${b}.alignmentQuestions`),
          strategicCascading: t(`${b}.strategicCascading`),
          crossFunctionalVisibility: t(`${b}.crossFunctionalVisibility`),
          companionGuidance: t(`${b}.companionGuidance`),
          goalCommunication: t(`${b}.goalCommunication`),
          selfLoveConnection: t(`${b}.selfLoveConnection`),
          leadershipInsights: t(`${b}.leadershipInsights`),
          trustConnection: t(`${b}.trustConnection`),
          dogfooding: t(`${b}.dogfooding`),
          engagementSummary: t(`${b}.engagementSummary`),
          activeObjectives: t(`${b}.activeObjectives`),
          linkedEntities: t(`${b}.linkedEntities`),
          reviewsRecorded: t(`${b}.reviewsRecorded`),
          latestMisaligned: t(`${b}.latestMisaligned`),
          successCriteria: t(`${b}.successCriteria`),
          criterionMet: t(`${b}.criterionMet`),
          criterionPending: t(`${b}.criterionPending`),
          visionPhrases: t(`${b}.visionPhrases`),
        }} />
    </div>
  );
}
