import { TrustReputationEngineDashboardPanel } from "@/components/app/trust-reputation-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function TrustReputationEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.trustReputationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <TrustReputationEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          activeProfiles: t(`${p}.activeProfiles`),
          trustedProfiles: t(`${p}.trustedProfiles`),
          underReviewProfiles: t(`${p}.underReviewProfiles`),
          avgTrustScore: t(`${p}.avgTrustScore`),
          recentSignals: t(`${p}.recentSignals`),
          entityTypes: t(`${p}.entityTypes`),
          trustTrends: t(`${p}.trustTrends`),
          trustedWorkflows: t(`${p}.trustedWorkflows`),
          approvalQuality: t(`${p}.approvalQuality`),
          reputationIndicators: t(`${p}.reputationIndicators`),
          trustProfiles: t(`${p}.trustProfiles`),
          trustLevel: t(`${p}.trustLevel`),
          trustScore: t(`${p}.trustScore`),
          status: t(`${p}.status`),
          avgScore: t(`${p}.avgScore`),
          profileCount: t(`${p}.profileCount`),
          trustedCount: t(`${p}.trustedCount`),
          avgValue: t(`${p}.avgValue`),
          signalCount: t(`${p}.signalCount`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          exportManifest: t(`${p}.exportManifest`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
          revokeTrust: t(`${p}.revokeTrust`),
          revokeDefaultReason: t(`${p}.revokeDefaultReason`),
          approveExpansion: t(`${p}.approveExpansion`),
          rejectExpansion: t(`${p}.rejectExpansion`),
          actionFailed: t(`${p}.actionFailed`),
          engagementSummary: t(`${p}.engagementSummary`),
          outcomesTotal: t(`${p}.outcomesTotal`),
          signalsLast90d: t(`${p}.signalsLast90d`),
          relationshipObjectives: t(`${p}.relationshipObjectives`),
          relationshipPrinciples: t(`${p}.relationshipPrinciples`),
          examplePhrases: t(`${p}.examplePhrases`),
          companionExamples: t(`${p}.companionExamples`),
          trustSignals: t(`${p}.trustSignals`),
          blueprintBoundaries: t(`${p}.blueprintBoundaries`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          successCriteria: t(`${p}.successCriteria`),
        }} />
    </div>
  );
}
