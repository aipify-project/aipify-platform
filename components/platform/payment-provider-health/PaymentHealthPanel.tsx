"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PaymentProviderLogo } from "@/components/shared/payment-providers/PaymentProviderLogo";
import {
  ALERT_SEVERITY_BADGES,
  HEALTH_STATUS_INDICATORS,
  parsePaymentProviderHealthCenter,
  type PaymentProviderHealthCenter,
  type PaymentProviderHealthLabels,
  type ProviderHealthCard,
} from "@/lib/payment-provider-health";
import type { PaymentProviderKey } from "@/lib/payment-providers";

type PaymentHealthPanelProps = {
  labels: PaymentProviderHealthLabels;
  backHref: string;
};

function StatusPill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
  );
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function ProviderHealthCard({
  provider,
  labels,
  onRetryCheck,
  onTestConnection,
  busy,
}: {
  provider: ProviderHealthCard;
  labels: PaymentProviderHealthLabels;
  onRetryCheck: (providerKey: string) => void;
  onTestConnection: (providerKey: string) => void;
  busy: string | null;
}) {
  const statusClass =
    HEALTH_STATUS_INDICATORS[provider.health_status]?.badge ??
    HEALTH_STATUS_INDICATORS.offline.badge;
  const dotClass =
    HEALTH_STATUS_INDICATORS[provider.health_status]?.dot ?? HEALTH_STATUS_INDICATORS.offline.dot;
  const isBusy = busy === provider.provider_key;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-5">
        <PaymentProviderLogo
          provider={provider.provider_key as PaymentProviderKey}
          alt={labels.providers[provider.provider_key] ?? provider.name}
        />
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} aria-hidden />
          <StatusPill
            label={labels.healthStatuses[provider.health_status] ?? provider.health_status}
            className={statusClass}
          />
        </div>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        {labels.providers[provider.provider_key] ?? provider.name}
      </h3>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-gray-500">{labels.provider.environment}</dt>
          <dd className="mt-1 font-medium text-gray-900">
            {labels.environments[provider.environment] ?? provider.environment}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">{labels.provider.apiConnection}</dt>
          <dd className="mt-1 font-medium text-gray-900">
            {labels.apiStatuses[provider.api_connection_status] ?? provider.api_connection_status}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">{labels.provider.webhookStatus}</dt>
          <dd className="mt-1 font-medium text-gray-900">
            {provider.webhook_status.replace(/_/g, " ")}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">{labels.provider.failed24h}</dt>
          <dd className="mt-1 font-medium text-gray-900">{provider.failed_events_24h}</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">{labels.provider.successRate}</dt>
          <dd className="mt-1 font-medium text-gray-900">{provider.success_rate_30d}%</dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">{labels.provider.nextCheck}</dt>
          <dd className="mt-1 font-medium text-gray-900">
            {formatDate(provider.next_health_check_at)}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs text-gray-500">{labels.provider.lastTransaction}</dt>
          <dd className="mt-1 font-medium text-gray-900">
            {formatDate(provider.last_successful_transaction_at)}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs text-gray-500">{labels.provider.lastSync}</dt>
          <dd className="mt-1 font-medium text-gray-900">
            {formatDate(provider.last_synchronization_at)}
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-wrap gap-3 pt-5">
        <Link
          href="/platform/payment-providers"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          {labels.provider.viewDetails} →
        </Link>
        <button
          type="button"
          disabled={isBusy}
          onClick={() => onRetryCheck(provider.provider_key)}
          className="text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
        >
          {isBusy ? labels.actions.checking : labels.provider.retryCheck}
        </button>
        <button
          type="button"
          disabled={isBusy}
          onClick={() => onTestConnection(provider.provider_key)}
          className="text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
        >
          {labels.provider.testConnection}
        </button>
      </div>
    </article>
  );
}

export function PaymentHealthPanel({ labels, backHref }: PaymentHealthPanelProps) {
  const [center, setCenter] = useState<PaymentProviderHealthCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyProvider, setBusyProvider] = useState<string | null>(null);
  const [auditFilter, setAuditFilter] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/payment-provider-health/overview");
    if (res.ok) setCenter(parsePaymentProviderHealthCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleRetryCheck = useCallback(
    async (providerKey: string) => {
      setBusyProvider(providerKey);
      try {
        const res = await fetch("/api/payment-provider-health/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider_key: providerKey }),
        });
        if (res.ok) await load();
      } finally {
        setBusyProvider(null);
      }
    },
    [load]
  );

  const handleTestConnection = useCallback(
    async (providerKey: string) => {
      setBusyProvider(providerKey);
      try {
        const res = await fetch(`/api/payment-providers/${providerKey}/test`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scope: "platform" }),
        });
        if (res.ok) await load();
      } finally {
        setBusyProvider(null);
      }
    },
    [load]
  );

  if (loading) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  if (!center) {
    return <p className="p-6 text-sm text-red-600">{labels.loading}</p>;
  }

  const filteredAudit = auditFilter
    ? center.audit.filter((entry) => entry.provider_key === auditFilter)
    : center.audit;

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
      </div>

      {center.all_operational && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
          {labels.emptyState}
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.autoChecks}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {center.providers.map((provider) => (
            <li
              key={provider.provider_key}
              className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700"
            >
              <span className="font-medium text-gray-900">
                {labels.providers[provider.provider_key]}
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                {labels.autoChecks[provider.provider_key]} · every {provider.check_interval_minutes}{" "}
                min
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-4 font-semibold text-gray-900">{labels.sections.providers}</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {center.providers.map((provider) => (
            <ProviderHealthCard
              key={provider.provider_key}
              provider={provider}
              labels={labels}
              onRetryCheck={handleRetryCheck}
              onTestConnection={handleTestConnection}
              busy={busyProvider}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.alerts}</h2>
        {center.alerts.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.emptyState}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {center.alerts.map((alert) => (
              <li key={alert.id} className="rounded-xl border border-gray-100 px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill
                    label={labels.severities[alert.severity]}
                    className={ALERT_SEVERITY_BADGES[alert.severity]}
                  />
                  <span className="text-xs text-gray-500">
                    {labels.providers[alert.provider_key as keyof typeof labels.providers] ??
                      alert.provider_key}
                  </span>
                  <span className="font-medium text-gray-900">{alert.title}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{alert.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-gray-900">{labels.sections.audit}</h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAuditFilter(null)}
              className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                auditFilter === null
                  ? "bg-indigo-50 text-indigo-800 ring-indigo-200"
                  : "bg-gray-50 text-gray-700 ring-gray-200"
              }`}
            >
              {labels.provider.viewLogs}
            </button>
            {center.providers.map((provider) => (
              <button
                key={provider.provider_key}
                type="button"
                onClick={() => setAuditFilter(provider.provider_key)}
                className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                  auditFilter === provider.provider_key
                    ? "bg-indigo-50 text-indigo-800 ring-indigo-200"
                    : "bg-gray-50 text-gray-700 ring-gray-200"
                }`}
              >
                {labels.providers[provider.provider_key]}
              </button>
            ))}
          </div>
        </div>
        {filteredAudit.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.audit.empty}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {filteredAudit.map((entry) => (
              <li key={entry.id} className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill
                    label={labels.severities[entry.severity]}
                    className={ALERT_SEVERITY_BADGES[entry.severity]}
                  />
                  <span className="font-medium text-gray-900">{entry.summary}</span>
                </div>
                <span className="mt-1 block text-xs text-gray-500">
                  {labels.audit.event}: {entry.event_type.replace(/_/g, " ")} ·{" "}
                  {labels.audit.resolution}: {entry.resolution_status} ·{" "}
                  {labels.providers[entry.provider_key as keyof typeof labels.providers] ??
                    entry.provider_key}
                </span>
                <span className="mt-1 block text-xs text-gray-400">
                  {formatDate(entry.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
