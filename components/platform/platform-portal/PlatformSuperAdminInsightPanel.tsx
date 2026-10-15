"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PlatformLayoutClasses } from "@/lib/design";
import { SUPER_ADMIN_DASHBOARD_HREF } from "@/lib/super-portal/dashboard-access-constants";
import { parseSuperPortalDashboard } from "@/lib/super-portal/parse";
import {
  toPlatformSuperAdminInsightView,
  type PlatformSuperAdminInsightView,
} from "@/lib/super-portal/platform-insight";
import { armInsightFetchTimeout } from "@/lib/super-portal/platform-insight-client";
import type { PlatformSuperAdminInsightLabels } from "@/lib/super-portal/platform-insight-labels";

type PlatformSuperAdminInsightPanelProps = {
  labels: PlatformSuperAdminInsightLabels;
};

function formatPct(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${value}%`;
}

function statusLabel(
  status: PlatformSuperAdminInsightView["global_platform_status"],
  labels: PlatformSuperAdminInsightLabels,
): string {
  if (status === "operational") return labels.statuses.operational;
  if (status === "attention_required") return labels.statuses.attention_required;
  return labels.statuses.unknown;
}

function InsightMetric({
  label,
  value,
  elevated,
}: {
  label: string;
  value: string | number;
  elevated?: boolean;
}) {
  return (
    <div
      className={`flex h-full flex-col rounded-xl border px-4 py-3.5 shadow-sm ${
        elevated
          ? "border-rose-200/90 bg-rose-50/70 dark:border-rose-800/70 dark:bg-rose-950/35"
          : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/50"
      }`}
    >
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd
        className={`mt-2 text-2xl font-semibold tabular-nums tracking-tight ${
          elevated
            ? "text-rose-950 dark:text-rose-50"
            : "text-slate-900 dark:text-slate-100"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

/** Compact in-card pulse skeleton — avoids the shared loader’s large empty plane and default English copy. */
function InsightLoadingSkeleton({ label }: { label: string }) {
  return (
    <div
      className="mt-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
      data-state="loading"
      data-area="super-admin-insight-loading"
    >
      <span className="sr-only">{label}</span>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-[4.25rem] animate-pulse rounded-xl border border-violet-100/90 bg-white/80 dark:border-violet-900/40 dark:bg-slate-900/35"
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}

export default function PlatformSuperAdminInsightPanel({
  labels,
}: PlatformSuperAdminInsightPanelProps) {
  const [insight, setInsight] = useState<PlatformSuperAdminInsightView | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const requestRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    const clearTimeoutArm = armInsightFetchTimeout(controller);

    setLoading(true);
    setLoadError(false);
    setInsight(null);

    try {
      const res = await fetch("/api/super-portal/dashboard", {
        credentials: "same-origin",
        cache: "no-store",
        signal: controller.signal,
      });
      if (!res.ok) {
        if (requestRef.current === controller) setLoadError(true);
        return;
      }

      let payload: unknown;
      try {
        payload = await res.json();
      } catch {
        if (requestRef.current === controller) setLoadError(true);
        return;
      }

      const parsed = parseSuperPortalDashboard(payload);
      if (!parsed) {
        if (requestRef.current === controller) setLoadError(true);
        return;
      }

      if (requestRef.current === controller) {
        setInsight(toPlatformSuperAdminInsightView(parsed));
      }
    } catch {
      if (requestRef.current !== controller) return;
      // Timeout (AbortError) and network failures share the existing calm error + retry UI.
      // Unmount / superseded requests are ignored via requestRef above.
      setLoadError(true);
    } finally {
      clearTimeoutArm();
      if (requestRef.current === controller) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void load();
    return () => {
      const active = requestRef.current;
      requestRef.current = null;
      active?.abort();
    };
  }, [load]);

  return (
    <section
      className={`${PlatformLayoutClasses.card} border-violet-200/80 bg-violet-50/40 dark:border-violet-900/50 dark:bg-violet-950/20`}
      data-area="super-admin-insight"
      aria-labelledby="super-admin-insight-title"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2
            id="super-admin-insight-title"
            className="text-base font-semibold text-slate-900 dark:text-slate-100"
          >
            {labels.title}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{labels.subtitle}</p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{labels.periodNote}</p>
        </div>
        <Link
          href={SUPER_ADMIN_DASHBOARD_HREF}
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-violet-300 bg-white px-3 py-2 text-sm font-medium text-violet-900 shadow-sm transition hover:bg-violet-50 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-100 dark:hover:bg-violet-900"
        >
          {labels.openSuperDashboard}
        </Link>
      </div>

      {loading ? <InsightLoadingSkeleton label={labels.loading} /> : null}

      {!loading && loadError ? (
        <div
          role="alert"
          className="mt-6 flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-rose-800 dark:bg-rose-950/40"
        >
          <p className="text-sm text-rose-900 dark:text-rose-100">{labels.loadError}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-sm font-medium text-rose-900 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-50"
          >
            {labels.retry}
          </button>
        </div>
      ) : null}

      {!loading && !loadError && insight ? (
        <>
          <dl className={`mt-6 ${PlatformLayoutClasses.metricGrid}`}>
            <InsightMetric
              label={labels.totalOrganizations}
              value={insight.total_organizations}
            />
            <InsightMetric
              label={labels.totalRegisteredUsers}
              value={insight.total_registered_users}
            />
            <InsightMetric
              label={labels.totalActiveSubscriptions}
              value={insight.total_active_subscriptions}
            />
            <InsightMetric
              label={labels.activePlatformSupportAdmins}
              value={insight.active_platform_support_administrators}
            />
            <InsightMetric
              label={labels.openCriticalIncidents}
              value={insight.open_critical_incidents}
              elevated={insight.open_critical_incidents > 0}
            />
            <InsightMetric
              label={labels.globalPlatformStatus}
              value={statusLabel(insight.global_platform_status, labels)}
              elevated={insight.global_platform_status === "attention_required"}
            />
            <InsightMetric
              label={labels.organizationGrowth30d}
              value={formatPct(insight.organization_growth_30d_pct)}
            />
            <InsightMetric
              label={labels.subscriptionGrowth30d}
              value={formatPct(insight.subscription_growth_30d_pct)}
            />
            <InsightMetric
              label={labels.executiveAlertCount}
              value={insight.executive_alert_count}
              elevated={insight.executive_alert_count > 0}
            />
          </dl>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            {labels.privacyNote}
          </p>
        </>
      ) : null}
    </section>
  );
}
