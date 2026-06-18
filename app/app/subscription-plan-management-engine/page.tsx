import { SubscriptionPlanManagementDashboardPanel } from "@/components/app/subscription-plan-management-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SubscriptionPlanManagementEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "subscriptionPlanManagementEngine");
  const t = createTranslator(dict);
  const p = "customerApp.subscriptionPlanManagementEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <SubscriptionPlanManagementDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          licenseCenter: t(`${p}.licenseCenter`),
          integrations: t(`${p}.integrations`),
          billingSettings: t(`${p}.billingSettings`),
          subscriptionEngine: t(`${p}.subscriptionEngine`),
          activePlan: t(`${p}.activePlan`),
          trialStatus: t(`${p}.trialStatus`),
          trialEnds: t(`${p}.trialEnds`),
          activeModules: t(`${p}.activeModules`),
          billingCycle: t(`${p}.billingCycle`),
          billingProvider: t(`${p}.billingProvider`),
          subscriptionActions: t(`${p}.subscriptionActions`),
          startTrial: t(`${p}.startTrial`),
          reactivate: t(`${p}.reactivate`),
          cancel: t(`${p}.cancel`),
          upgradeOpportunities: t(`${p}.upgradeOpportunities`),
          upgrade: t(`${p}.upgrade`),
          availablePlans: t(`${p}.availablePlans`),
          moduleAccess: t(`${p}.moduleAccess`),
          noModules: t(`${p}.noModules`),
          licensed: t(`${p}.licensed`),
          notLicensed: t(`${p}.notLicensed`),
          billingReadiness: t(`${p}.billingReadiness`),
          providers: t(`${p}.providers`),
          billingReady: t(`${p}.billingReady`),
          yes: t(`${p}.yes`),
          no: t(`${p}.no`),
          principles: t(`${p}.principles`),
        }}
      />
    </div>
  );
}
