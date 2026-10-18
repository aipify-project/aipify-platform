"use client";

import Link from "next/link";
import { NotificationSettingsSection } from "@/components/app/account/NotificationSettingsSection";
import { NotificationOrganizationGate } from "@/components/app/notifications/NotificationOrganizationGate";
import { useNotificationOrganizationGate } from "@/components/app/notifications/useNotificationOrganizationGate";
import { useUnifiedNotificationFeed } from "@/components/presence/UnifiedNotificationFeedProvider";
import type { NotificationSettingsPageLabels } from "@/lib/app/notifications/labels";

type NotificationSettingsPanelProps = {
  labels: NotificationSettingsPageLabels;
};

export function NotificationSettingsPanel({ labels }: NotificationSettingsPanelProps) {
  const feed = useUnifiedNotificationFeed();
  const orgGate = useNotificationOrganizationGate();

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/app/account/preferences"
          className="text-sm font-medium text-aipify-companion hover:text-aipify-companion/80"
        >
          {labels.back}
        </Link>
        <Link
          href="/app/notifications"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-aipify-border bg-white px-4 py-2 text-sm font-semibold text-aipify-text transition hover:bg-aipify-surface-muted"
        >
          {labels.manageInboxLink}
        </Link>
      </div>
      {orgGate.isReady && orgGate.organizationName ? (
        <p className="text-sm text-aipify-text-secondary">
          {labels.activeOrganization.replace("{name}", orgGate.organizationName)}
        </p>
      ) : null}

      <NotificationOrganizationGate
        loading={orgGate.loading}
        isReady={orgGate.isReady}
        accessMessageKey={orgGate.accessMessageKey}
        messages={labels.contextGate}
        onRetry={() => {
          void orgGate.refresh();
        }}
      >
        <NotificationSettingsSection
          labels={labels}
          organizationKey={orgGate.organizationKey}
          organizationName={orgGate.organizationName}
          organizationReady={orgGate.isReady}
          sharedPreferences={feed.preferences}
          preferencesStatus={feed.preferencesStatus}
          onRefreshSharedPreferences={feed.refreshPreferences}
          onPreferencesSaved={(preferences) => {
            feed.applyPreferences(preferences);
          }}
        />
      </NotificationOrganizationGate>
    </div>
  );
}
