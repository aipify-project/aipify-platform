import { EcosystemGovernanceDashboardPanel } from "@/components/app/ecosystem-governance";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EcosystemGovernancePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.ecosystemGovernance";

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
        }}
      />
    </div>
  );
}
