import { EnterpriseDeploymentDashboardPanel } from "@/components/app/enterprise";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EnterprisePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.enterpriseDeployment";

  return (
    <EnterpriseDeploymentDashboardPanel
      locale={locale}
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        principle: t(`${p}.principle`),
        loading: t(`${p}.loading`),
        empty: t(`${p}.empty`),
        deployment: t(`${p}.deployment`),
        agents: t(`${p}.agents`),
        dataResidency: t(`${p}.dataResidency`),
        connectors: t(`${p}.connectors`),
        audit: t(`${p}.audit`),
        framework: t(`${p}.framework`),
        upgradeRequired: t(`${p}.upgradeRequired`),
        mode: t(`${p}.mode`),
        residency: t(`${p}.residency`),
        connectivity: t(`${p}.connectivity`),
        agentsCount: t(`${p}.agentsCount`),
        registeredAgents: t(`${p}.registeredAgents`),
        noAgents: t(`${p}.noAgents`),
        neverSeen: t(`${p}.neverSeen`),
        recentJobs: t(`${p}.recentJobs`),
        noJobs: t(`${p}.noJobs`),
        privacy: t(`${p}.privacy`),
      }}
    />
  );
}
