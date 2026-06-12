import { SupplierIntelligenceDashboardPanel } from "@/components/app/supplier-intelligence";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SupplierIntelligencePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.supplierIntelligence";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <SupplierIntelligenceDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          portfolioHealth: t(`${p}.portfolioHealth`),
          activeSuppliers: t(`${p}.activeSuppliers`),
          openRisks: t(`${p}.openRisks`),
          generateBriefing: t(`${p}.generateBriefing`),
          diversificationAlerts: t(`${p}.diversificationAlerts`),
          opportunityInsights: t(`${p}.opportunityInsights`),
          relationshipRecords: t(`${p}.relationshipRecords`),
          recommendationsPending: t(`${p}.recommendationsPending`),
          healthScores: t(`${p}.healthScores`),
          deliveryReliability: t(`${p}.deliveryReliability`),
          marginPerformance: t(`${p}.marginPerformance`),
          riskEvents: t(`${p}.riskEvents`),
          affectedProducts: t(`${p}.affectedProducts`),
          recommendationsCenter: t(`${p}.recommendationsCenter`),
          recentBriefings: t(`${p}.recentBriefings`),
          dropshippingOperations: t(`${p}.dropshippingOperations`),
          commerceIntelligence: t(`${p}.commerceIntelligence`),
          commercePerformance: t(`${p}.commercePerformance`),
          multiStore: t(`${p}.multiStore`),
          meetingCompanion: t(`${p}.meetingCompanion`),
          integrationEngine: t(`${p}.integrationEngine`),
          approvals: t(`${p}.approvals`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          scoreComponents: t(`${p}.scoreComponents`),
          companionGuidance: t(`${p}.companionGuidance`),
          limitationPrinciples: t(`${p}.limitationPrinciples`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
        }}
      />
    </div>
  );
}
