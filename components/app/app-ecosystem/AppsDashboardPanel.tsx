"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseAppInstallResult,
  parseEcosystemAppsDashboard,
  type EcosystemAppsDashboard,
} from "@/lib/aipify/app-ecosystem";

type AppsDashboardPanelProps = {
  labels: Record<string, string>;
};

function riskBadgeClass(risk: string) {
  switch (risk) {
    case "restricted":
      return "bg-rose-100 text-rose-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-teal-100 text-teal-800";
  }
}

export function AppsDashboardPanel({ labels }: AppsDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<EcosystemAppsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionKey, setActionKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/apps/dashboard");
    if (res.ok) setDashboard(parseEcosystemAppsDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const installApp = async (appKey: string) => {
    setActionKey(appKey);
    const res = await fetch("/api/aipify/apps/install", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_key: appKey, approve: true }),
    });
    if (res.ok) parseAppInstallResult(await res.json());
    await load();
    setActionKey(null);
  };

  const updateApp = async (installId: string) => {
    setActionKey(installId);
    await fetch("/api/aipify/apps/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ install_id: installId }),
    });
    await load();
    setActionKey(null);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const installedKeys = new Set(dashboard.installed.map((i) => i.app_key));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Link href="/developers" className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-teal-300">
          {labels.developerPortal}
        </Link>
        <Link href="/app/marketplace" className="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:border-teal-300">
          {labels.marketplace}
        </Link>
      </div>

      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-5">
        <h2 className="text-sm font-semibold text-teal-900">{labels.overview}</h2>
        <p className="mt-2 text-sm text-gray-700">
          {dashboard.installed_count ?? 0} {labels.installedApps}
          {(dashboard.updates_available ?? 0) > 0 ? ` · ${dashboard.updates_available} ${labels.updatesAvailable}` : ""}
        </p>
        <p className="mt-2 text-xs text-gray-600">{labels.principle}</p>
      </section>

      {dashboard.installed.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.installedAppsTitle}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.installed.map((item) => (
              <li key={item.install_id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
                <div>
                  <Link href={`/app/apps/${item.app_key}`} className="font-medium text-teal-800 hover:underline">
                    {item.name}
                  </Link>
                  <p className="text-xs text-gray-500">
                    v{item.version}
                    {item.update_available ? ` → ${item.latest_version}` : ""}
                    {" · "}
                    <span className={`rounded px-1.5 py-0.5 capitalize ${riskBadgeClass(item.risk_level)}`}>
                      {item.risk_level}
                    </span>
                  </p>
                </div>
                {item.update_available ? (
                  <button
                    type="button"
                    disabled={actionKey === item.install_id}
                    onClick={() => void updateApp(item.install_id)}
                    className="rounded border border-teal-300 px-3 py-1 text-xs font-medium text-teal-800 hover:bg-teal-50 disabled:opacity-50"
                  >
                    {labels.update}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.catalog}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dashboard.catalog.map((app) => (
            <div key={app.app_key} className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/app/apps/${app.app_key}`} className="font-medium text-gray-900 hover:text-teal-700">
                  {app.name}
                </Link>
                <span className={`rounded px-2 py-0.5 text-xs capitalize ${riskBadgeClass(app.risk_level)}`}>
                  {app.risk_level}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-gray-600">{app.description}</p>
              <p className="mt-2 text-xs capitalize text-gray-500">{app.category.replace(/_/g, " ")} · v{app.version}</p>
              {!installedKeys.has(app.app_key) ? (
                <button
                  type="button"
                  disabled={actionKey === app.app_key}
                  onClick={() => void installApp(app.app_key)}
                  className="mt-3 rounded border border-teal-300 px-3 py-1 text-xs font-medium text-teal-800 hover:bg-teal-50 disabled:opacity-50"
                >
                  {actionKey === app.app_key ? labels.installing : labels.install}
                </button>
              ) : (
                <p className="mt-3 text-xs text-teal-700">{labels.installed}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-500">{labels.safetyNote}</p>
    </div>
  );
}
