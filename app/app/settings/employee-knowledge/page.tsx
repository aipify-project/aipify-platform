import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { EmployeeKnowledgeAdminPanel } from "@/components/app/settings/EmployeeKnowledgeAdminPanel";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { buildEmployeeKnowledgeLabels } from "@/lib/employee-knowledge-engine";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/**
 * Ansattkunnskap / Employee Knowledge workspace.
 * Feature owner: CUSTOMER APP — Bedrift-internal; not Website Kompis public FAQ.
 */
export default async function EmployeeKnowledgeSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, [
    "core",
    "portalStructure",
  ]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();
  const labels = buildEmployeeKnowledgeLabels(t);

  return (
    <AppHubShell
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        {
          label: t("customerApp.portalStructure.navGroups.kompisBedrift"),
          href: FOUNDATION_NAV_BINDINGS.kompisBedriftDashboard,
        },
        { label: labels.title },
      ]}
      eyebrow={t("customerApp.portalStructure.navGroups.kompisBedrift")}
      title={labels.title}
      description={labels.subtitle}
      contextLabel={formatHubContextLine(common, ctx)}
    >
      <EmployeeKnowledgeAdminPanel labels={labels} embedded />
    </AppHubShell>
  );
}
