import { SocialImpactPurposeDashboardPanel } from "@/components/app/social-impact-purpose-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SocialImpactPurposeEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "socialImpactPurpose");
  const t = createTranslator(dict);
  const p = "customerApp.socialImpactPurpose";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <SocialImpactPurposeDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          purposeCenter: t(`${p}.purposeCenter`),
          humanOversightRequired: t(`${p}.humanOversightRequired`),
          activeInitiatives: t(`${p}.activeInitiatives`),
          activeCommitments: t(`${p}.activeCommitments`),
          totalParticipation: t(`${p}.totalParticipation`),
          impactIndicators: t(`${p}.impactIndicators`),
          purposeCenterComponents: t(`${p}.purposeCenterComponents`),
          socialImpactInitiatives: t(`${p}.socialImpactInitiatives`),
          initiativeTypes: t(`${p}.initiativeTypes`),
          strategicCommitments: t(`${p}.strategicCommitments`),
          employeeWellbeing: t(`${p}.employeeWellbeing`),
          purposeAlignment: t(`${p}.purposeAlignment`),
          impactTracking: t(`${p}.impactTracking`),
          growthPartnerParticipation: t(`${p}.growthPartnerParticipation`),
          communityImpactPrograms: t(`${p}.communityImpactPrograms`),
          executivePurposeDashboard: t(`${p}.executivePurposeDashboard`),
          selfLoveInOrganizations: t(`${p}.selfLoveInOrganizations`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          companionAdaptation: t(`${p}.companionAdaptation`),
          limitationPrinciples: t(`${p}.limitationPrinciples`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
          purposeValuesEngine: t(`${p}.purposeValuesEngine`),
          impactEngine: t(`${p}.impactEngine`),
          selfLoveEngine: t(`${p}.selfLoveEngine`),
          gratitudeRecognitionEngine: t(`${p}.gratitudeRecognitionEngine`),
          community: t(`${p}.community`),
          growthPartnerOperations: t(`${p}.growthPartnerOperations`),
          inclusionHumanityEngine: t(`${p}.inclusionHumanityEngine`),
          aiEthicsEngine: t(`${p}.aiEthicsEngine`),
          globalKnowledgeExchangeEngine: t(`${p}.globalKnowledgeExchangeEngine`),
          innovationImpactEngine: t(`${p}.innovationImpactEngine`),
          ecosystemGovernance: t(`${p}.ecosystemGovernance`),
          organizationalHealthEngine: t(`${p}.organizationalHealthEngine`),
          phase149BlueprintTitle: t(`${p}.phase149.blueprintTitle`),
          communityInitiatives: t(`${p}.phase149.communityInitiatives`),
          wellbeingPrograms: t(`${p}.phase149.wellbeingPrograms`),
          impactReports: t(`${p}.phase149.impactReports`),
          executiveReviews: t(`${p}.phase149.executiveReviews`),
          globalImpactCenter: t(`${p}.phase149.globalImpactCenter`),
          socialResponsibilityEngine: t(`${p}.phase149.socialResponsibilityEngine`),
          communityImpactEngine: t(`${p}.phase149.communityImpactEngine`),
          impactReportingEngine: t(`${p}.phase149.impactReportingEngine`),
          growthPartnerImpactProgram: t(`${p}.phase149.growthPartnerImpactProgram`),
          executiveImpactReviews: t(`${p}.phase149.executiveImpactReviews`),
          executiveReviewRecords: t(`${p}.phase149.executiveReviewRecords`),
          phase149Objectives: t(`${p}.phase149.objectives`),
          impactCompanion: t(`${p}.phase149.impactCompanion`),
          selfLoveConnection: t(`${p}.phase149.selfLoveConnection`),
          securityRequirements: t(`${p}.phase149.securityRequirements`),
          companionLimitations: t(`${p}.phase149.companionLimitations`),
          phase149SuccessCriteria: t(`${p}.phase149.successCriteria`),
          visionPhrases: t(`${p}.phase149.visionPhrases`),
        }}
      />
    </div>
  );
}
