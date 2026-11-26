"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyEmptyState } from "@/components/branding";
import type { PlatformAnalyticsJourneyLabels } from "@/lib/platform-analytics/labels";
import type { PlatformAnalyticsJourney } from "@/lib/platform-analytics/journey";
import type { AnalyticsPeriodKey } from "@/lib/platform-analytics/period";
import { formatPlatformDateTimeFull } from "@/lib/platform-presentation-quality/date-time";
import { resolveAuthoritativeTimeZone } from "@/lib/platform-presentation-quality/bcp47";

type Props = {
  labels: PlatformAnalyticsJourneyLabels;
  locale: string;
  backHref: string;
};

export function PlatformAnalyticsJourneyPanel({ labels, locale, backHref }: Props) {
  const [period, setPeriod] = useState<AnalyticsPeriodKey>("30d");
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const [data, setData] = useState<PlatformAnalyticsJourney | null>(null);

  const load = useCallback(async (nextPeriod: AnalyticsPeriodKey) => {
    setPhase("loading");
    try {
      const res = await fetch(
        `/api/platform/analytics/journey?period=${encodeURIComponent(nextPeriod)}`,
        { cache: "no-store" },
      );
      if (!res.ok) {
        setPhase("error");
        return;
      }
      setData((await res.json()) as PlatformAnalyticsJourney);
      setPhase("ready");
    } catch {
      setPhase("error");
    }
  }, []);

  useEffect(() => {
    void load(period);
  }, [load, period]);

  if (phase === "loading") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (phase === "error" || !data) {
    return (
      <div className="space-y-4 p-6">
        <AipifyEmptyState message={labels.errorBody} pulseLabel={labels.errorTitle} />
        <button
          type="button"
          onClick={() => void load(period)}
          className="rounded-xl bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white"
        >
          {labels.retry}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-[#7C3AED] hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-[#1F2937]">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-[color:var(--aipify-text-secondary)]">{labels.subtitle}</p>
        <p className="mt-2 text-xs text-[color:var(--aipify-text-secondary)]">{data.privacyNote}</p>
        <p className="mt-1 text-xs text-[color:var(--aipify-text-secondary)]">{data.incompleteDataNote}</p>
        <p className="mt-2 text-xs text-[color:var(--aipify-text-secondary)]">
          {labels.lastChecked}:{" "}
          {formatPlatformDateTimeFull(data.generatedAt, {
            locale,
            timeZone: resolveAuthoritativeTimeZone(),
            emptyFallback: labels.unavailable,
            invalidFallback: labels.unavailable,
          })}
        </p>
      </div>

      <label className="text-sm text-[color:var(--aipify-text-secondary)]">
        {labels.lastChecked}
        <select
          className="ml-2 rounded-lg border border-[color:var(--aipify-border)] bg-white px-3 py-2 text-sm"
          value={period}
          onChange={(e) => setPeriod(e.target.value as AnalyticsPeriodKey)}
          aria-label={labels.title}
        >
          <option value="7d">7d</option>
          <option value="30d">30d</option>
          <option value="90d">90d</option>
          <option value="365d">365d</option>
          <option value="all">all</option>
        </select>
      </label>

      <ol className="space-y-4">
        {data.steps.map((step, index) => {
          const title = labels.steps[step.id] ?? step.id;
          const statusLabel =
            step.status === "available"
              ? labels.available
              : step.status === "partial"
                ? labels.partial
                : labels.unavailable;
          return (
            <li
              key={step.id}
              className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-[#1F2937]">
                  {index + 1}. {title}
                </p>
                <p className="text-xs font-medium text-[color:var(--aipify-text-secondary)]">
                  {statusLabel}
                </p>
              </div>
              <p className="mt-2 text-2xl font-semibold text-[#1F2937]">
                {step.count == null
                  ? labels.unavailable
                  : new Intl.NumberFormat(undefined).format(step.count)}
              </p>
              <p className="mt-2 text-xs text-[color:var(--aipify-text-secondary)]">{step.source}</p>
              {step.note ? (
                <p className="mt-1 text-sm text-[color:var(--aipify-text-secondary)]">{step.note}</p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
