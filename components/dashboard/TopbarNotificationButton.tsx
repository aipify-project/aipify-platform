"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  POLL_INTERVAL_HIDDEN_BADGE_MS,
  POLL_INTERVAL_NOTIFICATIONS_MS,
  dedupeFetch,
  shouldPollNotifications,
  usePollingTask,
} from "@/lib/polling";
import { createClient } from "@/lib/supabase/client";

type TopbarNotificationButtonProps = {
  label: string;
};

type UnreadCounts = {
  unread: number;
  critical_unread: number;
};

export default function TopbarNotificationButton({ label }: TopbarNotificationButtonProps) {
  const pathname = usePathname();
  const [counts, setCounts] = useState<UnreadCounts>({ unread: 0, critical_unread: 0 });

  const loadUnread = useCallback(async () => {
    if (!shouldPollNotifications(pathname)) {
      return true;
    }

    try {
      const ok = await dedupeFetch("notification-unread-count", async () => {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("get_notification_unread_count");
        if (!error && data && typeof data === "object") {
          const record = data as Record<string, unknown>;
          setCounts({
            unread: Number(record.unread ?? 0),
            critical_unread: Number(record.critical_unread ?? 0),
          });
        }
        return !error;
      });
      return ok;
    } catch {
      return false;
    }
  }, [pathname]);

  useEffect(() => {
    void loadUnread();
  }, [loadUnread]);

  const pollingEnabled = shouldPollNotifications(pathname);

  usePollingTask({
    taskKey: "notification-unread-count",
    intervalMs: pollingEnabled ? POLL_INTERVAL_NOTIFICATIONS_MS : 0,
    hiddenIntervalMs: pollingEnabled ? POLL_INTERVAL_HIDDEN_BADGE_MS : undefined,
    enabled: pollingEnabled,
    runImmediately: false,
    refreshOnVisible: true,
    execute: loadUnread,
  });

  const showBadge = counts.unread > 0 || counts.critical_unread > 0;
  const critical = counts.critical_unread > 0;

  return (
    <button
      type="button"
      className="relative inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
      aria-label={label}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>
      {showBadge ? (
        <span
          className={`absolute right-2 top-2 flex h-2 min-w-2 items-center justify-center rounded-full ring-2 ring-white ${
            critical ? "bg-rose-500" : "bg-violet-500"
          }`}
          aria-hidden="true"
        />
      ) : null}
    </button>
  );
}
