import type { PresenceNotificationLevel } from "@/lib/presence/notifications";

export type UnifiedNotificationCenterLabels = {
  title: string;
  close: string;
  emptyTitle: string;
  emptyDescription: string;
  markRead: string;
  readStatusUnread: string;
  readStatusRead: string;
  archive: string;
  openAction: string;
  dismiss: string;
  viewAll: string;
  viewAllHref: string;
  manageSettings: string;
  manageSettingsHref: string;
  soundToggleLabel: string;
  soundOn: string;
  soundOff: string;
  soundToggleLoading: string;
  soundToggleLoadError: string;
  soundToggleRetry: string;
  soundToggleSaving: string;
  soundToggleSaved: string;
  soundToggleSaveError: string;
  unreadSummary: string;
  ariaBell: string;
  ariaUnread: string;
  levels: Record<PresenceNotificationLevel, string>;
  eventTypes: {
    companion_reply_ready: string;
    playful_bell_moment: string;
    approval_awaiting_action: string;
    default: string;
  };
};

export function buildUnifiedNotificationCenterLabels(
  t: (key: string) => string,
): UnifiedNotificationCenterLabels {
  const base = "shell.notificationCenter";
  return {
    title: t(`${base}.title`),
    close: t(`${base}.close`),
    emptyTitle: t(`${base}.emptyTitle`),
    emptyDescription: t(`${base}.emptyDescription`),
    markRead: t(`${base}.markRead`),
    readStatusUnread: t(`${base}.readStatusUnread`),
    readStatusRead: t(`${base}.readStatusRead`),
    archive: t(`${base}.archive`),
    openAction: t(`${base}.openAction`),
    dismiss: t(`${base}.dismiss`),
    viewAll: t(`${base}.viewAll`),
    viewAllHref: "/app/notifications",
    manageSettings: t(`${base}.manageSettings`),
    manageSettingsHref: "/app/account/notification-settings",
    soundToggleLabel: t(`${base}.soundToggleLabel`),
    soundOn: t(`${base}.soundOn`),
    soundOff: t(`${base}.soundOff`),
    soundToggleLoading: t(`${base}.soundToggleLoading`),
    soundToggleLoadError: t(`${base}.soundToggleLoadError`),
    soundToggleRetry: t(`${base}.soundToggleRetry`),
    soundToggleSaving: t(`${base}.soundToggleSaving`),
    soundToggleSaved: t(`${base}.soundToggleSaved`),
    soundToggleSaveError: t(`${base}.soundToggleSaveError`),
    unreadSummary: t(`${base}.unreadSummary`),
    ariaBell: t(`${base}.ariaBell`),
    ariaUnread: t(`${base}.ariaUnread`),
    levels: {
      informational: t(`${base}.levels.informational`),
      important: t(`${base}.levels.important`),
      action_required: t(`${base}.levels.action_required`),
      critical: t(`${base}.levels.critical`),
    },
    eventTypes: {
      companion_reply_ready: t(`${base}.eventTypes.companionReplyReady`),
      playful_bell_moment: t(`${base}.eventTypes.playfulBellMoment`),
      approval_awaiting_action: t(`${base}.eventTypes.approvalAwaitingAction`),
      default: t(`${base}.eventTypes.default`),
    },
  };
}

export function formatUnreadAriaLabel(labels: UnifiedNotificationCenterLabels, count: number): string {
  return labels.ariaUnread.replace("{count}", String(count));
}

export function formatUnreadSummary(labels: UnifiedNotificationCenterLabels, count: number): string {
  return labels.unreadSummary.replace("{count}", String(count));
}
