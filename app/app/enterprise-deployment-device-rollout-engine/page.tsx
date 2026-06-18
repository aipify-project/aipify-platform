import { EnterpriseDeploymentDeviceRolloutEngineDashboardPanel } from "@/components/app/enterprise-deployment-device-rollout-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EnterpriseDeploymentDeviceRolloutEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "enterpriseDeploymentDeviceRolloutEngine");
  const t = createTranslator(dict);
  const p = "customerApp.enterpriseDeploymentDeviceRolloutEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <EnterpriseDeploymentDeviceRolloutEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          enterpriseReadiness: t(`${p}.enterpriseReadiness`),
          commandCenter: t(`${p}.commandCenter`),
          subscription: t(`${p}.subscription`),
          installEngine: t(`${p}.installEngine`),
          active_licenses: t(`${p}.active_licenses`),
          active_seats: t(`${p}.active_seats`),
          registered_devices: t(`${p}.registered_devices`),
          stale_or_failed_devices: t(`${p}.stale_or_failed_devices`),
          licenses: t(`${p}.licenses`),
          seats: t(`${p}.seats`),
          devices: t(`${p}.devices`),
          enrollmentTokens: t(`${p}.enrollmentTokens`),
          staleEnrollments: t(`${p}.staleEnrollments`),
          domainsAndSso: t(`${p}.domainsAndSso`),
          verified_domains: t(`${p}.verified_domains`),
          sso_ready: t(`${p}.sso_ready`),
          scimReadiness: t(`${p}.scimReadiness`),
          scimStatus: t(`${p}.scimStatus`),
          scimScaffoldNote: t(`${p}.scimScaffoldNote`),
          installerDownloads: t(`${p}.installerDownloads`),
          installerPending: t(`${p}.installerPending`),
          noItems: t(`${p}.noItems`),
          principles: t(`${p}.principles`),
        }}
      />
    </div>
  );
}
