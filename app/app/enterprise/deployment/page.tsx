import { EnterpriseDeploymentSettingsPanel } from "@/components/app/enterprise";
import {
  DEPLOYMENT_MODES,
  DATA_RESIDENCY_MODES,
  CONNECTIVITY_MODES,
  DESKTOP_ENDPOINT_MODES,
} from "@/lib/aipify/enterprise";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EnterpriseDeploymentPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "enterpriseDeployment");
  const t = createTranslator(dict);
  const p = "customerApp.enterpriseDeployment";

  const mapKeys = (keys: readonly string[], prefix: string) =>
    Object.fromEntries(keys.map((k) => [k, t(`${p}.${prefix}.${k}`)]));

  return (
    <EnterpriseDeploymentSettingsPanel
      labels={{
        title: t(`${p}.deploymentTitle`),
        subtitle: t(`${p}.deploymentSubtitle`),
        loading: t(`${p}.loading`),
        back: t(`${p}.back`),
        upgradeRequired: t(`${p}.upgradeRequired`),
        deploymentMode: t(`${p}.deploymentMode`),
        dataResidency: t(`${p}.dataResidency`),
        connectivity: t(`${p}.connectivity`),
        desktopEndpoint: t(`${p}.desktopEndpoint`),
        customEndpoint: t(`${p}.customEndpoint`),
        cloudSync: t(`${p}.cloudSync`),
        rawCloudSync: t(`${p}.rawCloudSync`),
        redactionRequired: t(`${p}.redactionRequired`),
        localKnowledge: t(`${p}.localKnowledge`),
        localMemory: t(`${p}.localMemory`),
        enterpriseGovernance: t(`${p}.enterpriseGovernance`),
        privacy: t(`${p}.privacy`),
      }}
      modeLabels={mapKeys(DEPLOYMENT_MODES, "deploymentModes")}
      residencyLabels={mapKeys(DATA_RESIDENCY_MODES, "residencyModes")}
      connectivityLabels={mapKeys(CONNECTIVITY_MODES, "connectivityModes")}
      endpointLabels={mapKeys(DESKTOP_ENDPOINT_MODES, "endpointModes")}
    />
  );
}
