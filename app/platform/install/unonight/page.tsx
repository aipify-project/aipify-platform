import { UnonightPilotInstallPanel } from "@/components/platform/pilot";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function UnonightPilotInstallPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <UnonightPilotInstallPanel
      labels={{
        title: t("platform.pilot.title"),
        subtitle: t("platform.pilot.subtitle"),
        loading: t("platform.pilot.loading"),
        status: t("platform.pilot.status"),
        safeMode: t("platform.pilot.safeMode"),
        safeModeOn: t("platform.pilot.safeModeOn"),
        safeModeOff: t("platform.pilot.safeModeOff"),
        discovery: t("platform.pilot.discovery"),
        knowledge: t("platform.pilot.knowledge"),
        governance: t("platform.pilot.governance"),
        supportMode: t("platform.pilot.supportMode"),
        runDiscovery: t("platform.pilot.runDiscovery"),
        seedKnowledge: t("platform.pilot.seedKnowledge"),
        enableSafeModules: t("platform.pilot.enableSafeModules"),
        nextStep: t("platform.pilot.nextStep"),
        blockedActions: t("platform.pilot.blockedActions"),
        pendingApprovals: t("platform.pilot.pendingApprovals"),
        createTenant: t("platform.pilot.createTenant"),
        notProvisioned: t("platform.pilot.notProvisioned"),
        createTenantFirst: t("platform.pilot.createTenantFirst"),
        completeness: t("platform.pilot.completeness"),
        openDashboard: t("platform.pilot.openDashboard"),
        modules: t("platform.pilot.modules"),
        integrationsTitle: t("platform.pilot.integrationsTitle"),
        checklist: t("platform.pilot.checklist"),
        recentEvents: t("platform.pilot.recentEvents"),
        viewAll: t("platform.pilot.viewAll"),
        notRun: t("platform.pilot.notRun"),
      }}
    />
  );
}
