"use client";

import Link from "next/link";
import { NotificationSettingsSection } from "@/components/app/account/NotificationSettingsSection";
import { RecentNotificationsSection } from "@/components/app/account/RecentNotificationsSection";
import { useUnifiedNotificationFeed } from "@/components/presence/UnifiedNotificationFeedProvider";
import type { AccountNotificationsPageLabels } from "@/lib/app/account/account-notifications-labels";
import { formatUnreadSummary } from "@/lib/presence/unified-notification-feed";

type AccountNotificationsPanelProps = {
  labels: AccountNotificationsPageLabels;
  locale: string;
};

export function AccountNotificationsPanel({ labels, locale }: AccountNotificationsPanelProps) {
  const feed = useUnifiedNotificationFeed();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-5 sm:px-6">
      <header className="space-y-2">
        <Link
          href="/app/account/preferences"
          className="text-sm font-medium text-aipify-companion hover:text-aipify-companion/80"
        >
          {labels.back}
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
          <p className="mt-1 text-gray-600">{labels.subtitle}</p>
          {feed.unreadCount > 0 ? (
            <p className="mt-2 text-sm text-gray-500">
              {formatUnreadSummary(feed.labels, feed.unreadCount)}
            </p>
          ) : null}
        </div>
      </header>

      <NotificationSettingsSection
        labels={labels}
        initialPreferences={feed.preferences}
        onPreferencesSaved={(preferences) => {
          feed.applyPreferences(preferences);
        }}
      />

      <RecentNotificationsSection
        labels={labels.recent}
        actionErrorLabel={labels.saveError}
        notifications={feed.notifications}
        loading={feed.loading}
        locale={locale}
        onFeedRefresh={feed.refresh}
      />
    </div>
  );
}
