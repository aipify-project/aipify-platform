"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
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
  REGIONAL_COVERAGE_KEYS,
  parsePaymentOperationsCenter,
  type PaymentOperationsCenter,
  type PaymentOperationsLabels,
  type PaymentOperationsProvider,
} from "@/lib/payment-operations";
import type { PaymentProviderKey } from "@/lib/payment-providers";

type PaymentOperationsCenterPanelProps = {
  labels: PaymentOperationsLabels;
  backHref: string;
};

function StatusPill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
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

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/payment-operations/overview");
    if (res.ok) setCenter(parsePaymentOperationsCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!center) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  const { summary } = center;

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

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.summary}</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              [labels.summary.activeProviders, summary.active_payment_providers],
              [labels.summary.countriesSupported, summary.countries_supported],
              [labels.summary.pendingSetups, summary.pending_provider_setups],
              [labels.summary.enterpriseCustomers, summary.enterprise_invoice_customers],
              [
                labels.summary.monthlyVolume,
                `${summary.monthly_transaction_volume.toLocaleString()} ${summary.monthly_transaction_currency}`,
              ],
              [labels.summary.failedEvents, summary.failed_payment_events],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="rounded-xl bg-gray-50 px-4 py-3">
              <dt className="text-xs uppercase tracking-wide text-gray-500">{label}</dt>
              <dd className="mt-1 text-xl font-semibold text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="mb-4 font-semibold text-gray-900">{labels.sections.providers}</h2>
        <div className="grid auto-rows-fr gap-6 lg:grid-cols-2">
          {center.providers.map((provider) => (
            <ProviderOpsCard key={provider.provider_key} provider={provider} labels={labels} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.settlements}</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {(
            [
              [labels.settlements.today, center.settlements.today],
              [labels.settlements.pending, center.settlements.pending],
              [labels.settlements.failed, center.settlements.failed],
            ] as const
          ).map(([title, items]) => (
            <div key={title} className="rounded-xl bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
              {items.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500">{labels.settlements.empty}</p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm">
                  {items.map((item) => (
                    <li key={item.id} className="rounded-lg bg-white px-3 py-2 ring-1 ring-gray-100">
                      <p className="font-medium text-gray-900">
                        {labels.providers[item.provider_key as keyof typeof labels.providers] ??
                          item.provider_key}
                      </p>
                      <p className="text-gray-600">
                        {item.amount.toLocaleString()} {item.currency}
                      </p>
                      {item.estimated_payout_date && (
                        <p className="text-xs text-gray-500">
                          {labels.settlements.estimatedPayout}: {item.estimated_payout_date}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
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

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.alerts}</h2>
        {center.alerts.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.settlements.empty}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {center.alerts.map((alert) => (
              <li key={alert.id} className="rounded-xl border border-gray-100 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill
                    label={labels.severities[alert.severity]}
                    className={ALERT_SEVERITY_BADGES[alert.severity]}
                  />
                  <span className="font-medium text-gray-900">{alert.title}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{alert.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.audit}</h2>
        {center.audit.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.audit.empty}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {center.audit.map((entry) => (
              <li key={entry.id} className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <span className="font-medium text-gray-900">{entry.summary}</span>
                <span className="mt-1 block text-xs text-gray-500">
                  {labels.audit.before}: {JSON.stringify(entry.before_value)} · {labels.audit.after}:{" "}
                  {JSON.stringify(entry.after_value)}
                </span>
                <span className="mt-1 block text-xs text-gray-400">{entry.created_at}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
