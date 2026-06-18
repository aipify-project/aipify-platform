import {
  SuperAdminAccessGate,
  SuperAdminAuthGuard,
  SuperAdminShell,
} from "@/components/super-admin";
import { buildCommandBarLabels, superAdminNavSources } from "@/lib/command-bar";
import { SUPER_ADMIN_SECTIONS } from "@/lib/super-admin/nav-config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

function buildSectionLabels(t: (key: string) => string) {
  return Object.fromEntries(
    SUPER_ADMIN_SECTIONS.map((section) => [
      section.id,
      {
        title: t(section.titleKey),
        purpose: t(section.purposeKey),
      },
    ])
  );
}

function buildModuleLabels(t: (key: string) => string) {
  const entries: Array<[string, { label: string; description: string }]> = [];
  for (const section of SUPER_ADMIN_SECTIONS) {
    for (const module of section.modules) {
      entries.push([
        module.id,
        {
          label: t(module.labelKey),
          description: t(module.descriptionKey),
        },
      ]);
    }
  }
  return Object.fromEntries(entries);
}

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "auth", "superAdmin", "commandBar"]);
  const t = createTranslator(dict);

  const sectionLabels = buildSectionLabels(t);
  const moduleLabels = buildModuleLabels(t);

  return (
    <SuperAdminAuthGuard loadingLabel={t("common.loading")}>
      <SuperAdminAccessGate
        loadingLabel={t("common.loading")}
        recoveryRequiredLabel={t("superAdmin.access.recoveryRequired")}
      >
        <SuperAdminShell
          portalTitle={t("superAdmin.shell.title")}
          portalSubtitle={t("superAdmin.shell.subtitle")}
          organizationLabel={t("superAdmin.shell.organization")}
          signOutLabel={t("auth.logout.signOut")}
          warningTitle={t("superAdmin.warning.title")}
          warningBody={t("superAdmin.warning.body")}
          warningProceedLabel={t("superAdmin.warning.proceed")}
          loadErrorLabel={t("superAdmin.controlCenter.loadError")}
          identityRoleLabel={t("superAdmin.identity.role")}
          identityVerifiedLabel={t("superAdmin.identity.verifiedAccess")}
          statusBarLabels={{
            operational: t("superAdmin.statusBar.operational"),
            warning: t("superAdmin.statusBar.warning"),
            warningCount: t("superAdmin.statusBar.warningCount"),
            critical: t("superAdmin.statusBar.critical"),
            openActionCenter: t("superAdmin.statusBar.openActionCenter"),
          }}
          sectionLabels={sectionLabels}
          moduleLabels={moduleLabels}
          commandBarLabels={buildCommandBarLabels(t)}
          commandBarNavSources={superAdminNavSources(t)}
          footerSignature={t("superAdmin.footer.signature")}
        >
          {children}
        </SuperAdminShell>
      </SuperAdminAccessGate>
    </SuperAdminAuthGuard>
  );
}
