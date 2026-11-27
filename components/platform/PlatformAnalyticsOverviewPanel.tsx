"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyEmptyState } from "@/components/branding";
import type { PlatformAnalyticsOverviewLabels } from "@/lib/platform-analytics/labels";
import type { PlatformAnalyticsOverview } from "@/lib/platform-analytics/overview";
import type { PlatformProductAnalytics } from "@/lib/platform-analytics/products";
import type { PlatformAnalyticsSalesPartners } from "@/lib/platform-analytics/sales-partners";
import type { AnalyticsPeriodKey } from "@/lib/platform-analytics/period";
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
            style: "decimal",
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

const PERIODS: AnalyticsPeriodKey[] = ["7d", "30d", "90d", "365d", "all"];

export function PlatformAnalyticsOverviewPanel({ labels, locale }: Props) {
  const [period, setPeriod] = useState<AnalyticsPeriodKey>("30d");
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const [data, setData] = useState<PlatformAnalyticsOverview | null>(null);
  const [products, setProducts] = useState<PlatformProductAnalytics | null>(null);
  const [salesPartners, setSalesPartners] = useState<PlatformAnalyticsSalesPartners | null>(null);

  const load = useCallback(async (nextPeriod: AnalyticsPeriodKey) => {
    setPhase("loading");
    try {
      const qs = `?period=${encodeURIComponent(nextPeriod)}`;
      const [overviewRes, productsRes, salesRes] = await Promise.all([
        fetch(`/api/platform/analytics/overview${qs}`, { cache: "no-store" }),
        fetch("/api/platform/analytics/products", { cache: "no-store" }),
        fetch("/api/platform/analytics/sales-partners", { cache: "no-store" }),
      ]);
      if (!overviewRes.ok) {
        setPhase("error");
        return;
      }
      setData((await overviewRes.json()) as PlatformAnalyticsOverview);
      if (productsRes.ok) setProducts((await productsRes.json()) as PlatformProductAnalytics);
      if (salesRes.ok) setSalesPartners((await salesRes.json()) as PlatformAnalyticsSalesPartners);
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
      <div className="space-y-4">
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

  const periodLabel =
    period === "7d"
      ? labels.period7d
      : period === "90d"
        ? labels.period90d
        : period === "365d"
          ? labels.period365d
          : period === "all"
            ? labels.periodAll
            : labels.period30d;

  const cards = [
    { ...data.metrics.customersTotal, label: labels.cards.customersTotal },
    { ...data.metrics.customerRegistrationsPeriod, label: labels.cards.customerRegistrationsPeriod },
    { ...data.metrics.activeAppCustomers, label: labels.cards.activeAppCustomers },
    { ...data.metrics.trialCustomers, label: labels.cards.trialCustomers },
    { ...data.metrics.cancelledCustomers, label: labels.cards.cancelledCustomers },
    { ...data.metrics.activeSubscriptions, label: labels.cards.activeSubscriptions },
    { ...data.metrics.revenueMrr, label: labels.cards.revenueMrr, formatCurrency: true },
    { ...data.metrics.revenueArr, label: labels.cards.revenueArr, formatCurrency: true },
    { ...data.metrics.outstandingInvoices, label: labels.cards.outstandingInvoices, formatCurrency: true },
    { ...data.metrics.activeBusinesses, label: labels.cards.activeBusinesses },
    { ...data.metrics.installationsTotal, label: labels.cards.installationsTotal },
    { ...data.metrics.activeGrowthPartners, label: labels.cards.activeGrowthPartners },
    { ...data.metrics.certifiedPartners, label: labels.cards.certifiedPartners },
    { ...data.metrics.academyPartners, label: labels.cards.academyPartners },
    { ...data.metrics.moduleUsage, label: labels.cards.moduleUsage },
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

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-[color:var(--aipify-text-secondary)]">
          {labels.periodLabel}
          <select
            className="ml-2 rounded-lg border border-[color:var(--aipify-border)] bg-white px-3 py-2 text-sm text-[#1F2937]"
            value={period}
            onChange={(e) => setPeriod(e.target.value as AnalyticsPeriodKey)}
          >
            {PERIODS.map((key) => (
              <option key={key} value={key}>
                {key === "7d"
                  ? labels.period7d
                  : key === "90d"
                    ? labels.period90d
                    : key === "365d"
                      ? labels.period365d
                      : key === "all"
                        ? labels.periodAll
                        : labels.period30d}
              </option>
            ))}
          </select>
        </label>
        <a
          className="rounded-xl border border-[color:var(--aipify-border)] bg-white px-4 py-2 text-sm font-semibold text-[#7C3AED]"
          href={`/api/platform/analytics/export?period=${encodeURIComponent(period)}`}
        >
          {labels.exportCsv}
        </a>
        <span className="text-xs text-[color:var(--aipify-text-secondary)]">{periodLabel}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <MetricCard
            key={card.id}
            label={card.label}
            value={card.value}
            available={card.available}
            unavailableLabel={labels.unavailable}
            formatCurrency={"formatCurrency" in card ? Boolean(card.formatCurrency) : false}
          />
        ))}
      </div>

      <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1F2937]">{labels.currencyPolicyTitle}</h2>
        <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{data.currencyPolicy}</p>
        <h2 className="mt-4 text-lg font-semibold text-[#1F2937]">{labels.previousPeriodNoteTitle}</h2>
        <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{data.previousPeriodNote}</p>
      </section>

      <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1F2937]">{labels.definitionsTitle}</h2>
        <ul className="mt-3 space-y-3">
          {data.definitions.map((def) => (
            <li key={def.id} className="text-sm text-[#1F2937]">
              <span className="font-medium">{def.id}</span>
              <span className="block text-[color:var(--aipify-text-secondary)]">{def.definition}</span>
              <span className="block text-xs text-[color:var(--aipify-text-secondary)]">{def.source}</span>
            </li>
          ))}
        </ul>
      </section>

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

      <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1F2937]">{labels.productsTitle}</h2>
        {!products || products.rows.length === 0 ? (
          <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.productsEmpty}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {products.rows.map((row) => (
              <li key={`${row.kind}-${row.key}`} className="text-sm text-[#1F2937]">
                <span className="font-medium">{row.key}</span>
                <span className="ml-2 text-[color:var(--aipify-text-secondary)]">
                  {row.status}
                  {row.usageCount != null ? ` · ${row.usageCount}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
        {products?.notes?.map((note) => (
          <p key={note} className="mt-2 text-xs text-[color:var(--aipify-text-secondary)]">
            {note}
          </p>
        ))}
      </section>

      <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1F2937]">{labels.salesPartnersTitle}</h2>
        {salesPartners ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                ["approvedPartners", salesPartners.metrics.approvedPartners],
                ["certifiedPartners", salesPartners.metrics.certifiedPartners],
                ["inAcademy", salesPartners.metrics.inAcademy],
                ["attributionLinks", salesPartners.metrics.attributionLinks],
                ["clicks", salesPartners.metrics.clicks],
                ["leads", salesPartners.metrics.leads],
                ["qualifiedSales", salesPartners.metrics.qualifiedSales],
                ["earnedCommission", salesPartners.metrics.earnedCommission],
                ["unpaidSettlements", salesPartners.metrics.unpaidSettlements],
              ] as const
            ).map(([key, value]) => (
              <div key={key} className="rounded-xl border border-[color:var(--aipify-border)] p-3">
                <p className="text-xs text-[color:var(--aipify-text-secondary)]">{key}</p>
                <p className="mt-1 text-lg font-semibold text-[#1F2937]">
                  {value == null ? labels.unavailable : new Intl.NumberFormat(undefined).format(value)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.unavailable}</p>
        )}
      </section>

      <nav className="flex flex-wrap gap-3 text-sm font-medium">
        <Link className="text-[#7C3AED] hover:underline" href="/platform/metrics">
          {labels.links.metrics}
        </Link>
        <Link className="text-[#7C3AED] hover:underline" href="/platform/analytics/customer-journeys">
          {labels.journeyTitle}
        </Link>
        <Link className="text-[#7C3AED] hover:underline" href="/platform/sellers/partners">
          {labels.links.sellers}
        </Link>
      </nav>
    </div>
  );
}
