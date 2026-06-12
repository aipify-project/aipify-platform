import { MarketplacePartnerEcosystemFoundationEngineDashboardPanel } from "@/components/app/marketplace-partner-ecosystem-foundation-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MarketplacePartnerEcosystemFoundationEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.marketplacePartnerEcosystemFoundationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <MarketplacePartnerEcosystemFoundationEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          approvedPartners: t(`${p}.approvedPartners`),
          pendingPartners: t(`${p}.pendingPartners`),
          offerings: t(`${p}.offerings`),
          certificationStatus: t(`${p}.certificationStatus`),
          qualityIndicators: t(`${p}.qualityIndicators`),
          integrationNotes: t(`${p}.integrationNotes`),
          approve: t(`${p}.approve`),
          suspend: t(`${p}.suspend`),
          recertify: t(`${p}.recertify`),
          actionFailed: t(`${p}.actionFailed`),
          ecosystemObjectives: t(`${p}.ecosystemObjectives`),
          industryPacks: t(`${p}.industryPacks`),
          industryPacksNote: t(`${p}.industryPacksNote`),
          connectorMarketplace: t(`${p}.connectorMarketplace`),
          connectorMarketplaceNote: t(`${p}.connectorMarketplaceNote`),
          knowledgePacks: t(`${p}.knowledgePacks`),
          companionSkills: t(`${p}.companionSkills`),
          futureScaffold: t(`${p}.futureScaffold`),
          successCriteria: t(`${p}.successCriteria`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          trustConnection: t(`${p}.trustConnection`),
          qualityGuardianConnection: t(`${p}.qualityGuardianConnection`),
          dogfooding: t(`${p}.dogfooding`),
          visionPhrases: t(`${p}.visionPhrases`),
          ecosystemActivationSummary: t(`${p}.ecosystemActivationSummary`),
          activeIntegrations: t(`${p}.activeIntegrations`),
          pendingIntegrations: t(`${p}.pendingIntegrations`),
          activeBusinessPacks: t(`${p}.activeBusinessPacks`),
          enabledModules: t(`${p}.enabledModules`),
          approvedPartnersCount: t(`${p}.approvedPartnersCount`),
          publishedOfferingsCount: t(`${p}.publishedOfferingsCount`),
          explore: t(`${p}.explore`),
          exploreIndustryIntelligence: t(`${p}.exploreIndustryIntelligence`),
          openKnowledgeCenter: t(`${p}.openKnowledgeCenter`),
          openSelfLove: t(`${p}.openSelfLove`),
          openQualityGuardian: t(`${p}.openQualityGuardian`),
          metadataScaffold: t(`${p}.metadataScaffold`),
          partnerExpertNetworkTitle: t(`${p}.partnerExpertNetworkTitle`),
          blueprintPhase33: t(`${p}.blueprintPhase33`),
          partnerEngagementSummary: t(`${p}.partnerEngagementSummary`),
          salesRepresentativePartners: t(`${p}.salesRepresentativePartners`),
          salesExpertPartners: t(`${p}.salesExpertPartners`),
          certifiedPartners: t(`${p}.certifiedPartners`),
          expertPartners: t(`${p}.expertPartners`),
          pendingReviews: t(`${p}.pendingReviews`),
          partnerObjectives: t(`${p}.partnerObjectives`),
          partnerTiers: t(`${p}.partnerTiers`),
          partnerCapabilities: t(`${p}.partnerCapabilities`),
          partnerMarketplaceConnection: t(`${p}.partnerMarketplaceConnection`),
          partnerPortalTerminology: t(`${p}.partnerPortalTerminology`),
          compensationPrinciple: t(`${p}.compensationPrinciple`),
          certificationConnection: t(`${p}.certificationConnection`),
          blueprintSuccessCriteria: t(`${p}.blueprintSuccessCriteria`),
          partnerSelfLoveConnection: t(`${p}.partnerSelfLoveConnection`),
          partnerTrustConnection: t(`${p}.partnerTrustConnection`),
          partnerDogfooding: t(`${p}.partnerDogfooding`),
          partnerVisionPhrases: t(`${p}.partnerVisionPhrases`),
          certificationLevel: t(`${p}.certificationLevel`),
          tierRequirements: t(`${p}.tierRequirements`),
          tierBenefits: t(`${p}.tierBenefits`),
          openCertificationEngine: t(`${p}.openCertificationEngine`),
          openLearningTraining: t(`${p}.openLearningTraining`),
          openPartnerPortal: t(`${p}.openPartnerPortal`),
          openSecurityTrust: t(`${p}.openSecurityTrust`),
          openTrustReputation: t(`${p}.openTrustReputation`),
          salesExpertPortal: t(`${p}.salesExpertPortal`),
        }} />
    </div>
  );
}
