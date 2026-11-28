"use client";

import { formatPlatformDateTimeShort } from "@/lib/platform-presentation-quality/date-time";
import type { TrafficStatusFreshness } from "@/lib/platform-portal/traffic-status-contract";
import type { PlatformTrafficStatusLabels } from "@/lib/platform-portal/traffic-status-labels";
import type { PlatformTrafficStatus, TrafficCount } from "@/lib/platform-portal/traffic-status";

export type { PlatformTrafficStatusLabels };

type PlatformTrafficStatusBarProps = {
  status: PlatformTrafficStatus | null;
  labels: PlatformTrafficStatusLabels;
  locale: string;
  freshness?: TrafficStatusFreshness;
  expanded?: boolean;
  onToggleExpanded?: () => void;
};

function displayValue(count: TrafficCount | null, labels: PlatformTrafficStatusLabels): string {
  if (!count) return labels.unavailable;
  if (count.state === "value") return String(count.value);
  return count.reason === "not_measured" ? labels.notMeasured : labels.unavailable;
}

function MetricChip({
  shortLabel,
  fullLabel,
  hint,
  value,
}: {
  shortLabel: string;
  fullLabel: string;
  hint: string;
  value: string;
}) {
  const title = `${fullLabel}: ${value}. ${hint}`;
  return (
    <div
      className="inline-flex min-w-0 max-w-[9.5rem] items-baseline gap-1 rounded-md px-1.5 py-0.5"
      title={title}
    >
      <span className="truncate text-[10px] font-medium uppercase tracking-wide text-[color:var(--aipify-text-secondary)]">
        {shortLabel}
      </span>
      <span className="shrink-0 text-xs font-semibold tabular-nums text-[color:var(--aipify-text)]">
        {value}
      </span>
      <span className="sr-only">{title}</span>
    </div>
  );
}

export function PlatformTrafficStatusBar({
  status,
  labels,
  locale,
  freshness = "fresh",
  expanded = false,
  onToggleExpanded,
}: PlatformTrafficStatusBarProps) {
  const checked = status
    ? formatPlatformDateTimeShort(status.checkedAt, {
        locale,
        emptyFallback: labels.unavailable,
        invalidFallback: labels.unavailable,
      })
    : labels.unavailable;

  const withSource = (hint: string, source: string | undefined) =>
    source ? `${hint} · ${labels.source}: ${source}` : hint;

  const metrics = status
    ? [
        {
          key: "newAppCustomers",
          shortLabel: labels.newAppCustomersShort,
          fullLabel: labels.newAppCustomers,
          hint: withSource(labels.newAppCustomersHint, status.sources.newAppCustomersToday),
          value: displayValue(status.newAppCustomersToday, labels),
        },
        {
          key: "newSellers",
          shortLabel: labels.newSellersShort,
          fullLabel: labels.newSellers,
          hint: withSource(labels.newSellersHint, status.sources.newSellersToday),
          value: displayValue(status.newSellersToday, labels),
        },
        {
          key: "appCustomersOnline",
          shortLabel: labels.appCustomersOnlineShort,
          fullLabel: labels.appCustomersOnline,
          hint: withSource(labels.notMeasuredHint, status.sources.appCustomersOnline),
          value: displayValue(status.appCustomersOnline, labels),
        },
        {
          key: "sellersOnline",
          shortLabel: labels.sellersOnlineShort,
          fullLabel: labels.sellersOnline,
          hint: withSource(labels.notMeasuredHint, status.sources.sellersOnline),
          value: displayValue(status.sellersOnline, labels),
        },
        {
          key: "signedInUsers",
          shortLabel: labels.signedInUsersShort,
          fullLabel: labels.signedInUsers,
          hint: withSource(labels.notMeasuredHint, status.sources.signedInUsers),
          value: displayValue(status.signedInUsers, labels),
        },
        {
          key: "visitors",
          shortLabel: labels.visitorsShort,
          fullLabel: labels.visitors,
          hint: withSource(labels.visitorsHint, status.sources.visitorsToday),
          value: displayValue(status.visitorsToday, labels),
        },
      ]
    : [];

  const dayScope = status
    ? labels.dayScope.replace("{zone}", status.dayTimeZone)
    : labels.unavailable;
  const operationalTitle = status
    ? withSource(labels.operationalHint, status.sources.operational)
    : labels.operationalHint;
  const metaLine = [
    operationalTitle,
    dayScope,
    `${labels.lastChecked}: ${checked}`,
    freshness === "stale" ? labels.stale : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section
      aria-label={labels.region}
      data-freshness={freshness}
      className="min-w-0 max-w-full"
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <div
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-medium ${
            freshness === "unavailable"
              ? "border-amber-200 bg-amber-50 text-amber-950"
              : "border-emerald-200 bg-emerald-50 text-emerald-950"
          }`}
          title={operationalTitle}
        >
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              freshness === "unavailable" ? "bg-amber-500" : "bg-emerald-500"
            }`}
            aria-hidden="true"
          />
          <span className="whitespace-nowrap">{labels.operationalShort}</span>
          <span className="sr-only">{operationalTitle}</span>
        </div>

        {/* Desktop / wide: single compact row */}
        <div className="hidden min-w-0 flex-1 items-center gap-0.5 overflow-hidden xl:flex">
          {metrics.map((metric) => (
            <MetricChip
              key={metric.key}
              shortLabel={metric.shortLabel}
              fullLabel={metric.fullLabel}
              hint={metric.hint}
              value={metric.value}
            />
          ))}
        </div>

        {/* Narrow: expandable details without horizontal overflow */}
        <div className="min-w-0 xl:hidden">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md border border-[color:var(--aipify-border)] bg-white px-2 py-1 text-[11px] font-medium text-[color:var(--aipify-text)]"
            aria-expanded={expanded}
            onClick={onToggleExpanded}
          >
            <span>{expanded ? labels.collapse : labels.expand}</span>
            <svg
              className={`h-3 w-3 transition ${expanded ? "rotate-180" : ""}`}
              viewBox="0 0 12 12"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M2.2 4.2a.75.75 0 0 1 1.06 0L6 6.94l2.74-2.74a.75.75 0 1 1 1.06 1.06l-3.27 3.27a.75.75 0 0 1-1.06 0L2.2 5.26a.75.75 0 0 1 0-1.06Z" />
            </svg>
          </button>
        </div>

        {freshness === "stale" ? (
          <span className="hidden shrink-0 text-[10px] font-medium text-amber-700 sm:inline">
            {labels.stale}
          </span>
        ) : null}
      </div>

      {expanded ? (
        <div className="mt-2 grid grid-cols-2 gap-1 rounded-lg border border-[color:var(--aipify-border)] bg-white p-2 shadow-sm sm:grid-cols-3 xl:hidden">
          {metrics.map((metric) => (
            <MetricChip
              key={metric.key}
              shortLabel={metric.shortLabel}
              fullLabel={metric.fullLabel}
              hint={metric.hint}
              value={metric.value}
            />
          ))}
          <p className="col-span-full text-[10px] leading-snug text-[color:var(--aipify-text-secondary)]">
            {metaLine}
          </p>
        </div>
      ) : null}

      <p className="sr-only">{metaLine}</p>
    </section>
  );
}
