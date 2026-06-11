import { DeploymentEnvironmentManagementEngineDashboardPanel } from "@/components/app/deployment-environment-management-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function DeploymentEnvironmentManagementEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.deploymentEnvironmentManagementEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <DeploymentEnvironmentManagementEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          deploymentEngine: t(`${p}.deploymentEngine`),
          updateEngine: t(`${p}.updateEngine`),
          unonightPilot: t(`${p}.unonightPilot`),
          notifications: t(`${p}.notifications`),
          governance: t(`${p}.governance`),
          pilotFlow: t(`${p}.pilotFlow`),
          activeEnvironments: t(`${p}.activeEnvironments`),
          rollbackReady: t(`${p}.rollbackReady`),
          enabledFlags: t(`${p}.enabledFlags`),
          activeRollouts: t(`${p}.activeRollouts`),
          environments: t(`${p}.environments`),
          noEnvironments: t(`${p}.noEnvironments`),
          deploymentHistory: t(`${p}.deploymentHistory`),
          noReleases: t(`${p}.noReleases`),
          rollback: t(`${p}.rollback`),
          featureFlags: t(`${p}.featureFlags`),
          noFlags: t(`${p}.noFlags`),
          enabled: t(`${p}.enabled`),
          disabled: t(`${p}.disabled`),
          rolloutProgress: t(`${p}.rolloutProgress`),
          noRollouts: t(`${p}.noRollouts`),
          principles: t(`${p}.principles`),
          enterpriseHooks: t(`${p}.enterpriseHooks`),
          enterpriseHooksNote: t(`${p}.enterpriseHooksNote`),
        }}
      />
    </div>
  );
}
