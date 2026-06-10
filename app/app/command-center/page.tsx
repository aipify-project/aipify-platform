import { CommandCenterPanel } from "@/components/app/presence";
import {
  PRESENCE_NOTIFICATION_LEVELS,
  type PresenceNotificationLevel,
} from "@/lib/presence/notifications";
import { QUIET_HOURS_MODES, type QuietHoursMode } from "@/lib/presence/quiet-hours";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppCommandCenterPage() {
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
    QUIET_HOURS_MODES.map((mode) => [
      mode,
      t(`presence.commandCenter.quietModes.${mode}`),
    ])
  ) as Record<QuietHoursMode, string>;

  return (
    <CommandCenterPanel
      labels={{
        title: t("presence.commandCenter.title"),
        subtitle: t("presence.commandCenter.subtitle"),
        principle: t("presence.commandCenter.principle"),
        corePrinciple: t("presence.commandCenter.corePrinciple"),
        loading: t("presence.center.loading"),
        empty: t("presence.commandCenter.empty"),
        pulseLabel: t("branding.pulseLabel"),
        planGate: t("presence.commandCenter.planGate"),
        desktopConnect: t("presence.desktopConnect.nav"),
        sections: {
          executiveFeed: t("presence.commandCenter.sections.executiveFeed"),
          health: t("presence.commandCenter.sections.health"),
          approvals: t("presence.commandCenter.sections.approvals"),
          skills: t("presence.commandCenter.sections.skills"),
          activity: t("presence.commandCenter.sections.activity"),
          recommendations: t("presence.commandCenter.sections.recommendations"),
          notifications: t("presence.commandCenter.sections.notifications"),
          quickActions: t("presence.commandCenter.sections.quickActions"),
          desktopPrepared: t("presence.commandCenter.sections.desktopPrepared"),
        },
        feedEmpty: t("presence.commandCenter.feedEmpty"),
        notifications: {
          unread: t("presence.desktop.notifications.unread"),
          none: t("presence.desktop.notifications.none"),
          levels: levelLabels,
        },
        preferences: {
          title: t("presence.desktop.preferences.title"),
          quietHours: t("presence.desktop.preferences.quietHours"),
          save: t("presence.settings.save"),
          saved: t("presence.settings.saved"),
          modes: modeLabels,
        },
      }}
    />
  );
}
