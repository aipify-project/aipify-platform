import { DesktopPresenceFoundationPanel } from "@/components/app/presence";
import {
  PRESENCE_NOTIFICATION_LEVELS,
  type PresenceNotificationLevel,
} from "@/lib/presence/notifications";
import { QUIET_HOURS_MODES, type QuietHoursMode } from "@/lib/presence/quiet-hours";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppPresencePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["presence", "branding"]);
  const t = createTranslator(dict);

  const levelLabels = Object.fromEntries(
    PRESENCE_NOTIFICATION_LEVELS.map((level) => [
      level,
      t(`presence.desktop.levels.${level}`),
    ])
  ) as Record<PresenceNotificationLevel, string>;

  const modeLabels = Object.fromEntries(
    QUIET_HOURS_MODES.map((mode) => [mode, t(`presence.desktop.quietModes.${mode}`)])
  ) as Record<QuietHoursMode, string>;

  return (
    <DesktopPresenceFoundationPanel
      labels={{
        title: t("presence.desktop.title"),
        subtitle: t("presence.desktop.subtitle"),
        principle: t("presence.desktop.principle"),
        loading: t("presence.center.loading"),
        empty: t("presence.desktop.empty"),
        pulseLabel: t("branding.pulseLabel"),
        sidebar: {
          health: t("presence.desktop.sidebar.health"),
          activity: t("presence.desktop.sidebar.activity"),
          recommendations: t("presence.desktop.sidebar.recommendations"),
          executive: t("presence.desktop.sidebar.executive"),
          approvals: t("presence.desktop.sidebar.approvals"),
          skills: t("presence.desktop.sidebar.skills"),
          desktopPrepared: t("presence.desktop.sidebar.desktopPrepared"),
        },
        notifications: {
          title: t("presence.desktop.notifications.title"),
          unread: t("presence.desktop.notifications.unread"),
          none: t("presence.desktop.notifications.none"),
          levels: levelLabels,
          actions: {},
        },
        preferences: {
          title: t("presence.desktop.preferences.title"),
          quietHours: t("presence.desktop.preferences.quietHours"),
          channels: t("presence.desktop.preferences.channels"),
          save: t("presence.settings.save"),
          saved: t("presence.settings.saved"),
          modes: modeLabels,
        },
      }}
    />
  );
}
