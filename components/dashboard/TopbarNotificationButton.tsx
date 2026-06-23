"use client";

import {
  formatUnreadAriaLabel,
  isNotificationUnread,
  type UnifiedNotificationCenterLabels,
} from "@/lib/presence/unified-notification-feed";
import { useOptionalUnifiedNotificationFeed } from "@/components/presence/UnifiedNotificationFeedProvider";

type TopbarNotificationButtonProps = {
  label: string;
  feedLabels?: UnifiedNotificationCenterLabels;
};

function formatBadgeCount(count: number): string {
  if (count > 99) return "99+";
  return String(count);
}

export default function TopbarNotificationButton({ label, feedLabels }: TopbarNotificationButtonProps) {
  const feed = useOptionalUnifiedNotificationFeed();

  const unreadCount = feed?.unreadCount ?? 0;
  const pulseActive = feed?.pulseActive ?? false;
  const labels = feed?.labels ?? feedLabels;
  const showBadge = unreadCount > 0;
  const critical = feed?.notifications.some(
    (item) => item.level === "critical" && isNotificationUnread(item),
  );

  const ariaLabel =
    labels && unreadCount > 0
      ? formatUnreadAriaLabel(labels, unreadCount)
      : labels?.ariaBell ?? label;

  return (
    <button
      type="button"
      onClick={() => feed?.openCenter()}
      className={`relative inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 ${
        pulseActive ? "animate-[bell-ring_0.8s_ease-in-out_2] ring-2 ring-violet-300 ring-offset-2" : ""
      }`}
      aria-label={ariaLabel}
      aria-haspopup="dialog"
      aria-expanded={feed?.centerOpen ?? false}
    >
      <svg
        className={`h-5 w-5 ${pulseActive ? "text-violet-600" : ""}`}
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
          className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white ring-2 ring-white ${
            critical ? "bg-rose-500" : "bg-violet-600"
          }`}
          aria-hidden="true"
        >
          {formatBadgeCount(unreadCount)}
        </span>
      ) : null}
    </button>
  );
}
