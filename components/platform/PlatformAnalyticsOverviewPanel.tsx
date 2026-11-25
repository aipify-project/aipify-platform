"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyEmptyState } from "@/components/branding";
import type { PlatformAnalyticsOverviewLabels } from "@/lib/platform-analytics/labels";
import type { PlatformAnalyticsOverview } from "@/lib/platform-analytics/overview";
import { formatPlatformDateTimeFull } from "@/lib/platform-presentation-quality/date-time";
import { resolveAuthoritativeTimeZone } from "@/lib/platform-presentation-quality/bcp47";

type Props = {
  labels: PlatformAnalyticsOverviewLabels;
  locale: string;
};

function MetricCard({
  label,
  value,
  available,
  unavailableLabel,
  formatCurrency,
}: {
  label: string;
  value: number | null;
  available: boolean;
  unavailableLabel: string;
  formatCurrency?: boolean;
}) {
  const display =
    !available || value == null
      ? unavailableLabel
      : formatCurrency
        ? new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "NOK",
            maximumFractionDigits: 0,
          }).format(value)
        : new Intl.NumberFormat(undefined).format(value);

  return (
    <div className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-[color:var(--aipify-text-secondary)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#1F2937]">{display}</p>
    </div>
  );
}

export function PlatformAnalyticsOverviewPanel({ labels, locale }: Props) {
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const [data, setData] = useState<PlatformAnalyticsOverview | null>(null);

  const load = useCallback(async () => {
    setPhase("loading");
    try {
      const res = await fetch("/api/platform/analytics/overview", { cache: "no-store" });
      if (!res.ok) {
        setPhase("error");
        return;
      }
      const body = (await res.json()) as PlatformAnalyticsOverview;
      setData(body);
      setPhase("ready");
    } catch {
      setPhase("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

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
      <div className="space-y-4">
        <AipifyEmptyState message={labels.errorBody} pulseLabel={labels.errorTitle} />
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-xl bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white"
        >
          {labels.retry}
        </button>
      </div>
    );
  }

  const cards = [
    {
      key: "customerRegistrations30d",
      ...data.metrics.customerRegistrations30d,
      label: labels.cards.customerRegistrations30d,
    },
    {
      key: "activeAppCustomers",
      ...data.metrics.activeAppCustomers,
      label: labels.cards.activeAppCustomers,
    },
    {
      key: "activeBusinesses",
      ...data.metrics.activeBusinesses,
      label: labels.cards.activeBusinesses,
    },
    {
      key: "activeGrowthPartners",
      ...data.metrics.activeGrowthPartners,
      label: labels.cards.activeGrowthPartners,
    },
    {
      key: "activeSubscriptions",
      ...data.metrics.activeSubscriptions,
      label: labels.cards.activeSubscriptions,
    },
    {
      key: "revenueMrr",
      ...data.metrics.revenueMrr,
      label: labels.cards.revenueMrr,
      formatCurrency: true,
    },
    {
      key: "moduleUsage",
      ...data.metrics.moduleUsage,
      label: labels.cards.moduleUsage,
    },
    {
      key: "academyPartners",
      ...data.metrics.academyPartners,
      label: labels.cards.academyPartners,
    },
  ] as const;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-[#1F2937]">{labels.title}</h1>
        <p className="max-w-3xl text-sm text-[color:var(--aipify-text-secondary)]">{labels.subtitle}</p>
        <p className="text-xs text-[color:var(--aipify-text-secondary)]">
          {labels.lastChecked}:{" "}
          {formatPlatformDateTimeFull(data.generatedAt, {
            locale,
            timeZone: resolveAuthoritativeTimeZone(),
            emptyFallback: labels.unavailable,
            invalidFallback: labels.unavailable,
          })}
        </p>
        <p className="text-xs text-[color:var(--aipify-text-secondary)]">{labels.privacyNote}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <MetricCard
            key={card.key}
            label={card.label}
            value={card.value}
            available={card.available}
            unavailableLabel={labels.unavailable}
            formatCurrency={"formatCurrency" in card ? card.formatCurrency : false}
          />
        ))}
      </div>

      <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1F2937]">{labels.ga4Title}</h2>
        <p className="mt-2 text-sm text-[#1F2937]">
          {data.ga4.measurementConfigured ? labels.ga4Configured : labels.ga4NotConfigured}
        </p>
        <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.ga4DataApiNote}</p>
      </section>

      <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1F2937]">{labels.modulesTitle}</h2>
        {data.mostUsedModules.length === 0 ? (
          <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.modulesEmpty}</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {data.mostUsedModules.map((moduleKey) => (
              <li
                key={moduleKey}
                className="rounded-full border border-[color:var(--aipify-border)] px-3 py-1 text-sm text-[#1F2937]"
              >
                {moduleKey}
              </li>
            ))}
          </ul>
        )}
      </section>

      <nav className="flex flex-wrap gap-3 text-sm font-medium">
        <Link className="text-[#7C3AED] hover:underline" href="/platform/metrics">
          {labels.links.metrics}
        </Link>
        <Link className="text-[#7C3AED] hover:underline" href="/platform/analytics/customer-journeys">
          {labels.links.customerJourneys}
        </Link>
        <Link className="text-[#7C3AED] hover:underline" href="/platform/sellers/partners">
          {labels.links.sellers}
        </Link>
      </nav>
    </div>
  );
}
