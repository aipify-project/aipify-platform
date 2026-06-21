import { CustomerSettingsCenterPanel } from "@/components/app/settings/CustomerSettingsCenterPanel";
import {
  PRESENCE_NOTIFICATION_LEVELS,
  type PresenceNotificationLevel,
} from "@/lib/presence/notifications";
import { QUIET_HOURS_MODES, type QuietHoursMode } from "@/lib/presence/quiet-hours";
import { getCustomerAppDictionaryForSplits, getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { coerceToAppLocale } from "@/lib/i18n/app-locales";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SettingsPage() {
  const locale = await getLocale();
  const dict = {
    ...(await getCustomerAppDictionaryForSplits(locale, ["settings"])),
    ...(await getDictionary(locale, ["presence", "shell"])),
  };
  const t = createTranslator(dict, { locale });
  const p = "customerApp.settings";

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

  const categoryIds = [
    "companionPresence",
    "governanceSecurity",
    "knowledgeLearning",
    "automationActions",
    "billingGrowth",
    "organizationIntelligence",
  ] as const;

  return (
    <CustomerSettingsCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
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
        categories: categoryIds.map((id) => ({
          id,
          title: t(`${p}.categories.${id}.title`),
          description: t(`${p}.categories.${id}.description`),
          links: [1, 2, 3, 4, 5, 6]
            .map((index) => {
              const href = t(`${p}.categories.${id}.links.${index}.href`);
              const label = t(`${p}.categories.${id}.links.${index}.label`);
              if (
                href.startsWith("customerApp.") ||
                href.startsWith("settings.") ||
                label.startsWith("customerApp.") ||
                label.startsWith("settings.")
              ) {
                return null;
              }
              return { href, label };
            })
            .filter((link): link is { href: string; label: string } => link !== null),
        })),
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
