"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseAppInstallResult, parseEcosystemAppDetail, type EcosystemAppDetail } from "@/lib/aipify/app-ecosystem";

type AppsDetailPanelProps = {
  appKey: string;
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

export function AppsDetailPanel({ appKey, labels }: AppsDetailPanelProps) {
  const [detail, setDetail] = useState<EcosystemAppDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/apps/${appKey}`);
    if (res.ok) setDetail(parseEcosystemAppDetail(await res.json()));
    else setDetail(null);
    setLoading(false);
  }, [appKey]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleInstall = async () => {
    setBusy(true);
    await fetch("/api/aipify/apps/install", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_key: appKey, approve: true }),
    });
    await load();
    setBusy(false);
  };

  const handleUninstall = async () => {
    if (!detail?.install?.install_id) return;
    setBusy(true);
    const res = await fetch("/api/aipify/apps/uninstall", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ install_id: detail.install.install_id }),
    });
    if (res.ok) parseAppInstallResult(await res.json());
    await load();
    setBusy(false);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!detail) return <div className="text-sm text-gray-600">{labels.notFound}</div>;

  const { app, install: installRecord, versions, reviews, metrics, permissions } = {
    ...detail,
    permissions: detail.app.permissions,
  };

  return (
    <div className="space-y-6">
      <Link href="/app/apps" className="text-sm text-teal-700 hover:underline">
        ← {labels.back}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{app.name}</h2>
          <p className="mt-1 text-gray-600">{app.description}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className={`rounded px-2 py-1 capitalize ${riskBadgeClass(app.risk_level)}`}>
              {labels.risk}: {app.risk_level}
            </span>
            <span className="rounded bg-gray-100 px-2 py-1 capitalize text-gray-700">
              {app.category.replace(/_/g, " ")}
            </span>
            <span className="rounded bg-gray-100 px-2 py-1 text-gray-700">v{app.version}</span>
            {app.sandbox_required ? (
              <span className="rounded bg-teal-100 px-2 py-1 text-teal-800">{labels.sandbox}</span>
            ) : null}
          </div>
        </div>
        {installRecord ? (
          <button
            type="button"
            onClick={() => void handleUninstall()}
            disabled={busy}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:border-rose-300 disabled:opacity-50"
          >
            {labels.uninstall}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void handleInstall()}
            disabled={busy}
            className="rounded-lg border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800 hover:bg-teal-100 disabled:opacity-50"
          >
            {labels.install}
          </button>
        )}
      </div>

      {permissions.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.permissions}</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {permissions.map((p) => (
              <li key={p} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">{p}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {versions.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.versions}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {versions.map((v) => (
              <li key={v.version} className="rounded border border-gray-200 px-3 py-2">
                v{v.version}
                {v.permissions_changed ? ` · ${labels.permissionsChanged}` : ""}
                {v.release_notes ? <p className="mt-1 text-gray-600">{v.release_notes}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {reviews.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.reviews}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {reviews.map((r, i) => (
              <li key={i} className="rounded border border-gray-200 px-3 py-2">
                {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                {r.review ? <p className="mt-1 text-gray-600">{r.review}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {metrics.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.telemetry}</h3>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {metrics.slice(0, 6).map((m, i) => (
              <div key={i} className="rounded border border-gray-200 p-3 text-sm">
                <p className="capitalize text-gray-500">{m.metric_key.replace(/_/g, " ")}</p>
                <p className="font-semibold">{m.metric_value}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <p className="text-xs text-gray-500">{labels.governanceNote}</p>
    </div>
  );
}
