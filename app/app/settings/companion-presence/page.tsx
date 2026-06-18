import { CompanionPresenceSettingsPanel } from "@/components/app/companion-presence";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionPresenceSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["navigation"]);
  const t = createTranslator(dict);
  const p = "customerApp.companionPresence.settings";

  return (
    <CompanionPresenceSettingsPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        back: t(`${p}.back`),
        save: t(`${p}.save`),
        saved: t(`${p}.saved`),
        privacyTitle: t(`${p}.privacyTitle`),
        privacyNote: t(`${p}.privacyNote`),
        orgSection: t(`${p}.orgSection`),
        indicatorEnabled: t(`${p}.indicatorEnabled`),
        heartbeatInterval: t(`${p}.heartbeatInterval`),
        showSinceLastLogin: t(`${p}.showSinceLastLogin`),
        showTaskCounts: t(`${p}.showTaskCounts`),
        showApprovalCounts: t(`${p}.showApprovalCounts`),
        showNotificationCounts: t(`${p}.showNotificationCounts`),
        criticalAck: t(`${p}.criticalAck`),
        userSection: t(`${p}.userSection`),
        quietMode: t(`${p}.quietMode`),
        quietModeHint: t(`${p}.quietModeHint`),
      }}
    />
  );
}
