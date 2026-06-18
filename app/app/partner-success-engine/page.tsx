import { PartnerSuccessEngineDashboardPanel } from "@/components/app/partner-success-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnerSuccessEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "partnerSuccessEngine");
  const t = createTranslator(dict);
  const p = "customerApp.partnerSuccessEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <PartnerSuccessEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          customerSuccess: t(`${p}.customerSuccess`),
          enterpriseDeployment: t(`${p}.enterpriseDeployment`),
          changeManagement: t(`${p}.changeManagement`),
          customerHealth: t(`${p}.customerHealth`),
          activePartners: t(`${p}.activePartners`),
          avgAdoption: t(`${p}.avgAdoption`),
          highRenewalRisk: t(`${p}.highRenewalRisk`),
          createPartner: t(`${p}.createPartner`),
          partnerNamePlaceholder: t(`${p}.partnerNamePlaceholder`),
          typeImplementation: t(`${p}.typeImplementation`),
          typeConsultant: t(`${p}.typeConsultant`),
          typeReseller: t(`${p}.typeReseller`),
          typeMsp: t(`${p}.typeMsp`),
          typeOnboarding: t(`${p}.typeOnboarding`),
          typeAdvisor: t(`${p}.typeAdvisor`),
          createPartnerButton: t(`${p}.createPartnerButton`),
          creating: t(`${p}.creating`),
          createFailed: t(`${p}.createFailed`),
          partners: t(`${p}.partners`),
          noPartners: t(`${p}.noPartners`),
          opportunities: t(`${p}.opportunities`),
          noOpportunities: t(`${p}.noOpportunities`),
          adoption: t(`${p}.adoption`),
          risks: t(`${p}.risks`),
          noRisks: t(`${p}.noRisks`),
          renewalReadiness: t(`${p}.renewalReadiness`),
          principles: t(`${p}.principles`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          exportManifest: t(`${p}.exportManifest`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
        }} />
    </div>
  );
}
