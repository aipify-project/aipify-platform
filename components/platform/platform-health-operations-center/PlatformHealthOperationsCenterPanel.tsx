"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  INCIDENT_SEVERITIES,
  INCIDENT_STATUSES,
  SERVICE_KEYS,
  SEVERITY_BADGES,
  SERVICE_STATUS_BADGES,
  parsePlatformHealthOperationsCenter,
  type PlatformHealthOperationsCenter,
  type PlatformHealthOperationsLabels,
} from "@/lib/platform-health-operations-center";

type PlatformHealthOperationsCenterPanelProps = {
  labels: PlatformHealthOperationsLabels;
  backHref: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export function PlatformHealthOperationsCenterPanel({
  labels,
  backHref,
}: PlatformHealthOperationsCenterPanelProps) {
  const [center, setCenter] = useState<PlatformHealthOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftSummary, setDraftSummary] = useState("");
  const [draftServiceKey, setDraftServiceKey] = useState<string>(SERVICE_KEYS[0]);
  const [draftSeverity, setDraftSeverity] = useState<string>("medium");
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform-health-operations-center/overview");
    if (res.ok) {
      setCenter(parsePlatformHealthOperationsCenter(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const performAction = useCallback(
    async (payload: Record<string, string>) => {
      setBusy(true);
      try {
        const res = await fetch("/api/platform-health-operations-center/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) await load();
      } finally {
        setBusy(false);
      }
    },
    [load]
  );

  if (loading && !center) {
    return <p className="p-6 text-sm text-zinc-500">{labels.loading}</p>;
  }

  if (!center) {
    return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;
  }

  const summary = center.executive_summary;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">
          {center.principle}
        </p>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.executiveSummary}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard
            label={labels.executiveSummary.activeOrganizations}
            value={summary.active_organizations}
          />
          <OverviewCard
            label={labels.executiveSummary.activeSubscriptions}
            value={summary.active_subscriptions}
          />
          <OverviewCard
            label={labels.executiveSummary.platformUptime}
            value={`${summary.platform_uptime_pct}%`}
          />
          <OverviewCard
            label={labels.executiveSummary.openIncidents}
            value={summary.open_incidents}
          />
          <OverviewCard
            label={labels.executiveSummary.resolvedIncidentsMonth}
            value={summary.resolved_incidents_this_month}
          />
          <OverviewCard
            label={labels.executiveSummary.criticalAlerts}
            value={summary.critical_alerts}
          />
        </dl>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.services}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {center.services.map((service) => (
            <article
              key={service.key}
              className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4"
            >
              <h3 className="text-sm font-medium text-zinc-900">
                {labels.services[service.key] ?? service.label}
              </h3>
              <span
                className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${SERVICE_STATUS_BADGES[service.status]}`}
              >
                {labels.serviceStatuses[service.status]}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.deployment}</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-zinc-500">{labels.table.version}</dt>
            <dd className="font-medium text-zinc-900">{center.deployment.version}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">{labels.table.version} (prev)</dt>
            <dd className="font-medium text-zinc-900">
              {center.deployment.previous_version ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">{labels.table.timestamp}</dt>
            <dd className="font-medium text-zinc-900">
              {formatDate(center.deployment.deployed_at)}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">{labels.table.initiator}</dt>
            <dd className="font-medium text-zinc-900">{center.deployment.initiator || "—"}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">{labels.table.status}</dt>
            <dd className="font-medium text-zinc-900">
              {labels.deploymentStatuses[center.deployment.status]}
            </dd>
          </div>
        </dl>
      </section>

      {center.can_manage && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.sections.createIncident}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="text-zinc-600">{labels.form.incidentTitle}</span>
              <input
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span className="text-zinc-600">{labels.form.serviceKey}</span>
              <select
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2"
                value={draftServiceKey}
                onChange={(e) => setDraftServiceKey(e.target.value)}
              >
                {SERVICE_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {labels.services[key]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm md:col-span-2">
              <span className="text-zinc-600">{labels.form.incidentSummary}</span>
              <textarea
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2"
                rows={3}
                value={draftSummary}
                onChange={(e) => setDraftSummary(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span className="text-zinc-600">{labels.form.severity}</span>
              <select
                className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2"
                value={draftSeverity}
                onChange={(e) => setDraftSeverity(e.target.value)}
              >
                {INCIDENT_SEVERITIES.map((key) => (
                  <option key={key} value={key}>
                    {labels.severities[key]}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <button
                type="button"
                disabled={busy || !draftTitle.trim()}
                onClick={() =>
                  void performAction({
                    action: "create_incident",
                    title: draftTitle.trim(),
                    summary: draftSummary.trim(),
                    service_key: draftServiceKey,
                    severity: draftSeverity,
                  }).then(() => {
                    setDraftTitle("");
                    setDraftSummary("");
                  })
                }
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {busy ? labels.form.saving : labels.form.create}
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.incidents}</h2>
        {center.incidents.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">{labels.emptyState}</p>
        ) : (
          <div className="mt-4 space-y-4">
            {center.incidents.map((incident) => (
              <article key={incident.id} className="rounded-xl border border-zinc-100 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-zinc-900">{incident.title}</h3>
                    <p className="mt-1 text-sm text-zinc-600">{incident.summary}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${SEVERITY_BADGES[incident.severity]}`}
                    >
                      {labels.severities[incident.severity]}
                    </span>
                    <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200">
                      {labels.incidentStatuses[incident.status]}
                    </span>
                  </div>
                </div>
                {center.can_manage && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {INCIDENT_STATUSES.filter((s) => s !== incident.status).map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          void performAction({
                            action: "update_incident_status",
                            incident_id: incident.id,
                            status,
                          })
                        }
                        className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                      >
                        {labels.incidentStatuses[status]}
                      </button>
                    ))}
                  </div>
                )}
                {center.can_manage && (
                  <div className="mt-4 flex gap-2">
                    <input
                      className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                      placeholder={labels.form.note}
                      value={noteDrafts[incident.id] ?? ""}
                      onChange={(e) =>
                        setNoteDrafts((prev) => ({ ...prev, [incident.id]: e.target.value }))
                      }
                    />
                    <button
                      type="button"
                      disabled={busy || !(noteDrafts[incident.id] ?? "").trim()}
                      onClick={() =>
                        void performAction({
                          action: "add_incident_note",
                          incident_id: incident.id,
                          note: (noteDrafts[incident.id] ?? "").trim(),
                        }).then(() =>
                          setNoteDrafts((prev) => ({ ...prev, [incident.id]: "" }))
                        )
                      }
                      className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
                    >
                      {labels.form.addNote}
                    </button>
                  </div>
                )}
                {incident.notes.length > 0 && (
                  <ul className="mt-4 space-y-2 border-t border-zinc-100 pt-4 text-sm text-zinc-600">
                    {incident.notes.map((note) => (
                      <li key={note.id}>
                        <span className="text-zinc-400">{formatDate(note.created_at)} — </span>
                        {note.note}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.alerts}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="pb-3 pr-4">{labels.table.title}</th>
                <th className="pb-3 pr-4">{labels.table.category}</th>
                <th className="pb-3 pr-4">{labels.table.severity}</th>
                <th className="pb-3 pr-4">{labels.table.status}</th>
                <th className="pb-3 pr-4">{labels.table.timestamp}</th>
                {center.can_manage && <th className="pb-3">{labels.table.action}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {center.alerts.map((alert) => (
                <tr key={alert.id}>
                  <td className="py-3 pr-4 font-medium text-zinc-900">{alert.title}</td>
                  <td className="py-3 pr-4 text-zinc-600">
                    {labels.alertCategories[alert.category]}
                  </td>
                  <td className="py-3 pr-4">{labels.severities[alert.severity]}</td>
                  <td className="py-3 pr-4">
                    {labels.alertResolutionStatuses[alert.resolution_status]}
                  </td>
                  <td className="py-3 pr-4 text-zinc-500">{formatDate(alert.created_at)}</td>
                  {center.can_manage && (
                    <td className="py-3">
                      {alert.resolution_status !== "resolved" && (
                        <div className="flex gap-2">
                          {alert.resolution_status === "open" && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                void performAction({
                                  action: "resolve_alert",
                                  alert_id: alert.id,
                                  resolution_status: "acknowledged",
                                })
                              }
                              className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                            >
                              {labels.form.acknowledgeAlert}
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              void performAction({
                                action: "resolve_alert",
                                alert_id: alert.id,
                                resolution_status: "resolved",
                              })
                            }
                            className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
                          >
                            {labels.form.resolveAlert}
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.deploymentHistory}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="pb-3 pr-4">{labels.table.version}</th>
                <th className="pb-3 pr-4">{labels.table.initiator}</th>
                <th className="pb-3 pr-4">{labels.table.status}</th>
                <th className="pb-3">{labels.table.timestamp}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {center.deployment_history.map((row) => (
                <tr key={row.id ?? row.version + row.deployed_at}>
                  <td className="py-3 pr-4 font-medium text-zinc-900">{row.version}</td>
                  <td className="py-3 pr-4 text-zinc-600">{row.initiator}</td>
                  <td className="py-3 pr-4">{labels.deploymentStatuses[row.status]}</td>
                  <td className="py-3 text-zinc-500">{formatDate(row.deployed_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="pb-3 pr-4">{labels.table.action}</th>
                <th className="pb-3 pr-4">{labels.table.timestamp}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {center.audit_logs.map((entry) => (
                <tr key={entry.id}>
                  <td className="py-3 pr-4 font-medium text-zinc-900">{entry.action}</td>
                  <td className="py-3 text-zinc-500">{formatDate(entry.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
