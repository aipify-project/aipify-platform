"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ProviderCard,
  ProviderCardActions,
  ProviderCardAssets,
  ProviderCardBody,
  ProviderCardDetail,
  ProviderCardOperationalDetails,
} from "@/components/payments/provider-card";
import { ProviderLogo } from "@/components/payments/provider-logo";
import { ProviderStatusBadge } from "@/components/payments/provider-status-badge";
import {
  ALERT_SEVERITY_BADGES,
  AUDIT_FILTER_CATEGORIES,
  OPERATIONS_INDICATOR_STYLES,
  REGIONAL_COVERAGE_KEYS,
  auditFilterLabel,
  computeExecutiveSummary,
  computeSettlementTotals,
  deriveAlertQuickAction,
  deriveAlertRecommendedAction,
  filterAuditEntries,
  formatSettlementDate,
  getOperationsMetricIndicator,
  indicatorLabel,
  parsePaymentOperationsCenter,
  type AuditFilterCategory,
  type OperationsIndicator,
  type PaymentOperationsCenter,
  type PaymentOperationsLabels,
  type PaymentOperationsProvider,
  type SettlementRecord,
} from "@/lib/payment-operations";
import type { PaymentProviderKey } from "@/lib/payment-providers";

type PaymentOperationsCenterPanelProps = {
  labels: PaymentOperationsLabels;
  backHref: string;
};

const EXECUTIVE_CARD =
  "rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-white to-zinc-50/80 p-6 shadow-sm shadow-zinc-900/5";
const SECTION_CARD = "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm";

function StatusPill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
  );
}

function StatusIndicator({
  indicator,
  label,
}: {
  indicator: OperationsIndicator;
  label: string;
}) {
  const styles = OPERATIONS_INDICATOR_STYLES[indicator];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${styles.text}`}>
      <span className={`h-2 w-2 rounded-full ${styles.dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}

function formatAmount(amount: number, currency: string): string {
  return `${amount.toLocaleString("nb-NO")} ${currency}`;
}

function ExecutiveSummarySection({
  center,
  labels,
}: {
  center: PaymentOperationsCenter;
  labels: PaymentOperationsLabels;
}) {
  const executive = computeExecutiveSummary(center);
  const nextProvider = executive.next_settlement_provider
    ? labels.providers[executive.next_settlement_provider as keyof typeof labels.providers] ??
      executive.next_settlement_provider
    : null;

  const items = [
    {
      label: labels.executive.healthScore,
      value: `${executive.health_score}% ${labels.executive.healthHealthy}`,
      indicator: executive.health_label,
    },
    {
      label: labels.executive.criticalProviders,
      value:
        executive.critical_provider_status === "operational"
          ? labels.executive.criticalProvidersOperational
          : labels.executive.criticalProvidersDegraded,
      indicator:
        executive.critical_provider_status === "operational" ? ("healthy" as const) : ("critical" as const),
    },
    {
      label: labels.executive.warningsAttention,
      value:
        executive.warnings_count > 0
          ? labels.executive.warningsAttention.replace("{count}", String(executive.warnings_count))
          : labels.executive.warningsNone,
      indicator: executive.warnings_count > 0 ? ("attention" as const) : ("healthy" as const),
    },
    {
      label: labels.executive.nextSettlement,
      value:
        nextProvider && executive.next_settlement_date
          ? `${nextProvider} – ${formatSettlementDate(executive.next_settlement_date)}`
          : labels.executive.nextSettlementNone,
      indicator: "stable" as const,
    },
    {
      label: labels.executive.expectedSettlementTotal,
      value: formatAmount(executive.expected_settlement_total, executive.currency),
      indicator: "stable" as const,
    },
    {
      label: labels.executive.pendingSettlementTotal,
      value: formatAmount(executive.pending_settlement_total, executive.currency),
      indicator: executive.pending_settlement_total > 0 ? ("attention" as const) : ("healthy" as const),
    },
  ];

  return (
    <section className={EXECUTIVE_CARD}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {labels.sections.executiveSummary}
      </h2>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border border-zinc-100 bg-white/80 px-4 py-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{item.label}</dt>
            <dd className="mt-2 text-lg font-semibold tracking-tight text-zinc-900">{item.value}</dd>
            <div className="mt-2">
              <StatusIndicator
                indicator={item.indicator}
                label={indicatorLabel(labels, item.indicator)}
              />
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}

function OperationsOverviewSection({
  center,
  labels,
}: {
  center: PaymentOperationsCenter;
  labels: PaymentOperationsLabels;
}) {
  const { summary } = center;
  const metrics = [
    {
      key: "activeProviders" as const,
      label: labels.summary.activeProviders,
      value: summary.active_payment_providers,
    },
    {
      key: "failedEvents" as const,
      label: labels.summary.failedEvents,
      value: summary.failed_payment_events,
    },
    {
      key: "monthlyVolume" as const,
      label: labels.summary.monthlyVolume,
      value: `${summary.monthly_transaction_volume.toLocaleString("nb-NO")} ${summary.monthly_transaction_currency}`,
    },
    {
      key: "countriesSupported" as const,
      label: labels.summary.countriesSupported,
      value: summary.countries_supported,
    },
    {
      key: "pendingSetups" as const,
      label: labels.summary.pendingSetups,
      value: summary.pending_provider_setups,
    },
    {
      key: "enterpriseCustomers" as const,
      label: labels.summary.enterpriseCustomers,
      value: summary.enterprise_invoice_customers,
    },
  ];

  return (
    <section className={SECTION_CARD}>
      <h2 className="font-semibold text-gray-900">{labels.sections.summary}</h2>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => {
          const indicator = getOperationsMetricIndicator(metric.key, center);
          return (
            <div key={metric.key} className="rounded-xl bg-gray-50 px-4 py-4">
              <dt className="text-xs uppercase tracking-wide text-gray-500">{metric.label}</dt>
              <dd className="mt-1 text-xl font-semibold text-gray-900">{metric.value}</dd>
              <div className="mt-2">
                <StatusIndicator
                  indicator={indicator}
                  label={indicatorLabel(
                    labels,
                    indicator,
                    metric.key === "failedEvents" ? "failedEvents" : undefined
                  )}
                />
              </div>
            </div>
          );
        })}
      </dl>
    </section>
  );
}

function SettlementColumn({
  title,
  items,
  total,
  currency,
  labels,
}: {
  title: string;
  items: SettlementRecord[];
  total: number;
  currency: string;
  labels: PaymentOperationsLabels;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-xs font-medium text-gray-600">
          {labels.settlements.columnTotal}: {formatAmount(total, currency)}
        </p>
      </div>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-gray-500">{labels.settlements.empty}</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg bg-white px-3 py-2 ring-1 ring-gray-100">
              <p className="font-medium text-gray-900">
                {labels.providers[item.provider_key as keyof typeof labels.providers] ?? item.provider_key}
              </p>
              <p className="text-gray-600">
                {formatAmount(item.amount, item.currency)}
              </p>
              {item.estimated_payout_date ? (
                <p className="mt-1 text-xs font-medium text-indigo-700">
                  {labels.settlements.estimatedPayout}: {formatSettlementDate(item.estimated_payout_date)}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProviderOpsCard({
  provider,
  labels,
}: {
  provider: PaymentOperationsProvider;
  labels: PaymentOperationsLabels;
}) {
  const caps =
    provider.operational_capabilities.length > 0
      ? provider.operational_capabilities
      : provider.capabilities;
  const providerKey = provider.provider_key as PaymentProviderKey;
  const providerName = labels.providers[provider.provider_key] ?? provider.name;

  return (
    <ProviderCard>
      <ProviderCardAssets>
        <ProviderLogo provider={providerKey} alt={providerName} />
      </ProviderCardAssets>

      <ProviderCardBody>
        <h3 className="text-lg font-semibold tracking-tight text-neutral-900">{providerName}</h3>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {labels.provider.capabilities}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-neutral-700">
            {caps.map((cap) => (
              <li key={cap}>• {labels.capabilities[cap] ?? cap}</li>
            ))}
          </ul>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {labels.provider.regions}
          </p>
          <p className="mt-2 text-sm text-neutral-700">
            {(provider.supported_countries.length > 0
              ? provider.supported_countries
              : provider.regions
            ).join(" · ")}
          </p>
        </div>

        <ProviderCardOperationalDetails>
          <ProviderCardDetail
            label={labels.provider.status}
            value={
              <ProviderStatusBadge
                statusKey={provider.status}
                label={labels.statuses[provider.status] ?? provider.status}
              />
            }
          />
          <ProviderCardDetail
            label={labels.provider.environment}
            value={labels.environments[provider.environment] ?? provider.environment}
          />
          <ProviderCardDetail
            label={labels.provider.apiStatus}
            value={labels.apiStatuses[provider.api_status] ?? provider.api_status}
          />
          <ProviderCardDetail
            label={labels.provider.webhookStatus}
            value={provider.webhook_status.replace(/_/g, " ")}
          />
          <ProviderCardDetail
            label={labels.provider.settlementStatus}
            value={labels.statuses[provider.settlement_status] ?? provider.settlement_status}
          />
          <ProviderCardDetail
            label={labels.provider.lastSync}
            value={
              provider.last_synchronization
                ? new Date(provider.last_synchronization).toLocaleString()
                : "—"
            }
          />
          <ProviderCardDetail
            label={labels.provider.currencies}
            value={provider.supported_currencies.join(", ")}
          />
          <ProviderCardDetail
            label={labels.provider.countries}
            value={provider.supported_countries.join(", ")}
          />
        </ProviderCardOperationalDetails>

        <ProviderCardActions>
          <Link
            href="/platform/payment-providers"
            className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            {labels.provider.configure}
          </Link>
        </ProviderCardActions>
      </ProviderCardBody>
    </ProviderCard>
  );
}

export function PaymentOperationsCenterPanel({
  labels,
  backHref,
}: PaymentOperationsCenterPanelProps) {
  const [center, setCenter] = useState<PaymentOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [auditFilter, setAuditFilter] = useState<AuditFilterCategory>("all");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/payment-operations/overview");
    if (res.ok) setCenter(parsePaymentOperationsCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const settlementTotals = useMemo(
    () =>
      center
        ? computeSettlementTotals(center.settlements, center.summary.monthly_transaction_currency)
        : null,
    [center]
  );

  const filteredAudit = useMemo(
    () => (center ? filterAuditEntries(center.audit, auditFilter) : []),
    [center, auditFilter]
  );

  if (loading) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!center || !settlementTotals) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-gray-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm text-gray-800">
          {center.principle}
        </p>
        <p className="mt-2 text-xs text-gray-500">{center.founding_principle}</p>
      </div>

      <ExecutiveSummarySection center={center} labels={labels} />
      <OperationsOverviewSection center={center} labels={labels} />

      <section>
        <h2 className="mb-4 font-semibold text-gray-900">{labels.sections.providers}</h2>
        <div className="grid auto-rows-fr gap-6 lg:grid-cols-2">
          {center.providers.map((provider) => (
            <ProviderOpsCard key={provider.provider_key} provider={provider} labels={labels} />
          ))}
        </div>
      </section>

      <section className={SECTION_CARD}>
        <h2 className="font-semibold text-gray-900">{labels.sections.settlements}</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <SettlementColumn
            title={labels.settlements.today}
            items={center.settlements.today}
            total={settlementTotals.today}
            currency={settlementTotals.currency}
            labels={labels}
          />
          <SettlementColumn
            title={labels.settlements.pending}
            items={center.settlements.pending}
            total={settlementTotals.pending}
            currency={settlementTotals.currency}
            labels={labels}
          />
          <SettlementColumn
            title={labels.settlements.failed}
            items={center.settlements.failed}
            total={settlementTotals.failed}
            currency={settlementTotals.currency}
            labels={labels}
          />
        </div>
      </section>

      <section className={SECTION_CARD}>
        <h2 className="font-semibold text-gray-900">{labels.sections.regionalCoverage}</h2>
        <ul className="mt-4 space-y-3">
          {REGIONAL_COVERAGE_KEYS.map((key) => {
            const region = center.regional_coverage[key];
            return (
              <li
                key={key}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm"
              >
                <span className="font-medium text-gray-900">{labels.regional[key]}</span>
                <span className="text-gray-600">
                  {region.ready ? "✓" : "—"}{" "}
                  {region.providers
                    .map((p) => labels.providers[p as keyof typeof labels.providers] ?? p)
                    .join(" · ")}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={SECTION_CARD}>
        <h2 className="font-semibold text-gray-900">{labels.sections.alerts}</h2>
        {center.alerts.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.alerts.empty}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {center.alerts.map((alert) => {
              const action = deriveAlertQuickAction(alert);
              const recommendationKey = deriveAlertRecommendedAction(alert);
              const recommendation =
                labels.alerts.recommendations[
                  recommendationKey as keyof typeof labels.alerts.recommendations
                ] ?? recommendationKey;

              return (
                <li key={alert.id} className="rounded-xl border border-gray-100 px-4 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill
                      label={labels.severities[alert.severity]}
                      className={ALERT_SEVERITY_BADGES[alert.severity]}
                    />
                    <span className="font-medium text-gray-900">{alert.title}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{alert.summary}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                  <p className="mt-2 text-sm text-gray-700">
                    <span className="font-medium">{labels.alerts.recommendedAction}: </span>
                    {recommendation}
                  </p>
                  <div className="mt-3">
                    <Link
                      href={action.href}
                      className="inline-flex rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 transition hover:border-gray-300 hover:bg-gray-50"
                    >
                      {labels.alerts.actions[action.label_key]} →
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className={SECTION_CARD}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-gray-900">{labels.sections.audit}</h2>
          <div className="flex flex-wrap gap-2">
            {AUDIT_FILTER_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setAuditFilter(category)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  auditFilter === category
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {auditFilterLabel(labels, category)}
              </button>
            ))}
          </div>
        </div>
        {filteredAudit.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.audit.empty}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {filteredAudit.map((entry) => (
              <li key={entry.id} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 text-sm">
                <p className="font-medium text-gray-900">{entry.summary}</p>
                <div className="mt-2 grid gap-2 text-xs text-gray-600 sm:grid-cols-2">
                  <p>
                    <span className="font-medium text-gray-500">{labels.audit.before}: </span>
                    {JSON.stringify(entry.before_value)}
                  </p>
                  <p>
                    <span className="font-medium text-gray-500">{labels.audit.after}: </span>
                    {JSON.stringify(entry.after_value)}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span>
                    {labels.audit.timestamp}: {new Date(entry.created_at).toLocaleString()}
                  </span>
                  <span>
                    {labels.audit.actor}: {entry.actor ?? "Platform Admin"}
                  </span>
                  <span>
                    {labels.audit.workspace}: {entry.workspace ?? "Aipify Group AS"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
