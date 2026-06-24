"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Circle,
  Info,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import type { AccountNotificationsPageLabels } from "@/lib/app/account/account-notifications-labels";
import {
  countUnreadNotifications,
  filterAccountRecentNotifications,
  formatNotificationTimestamp,
  isValidInternalNotificationHref,
  markAllNotificationsReadLocally,
  markNotificationReadLocally,
  performPresenceNotificationAction,
  removeNotificationLocally,
} from "@/lib/app/account/recent-notifications";
import type { PresenceNotification } from "@/lib/presence/notification-state";
import type { PresenceNotificationLevel } from "@/lib/presence/notifications";
import { isNotificationUnread } from "@/lib/presence/unified-notification-feed";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";

type RecentNotificationsSectionProps = {
  labels: AccountNotificationsPageLabels["recent"];
  actionErrorLabel: string;
  notifications: PresenceNotification[];
  loading: boolean;
  locale: string;
  onFeedRefresh: () => Promise<boolean>;
};

function eventTypeLabel(
  labels: AccountNotificationsPageLabels["recent"],
  eventType: string,
): string {
  if (eventType === "companion_reply_ready") return labels.eventTypes.companion_reply_ready;
  if (eventType === "playful_bell_moment") return labels.eventTypes.playful_bell_moment;
  if (eventType === "approval_awaiting_action") return labels.eventTypes.approval_awaiting_action;
  return labels.eventTypes.default;
}

function notificationIcon(eventType: string, level: PresenceNotificationLevel) {
  if (eventType === "companion_reply_ready") {
    return <MessageCircle className="h-5 w-5" aria-hidden="true" />;
  }
  if (eventType === "playful_bell_moment") {
    return <Sparkles className="h-5 w-5" aria-hidden="true" />;
  }
  if (eventType === "approval_awaiting_action") {
    return <CheckCircle2 className="h-5 w-5" aria-hidden="true" />;
  }
  if (level === "critical" || level === "action_required") {
    return <AlertTriangle className="h-5 w-5" aria-hidden="true" />;
  }
  if (level === "important") {
    return <Bell className="h-5 w-5" aria-hidden="true" />;
  }
  return <Info className="h-5 w-5" aria-hidden="true" />;
}

export function RecentNotificationsSection({
  labels,
  actionErrorLabel,
  notifications,
  loading,
  locale,
  onFeedRefresh,
}: RecentNotificationsSectionProps) {
  const router = useRouter();
  const [items, setItems] = useState<PresenceNotification[]>([]);
  const [actionError, setActionError] = useState(false);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [bulkPending, setBulkPending] = useState(false);

  useEffect(() => {
    setItems(filterAccountRecentNotifications(notifications));
  }, [notifications]);

  const unreadCount = useMemo(() => countUnreadNotifications(items), [items]);

  const setPending = useCallback((notificationId: string, pending: boolean) => {
    setPendingIds((current) => {
      const next = new Set(current);
      if (pending) next.add(notificationId);
      else next.delete(notificationId);
      return next;
    });
  }, []);

  const handleMarkRead = useCallback(
    async (notificationId: string) => {
      setActionError(false);
      setPending(notificationId, true);
      const previous = items;
      setItems((current) => markNotificationReadLocally(current, notificationId));
      const ok = await performPresenceNotificationAction(notificationId, "mark_as_reviewed");
      setPending(notificationId, false);
      if (!ok) {
        setItems(previous);
        setActionError(true);
        return;
      }
      await onFeedRefresh();
    },
    [items, onFeedRefresh, setPending],
  );

  const handleArchive = useCallback(
    async (notificationId: string) => {
      setActionError(false);
      setPending(notificationId, true);
      const previous = items;
      setItems((current) => removeNotificationLocally(current, notificationId));
      const ok = await performPresenceNotificationAction(notificationId, "dismiss");
      setPending(notificationId, false);
      if (!ok) {
        setItems(previous);
        setActionError(true);
        return;
      }
      await onFeedRefresh();
    },
    [items, onFeedRefresh, setPending],
  );

  const handleOpen = useCallback(
    async (notification: PresenceNotification) => {
      const href = notification.action_href?.trim();
      if (!isValidInternalNotificationHref(href)) return;

      if (isNotificationUnread(notification)) {
        await handleMarkRead(notification.id);
      }

      router.push(href);
    },
    [handleMarkRead, router],
  );

  const handleMarkAllRead = useCallback(async () => {
    const unreadItems = items.filter(isNotificationUnread);
    if (unreadItems.length === 0) return;

    setActionError(false);
    setBulkPending(true);
    const previous = items;
    setItems((current) => markAllNotificationsReadLocally(current));

    const results = await Promise.all(
      unreadItems.map((item) => performPresenceNotificationAction(item.id, "mark_as_reviewed")),
    );

    setBulkPending(false);
    if (results.some((ok) => !ok)) {
      setItems(previous);
      setActionError(true);
      return;
    }
    await onFeedRefresh();
  }, [items, onFeedRefresh]);

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-aipify-text">{labels.sectionTitle}</h2>
          <p className="mt-1 text-sm text-aipify-text-secondary">{labels.sectionDescription}</p>
        </div>
        {unreadCount > 0 ? (
          <button
            type="button"
            onClick={() => void handleMarkAllRead()}
            disabled={bulkPending}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-aipify-border bg-white px-4 py-2 text-sm font-semibold text-aipify-text transition hover:bg-aipify-surface-muted disabled:opacity-60"
          >
            {labels.markAllAsRead}
          </button>
        ) : null}
      </header>

      {actionError ? <p className="text-sm text-rose-800">{actionErrorLabel}</p> : null}

      {loading ? (
        <div className="rounded-xl border border-aipify-border bg-white p-6 shadow-sm" aria-busy="true" />
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-aipify-border bg-white p-6 text-center shadow-sm">
          <h3 className="text-base font-semibold text-aipify-text">{labels.emptyTitle}</h3>
          <p className="mt-2 text-sm text-aipify-text-secondary">{labels.emptyDescription}</p>
        </div>
      ) : (
        <ul className="divide-y divide-aipify-border rounded-xl border border-aipify-border bg-white shadow-sm">
          {items.map((notification) => {
            const unread = isNotificationUnread(notification);
            const openHref = isValidInternalNotificationHref(notification.action_href)
              ? notification.action_href
              : null;
            const isPending = pendingIds.has(notification.id);

            return (
              <li key={notification.id} className="px-4 py-4 sm:px-5">
                <div className="flex gap-3">
                  <div
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-aipify-surface-muted text-aipify-companion"
                    aria-hidden="true"
                  >
                    {notificationIcon(notification.event_type, notification.level)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <AipifyStatusBadge
                        kind={unread ? "needs_attention" : "verified"}
                        label={unread ? labels.readStatusUnread : labels.readStatusRead}
                      />
                      <span className="text-xs text-aipify-text-muted">
                        {formatNotificationTimestamp(notification.created_at, locale)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-aipify-text">{notification.title}</p>
                    {notification.body ? (
                      <p className="mt-1 text-sm text-aipify-text-secondary">{notification.body}</p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-aipify-text-muted">
                      <span>{labels.categoryLabel}</span>
                      <AipifyStatusBadge
                        kind="waiting"
                        label={eventTypeLabel(labels, notification.event_type)}
                      />
                      <AipifyStatusBadge
                        kind={
                          notification.level === "critical" || notification.level === "action_required"
                            ? "needs_attention"
                            : "waiting"
                        }
                        label={labels.levels[notification.level]}
                      />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {openHref ? (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => void handleOpen(notification)}
                          className="inline-flex min-h-[36px] items-center justify-center rounded-lg bg-aipify-companion px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
                        >
                          {labels.openAction}
                        </button>
                      ) : null}
                      {unread ? (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => void handleMarkRead(notification.id)}
                          className="inline-flex min-h-[36px] items-center justify-center rounded-lg border border-aipify-border px-3 py-1.5 text-xs font-semibold text-aipify-text transition hover:bg-aipify-surface-muted disabled:opacity-60"
                        >
                          {labels.markAsRead}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => void handleArchive(notification.id)}
                          className="inline-flex min-h-[36px] items-center justify-center rounded-lg border border-aipify-border px-3 py-1.5 text-xs font-semibold text-aipify-text transition hover:bg-aipify-surface-muted disabled:opacity-60"
                        >
                          {labels.archive}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="hidden sm:block" aria-hidden="true">
                    {unread ? (
                      <Circle className="h-4 w-4 text-aipify-companion" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
