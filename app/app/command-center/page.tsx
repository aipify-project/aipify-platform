import { AipifyCompanionBriefingBanner } from "@/components/app/briefing";
import { BusinessOsCommandCenterPanel } from "@/components/app/business-os-command-center";
import { CommandCenterPanel } from "@/components/app/presence";
import { buildCompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";
import { buildBusinessOsCommandCenterLabels } from "@/lib/business-os-command-center/labels";
import {
  PRESENCE_NOTIFICATION_LEVELS,
  type PresenceNotificationLevel,
} from "@/lib/presence/notifications";
import { QUIET_HOURS_MODES, type QuietHoursMode } from "@/lib/presence/quiet-hours";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppCommandCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["presence", "branding"]);
  const t = createTranslator(dict);
  const p = "presence.executiveCenter";

  const ccDict = await getCustomerAppDictionaryForModule(locale, "businessOsCommandCenter");
  const tc = createTranslator(ccDict);
  const labels = buildBusinessOsCommandCenterLabels(tc);
  const briefingLabels = buildCompanionBriefingLabels(t);

  const levelLabels = Object.fromEntries(
    PRESENCE_NOTIFICATION_LEVELS.map((level) => [level, t(`presence.desktop.levels.${level}`)]),
  ) as Record<PresenceNotificationLevel, string>;

  const modeLabels = Object.fromEntries(
    QUIET_HOURS_MODES.map((mode) => [mode, t(`${p}.quietModes.${mode}`)]),
  ) as Record<QuietHoursMode, string>;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <AipifyCompanionBriefingBanner context="command_center" labels={briefingLabels} />
      <BusinessOsCommandCenterPanel labels={labels} />
      <section id="presence" className="border-t border-gray-200 pt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.links.presenceFeed}</h2>
        <CommandCenterPanel
          labels={{
            title: t(`${p}.title`),
            subtitle: t(`${p}.subtitle`),
            principle: t(`${p}.principle`),
            corePrinciple: t(`${p}.corePrinciple`),
            loading: t(`${p}.loading`),
            empty: t(`${p}.empty`),
            pulseLabel: t("branding.pulseLabel"),
            planGate: t(`${p}.planGate`),
            desktopConnect: t(`${p}.desktopConnect`),
            sinceLastLogin: t(`${p}.sinceLastLogin`),
            sections: {
              executiveBriefing: t(`${p}.sections.executiveBriefing`),
              organizationHealth: t(`${p}.sections.organizationHealth`),
              attention: t(`${p}.sections.attention`),
              recommendedActions: t(`${p}.sections.recommendedActions`),
              recommendedActionsNote: t(`${p}.sections.recommendedActionsNote`),
              insights: t(`${p}.sections.insights`),
              companionStatus: t(`${p}.sections.companionStatus`),
              notifications: t(`${p}.sections.notifications`),
              preferences: t(`${p}.sections.preferences`),
              desktopCompanion: t(`${p}.sections.desktopCompanion`),
            },
            feedFallback: [
              t(`${p}.feed.items.supportResolved`),
              t(`${p}.feed.items.approvals`),
              t(`${p}.feed.items.commerceMargins`),
              t(`${p}.feed.items.responseTimes`),
              t(`${p}.feed.items.security`),
              t(`${p}.feed.items.recommendation`),
            ],
            actionCards: {
              pendingApprovals: {
                title: t(`${p}.actionCards.pendingApprovals.title`),
                detail: (count: number) =>
                  t(`${p}.actionCards.pendingApprovals.detail`).replace("{count}", String(count)),
                action: t(`${p}.actionCards.pendingApprovals.action`),
              },
              escalations: {
                title: t(`${p}.actionCards.escalations.title`),
                detail: (count: number) =>
                  count === 0
                    ? t(`${p}.actionCards.escalations.detailNone`)
                    : t(`${p}.actionCards.escalations.detail`).replace("{count}", String(count)),
                action: t(`${p}.actionCards.escalations.action`),
              },
              executiveSummary: {
                title: t(`${p}.actionCards.executiveSummary.title`),
                detail: t(`${p}.actionCards.executiveSummary.detail`),
                action: t(`${p}.actionCards.executiveSummary.action`),
              },
              securityAlerts: {
                title: t(`${p}.actionCards.securityAlerts.title`),
                detail: (count: number) =>
                  count === 0
                    ? t(`${p}.actionCards.securityAlerts.detailNone`)
                    : t(`${p}.actionCards.securityAlerts.detail`).replace("{count}", String(count)),
                action: t(`${p}.actionCards.securityAlerts.action`),
              },
            },
            health: {
              operational: t(`${p}.health.operational`),
              security: t(`${p}.health.security`),
              team: t(`${p}.health.team`),
              commerce: t(`${p}.health.commerce`),
            },
            insights: {
              trends: t(`${p}.insights.trends`),
              risks: t(`${p}.insights.risks`),
              opportunities: t(`${p}.insights.opportunities`),
            },
            companion: {
              presence: t(`${p}.companion.presence`),
              desktop: t(`${p}.companion.desktop`),
              learning: t(`${p}.companion.learning`),
              automation: t(`${p}.companion.automation`),
              macosAvailable: t(`${p}.companion.macosAvailable`),
              windowsPlanned: t(`${p}.companion.windowsPlanned`),
              linuxPlanned: t(`${p}.companion.linuxPlanned`),
            },
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
      </section>
    </div>
  );
}
