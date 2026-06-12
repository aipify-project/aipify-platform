import { DigitalTwinDashboardPanel } from "@/components/app/digital-twin";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DigitalTwinPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.digitalTwin";
  const bp = `${p}.blueprint.phase77`;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
        <p className="mt-2 text-sm text-slate-600">{t(`${p}.philosophy`)}</p>
      </div>
      <DigitalTwinDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          twinHealth: t(`${p}.twinHealth`),
          processCoverage: t(`${p}.processCoverage`),
          knowledgeOwners: t(`${p}.knowledgeOwners`),
          lowConfidence: t(`${p}.lowConfidence`),
          roles: t(`${p}.roles`),
          rolesSection: t(`${p}.rolesSection`),
          processesSection: t(`${p}.processesSection`),
          knowledgeRouting: t(`${p}.knowledgeRouting`),
          insightsSection: t(`${p}.insightsSection`),
          reviewRecommended: t(`${p}.reviewRecommended`),
          integrations: t(`${p}.integrations`),
          safetyNote: t(`${p}.safetyNote`),
          blueprintSection: t(`${bp}.sectionTitle`),
          objectives: t(`${bp}.objectives`),
          twinDefinition: t(`${bp}.twinDefinition`),
          organizationalMapping: t(`${bp}.organizationalMapping`),
          companionObservations: t(`${bp}.companionObservations`),
          simulationConnection: t(`${bp}.simulationConnection`),
          openSimulations: t(`${bp}.openSimulations`),
          learningConnection: t(`${bp}.learningConnection`),
          selfLoveConnection: t(`${bp}.selfLoveConnection`),
          leadershipInsights: t(`${bp}.leadershipInsights`),
          privacyPrinciples: t(`${bp}.privacyPrinciples`),
          successCriteria: t(`${bp}.successCriteria`),
          visionPhrases: t(`${bp}.visionPhrases`),
          activeRoles: t(`${bp}.activeRoles`),
          activeProcesses: t(`${bp}.activeProcesses`),
          openInsights: t(`${bp}.openInsights`),
          criterionMet: t(`${bp}.criterionMet`),
          criterionPending: t(`${bp}.criterionPending`),
        }}
      />
    </div>
  );
}
