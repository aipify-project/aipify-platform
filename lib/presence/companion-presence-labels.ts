import type { CompanionPresenceLabels } from "@/components/app/companion-presence";
import type { CompanionPresenceState } from "@/lib/presence/companion-presence";

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

export function buildCompanionPresenceLabels(t: TranslateFn): CompanionPresenceLabels {
  const states = Object.fromEntries(
    (
      [
        "idle",
        "working",
        "attention_needed",
        "critical_alert",
        "disconnected",
        "quiet_mode",
      ] as CompanionPresenceState[]
    ).map((state) => [state, t(`customerApp.companionPresence.states.${state}`)])
  ) as Record<CompanionPresenceState, string>;

  return {
    ariaIndicator: t("customerApp.companionPresence.ariaIndicator"),
    ariaPanel: t("customerApp.companionPresence.ariaPanel"),
    ariaClose: t("customerApp.companionPresence.ariaClose"),
    ariaCollapse: t("customerApp.companionPresence.ariaCollapse"),
    ariaExpand: t("customerApp.companionPresence.ariaExpand"),
    states,
    sinceLastLogin: t("customerApp.companionPresence.sinceLastLogin"),
    tasks: t("customerApp.companionPresence.tasks"),
    approvals: t("customerApp.companionPresence.approvals"),
    notifications: t("customerApp.companionPresence.notifications"),
    askAipify: t("customerApp.companionPresence.askAipify"),
    privacyNote: t("customerApp.companionPresence.privacyNote"),
    quietMode: t("customerApp.companionPresence.quietMode"),
    quietModeOff: t("customerApp.companionPresence.quietModeOff"),
    acknowledgeCritical: t("customerApp.companionPresence.acknowledgeCritical"),
    loading: t("customerApp.companionPresence.loading"),
    newSinceLogin: t("customerApp.companionPresence.newSinceLogin"),
    unresolvedApprovals: t("customerApp.companionPresence.unresolvedApprovals"),
  };
}
