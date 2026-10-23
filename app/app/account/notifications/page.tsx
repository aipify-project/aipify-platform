import { cookies } from "next/headers";
import { NotificationSettingsPanel } from "@/components/app/account/NotificationSettingsPanel";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { WebsiteKompisSettingsIntro } from "@/components/app/website-kompis/WebsiteKompisSettingsIntro";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon, hubT } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { buildNotificationSettingsPageLabels } from "@/lib/app/notifications/labels";
import { accountSettingsParent } from "@/lib/app-portal/product-context/account-settings-parent";
import { APP_PRODUCT_CONTEXT_COOKIE } from "@/lib/app-portal/product-context/constants";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/** Global account notification settings — preserves existing storage semantics. */
export default async function AccountNotificationsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure", "settings"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();
  const parent = accountSettingsParent(
    (await cookies()).get(APP_PRODUCT_CONTEXT_COOKIE)?.value,
  );
  const parentCrumb =
    parent === "kompisBedrift"
      ? {
          label: t("customerApp.portalStructure.nav.kompisBedriftSettings"),
          href: FOUNDATION_NAV_BINDINGS.kompisBedriftSettings,
        }
      : parent === "kompisWeb"
        ? {
            label: t("customerApp.portalStructure.nav.kompisWebSettings"),
            href: FOUNDATION_NAV_BINDINGS.kompisWebSettings,
          }
        : {
            label: t("customerApp.portalStructure.foundationDashboard.accountTitle"),
            href: FOUNDATION_NAV_BINDINGS.accountHome,
          };

  return (
    <AppHubShell
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        parentCrumb,
        { label: t("customerApp.portalStructure.nav.accountNotifications") },
      ]}
      eyebrow={parentCrumb.label}
      title={t("customerApp.portalStructure.nav.accountNotifications")}
      description={hubT(t, "account.notificationsDescription")}
      contextLabel={formatHubContextLine(common, ctx)}
      suppressPageHeader
    >
      <div className="space-y-6">
        <WebsiteKompisSettingsIntro
          eyebrow={parentCrumb.label}
          title={t("customerApp.portalStructure.nav.accountNotifications")}
          description={hubT(t, "account.notificationsDescription")}
          contextLabel={formatHubContextLine(common, ctx)}
        />
        <NotificationSettingsPanel labels={buildNotificationSettingsPageLabels(t)} />
      </div>
    </AppHubShell>
  );
}
