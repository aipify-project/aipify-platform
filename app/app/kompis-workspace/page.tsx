import { KompisCustomerWorkspaceHost } from "@/components/app/kompis-customer-workspace/KompisCustomerWorkspaceHost";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import {
  buildKompisWorkspaceLabels,
  loadKompisServerWorkspaceBundle,
} from "@/lib/kompis-customer-workspace";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function KompisCustomerWorkspacePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);
  const labels = buildKompisWorkspaceLabels(t);

  const supabase = await createClient();
  const loaded = await loadKompisServerWorkspaceBundle(supabase, {
    route: "/app/kompis-workspace",
    module: "account",
    locale,
  });

  const organizationName = loaded.ok ? loaded.bundle.organizationName : "Organization";
  const userRole = loaded.ok ? loaded.bundle.userRole : "member";
  const permissions = loaded.ok ? loaded.bundle.permissions : null;
  const isAdmin =
    loaded.ok &&
    ["organization_owner", "organization_admin", "owner", "admin"].includes(
      loaded.bundle.userRole
    );

  const labelsCatalog = {
    ...labels.messageCatalog,
    readAction: t("customerApp.portalStructure.kompisWorkspace.runtime.readAction"),
    draftAction: t("customerApp.portalStructure.kompisWorkspace.runtime.draftAction"),
    confirmPrefAction: t("customerApp.portalStructure.kompisWorkspace.runtime.confirmPrefAction"),
    draftTitle: t("customerApp.portalStructure.kompisWorkspace.runtime.draftTitle"),
    draftBody: t("customerApp.portalStructure.kompisWorkspace.runtime.draftBody"),
    resultTitle: t("customerApp.portalStructure.kompisWorkspace.runtime.resultTitle"),
    adminTitle: t("customerApp.portalStructure.kompisWorkspace.admin.title"),
    adminEnable: t("customerApp.portalStructure.kompisWorkspace.admin.enable"),
    adminDisable: t("customerApp.portalStructure.kompisWorkspace.admin.disable"),
    adminHidden: t("customerApp.portalStructure.kompisWorkspace.admin.hiddenForMembers"),
    receiptOk: t("customerApp.portalStructure.kompisWorkspace.runtime.receiptOk"),
  };

  return (
    <div className={AppLayoutClasses.fullWorkspace}>
      <KompisCustomerWorkspaceHost
        locale={locale}
        labelsCatalog={labelsCatalog}
        organizationName={organizationName}
        userRole={userRole}
        initialPermissions={permissions}
        contextSummary={t("customerApp.portalStructure.kompisWorkspace.runtime.contextSummary")}
        isAdmin={isAdmin}
        route="/app/kompis-workspace"
        module="account"
        suppressFloatingShell
      />
    </div>
  );
}
