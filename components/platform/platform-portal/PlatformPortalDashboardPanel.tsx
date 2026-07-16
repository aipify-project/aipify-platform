"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  buildPlatformPortalLabels,
  parsePlatformPortalDashboard,
  type PlatformPortalDashboard,
} from "@/lib/platform-portal";
import type { PlatformNavGroupConfig } from "@/lib/platform/build-nav";
import { AipifyLoader } from "@/components/ui/aipify-loader";

type PlatformPortalDashboardPanelProps = {
  labels: ReturnType<typeof buildPlatformPortalLabels>["dashboard"];
  navGroups: PlatformNavGroupConfig[];
};

type MetricVariant = "neutral" | "success" | "warning" | "danger";

const METRIC_VARIANT_STYLES: Record<
  MetricVariant,
  { card: string; label: string; value: string; marker: string }
> = {
  neutral: {
    card: "border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/50",
    label: "text-slate-500 dark:text-slate-400",
    value: "text-slate-900 dark:text-slate-100",
    marker: "bg-slate-400 ring-slate-200 dark:bg-slate-500 dark:ring-slate-700",
  },
  success: {
    card: "border-emerald-200/90 bg-emerald-50/70 dark:border-emerald-800/70 dark:bg-emerald-950/35",
    label: "text-emerald-800/80 dark:text-emerald-300/90",
    value: "text-emerald-950 dark:text-emerald-50",
    marker: "bg-emerald-500 ring-emerald-200 dark:bg-emerald-400 dark:ring-emerald-900",
  },
  warning: {
    card: "border-amber-200/90 bg-amber-50/70 dark:border-amber-800/70 dark:bg-amber-950/35",
    label: "text-amber-800/80 dark:text-amber-300/90",
    value: "text-amber-950 dark:text-amber-50",
    marker: "bg-amber-500 ring-amber-200 dark:bg-amber-400 dark:ring-amber-900",
  },
  danger: {
    card: "border-rose-200/90 bg-rose-50/70 dark:border-rose-800/70 dark:bg-rose-950/35",
    label: "text-rose-800/80 dark:text-rose-300/90",
    value: "text-rose-950 dark:text-rose-50",
    marker: "bg-rose-500 ring-rose-200 dark:bg-rose-400 dark:ring-rose-900",
  },
};

/** Problem/waiting counts: zero is healthy; non-zero uses the elevated variant. */
function countVariant(
  count: number,
  elevated: "warning" | "danger" = "warning",
): "success" | "warning" | "danger" {
  return count === 0 ? "success" : elevated;
}

function MetricCard({
  label,
  value,
  variant = "neutral",
}: {
  label: string;
  value: string | number;
  variant?: MetricVariant;
}) {
  const styles = METRIC_VARIANT_STYLES[variant];

  return (
    <div
      className={`rounded-xl border px-4 py-3.5 shadow-sm ${styles.card}`}
      data-variant={variant}
    >
      <div className="flex items-start justify-between gap-3">
        <dt className={`text-xs font-medium uppercase tracking-wide ${styles.label}`}>{label}</dt>
        <span
          className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ring-2 ${styles.marker}`}
          aria-hidden="true"
          data-status={variant}
        />
      </div>
      <dd className={`mt-2 text-2xl font-semibold tabular-nums tracking-tight ${styles.value}`}>
        {value}
      </dd>
    </div>
  );
}

const ATTENTION_ICON_STYLES: Record<"success" | "warning" | "danger", string> = {
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  danger: "text-rose-600 dark:text-rose-400",
};

function AttentionStatusIcon({ variant }: { variant: "success" | "warning" | "danger" }) {
  const className = `h-4 w-4 shrink-0 ${ATTENTION_ICON_STYLES[variant]}`;

  if (variant === "success") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm3.78 5.97-4.34 4.35a.75.75 0 0 1-1.06 0L4.22 8.16a.75.75 0 0 1 1.06-1.06l1.63 1.63 3.81-3.82a.75.75 0 1 1 1.06 1.06Z" />
      </svg>
    );
  }

  if (variant === "danger") {
    return (
      <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0Zm-.75 4.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5Zm.75 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575L6.457 1.047ZM8 5a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0v-3.5A.75.75 0 0 0 8 5Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    </svg>
  );
}

function AttentionCard({
  label,
  value,
  elevated = "warning",
}: {
  label: string;
  value: number;
  elevated?: "warning" | "danger";
}) {
  const variant = countVariant(value, elevated);
  const styles = METRIC_VARIANT_STYLES[variant];

  return (
    <div
      className={`rounded-xl border px-3.5 py-3 shadow-sm ${styles.card}`}
      data-variant={variant}
      data-attention="true"
    >
      <div className="flex items-center gap-2">
        <AttentionStatusIcon variant={variant} />
        <dt className={`min-w-0 truncate text-xs font-medium uppercase tracking-wide ${styles.label}`}>
          {label}
        </dt>
      </div>
      <dd className={`mt-1.5 text-xl font-semibold tabular-nums tracking-tight ${styles.value}`}>
        {value}
      </dd>
    </div>
  );
}

export function PlatformPortalDashboardPanel({
  labels,
  navGroups,
}: PlatformPortalDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<PlatformPortalDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform-portal/dashboard");
    if (res.ok) setDashboard(parsePlatformPortalDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !dashboard) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[1680px] items-center justify-center p-6">
        <AipifyLoader centered label={labels.loading} />
      </div>
    );
  }

  if (!dashboard) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  return (
    <div className="mx-auto w-full max-w-[1680px] space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm text-slate-800">
          {dashboard.principle}
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/40">
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <AttentionCard
            label={labels.organizationsRequiringAttention}
            value={dashboard.organizations_requiring_attention}
          />
          <AttentionCard
            label={labels.openSupportWorkload}
            value={dashboard.open_support_workload}
          />
          <AttentionCard
            label={labels.paymentPastDue}
            value={dashboard.payment_status_summary.past_due}
            elevated="danger"
          />
          <AttentionCard
            label={labels.pendingReview}
            value={dashboard.marketplace_moderation.pending_review}
          />
          <AttentionCard
            label={labels.pendingApplications}
            value={dashboard.growth_partner_summary.pending_applications}
          />
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            label={labels.activeSubscriptions}
            value={dashboard.active_subscriptions}
            variant="success"
          />
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.paymentStatusSummary}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <MetricCard
            label={labels.paymentActive}
            value={dashboard.payment_status_summary.active}
            variant="success"
          />
          <MetricCard
            label={labels.paymentTrialing}
            value={dashboard.payment_status_summary.trialing}
            variant={countVariant(dashboard.payment_status_summary.trialing)}
          />
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.customerSuccessIndicators}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <MetricCard
            label={labels.healthyRatio}
            value={`${dashboard.customer_success_indicators.healthy_ratio_pct}%`}
            variant="success"
          />
        </dl>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.marketplaceModeration}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <MetricCard
              label={labels.published}
              value={dashboard.marketplace_moderation.published}
              variant="success"
            />
          </dl>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">{labels.partnerProgramSummary}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <MetricCard
              label={labels.activePrograms}
              value={dashboard.growth_partner_summary.active_programs}
              variant="success"
            />
          </dl>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">{labels.productDeploymentUpdates}</h2>
        {dashboard.product_deployment_updates.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">{labels.noUpdates}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {dashboard.product_deployment_updates.map((update) => (
              <li
                key={update.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-900">{update.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    v{update.version} · {update.classification}
                  </p>
                </div>
                {update.scheduled_at ? (
                  <span className="text-xs text-slate-500">
                    {new Date(update.scheduled_at).toLocaleDateString()}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">{labels.portalModules}</h2>
        {navGroups.map((group) => (
          <div key={group.id}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {group.label}
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                >
                  <h4 className="font-medium text-slate-900">{item.label}</h4>
                  <span className="mt-4 inline-block text-sm font-medium text-indigo-600">
                    {labels.openModule} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <p className="text-xs text-slate-500">{dashboard.privacy_note || labels.privacyNote}</p>
    </div>
  );
}
