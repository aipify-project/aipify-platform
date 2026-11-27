"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import { PlatformPageFrame } from "@/components/platform/PlatformPageFrame";
import { PlatformLayoutClasses } from "@/lib/design";
import type { AipifyStatusKind } from "@/lib/design/status-system";
import type { PlatformPortalCustomersPayload } from "@/lib/platform-portal";
import type { PlatformCustomerSuccessOverview } from "@/lib/platform-portal/customer-success";
import type { PlatformPortalDashboard } from "@/lib/platform-portal/types";

type OverviewLabels = {
  title: string;
  subtitle: string;
  scopeNote: string;
  loading: string;
  errorTitle: string;
  errorMessage: string;
  retry: string;
  unavailable: string;
  openOrganizations: string;
  openSuccess: string;
  openSupport: string;
  kpiCustomerOrgs: string;
  kpiCustomerOrgsHelp: string;
  kpiActiveSubscriptions: string;
  kpiActiveSubscriptionsHelp: string;
  kpiTrialing: string;
  kpiTrialingHelp: string;
  kpiPastDue: string;
  kpiPastDueHelp: string;
  kpiFollowUp: string;
  kpiFollowUpHelp: string;
  kpiOpenSupport: string;
  kpiOpenSupportHelp: string;
  followUpTitle: string;
  followUpEmpty: string;
  definitionsTitle: string;
  statusOk: string;
  statusAttention: string;
  statusCritical: string;
  statusInfo: string;
  statusUnknown: string;
};

type PlatformCustomersOverviewPanelProps = {
  labels: OverviewLabels;
};

type SectionState<T> =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; data: T };

type MetricTone = "neutral" | "success" | "warning" | "danger" | "muted";

function toneToKind(tone: MetricTone): AipifyStatusKind {
  switch (tone) {
    case "success":
      return "verified";
    case "warning":
      return "needs_attention";
    case "danger":
      return "not_allowed";
    case "muted":
      return "waiting";
    default:
      return "information";
  }
}

function MetricCard({
  label,
  help,
  value,
  tone,
  statusLabel,
}: {
  label: string;
  help: string;
  value: string;
  tone: MetricTone;
  statusLabel: string;
}) {
  const toneClass =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50/80 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-50"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50/80 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-50"
        : tone === "danger"
          ? "border-rose-200 bg-rose-50/80 text-rose-950 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-50"
          : tone === "muted"
            ? "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300"
            : "border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-50";

  return (
    <article className={`rounded-xl border p-4 shadow-sm ${toneClass}`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-xs font-medium uppercase tracking-wide opacity-80">{label}</h3>
        <AipifyStatusBadge kind={toneToKind(tone)} label={statusLabel} />
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-2 text-xs leading-relaxed opacity-80">{help}</p>
    </article>
  );
}

function displayCount(
  state: SectionState<unknown>,
  value: number | null | undefined,
  unavailable: string,
): { text: string; tone: MetricTone } {
  if (state.kind === "error") return { text: unavailable, tone: "muted" };
  if (state.kind === "loading" || value == null) return { text: unavailable, tone: "muted" };
  return { text: String(value), tone: "neutral" };
}

export function PlatformCustomersOverviewPanel({ labels }: PlatformCustomersOverviewPanelProps) {
  const [customers, setCustomers] = useState<SectionState<PlatformPortalCustomersPayload>>({
    kind: "loading",
  });
  const [success, setSuccess] = useState<SectionState<PlatformCustomerSuccessOverview>>({
    kind: "loading",
  });
  const [dashboard, setDashboard] = useState<SectionState<PlatformPortalDashboard>>({
    kind: "loading",
  });
  const [reloadToken, setReloadToken] = useState(0);

  const load = useCallback(async () => {
    setCustomers({ kind: "loading" });
    setSuccess({ kind: "loading" });
    setDashboard({ kind: "loading" });

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20_000);

    const loadJson = async <T,>(url: string): Promise<SectionState<T>> => {
      try {
        const res = await fetch(url, { cache: "no-store", signal: controller.signal });
        if (!res.ok) return { kind: "error" };
        const body = (await res.json()) as T;
        return { kind: "ready", data: body };
      } catch {
        return { kind: "error" };
      }
    };

    try {
      const [c, s, d] = await Promise.all([
        loadJson<PlatformPortalCustomersPayload>("/api/platform-portal/customers"),
        loadJson<PlatformCustomerSuccessOverview>("/api/platform-portal/customer-success"),
        loadJson<PlatformPortalDashboard>("/api/platform-portal/dashboard"),
      ]);
      setCustomers(c);
      setSuccess(s);
      setDashboard(d);
    } finally {
      window.clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, reloadToken]);

  const anyLoading =
    customers.kind === "loading" || success.kind === "loading" || dashboard.kind === "loading";
  const allFailed =
    customers.kind === "error" && success.kind === "error" && dashboard.kind === "error";

  if (anyLoading && customers.kind === "loading" && success.kind === "loading") {
    return (
      <PlatformPageFrame className="flex min-h-[50vh] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </PlatformPageFrame>
    );
  }

  if (allFailed) {
    return (
      <PlatformPageFrame>
        <div
          role="alert"
          className="flex flex-col gap-4 rounded-xl border border-rose-200 bg-rose-50 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-rose-800 dark:bg-rose-950/40"
        >
          <div>
            <h1 className="text-base font-semibold text-rose-950 dark:text-rose-50">
              {labels.errorTitle}
            </h1>
            <p className="mt-1 text-sm text-rose-800 dark:text-rose-200">{labels.errorMessage}</p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-900 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-50"
            onClick={() => setReloadToken((n) => n + 1)}
          >
            {labels.retry}
          </button>
        </div>
      </PlatformPageFrame>
    );
  }

  const orgTotal = customers.kind === "ready" ? customers.data.summary.total : null;
  const followUp =
    customers.kind === "ready"
      ? customers.data.summary.requiresAttention
      : success.kind === "ready"
        ? (success.data.summary?.requiresAttention ?? null)
        : null;
  const activeSubs =
    dashboard.kind === "ready"
      ? dashboard.data.active_subscriptions
      : customers.kind === "ready"
        ? customers.data.summary.active
        : null;
  const trialing =
    dashboard.kind === "ready" ? (dashboard.data.payment_status_summary?.trialing ?? null) : null;
  const pastDue =
    dashboard.kind === "ready" ? (dashboard.data.payment_status_summary?.past_due ?? null) : null;
  const openSupport = dashboard.kind === "ready" ? dashboard.data.open_support_workload : null;

  const orgMetric = displayCount(customers, orgTotal, labels.unavailable);
  const activeSource: SectionState<unknown> =
    dashboard.kind === "ready"
      ? dashboard
      : customers.kind === "ready"
        ? customers
        : dashboard.kind === "error" && customers.kind === "error"
          ? dashboard
          : { kind: "loading" };
  const activeMetric = displayCount(activeSource, activeSubs, labels.unavailable);
  const trialMetric = displayCount(dashboard, trialing, labels.unavailable);
  const pastDueMetric = displayCount(dashboard, pastDue, labels.unavailable);
  const followMetric = displayCount(
    customers.kind === "ready" ? customers : success,
    followUp,
    labels.unavailable,
  );
  const supportMetric = displayCount(dashboard, openSupport, labels.unavailable);

  const statusFor = (tone: MetricTone) => {
    switch (tone) {
      case "success":
        return labels.statusOk;
      case "warning":
        return labels.statusAttention;
      case "danger":
        return labels.statusCritical;
      case "muted":
        return labels.unavailable;
      default:
        return labels.statusInfo;
    }
  };

  return (
    <PlatformPageFrame>
      <header className={PlatformLayoutClasses.pageHeader}>
        <h1 className={PlatformLayoutClasses.pageTitle}>{labels.title}</h1>
        <p className={PlatformLayoutClasses.pageSubtitle}>{labels.subtitle}</p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{labels.scopeNote}</p>
      </header>

      <section className={PlatformLayoutClasses.metricGridDense} aria-label={labels.title}>
        <MetricCard
          label={labels.kpiCustomerOrgs}
          help={labels.kpiCustomerOrgsHelp}
          value={orgMetric.text}
          tone={orgMetric.tone}
          statusLabel={statusFor(orgMetric.tone)}
        />
        <MetricCard
          label={labels.kpiActiveSubscriptions}
          help={labels.kpiActiveSubscriptionsHelp}
          value={activeMetric.text}
          tone={activeMetric.tone === "neutral" ? "success" : activeMetric.tone}
          statusLabel={statusFor(
            activeMetric.tone === "neutral" ? "success" : activeMetric.tone,
          )}
        />
        <MetricCard
          label={labels.kpiTrialing}
          help={labels.kpiTrialingHelp}
          value={trialMetric.text}
          tone={trialMetric.tone}
          statusLabel={statusFor(trialMetric.tone)}
        />
        <MetricCard
          label={labels.kpiPastDue}
          help={labels.kpiPastDueHelp}
          value={pastDueMetric.text}
          tone={
            pastDueMetric.tone === "muted"
              ? "muted"
              : (pastDue ?? 0) > 0
                ? "danger"
                : "success"
          }
          statusLabel={statusFor(
            pastDueMetric.tone === "muted"
              ? "muted"
              : (pastDue ?? 0) > 0
                ? "danger"
                : "success",
          )}
        />
        <MetricCard
          label={labels.kpiFollowUp}
          help={labels.kpiFollowUpHelp}
          value={followMetric.text}
          tone={
            followMetric.tone === "muted"
              ? "muted"
              : (followUp ?? 0) > 0
                ? "warning"
                : "success"
          }
          statusLabel={statusFor(
            followMetric.tone === "muted"
              ? "muted"
              : (followUp ?? 0) > 0
                ? "warning"
                : "success",
          )}
        />
        <MetricCard
          label={labels.kpiOpenSupport}
          help={labels.kpiOpenSupportHelp}
          value={supportMetric.text}
          tone={supportMetric.tone}
          statusLabel={statusFor(supportMetric.tone)}
        />
      </section>

      <section className={PlatformLayoutClasses.card}>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          {labels.followUpTitle}
        </h2>
        {followMetric.tone === "muted" ? (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{labels.unavailable}</p>
        ) : (followUp ?? 0) === 0 ? (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{labels.followUpEmpty}</p>
        ) : (
          <p className="mt-2 text-sm text-amber-900 dark:text-amber-100">
            {followUp} ·{" "}
            <Link
              href="/platform/customer-success"
              className="font-medium text-violet-700 hover:text-violet-800 dark:text-violet-300"
            >
              {labels.openSuccess}
            </Link>
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link
            href="/platform/customers"
            className="font-medium text-violet-700 hover:text-violet-800 dark:text-violet-300"
          >
            {labels.openOrganizations}
          </Link>
          <Link
            href="/platform/support"
            className="font-medium text-violet-700 hover:text-violet-800 dark:text-violet-300"
          >
            {labels.openSupport}
          </Link>
        </div>
      </section>

      <section className={PlatformLayoutClasses.cardMuted}>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          {labels.definitionsTitle}
        </h2>
        <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <li>
            {labels.kpiCustomerOrgs}: {labels.kpiCustomerOrgsHelp}
          </li>
          <li>
            {labels.kpiActiveSubscriptions}: {labels.kpiActiveSubscriptionsHelp}
          </li>
          <li>
            {labels.kpiTrialing}: {labels.kpiTrialingHelp}
          </li>
          <li>
            {labels.kpiPastDue}: {labels.kpiPastDueHelp}
          </li>
          <li>
            {labels.kpiFollowUp}: {labels.kpiFollowUpHelp}
          </li>
          <li>
            {labels.kpiOpenSupport}: {labels.kpiOpenSupportHelp}
          </li>
        </ul>
      </section>
    </PlatformPageFrame>
  );
}
