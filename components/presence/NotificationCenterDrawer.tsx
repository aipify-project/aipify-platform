"use client";

import Link from "next/link";
import { useUnifiedNotificationFeed } from "./UnifiedNotificationFeedProvider";
import type { PresenceNotification } from "@/lib/presence/notification-state";
import type { PresenceNotificationLevel } from "@/lib/presence/notifications";
import { formatUnreadSummary, type UnifiedNotificationCenterLabels } from "@/lib/presence/unified-notification-feed";
import { isNotificationUnread } from "@/lib/presence/unified-notification-feed";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import { NotificationCenterSoundToggle } from "@/components/presence/NotificationCenterSoundToggle";

const LEVEL_STYLES: Record<PresenceNotificationLevel, string> = {
  informational: "bg-gray-100 text-gray-700",
  important: "bg-sky-100 text-sky-800",
  action_required: "bg-amber-100 text-amber-900",
  critical: "bg-rose-100 text-rose-800",
};

function eventTypeLabel(
  labels: UnifiedNotificationCenterLabels,
  eventType: string,
): string {
  if (eventType === "companion_reply_ready") return labels.eventTypes.companion_reply_ready;
  if (eventType === "playful_bell_moment") return labels.eventTypes.playful_bell_moment;
  if (eventType === "approval_awaiting_action") return labels.eventTypes.approval_awaiting_action;
  return labels.eventTypes.default;
}

type NotificationCenterListProps = {
  labels: UnifiedNotificationCenterLabels;
  notifications: PresenceNotification[];
  onOpen: (notification: PresenceNotification) => void;
  onMarkRead: (notificationId: string) => void;
  onArchive: (notificationId: string) => void;
  compact?: boolean;
};

export function NotificationCenterList({
  labels,
  notifications,
  onOpen,
  onMarkRead,
  onArchive,
  compact = false,
}: NotificationCenterListProps) {
  if (notifications.length === 0) {
    return (
      <div className={compact ? "px-5 py-8 text-center" : "rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm"}>
        <h2 className="text-lg font-semibold text-gray-900">{labels.emptyTitle}</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{labels.emptyDescription}</p>
      </div>
    );
  }

  return (
    <ul className={compact ? "divide-y divide-gray-100" : "divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-sm"}>
      {notifications.map((notification) => {
        const unread = isNotificationUnread(notification);
        return (
          <li key={notification.id} className={compact ? "px-5 py-4" : "px-6 py-4"}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${LEVEL_STYLES[notification.level]}`}
                  >
                    {labels.levels[notification.level]}
                  </span>
                  <span className="text-xs text-gray-500">
                    {eventTypeLabel(labels, notification.event_type)}
                  </span>
                  <AipifyStatusBadge
                    kind={unread ? "needs_attention" : "verified"}
                    label={unread ? labels.readStatusUnread : labels.readStatusRead}
                  />
                </div>
                <p className="mt-2 text-base font-medium text-gray-900">{notification.title}</p>
                {notification.body ? (
                  <p className="mt-1 text-sm text-gray-600">{notification.body}</p>
                ) : null}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {notification.action_href ? (
                <button
                  type="button"
                  onClick={() => void onOpen(notification)}
                  className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700"
                >
                  {labels.openAction}
                </button>
              ) : null}
              {unread ? (
                <button
                  type="button"
                  onClick={() => void onMarkRead(notification.id)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  {labels.markRead}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void onArchive(notification.id)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  {labels.archive}
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function NotificationCenterDrawer() {
  const feed = useUnifiedNotificationFeed();
  const { labels, centerOpen, closeCenter, notifications, unreadCount, openNotification, dismissNotification, markNotificationRead } =
    feed;

  if (!centerOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px]"
        aria-label={labels.close}
        onClick={closeCenter}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
            {unreadCount > 0 ? (
              <p className="mt-1 text-sm text-gray-500">
                {formatUnreadSummary(labels, unreadCount)}
              </p>
            ) : null}
            <NotificationCenterSoundToggle labels={labels} />
            <Link
              href={labels.manageSettingsHref}
              onClick={closeCenter}
              className="mt-2 inline-flex text-xs font-medium text-aipify-companion hover:underline"
            >
              {labels.manageSettings}
            </Link>
          </div>
          <button
            type="button"
            onClick={closeCenter}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label={labels.close}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <NotificationCenterList
            labels={labels}
            notifications={notifications}
            onOpen={openNotification}
            onMarkRead={markNotificationRead}
            onArchive={dismissNotification}
            compact
          />
        </div>

        <footer className="border-t border-gray-200 px-5 py-4">
          <Link
            href={labels.viewAllHref}
            onClick={closeCenter}
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            {labels.viewAll}
          </Link>
        </footer>
      </aside>
    </div>
  );
}
