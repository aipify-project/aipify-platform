import { NotificationSettingsPanel } from "@/components/app/account/NotificationSettingsPanel";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon, hubT } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { buildNotificationSettingsPageLabels } from "@/lib/app/notifications/labels";
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

  return (
    <AppHubShell
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        {
          label: t("customerApp.portalStructure.navGroups.account"),
          href: FOUNDATION_NAV_BINDINGS.accountHome,
        },
        { label: t("customerApp.portalStructure.nav.accountNotifications") },
      ]}
      eyebrow={t("customerApp.portalStructure.navGroups.account")}
      title={t("customerApp.portalStructure.nav.accountNotifications")}
      description={hubT(t, "account.notificationsDescription")}
      contextLabel={formatHubContextLine(common, ctx)}
    >
      <NotificationSettingsPanel labels={buildNotificationSettingsPageLabels(t)} />
    </AppHubShell>
  );
}
