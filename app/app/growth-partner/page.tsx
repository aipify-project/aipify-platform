import { GrowthPartnerDashboardPanel } from "@/components/app/growth-partner-dashboard";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GrowthPartnerDashboardPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "growthPartnerDashboard");
  const t = createTranslator(dict);
  const p = "customerApp.growthPartnerDashboard";

  const labels = {
    title: t(`${p}.title`),
    welcome: t(`${p}.welcome`),
    welcomeSubtitle: t(`${p}.welcomeSubtitle`),
    status: t(`${p}.status`),
    nextSteps: t(`${p}.nextSteps`),
    trainingProgress: t(`${p}.trainingProgress`),
    certificationStatus: t(`${p}.certificationStatus`),
    commissionOverview: t(`${p}.commissionOverview`),
    myLeads: t(`${p}.myLeads`),
    myCustomers: t(`${p}.myCustomers`),
    payoutProfile: t(`${p}.payoutProfile`),
    profileSettings: t(`${p}.profileSettings`),
    startTraining: t(`${p}.startTraining`),
    viewOperations: t(`${p}.viewOperations`),
    accessDenied: t(`${p}.accessDenied`),
    privacyNote: t(`${p}.privacyNote`),
    refresh: t(`${p}.refresh`),
    modules: t(`${p}.modules`),
    commissionNote: t(`${p}.commissionNote`),
    statusWaiting: t(`${p}.statusWaiting`),
    statusVerified: t(`${p}.statusVerified`),
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
      </div>
      <GrowthPartnerDashboardPanel labels={labels} />
    </div>
  );
}
