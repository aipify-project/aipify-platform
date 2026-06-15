"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsMarketplaceDashboard,
  type AipifyHostsMarketplaceDashboard,
  type HostsMarketplaceModule,
  type HostsMarketplaceProvider,
  type HostsMarketplaceRequest,
} from "@/lib/aipify/aipify-hosts-marketplace";

type Props = {
  labels: Record<string, string>;
};

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm sm:px-5">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-xl font-semibold text-gray-900 sm:text-2xl">{value}</dd>
    </div>
  );
}

function statusBadge(status: string, labels: Record<string, string>): string {
  const map: Record<string, string> = {
    requested: "bg-sky-50 text-sky-800 ring-sky-200",
    accepted: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    scheduled: "bg-violet-50 text-violet-800 ring-violet-200",
    in_progress: "bg-amber-50 text-amber-900 ring-amber-200",
    completed: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    cancelled: "bg-gray-100 text-gray-700 ring-gray-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function statusLabel(status: string, labels: Record<string, string>): string {
  const key = `status_${status}` as keyof typeof labels;
  return labels[key] ?? status.replace(/_/g, " ");
}

function ProviderCard({
  provider,
  labels,
  onFavorite,
  onRequest,
  busy,
}: {
  provider: HostsMarketplaceProvider;
  labels: Record<string, string>;
  onFavorite: (id: string) => void;
  onRequest: (provider: HostsMarketplaceProvider) => void;
  busy: boolean;
}) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900">{provider.company_name}</h3>
          <p className="mt-1 text-sm text-gray-600">{provider.profile_summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200">
            {labels.verified}
          </span>
          <span className="rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
            {provider.availability_status}
          </span>
        </div>
      </div>
      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-gray-500">{labels.coverageArea}</dt>
          <dd className="font-medium text-gray-900">{provider.coverage_area}</dd>
        </div>
        <div>
          <dt className="text-gray-500">{labels.rating}</dt>
          <dd className="font-medium text-gray-900">
            {provider.rating_avg.toFixed(2)} ({provider.rating_count})
          </dd>
        </div>
      </dl>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {provider.service_categories.map((cat) => (
          <span key={cat} className="rounded-full bg-teal-50 px-2 py-0.5 text-xs text-teal-800">
            {cat.replace(/_/g, " ")}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => onFavorite(provider.id)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          {provider.is_favorite ? labels.removeFavorite : labels.saveFavorite}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onRequest(provider)}
          className="rounded-lg bg-teal-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {labels.requestService}
        </button>
      </div>
    </article>
  );
}

function RequestList({
  title,
  requests,
  labels,
  emptyTitle,
  emptyMessage,
}: {
  title: string;
  requests: HostsMarketplaceRequest[];
  labels: Record<string, string>;
  emptyTitle: string;
  emptyMessage: string;
}) {
  if (requests.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-5">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm font-medium text-gray-700">{emptyTitle}</p>
        <p className="mt-1 text-sm text-gray-600">{emptyMessage}</p>
      </section>
    );
  }
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-gray-900">{title}</h2>
      <ul className="mt-4 divide-y divide-gray-100">
        {requests.map((req) => (
          <li key={req.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium text-gray-900">{req.provider_name ?? req.summary}</p>
              <p className="text-sm text-gray-600">{req.summary}</p>
            </div>
            <span className={`self-start rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${statusBadge(req.status, labels)}`}>
              {statusLabel(req.status, labels)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ModuleCard({ module, enabledLabel }: { module: HostsMarketplaceModule; enabledLabel: string }) {
  return (
    <article className="rounded-xl border border-teal-100 bg-teal-50/40 p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{module.label}</h3>
        <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800">{enabledLabel}</span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{module.description}</p>
    </article>
  );
}

export function AipifyHostsMarketplaceDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<AipifyHostsMarketplaceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [requestProvider, setRequestProvider] = useState<HostsMarketplaceProvider | null>(null);
  const [requestSummary, setRequestSummary] = useState("");

  const load = useCallback(async (nextCategory = category, nextQuery = query) => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams();
    if (nextCategory) params.set("category", nextCategory);
    if (nextQuery.trim()) params.set("query", nextQuery.trim());
    const qs = params.toString();
    const res = await fetch(`/api/aipify/aipify-hosts/marketplace/dashboard${qs ? `?${qs}` : ""}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsMarketplaceDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, [category, query]);

  useEffect(() => {
    void load();
  }, [load]);

  const compareProviders = useMemo(() => {
    if (!dashboard) return [];
    return [...dashboard.providers].sort((a, b) => b.rating_avg - a.rating_avg).slice(0, 3);
  }, [dashboard]);

  const handleFavorite = async (providerId: string) => {
    setBusy(true);
    await fetch("/api/aipify/aipify-hosts/marketplace/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider_id: providerId }),
    });
    setBusy(false);
    await load();
  };

  const handleCreateRequest = async () => {
    if (!requestProvider || !requestSummary.trim()) return;
    setBusy(true);
    const primaryCategory = requestProvider.service_categories[0] ?? "maintenance";
    await fetch("/api/aipify/aipify-hosts/marketplace/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider_id: requestProvider.id,
        service_category: category || primaryCategory,
        summary: requestSummary.trim(),
      }),
    });
    setBusy(false);
    setRequestProvider(null);
    setRequestSummary("");
    await load();
  };

  if (loading && !dashboard) {
    return <AipifyLoader label={labels.loading} centered fullPage />;
  }

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const perf = dashboard.provider_performance;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-teal-100 bg-teal-50/40 p-6">
        <p className="text-sm font-medium text-teal-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-teal-900">{dashboard.governance.principle}</p>
        <p className="mt-3 text-xs text-teal-800">{labels.foundationNote}</p>
        <Link
          href="/app/aipify-hosts"
          className="mt-4 inline-flex rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-900 hover:bg-teal-50"
        >
          {labels.backToHosts}
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={labels.openRequests} value={dashboard.open_requests.length} />
        <MetricCard label={labels.upcomingServices} value={dashboard.upcoming_services.length} />
        <MetricCard label={labels.verifiedProviders} value={perf.verified_provider_count} />
        <MetricCard label={labels.avgRating} value={perf.average_provider_rating.toFixed(2)} />
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.searchProviders}</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">{labels.allCategories}</option>
            {dashboard.service_categories.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void load(category, query)}
            className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
          >
            {labels.search}
          </button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <RequestList
          title={labels.openRequestsTitle}
          requests={dashboard.open_requests}
          labels={labels}
          emptyTitle={labels.emptyOpenTitle}
          emptyMessage={labels.emptyOpenMessage}
        />
        <RequestList
          title={labels.upcomingServicesTitle}
          requests={dashboard.upcoming_services}
          labels={labels}
          emptyTitle={labels.emptyUpcomingTitle}
          emptyMessage={labels.emptyUpcomingMessage}
        />
      </div>

      {dashboard.favorites.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.savedFavorites}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {dashboard.favorites.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                labels={labels}
                onFavorite={handleFavorite}
                onRequest={setRequestProvider}
                busy={busy}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.providersDirectory}</h2>
        {dashboard.providers.length === 0 ? (
          <PlatformEmptyState
            title={labels.emptyProvidersTitle}
            message={labels.emptyProvidersMessage}
            primaryAction={{ label: labels.clearFilters, onClick: () => { setCategory(""); setQuery(""); void load("", ""); } }}
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {dashboard.providers.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                labels={labels}
                onFavorite={handleFavorite}
                onRequest={setRequestProvider}
                busy={busy}
              />
            ))}
          </div>
        )}
      </section>

      {compareProviders.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.compareProviders}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500">
                  <th className="py-2 pr-4">{labels.company}</th>
                  <th className="py-2 pr-4">{labels.rating}</th>
                  <th className="py-2 pr-4">{labels.coverageArea}</th>
                  <th className="py-2">{labels.availability}</th>
                </tr>
              </thead>
              <tbody>
                {compareProviders.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="py-3 pr-4 font-medium text-gray-900">{p.company_name}</td>
                    <td className="py-3 pr-4">{p.rating_avg.toFixed(2)}</td>
                    <td className="py-3 pr-4">{p.coverage_area}</td>
                    <td className="py-3">{p.availability_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.providerPerformance}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label={labels.completedJobs} value={perf.completed_jobs} />
          <MetricCard label={labels.onTimeCompletion} value={`${perf.on_time_completion_pct}%`} />
          <MetricCard label={labels.verifiedProviders} value={perf.verified_provider_count} />
          <MetricCard label={labels.avgRating} value={perf.average_provider_rating.toFixed(2)} />
        </dl>
      </section>

      {dashboard.outstanding_approvals.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
          <h2 className="font-semibold text-amber-950">{labels.outstandingApprovals}</h2>
          <ul className="mt-3 space-y-2 text-sm text-amber-900">
            {dashboard.outstanding_approvals.map((item) => (
              <li key={item.key}>
                {item.company_name} — {item.publication_status}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.modules}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {dashboard.modules.map((module) => (
            <ModuleCard
              key={module.key}
              module={module}
              enabledLabel={labels.included}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.futureOpportunities}</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {dashboard.commercial.future_opportunities.map((item) => (
            <li key={item} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      </section>

      {requestProvider && (
        <section className="rounded-2xl border border-teal-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.requestServiceTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {labels.requestServiceFor} {requestProvider.company_name}
          </p>
          <textarea
            value={requestSummary}
            onChange={(e) => setRequestSummary(e.target.value)}
            rows={3}
            placeholder={labels.requestSummaryPlaceholder}
            className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy || !requestSummary.trim()}
              onClick={() => void handleCreateRequest()}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
            >
              {labels.submitRequest}
            </button>
            <button
              type="button"
              onClick={() => { setRequestProvider(null); setRequestSummary(""); }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {labels.cancel}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
