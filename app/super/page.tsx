import { SuperAdminControlCenterPanel } from "@/components/super-admin";
import { SUPER_ADMIN_SECTIONS } from "@/lib/super-admin/nav-config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SuperAdminPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["superAdmin"]);
  const t = createTranslator(dict);

  const sectionLabels = Object.fromEntries(
    SUPER_ADMIN_SECTIONS.map((section) => [
      section.id,
      {
        title: t(section.titleKey),
        purpose: t(section.purposeKey),
      },
    ])
  );

  const moduleLabels: Record<string, { label: string; description: string }> = {};
  for (const section of SUPER_ADMIN_SECTIONS) {
    for (const module of section.modules) {
      moduleLabels[module.id] = {
        label: t(module.labelKey),
        description: t(module.descriptionKey),
      };
    }
  }

  return (
    <SuperAdminControlCenterPanel
      labels={{
        loading: t("superAdmin.controlCenter.loading"),
        loadError: t("superAdmin.controlCenter.loadError"),
        welcome: t("superAdmin.controlCenter.welcome"),
        globalPlatformHealth: t("superAdmin.controlCenter.globalPlatformHealth"),
        organizations: t("superAdmin.controlCenter.organizations"),
        organizationsActive: t("superAdmin.controlCenter.organizationsActive"),
        growthPartnerApplications: t("superAdmin.controlCenter.growthPartnerApplications"),
        growthPartnerPending: t("superAdmin.controlCenter.growthPartnerPending"),
        marketplaceReviews: t("superAdmin.controlCenter.marketplaceReviews"),
        marketplaceAwaiting: t("superAdmin.controlCenter.marketplaceAwaiting"),
        criticalIncidents: t("superAdmin.controlCenter.criticalIncidents"),
        criticalIncidentsNone: t("superAdmin.controlCenter.criticalIncidentsNone"),
        criticalIncidentsCount: t("superAdmin.controlCenter.criticalIncidentsCount"),
        privacyNote: t("superAdmin.controlCenter.privacyNote"),
        sectionsTitle: t("superAdmin.controlCenter.sectionsTitle"),
        openModule: t("superAdmin.controlCenter.openModule"),
      }}
      sectionLabels={sectionLabels}
      moduleLabels={moduleLabels}
    />
  );
}
