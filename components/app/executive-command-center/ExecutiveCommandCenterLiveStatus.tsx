"use client";

import { useEffect, useState } from "react";
import { formatLiveRefreshStatus } from "@/lib/command-center/format-live-refresh-status";
import type { buildExecutiveCommandCenterLabels } from "@/lib/executive-command-center-engine/labels";
import { useExecutiveCommandCenterRefresh } from "./ExecutiveCommandCenterRefreshContext";

type Labels = ReturnType<typeof buildExecutiveCommandCenterLabels>;

export function ExecutiveCommandCenterLiveStatus({ labels }: { labels: Labels }) {
  const { lastUpdatedAt, refreshError, refreshing, silentRefreshing } =
    useExecutiveCommandCenterRefresh();
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 15_000);
    return () => window.clearInterval(timer);
  }, []);

  const live = labels.liveRefresh;
  const errorText = refreshError ? live.refreshFailed : null;
  const statusText = formatLiveRefreshStatus(
    lastUpdatedAt,
    errorText,
    {
      updatedNow: live.updatedNow,
      updatedSecondsAgo: live.updatedSecondsAgo,
      updatedMinutesAgo: live.updatedMinutesAgo,
      refreshFailed: live.refreshFailed,
    },
    nowMs,
  );

  if (!statusText && !refreshing && !silentRefreshing) {
    return null;
  }

  const activeText =
    refreshing || silentRefreshing ? live.refreshing : statusText;

  return (
    <p
      className="text-xs text-aipify-text-muted"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {activeText}
    </p>
  );
}
