import { EcosystemGovernanceDashboardPanel } from "@/components/app/ecosystem-governance";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EcosystemGovernancePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.ecosystemGovernance";
  const p146 = `${p}.phase146`;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <EcosystemGovernanceDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          governanceMaturityScore: t(`${p}.governanceMaturityScore`),
          humanOversightRequired: t(`${p}.humanOversightRequired`),
          voluntaryAlignment: t(`${p}.voluntaryAlignment`),
          certifiedParticipants: t(`${p}.certifiedParticipants`),
          certificationsInReview: t(`${p}.certificationsInReview`),
          activeTrustBadges: t(`${p}.activeTrustBadges`),
          openAuditReviews: t(`${p}.openAuditReviews`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          governanceCenterFunctions: t(`${p}.governanceCenterFunctions`),
          certificationPrograms: t(`${p}.certificationPrograms`),
          gpCertificationLevels: t(`${p}.gpCertificationLevels`),
          companionAssessmentAreas: t(`${p}.companionAssessmentAreas`),
          certificationRecords: t(`${p}.certificationRecords`),
          auditReviews: t(`${p}.auditReviews`),
          policyLibrary: t(`${p}.policyLibrary`),
          trustBadges: t(`${p}.trustBadges`),
          continuousImprovement: t(`${p}.continuousImprovement`),
          securityRequirements: t(`${p}.securityRequirements`),
          selfLoveInGovernance: t(`${p}.selfLoveInGovernance`),
          companionAdaptation: t(`${p}.companionAdaptation`),
          limitationPrinciples: t(`${p}.limitationPrinciples`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
          marketplaceGovernance: t(`${p}.marketplaceGovernance`),
          partnerCertification: t(`${p}.partnerCertification`),
          companionMarketplace: t(`${p}.companionMarketplace`),
          trustReputation: t(`${p}.trustReputation`),
          approvals: t(`${p}.approvals`),
          twoFactorSettings: t(`${p}.twoFactorSettings`),
          globalKnowledgeExchange: t(`${p146}.globalKnowledgeExchange`),
          aipifyUniversity: t(`${p146}.aipifyUniversity`),
          complianceReadiness: t(`${p146}.complianceReadiness`),
          certificationAchievement: t(`${p146}.certificationAchievement`),
          phase146BlueprintTitle: t(`${p146}.blueprintTitle`),
          phase146Objectives: t(`${p146}.objectives`),
          professionalDirectoryCount: t(`${p146}.professionalDirectoryCount`),
          certifiedProfessionalsCount: t(`${p146}.certifiedProfessionalsCount`),
          certificationReviewsScheduled: t(`${p146}.certificationReviewsScheduled`),
          certificationPathwaysCount: t(`${p146}.certificationPathwaysCount`),
          certificationPathways: t(`${p146}.certificationPathways`),
          growthPartnerAccreditation: t(`${p146}.growthPartnerAccreditation`),
          continuousLearningEngine: t(`${p146}.continuousLearningEngine`),
          professionalStandards: t(`${p146}.professionalStandards`),
          executiveEducation: t(`${p146}.executiveEducation`),
          professionalDirectory: t(`${p146}.professionalDirectory`),
          professionalDirectoryNote: t(`${p146}.professionalDirectoryNote`),
          certificationReviewsPhase146: t(`${p146}.certificationReviews`),
          certificationCompanion: t(`${p146}.certificationCompanion`),
          phase146SecurityRequirements: t(`${p146}.securityRequirements`),
          phase146SelfLove: t(`${p146}.selfLove`),
          phase146CompanionLimitations: t(`${p146}.companionLimitations`),
          phase146SuccessCriteria: t(`${p146}.successCriteria`),
        }}
      />
    </div>
  );
}
