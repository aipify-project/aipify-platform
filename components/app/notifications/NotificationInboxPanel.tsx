"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Archive,
  Bell,
  CheckCircle2,
  Info,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import type { NotificationInboxPageLabels } from "@/lib/app/notifications/labels";
import {
  fetchNotificationInboxPage,
  formatNotificationTimestamp,
  getNotificationPresentationStatus,
  INBOX_PAGE_SIZE,
  isValidInternalNotificationHref,
  patchAllNotificationsReadLocally,
  patchNotificationArchivedLocally,
  patchNotificationReadLocally,
  performPresenceNotificationAction,
  performPresenceNotificationBulkAction,
  removeNotificationFromActiveList,
  type NotificationInboxFilter,
} from "@/lib/app/notifications/inbox";
import type { PresenceNotification } from "@/lib/presence/notification-state";
import type { PresenceNotificationLevel } from "@/lib/presence/notifications";
import { useOptionalUnifiedNotificationFeed } from "@/components/presence/UnifiedNotificationFeedProvider";

function eventTypeLabel(
  labels: NotificationInboxPageLabels,
  eventType: string,
): string {
  if (eventType === "companion_reply_ready") return labels.eventTypes.companion_reply_ready;
  if (eventType === "playful_bell_moment") return labels.eventTypes.playful_bell_moment;
  if (eventType === "approval_awaiting_action") return labels.eventTypes.approval_awaiting_action;
  return labels.eventTypes.default;
}

function notificationIcon(eventType: string, level: PresenceNotificationLevel) {
  if (eventType === "companion_reply_ready") return <MessageCircle className="h-5 w-5" aria-hidden="true" />;
  if (eventType === "playful_bell_moment") return <Sparkles className="h-5 w-5" aria-hidden="true" />;
  if (eventType === "approval_awaiting_action") return <CheckCircle2 className="h-5 w-5" aria-hidden="true" />;
  if (level === "critical" || level === "action_required") {
    return <AlertTriangle className="h-5 w-5" aria-hidden="true" />;
  }
  if (level === "important") return <Bell className="h-5 w-5" aria-hidden="true" />;
  return <Info className="h-5 w-5" aria-hidden="true" />;
}

function statusBadge(
  labels: NotificationInboxPageLabels,
  notification: PresenceNotification,
) {
  const status = getNotificationPresentationStatus(notification);
  if (status === "archived") {
    return <AipifyStatusBadge kind="waiting" label={labels.readStatusArchived} />;
  }
  if (status === "unread") {
    return <AipifyStatusBadge kind="needs_attention" label={labels.readStatusUnread} />;
  }
  return <AipifyStatusBadge kind="verified" label={labels.readStatusRead} />;
}

type NotificationInboxPanelProps = {
  labels: NotificationInboxPageLabels;
  locale: string;
};

export function NotificationInboxPanel({ labels, locale }: NotificationInboxPanelProps) {
  const router = useRouter();
  const feed = useOptionalUnifiedNotificationFeed();
  const [filter, setFilter] = useState<NotificationInboxFilter>("unread");
  const [items, setItems] = useState<PresenceNotification[]>([]);
  const [counts, setCounts] = useState({ unread: 0, all: 0, archived: 0 });
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [actionError, setActionError] = useState(false);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [bulkPending, setBulkPending] = useState(false);

  const loadPage = useCallback(
    async (nextFilter: NotificationInboxFilter, nextOffset: number, append: boolean) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setActionError(false);

      const page = await fetchNotificationInboxPage({
        filter: nextFilter,
        offset: nextOffset,
        limit: INBOX_PAGE_SIZE,
      });

      setCounts(page.counts);
      setHasMore(page.hasMore);
      setOffset(nextOffset);
      setFilter(nextFilter);
      setItems((current) => (append ? [...current, ...page.notifications] : page.notifications));

      if (append) setLoadingMore(false);
      else setLoading(false);
    },
    [],
  );

  useEffect(() => {
    void loadPage("unread", 0, false);
  }, [loadPage]);

  const setPending = useCallback((notificationId: string, pending: boolean) => {
    setPendingIds((current) => {
      const next = new Set(current);
      if (pending) next.add(notificationId);
      else next.delete(notificationId);
      return next;
    });
  }, []);

  const refreshFeed = useCallback(async () => {
    await feed?.refresh();
  }, [feed]);

  const handleFilterChange = useCallback(
    (nextFilter: NotificationInboxFilter) => {
      void loadPage(nextFilter, 0, false);
    },
    [loadPage],
  );

  const handleMarkRead = useCallback(
    async (notificationId: string) => {
      setActionError(false);
      setPending(notificationId, true);
      const previous = items;
      setItems((current) => patchNotificationReadLocally(current, notificationId));
      const ok = await performPresenceNotificationAction(notificationId, "mark_as_reviewed");
      setPending(notificationId, false);
      if (!ok) {
        setItems(previous);
        setActionError(true);
        return;
      }
      setCounts((current) => ({
        ...current,
        unread: Math.max(0, current.unread - 1),
      }));
      await refreshFeed();
    },
    [items, refreshFeed, setPending],
  );

  const handleArchive = useCallback(
    async (notificationId: string) => {
      setActionError(false);
      setPending(notificationId, true);
      const previous = items;
      setItems((current) =>
        filter === "archived"
          ? patchNotificationArchivedLocally(current, notificationId)
          : removeNotificationFromActiveList(current, notificationId),
      );
      const ok = await performPresenceNotificationAction(notificationId, "archive");
      setPending(notificationId, false);
      if (!ok) {
        setItems(previous);
        setActionError(true);
        return;
      }
      if (filter !== "archived") {
        setCounts((current) => ({
          ...current,
          archived: current.archived + 1,
          all: Math.max(0, current.all - 1),
          unread: Math.max(0, current.unread - (getNotificationPresentationStatus(previous.find((n) => n.id === notificationId)!) === "unread" ? 1 : 0)),
        }));
      }
      await refreshFeed();
    },
    [filter, items, refreshFeed, setPending],
  );

  const handleOpen = useCallback(
    async (notification: PresenceNotification) => {
      const href = notification.action_href?.trim();
      if (!isValidInternalNotificationHref(href)) return;
      if (getNotificationPresentationStatus(notification) === "unread") {
        await handleMarkRead(notification.id);
      }
      router.push(href);
    },
    [handleMarkRead, router],
  );

  const handleMarkAllRead = useCallback(async () => {
    setBulkPending(true);
    setActionError(false);
    const previous = items;
    setItems((current) => patchAllNotificationsReadLocally(current));
    const ok = await performPresenceNotificationBulkAction("mark_all_read");
    setBulkPending(false);
    if (!ok) {
      setItems(previous);
      setActionError(true);
      return;
    }
    await loadPage(filter, 0, false);
    await refreshFeed();
  }, [filter, items, loadPage, refreshFeed]);

  const handleArchiveAllRead = useCallback(async () => {
    if (!window.confirm(labels.archiveAllReadConfirm)) return;
    setBulkPending(true);
    setActionError(false);
    const ok = await performPresenceNotificationBulkAction("archive_all_read");
    setBulkPending(false);
    if (!ok) {
      setActionError(true);
      return;
    }
    await loadPage(filter, 0, false);
    await refreshFeed();
  }, [filter, labels.archiveAllReadConfirm, loadPage, refreshFeed]);

  const filterButtons = useMemo(
    () =>
      [
        { id: "unread" as const, label: labels.filters.unread, count: counts.unread },
        { id: "all" as const, label: labels.filters.all, count: counts.all },
        { id: "archived" as const, label: labels.filters.archived, count: counts.archived },
      ] as const,
    [counts, labels.filters],
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-5 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-aipify-text">{labels.title}</h1>
          <p className="mt-1 text-sm text-aipify-text-secondary">{labels.subtitle}</p>
        </div>
        <Link
          href="/app/account/notification-settings"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-aipify-border bg-white px-4 py-2 text-sm font-semibold text-aipify-text transition hover:bg-aipify-surface-muted"
        >
          {labels.manageSettingsLink}
        </Link>
      </header>

      <div className="flex flex-col gap-3 rounded-xl border border-aipify-border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => handleFilterChange(entry.id)}
              className={`inline-flex min-h-[40px] items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                filter === entry.id
                  ? "bg-aipify-companion text-white"
                  : "border border-aipify-border bg-white text-aipify-text hover:bg-aipify-surface-muted"
              }`}
            >
              <span>{entry.label}</span>
              <AipifyStatusBadge
                kind={filter === entry.id ? "verified" : "waiting"}
                label={String(entry.count)}
              />
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {filter !== "archived" && counts.unread > 0 ? (
            <button
              type="button"
              disabled={bulkPending}
              onClick={() => void handleMarkAllRead()}
              className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-aipify-border px-3 py-2 text-sm font-semibold text-aipify-text transition hover:bg-aipify-surface-muted disabled:opacity-60"
            >
              {labels.markAllAsRead}
            </button>
          ) : null}
          {filter === "all" && counts.all > counts.unread ? (
            <button
              type="button"
              disabled={bulkPending}
              onClick={() => void handleArchiveAllRead()}
              className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-aipify-border px-3 py-2 text-sm font-semibold text-aipify-text transition hover:bg-aipify-surface-muted disabled:opacity-60"
            >
              {labels.archiveAllRead}
            </button>
          ) : null}
        </div>
      </div>

      {actionError ? <p className="text-sm text-rose-800">{labels.actionError}</p> : null}

      {loading ? (
        <div className="rounded-xl border border-aipify-border bg-white p-8 shadow-sm" aria-busy="true" />
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-aipify-border bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-aipify-text">{labels.emptyTitle}</h2>
          <p className="mt-2 text-sm text-aipify-text-secondary">{labels.emptyDescription}</p>
        </div>
      ) : (
        <ul className="divide-y divide-aipify-border rounded-xl border border-aipify-border bg-white shadow-sm">
          {items.map((notification) => {
            const presentation = getNotificationPresentationStatus(notification);
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
                      {statusBadge(labels, notification)}
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
                      {presentation === "unread" ? (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => void handleMarkRead(notification.id)}
                          className="inline-flex min-h-[36px] items-center justify-center rounded-lg border border-aipify-border px-3 py-1.5 text-xs font-semibold text-aipify-text transition hover:bg-aipify-surface-muted disabled:opacity-60"
                        >
                          {labels.markAsRead}
                        </button>
                      ) : null}
                      {presentation !== "archived" ? (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => void handleArchive(notification.id)}
                          className="inline-flex min-h-[36px] items-center justify-center gap-1 rounded-lg border border-aipify-border px-3 py-1.5 text-xs font-semibold text-aipify-text transition hover:bg-aipify-surface-muted disabled:opacity-60"
                        >
                          <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                          {labels.archive}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {hasMore && !loading ? (
        <div className="flex justify-center">
          <button
            type="button"
            disabled={loadingMore}
            onClick={() => void loadPage(filter, offset + INBOX_PAGE_SIZE, true)}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-aipify-border bg-white px-5 py-2.5 text-sm font-semibold text-aipify-text transition hover:bg-aipify-surface-muted disabled:opacity-60"
          >
            {loadingMore ? labels.loadingMore : labels.loadMore}
          </button>
        </div>
      ) : null}
    </div>
  );
}
