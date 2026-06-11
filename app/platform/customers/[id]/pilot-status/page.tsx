import { TenantPilotStatusPanel } from "@/components/platform/pilot";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ id: string }> };

export default async function TenantPilotStatusPage({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <TenantPilotStatusPanel
      tenantId={id}
      labels={{
        title: t("platform.pilot.dashboardTitle"),
        loading: t("platform.pilot.loading"),
        empty: t("platform.pilot.empty"),
        modules: t("platform.pilot.modules"),
        integrations: t("platform.pilot.integrationsTitle"),
        discovery: t("platform.pilot.discovery"),
        completeness: t("platform.pilot.completeness"),
        safeMode: t("platform.pilot.safeMode"),
        supportMode: t("platform.pilot.supportMode"),
        knowledge: t("platform.pilot.knowledge"),
        gaps: t("platform.pilot.gaps"),
        workflows: t("platform.pilot.workflows"),
        pendingApprovals: t("platform.pilot.pendingApprovals"),
        nextStep: t("platform.pilot.nextStep"),
        on: t("platform.pilot.on"),
        off: t("platform.pilot.off"),
      }}
    />
  );
}
