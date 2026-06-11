import { CustomerSettingsCenterPanel } from "@/components/app/settings/CustomerSettingsCenterPanel";
import {
  PRESENCE_NOTIFICATION_LEVELS,
  type PresenceNotificationLevel,
} from "@/lib/presence/notifications";
import { QUIET_HOURS_MODES, type QuietHoursMode } from "@/lib/presence/quiet-hours";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SettingsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp", "presence"]);
  const t = createTranslator(dict);

  const levelLabels = Object.fromEntries(
    PRESENCE_NOTIFICATION_LEVELS.map((level) => [
      level,
      t(`presence.desktop.levels.${level}`),
    ])
  ) as Record<PresenceNotificationLevel, string>;

  const modeLabels = Object.fromEntries(
    QUIET_HOURS_MODES.map((mode) => [
      mode,
      t(`presence.commandCenter.quietModes.${mode}`),
    ])
  ) as Record<QuietHoursMode, string>;

  return (
    <CustomerSettingsCenterPanel
      labels={{
        title: t("customerApp.settings.title"),
        subtitle: t("customerApp.settings.subtitle"),
        sections: {
          notifications: t("customerApp.settings.sections.notifications"),
          presence: t("customerApp.settings.sections.presence"),
          quietHours: t("customerApp.settings.sections.quietHours"),
          executiveBriefing: t("customerApp.settings.sections.executiveBriefing"),
          desktop: t("customerApp.settings.sections.desktop"),
          developer: t("customerApp.settings.sections.developer"),
          updates: t("customerApp.settings.sections.updates"),
          learning: t("customerApp.settings.sections.learning"),
          timezone: t("customerApp.settings.timezone"),
        },
        timezoneHint: t("customerApp.settings.timezoneHint"),
        quietModes: modeLabels,
        levels: levelLabels,
        save: t("customerApp.settings.save"),
        saved: t("customerApp.settings.saved"),
        links: {
          developer: t("customerApp.settings.links.developer"),
          updates: t("customerApp.settings.links.updates"),
          desktopConnect: t("customerApp.settings.links.desktopConnect"),
          learning: t("customerApp.settings.links.learning"),
          businessDna: t("customerApp.settings.links.businessDna"),
          supportOperations: t("customerApp.settings.links.supportOperations"),
          employeeKnowledge: t("customerApp.settings.links.employeeKnowledge"),
          workingStyle: t("customerApp.settings.links.workingStyle"),
          billing: t("customerApp.settings.links.billing"),
          modules: t("customerApp.settings.links.modules"),
        },
      }}
    />
  );
}
