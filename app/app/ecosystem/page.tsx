import { EnterpriseEcosystemPartnerNetworkDashboardPanel } from "@/components/app/enterprise-ecosystem-partner-network-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EcosystemCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "enterpriseEcosystemPartnerNetworkEngine");
  const t = createTranslator(dict);
  const p = "customerApp.enterpriseEcosystemPartnerNetworkEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    actionFailed: t(`${p}.actionFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    partnersTitle: t(`${p}.partnersTitle`),
    growthPartnersTitle: t(`${p}.growthPartnersTitle`),
    serviceProvidersTitle: t(`${p}.serviceProvidersTitle`),
    industryExpertsTitle: t(`${p}.industryExpertsTitle`),
    developerEcosystemTitle: t(`${p}.developerEcosystemTitle`),
    marketplaceTitle: t(`${p}.marketplaceTitle`),
    partnerSuccessTitle: t(`${p}.partnerSuccessTitle`),
    intelligenceTitle: t(`${p}.intelligenceTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    governanceTitle: t(`${p}.governanceTitle`),
    analyticsTitle: t(`${p}.analyticsTitle`),
    executiveTitle: t(`${p}.executiveTitle`),
    metricPartners: t(`${p}.metricPartners`),
    metricGrowthPartners: t(`${p}.metricGrowthPartners`),
    metricDevelopers: t(`${p}.metricDevelopers`),
    metricExperts: t(`${p}.metricExperts`),
    metricServiceProviders: t(`${p}.metricServiceProviders`),
    metricMarketplace: t(`${p}.metricMarketplace`),
    metricHealth: t(`${p}.metricHealth`),
    metricGlobalReach: t(`${p}.metricGlobalReach`),
    ratingLabel: t(`${p}.ratingLabel`),
    commissionLabel: t(`${p}.commissionLabel`),
    healthLabel: t(`${p}.healthLabel`),
    noPartners: t(`${p}.noPartners`),
    noGrowthPartners: t(`${p}.noGrowthPartners`),
    noServiceProviders: t(`${p}.noServiceProviders`),
    noDeveloperAssets: t(`${p}.noDeveloperAssets`),
    noMarketplace: t(`${p}.noMarketplace`),
    noIntelligence: t(`${p}.noIntelligence`),
    noAdvisor: t(`${p}.noAdvisor`),
    noAudit: t(`${p}.noAudit`),
    recommendation: t(`${p}.recommendation`),
    openGrowthPartnerPortal: t(`${p}.openGrowthPartnerPortal`),
    openEcosystemGovernance: t(`${p}.openEcosystemGovernance`),
    openEcosystemIntelligence: t(`${p}.openEcosystemIntelligence`),
    createPartner: t(`${p}.createPartner`),
    approvePartner: t(`${p}.approvePartner`),
    grantCertification: t(`${p}.grantCertification`),
    recordCommission: t(`${p}.recordCommission`),
    createListing: t(`${p}.createListing`),
    suspendPartner: t(`${p}.suspendPartner`),
    refreshAnalytics: t(`${p}.refreshAnalytics`),
    governanceVerification: t(`${p}.governanceVerification`),
    governanceCertification: t(`${p}.governanceCertification`),
    governancePayout: t(`${p}.governancePayout`),
    governanceMarketplace: t(`${p}.governanceMarketplace`),
    governanceAudit: t(`${p}.governanceAudit`),
    executiveSummary: t(`${p}.executiveSummary`),
    networkLabel: t(`${p}.networkLabel`),
    reachLabel: t(`${p}.reachLabel`),
    revenueLabel: t(`${p}.revenueLabel`),
    activityLabel: t(`${p}.activityLabel`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <EnterpriseEcosystemPartnerNetworkDashboardPanel labels={labels} />
    </div>
  );
}
