"use client";

import { formatRelativeTime } from "@/lib/i18n/format-relative-time";
import type {
  Installation,
  IntegrationKey,
  IntegrationStatus,
  ModuleKey,
  SystemType,
} from "@/lib/tenant/types";

type InstallationCardLabels = {
  company: string;
  installationId: string;
  systemType: string;
  status: Record<string, string>;
  systemTypes: Record<SystemType, string>;
  modules: string;
  integrations: string;
  lastSynced: string;
  neverSynced: string;
  modulesList: Record<ModuleKey, string>;
  integrationsList: Record<IntegrationKey, string>;
  integrationStatus: Record<IntegrationStatus, string>;
};

type InstallationCardProps = {
  installation: Installation;
  labels: InstallationCardLabels;
  locale: string;
};

function StatusBadge({
  status,
  labels,
}: {
  status: string;
  labels: Record<string, string>;
}) {
  const tone =
    status === "active"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
      : status === "pending"
        ? "bg-amber-50 text-amber-700 ring-amber-100"
        : status === "paused"
          ? "bg-gray-100 text-gray-700 ring-gray-200"
          : "bg-red-50 text-red-700 ring-red-100";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${tone}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

export default function InstallationCard({
  installation,
  labels,
  locale,
}: InstallationCardProps) {
  const displayName =
    installation.name ??
    installation.site_url ??
    labels.systemTypes[installation.system_type];
  const companyName = installation.company?.name ?? "—";
  const activeModules =
    installation.modules?.filter((module) => module.enabled) ?? [];
  const integrations = installation.integrations ?? [];
  const lastSynced = formatRelativeTime(installation.last_synced_at, locale);

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            {displayName}
          </h2>
          {installation.site_url && installation.name && (
            <p className="mt-1 text-sm text-gray-500">{installation.site_url}</p>
          )}
        </div>
        <StatusBadge status={installation.status} labels={labels.status} />
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {labels.company}
          </dt>
          <dd className="mt-1 text-sm font-medium text-gray-900">{companyName}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {labels.systemType}
          </dt>
          <dd className="mt-1 text-sm font-medium text-gray-900">
            {labels.systemTypes[installation.system_type]}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {labels.installationId}
          </dt>
          <dd className="mt-1 break-all font-mono text-xs text-gray-600">
            {installation.id}
          </dd>
        </div>
      </dl>

      {activeModules.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.modules}</h3>
          <ul className="mt-3 space-y-2">
            {activeModules.map((module) => (
              <li
                key={module.module_key}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <span className="text-emerald-500" aria-hidden="true">
                  ✓
                </span>
                {labels.modulesList[module.module_key]}
              </li>
            ))}
          </ul>
        </div>
      )}

      {integrations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900">
            {labels.integrations}
          </h3>
          <ul className="mt-3 space-y-2">
            {integrations.map((integration) => (
              <li
                key={integration.integration_key}
                className="flex flex-wrap items-center justify-between gap-2 text-sm"
              >
                <span className="flex items-center gap-2 text-gray-700">
                  <span
                    className={
                      integration.status === "connected"
                        ? "text-emerald-500"
                        : "text-gray-300"
                    }
                    aria-hidden="true"
                  >
                    {integration.status === "connected" ? "✓" : "○"}
                  </span>
                  {labels.integrationsList[integration.integration_key]}
                </span>
                <span className="text-xs font-medium text-gray-500">
                  {labels.integrationStatus[integration.status]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {labels.lastSynced}
        </p>
        <p className="mt-1 text-sm font-medium text-gray-700">
          {lastSynced ?? labels.neverSynced}
        </p>
      </div>
    </article>
  );
}
