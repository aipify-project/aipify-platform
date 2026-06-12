import { InnovationLabDashboardPanel } from "@/components/app/innovation-lab";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function InnovationLabPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.innovationLab";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <InnovationLabDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          innovationScore: t(`${p}.innovationScore`),
          generateBriefing: t(`${p}.generateBriefing`),
          activeExperiments: t(`${p}.activeExperiments`),
          ideasInPipeline: t(`${p}.ideasInPipeline`),
          returnOnInnovation: t(`${p}.returnOnInnovation`),
          experimentCompletion: t(`${p}.experimentCompletion`),
          labStructure: t(`${p}.labStructure`),
          ideaPipeline: t(`${p}.ideaPipeline`),
          risk: t(`${p}.risk`),
          value: t(`${p}.value`),
          alignment: t(`${p}.alignment`),
          approveIdea: t(`${p}.approveIdea`),
          experiments: t(`${p}.experiments`),
          stage: t(`${p}.stage`),
          participants: t(`${p}.participants`),
          advanceExperiment: t(`${p}.advanceExperiment`),
          pilotPrograms: t(`${p}.pilotPrograms`),
          featureFlags: t(`${p}.featureFlags`),
          exposure: t(`${p}.exposure`),
          innovationScorecard: t(`${p}.innovationScorecard`),
          satisfactionImpact: t(`${p}.satisfactionImpact`),
          adoptionPotential: t(`${p}.adoptionPotential`),
          businessValue: t(`${p}.businessValue`),
          lessonsLearned: t(`${p}.lessonsLearned`),
          sandboxEnvironment: t(`${p}.sandboxEnvironment`),
          governanceControls: t(`${p}.governanceControls`),
          recentBriefings: t(`${p}.recentBriefings`),
          governance: t(`${p}.governance`),
          simulationLab: t(`${p}.simulationLab`),
          academy: t(`${p}.academy`),
          knowledgeCenter: t(`${p}.knowledgeCenter`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          blueprintPhase38: t(`${p}.blueprintPhase38`),
          engagementSummary: t(`${p}.engagementSummary`),
          ideasTotal: t(`${p}.ideasTotal`),
          experimentsTotal: t(`${p}.experimentsTotal`),
          experimentsActive: t(`${p}.experimentsActive`),
          pilotsTotal: t(`${p}.pilotsTotal`),
          lessonsTotal: t(`${p}.lessonsTotal`),
          featureFlagsControlled: t(`${p}.featureFlagsControlled`),
          innovationObjectives: t(`${p}.innovationObjectives`),
          ideaManagement: t(`${p}.ideaManagement`),
          experimentationPrinciples: t(`${p}.experimentationPrinciples`),
          companionInnovationSupport: t(`${p}.companionInnovationSupport`),
          learningCapture: t(`${p}.learningCapture`),
          openOrganizationalMemory: t(`${p}.openOrganizationalMemory`),
          organizationalMemory: t(`${p}.organizationalMemory`),
          recognitionExperiences: t(`${p}.recognitionExperiences`),
          openGratitudeRecognition: t(`${p}.openGratitudeRecognition`),
          successCriteria: t(`${p}.successCriteria`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          openSelfLove: t(`${p}.openSelfLove`),
          trustConnection: t(`${p}.trustConnection`),
          openGovernance: t(`${p}.openGovernance`),
          dogfooding: t(`${p}.dogfooding`),
          aipifyGroup: t(`${p}.aipifyGroup`),
          unonightPilot: t(`${p}.unonightPilot`),
          visionPhrases: t(`${p}.visionPhrases`),
        }}
      />
    </div>
  );
}
