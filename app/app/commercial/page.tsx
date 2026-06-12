import { CommercialModelDashboardPanel } from "@/components/app/billing-commercial";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CommercialModelPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.billingCommercial";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CommercialModelDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          commercialHealth: t(`${p}.commercialHealth`),
          generateBriefing: t(`${p}.generateBriefing`),
          mrrLabel: t(`${p}.mrrLabel`),
          mrr: t(`${p}.mrr`),
          arr: t(`${p}.arr`),
          renewalLikelihood: t(`${p}.renewalLikelihood`),
          expansionOpportunity: t(`${p}.expansionOpportunity`),
          billingSettings: t(`${p}.billingSettings`),
          moduleSettings: t(`${p}.moduleSettings`),
          licenseCenter: t(`${p}.licenseCenter`),
          packagingStrategy: t(`${p}.packagingStrategy`),
          perMonth: t(`${p}.perMonth`),
          addonModules: t(`${p}.addonModules`),
          activateAddon: t(`${p}.activateAddon`),
          enterpriseServices: t(`${p}.enterpriseServices`),
          usageTracking: t(`${p}.usageTracking`),
          invoices: t(`${p}.invoices`),
          renewalManagement: t(`${p}.renewalManagement`),
          completeRenewal: t(`${p}.completeRenewal`),
          partnerBilling: t(`${p}.partnerBilling`),
          trialFramework: t(`${p}.trialFramework`),
          pricingGovernance: t(`${p}.pricingGovernance`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          blueprintPhase39: t(`${p}.blueprintPhase39`),
          revenueSummary: t(`${p}.revenueSummary`),
          revenueObjectives: t(`${p}.revenueObjectives`),
          upcomingRenewals: t(`${p}.upcomingRenewals`),
          renewalRisk: t(`${p}.renewalRisk`),
          retentionSignal: t(`${p}.retentionSignal`),
          revenueTrend: t(`${p}.revenueTrend`),
          activeAddons: t(`${p}.activeAddons`),
          expansionPacks: t(`${p}.expansionPacks`),
          customerHealthInsights: t(`${p}.customerHealthInsights`),
          openCustomerSuccess: t(`${p}.openCustomerSuccess`),
          renewalIntelligence: t(`${p}.renewalIntelligence`),
          expansionOpportunities: t(`${p}.expansionOpportunities`),
          salesExpertConnection: t(`${p}.salesExpertConnection`),
          openSalesExpert: t(`${p}.openSalesExpert`),
          financialSystems: t(`${p}.financialSystems`),
          openIntegrationEngine: t(`${p}.openIntegrationEngine`),
          trustConnection: t(`${p}.trustConnection`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          dogfooding: t(`${p}.dogfooding`),
          aipifyGroup: t(`${p}.aipifyGroup`),
          unonight: t(`${p}.unonight`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
          visionPhrases: t(`${p}.visionPhrases`),
        }}
      />
    </div>
  );
}
