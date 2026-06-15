"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsDashboard,
  type AipifyHostsDashboard,
  type HostsModule,
  type HostsPackage,
} from "@/lib/aipify/aipify-hosts";

type Props = {
  labels: Record<string, string>;
};

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function ModuleCard({ module, enabled, enabledLabel, scaffoldLabel }: {
  module: HostsModule;
  enabled: boolean;
  enabledLabel: string;
  scaffoldLabel: string;
}) {
  return (
    <article className={`rounded-xl border p-4 ${enabled ? "border-indigo-100 bg-indigo-50/40" : "border-gray-100 bg-gray-50/60"}`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{module.label}</h3>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${enabled ? "bg-indigo-100 text-indigo-800" : "bg-gray-200 text-gray-600"}`}>
          {enabled ? enabledLabel : scaffoldLabel}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{module.description}</p>
    </article>
  );
}

function packageIncludesModule(pkg: HostsPackage, moduleKey: string): boolean {
  return Array.isArray(pkg.modules) && pkg.modules.includes(moduleKey as HostsPackage["modules"][number]);
}

export function AipifyHostsDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<AipifyHostsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const res = await fetch("/api/aipify/aipify-hosts/dashboard");
    if (res.ok) {
      setDashboard(parseAipifyHostsDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
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

  const activePackage = dashboard.packages.find((p) => p.key === dashboard.package_key);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6">
        <p className="text-sm font-medium text-indigo-900">{dashboard.positioning}</p>
        <p className="mt-3 text-xs text-indigo-800">{dashboard.governance.principle}</p>
        {labels.openAutomation && (
          <Link
            href="/app/aipify-hosts/automation"
            className="mt-4 inline-flex rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-50"
          >
            {labels.openAutomation}
          </Link>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.executiveSnapshot}</h2>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label={labels.properties} value={dashboard.property_count} />
          <MetricCard label={labels.healthScore} value={`${dashboard.property_health_score}%`} />
          <MetricCard label={labels.package} value={activePackage?.label ?? dashboard.package_key} />
          <MetricCard label={labels.platforms} value={dashboard.platforms.length} />
        </dl>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.supportedPlatforms}</h2>
        <div className="flex flex-wrap gap-2">
          {dashboard.platforms.map((platform) => (
            <span key={platform.key} className="rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 ring-1 ring-gray-200">
              {platform.label}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.modules}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {dashboard.modules.map((module) => {
            const enabled = activePackage ? packageIncludesModule(activePackage, module.key) : false;
            return (
              <ModuleCard
                key={module.key}
                module={module}
                enabled={enabled}
                enabledLabel={labels.included}
                scaffoldLabel={labels.upgradeRequired}
              />
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.packages}</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {dashboard.packages.map((pkg) => (
            <article
              key={pkg.key}
              className={`rounded-2xl border p-5 ${pkg.key === dashboard.package_key ? "border-indigo-300 bg-indigo-50/30 shadow-sm" : "border-gray-200 bg-white"}`}
            >
              <h3 className="font-semibold text-gray-900">{pkg.label}</h3>
              <p className="mt-1 text-sm text-gray-600">{pkg.target}</p>
              <p className="mt-3 text-xs text-gray-500">
                {labels.moduleCount.replace("{count}", String(pkg.modules?.length ?? 0))}
              </p>
            </article>
          ))}
        </div>
      </section>

      {dashboard.properties.length === 0 ? (
        <PlatformEmptyState
          title={labels.emptyPropertiesTitle}
          message={labels.emptyPropertiesMessage}
          primaryAction={{ label: labels.addProperty, onClick: () => {} }}
          secondaryAction={{ label: labels.exploreKnowledge, href: "/app/settings/employee-knowledge" }}
        />
      ) : (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.propertiesList}</h2>
          <ul className="mt-4 divide-y divide-gray-100">
            {dashboard.properties.map((property) => (
              <li key={property.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span className="font-medium text-gray-900">{property.display_name}</span>
                <span className="text-gray-500">{property.platform_source ?? labels.directBooking}</span>
                <span className="text-indigo-700">{property.health_score}%</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{labels.successMetrics}</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {dashboard.success_metrics.map((metric) => (
            <li key={metric.key} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
              {metric.label}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
