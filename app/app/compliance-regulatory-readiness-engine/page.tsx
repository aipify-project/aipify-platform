import { ComplianceRegulatoryReadinessEngineDashboardPanel } from "@/components/app/compliance-regulatory-readiness-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ComplianceRegulatoryReadinessEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "complianceRegulatoryReadinessEngine");
  const t = createTranslator(dict);
  const p = "customerApp.complianceRegulatoryReadinessEngine";
  const ph = `${p}.phase145`;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <ComplianceRegulatoryReadinessEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          legalDisclaimerTitle: t(`${ph}.legalDisclaimerTitle`),
          legalDisclaimerBody: t(`${ph}.legalDisclaimerBody`),
          objectives: t(`${ph}.objectives`),
          regulatoryIntelligence: t(`${ph}.regulatoryIntelligence`),
          policyManagement: t(`${ph}.policyManagement`),
          policyRegistry: t(`${ph}.policyRegistry`),
          reviewCycles: t(`${ph}.reviewCycles`),
          auditReadiness: t(`${ph}.auditReadiness`),
          complianceCompanion: t(`${ph}.complianceCompanion`),
          companionMustAvoid: t(`${ph}.companionMustAvoid`),
          securityRequirements: t(`${ph}.securityRequirements`),
          selfLove: t(`${ph}.selfLove`),
          companionLimitations: t(`${ph}.companionLimitations`),
          successCriteria: t(`${ph}.successCriteria`),
          criterionMet: t(`${ph}.criterionMet`),
          criterionPending: t(`${ph}.criterionPending`),
          visionPhrases: t(`${ph}.visionPhrases`),
          openRecords: t(`${ph}.openRecords`),
          activePolicies: t(`${ph}.activePolicies`),
          scheduledReviews: t(`${ph}.scheduledReviews`),
          pendingAttestations: t(`${ph}.pendingAttestations`),
          scheduleReview: t(`${ph}.scheduleReview`),
          scheduling: t(`${ph}.scheduling`),
          defaultReviewTitle: t(`${ph}.defaultReviewTitle`),
          noReviewCycles: t(`${ph}.noReviewCycles`),
          attest: t(`${ph}.attest`),
          declineAttestation: t(`${ph}.declineAttestation`),
          actionFailed: t(`${ph}.actionFailed`),
        }} />
    </div>
  );
}
