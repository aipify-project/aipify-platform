import { CustomerSettingsCenterPanel } from "@/components/app/settings/CustomerSettingsCenterPanel";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { buildOperativeSettingsCategories } from "@/lib/app/settings/build-operative-settings-categories";
import { requireAppSettingsOwnerAdminAccess } from "@/lib/app/settings/require-settings-owner-admin";
import {
  PRESENCE_NOTIFICATION_LEVELS,
  type PresenceNotificationLevel,
} from "@/lib/presence/notifications";
import { QUIET_HOURS_MODES, type QuietHoursMode } from "@/lib/presence/quiet-hours";
import { getCustomerAppDictionaryForSplits, getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { coerceToAppLocale } from "@/lib/i18n/app-locales";
import { lookupDictionaryString } from "@/lib/i18n/lookup-dictionary-string";
import { createTranslator } from "@/lib/i18n/translate";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const locale = await getLocale();
  const dict = {
    ...(await getCustomerAppDictionaryForSplits(locale, ["settings"])),
    ...(await getDictionary(locale, ["presence", "shell"])),
  };
  const t = createTranslator(dict, { locale });
  const p = "customerApp.settings";

  const supabase = await createClient();
  const access = await requireAppSettingsOwnerAdminAccess(supabase);
  if (!access.ok) {
    if (access.reason === "unauthenticated") {
      redirect("/login?next=/app/settings");
    }
    // Deny before panel render — no protected content flash.
    return (
      <div className="mx-auto max-w-3xl p-6">
        <PlatformEmptyState
          title={t(`${p}.organizationSettingsAccess.deniedTitle`)}
          message={t(`${p}.organizationSettingsAccess.deniedBody`)}
          primaryAction={{
            label: t(`${p}.organizationSettingsAccess.backToApp`),
            href: "/app",
          }}
        />
      </div>
    );
  }

  const levelLabels = Object.fromEntries(
    PRESENCE_NOTIFICATION_LEVELS.map((level) => [
      level,
      t(`presence.desktop.levels.${level}`),
    ]),
  ) as Record<PresenceNotificationLevel, string>;

  const modeLabels = Object.fromEntries(
    QUIET_HOURS_MODES.map((mode) => [
      mode,
      t(`presence.executiveCenter.quietModes.${mode}`),
    ]),
  ) as Record<QuietHoursMode, string>;

  const title =
    lookupDictionaryString(dict, `${p}.operativeTitle`) ??
    lookupDictionaryString(dict, `${p}.title`) ??
    t(`${p}.title`);
  const subtitle =
    lookupDictionaryString(dict, `${p}.operativeSubtitle`) ??
    lookupDictionaryString(dict, `${p}.subtitle`) ??
    t(`${p}.subtitle`);

  return (
    <CustomerSettingsCenterPanel
      labels={{
        title,
        subtitle,
        sections: {
          notifications: t(`${p}.sections.notifications`),
          quietHours: t(`${p}.sections.quietHours`),
          timezone: t(`${p}.timezone`),
          language: t(`${p}.accountPreferences.languageSection`),
        },
        timezoneHint: t(`${p}.timezoneHint`),
        languageHint: t(`${p}.accountPreferences.languageHint`),
        quietModes: modeLabels,
        levels: levelLabels,
        save: t(`${p}.save`),
        saved: t(`${p}.saved`),
        categories: buildOperativeSettingsCategories(dict),
      }}
      currentLocale={coerceToAppLocale(locale)}
      languageSelectorLabels={{
        label: t("shell.languageSelector.label"),
        activeLanguage: t("shell.languageSelector.activeLanguage"),
        changeLanguage: t("shell.languageSelector.changeLanguage"),
        switchFailed: t("shell.languageSelector.switchFailed"),
        retry: t("shell.languageSelector.retry"),
        openMenu: t("shell.languageSelector.openMenu"),
      }}
    />
  );
}
