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
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-5 sm:px-6">
      <header className="space-y-2">
        <Link
          href="/app/account/preferences"
          className="text-sm font-medium text-aipify-companion hover:text-aipify-companion/80"
        >
          {labels.back}
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
            <p className="mt-1 text-gray-600">{labels.subtitle}</p>
            {orgGate.isReady && orgGate.organizationName ? (
              <p className="mt-2 text-sm text-aipify-text-secondary">
                {labels.activeOrganization.replace("{name}", orgGate.organizationName)}
              </p>
            ) : null}
          </div>
          <Link
            href="/app/notifications"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-aipify-border bg-white px-4 py-2 text-sm font-semibold text-aipify-text transition hover:bg-aipify-surface-muted"
          >
            {labels.manageInboxLink}
          </Link>
        </div>
      </header>

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
          onPreferencesSaved={(preferences) => {
            feed.applyPreferences(preferences);
          }}
        />
      </NotificationOrganizationGate>
    </div>
  );
}
