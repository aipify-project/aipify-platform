"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsIncidentCenterActionResult,
  parseAipifyHostsIncidentCenterDashboard,
  type HostsEmergencyEventRow,
  type HostsIncidentCenterDashboard,
  type HostsIncidentCenterSectionKey,
  type HostsIncidentPlaybook,
  type HostsIncidentRow,
  type HostsRecoveryActionRow,
} from "@/lib/aipify/aipify-hosts-incident-center";

type Props = { labels: Record<string, string> };

function severityBadge(severity: string): string {
  const map: Record<string, string> = {
    low: "bg-gray-100 text-gray-700 ring-gray-200",
    medium: "bg-sky-50 text-sky-800 ring-sky-200",
    high: "bg-amber-50 text-amber-900 ring-amber-200",
    critical: "bg-red-50 text-red-800 ring-red-200",
  };
  return map[severity] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    open: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    investigating: "bg-sky-50 text-sky-800 ring-sky-200",
    action_required: "bg-amber-50 text-amber-900 ring-amber-200",
    resolved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    closed: "bg-gray-100 text-gray-700 ring-gray-200",
    responding: "bg-red-50 text-red-800 ring-red-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function EmptyBoard({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-8 text-center">
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function IncidentTable({
  rows,
  labels,
  busy,
  showActions,
  onAssign,
  onEscalate,
  onResolve,
  onRecovery,
}: {
  rows: HostsIncidentRow[];
  labels: Record<string, string>;
  busy: boolean;
  showActions?: boolean;
  onAssign: (id: string, owner: string) => void;
  onEscalate: (id: string) => void;
  onResolve: (id: string) => void;
  onRecovery: (id: string, actionType: string) => void;
}) {
  const [ownerDraft, setOwnerDraft] = useState<Record<string, string>>({});

  if (rows.length === 0) {
    return <EmptyBoard title={labels.emptyIncidentsTitle} message={labels.emptyIncidentsMessage} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.incidentType}</th>
            <th className="px-4 py-3">{labels.severity}</th>
            <th className="px-4 py-3">{labels.description}</th>
            <th className="px-4 py-3">{labels.reportedBy}</th>
            <th className="px-4 py-3">{labels.assignedOwner}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.createdDate}</th>
            {showActions && <th className="px-4 py-3">{labels.actions}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`border-b border-gray-100 ${row.severity === "critical" ? "bg-red-50/30" : ""}`}>
              <td className="px-4 py-3 text-gray-700">{row.property}</td>
              <td className="px-4 py-3 text-gray-700">{labelFor(labels, "cat", row.incident_type)}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${severityBadge(row.severity)}`}>
                  {labelFor(labels, "severity", row.severity)}
                </span>
              </td>
              <td className="px-4 py-3 max-w-xs text-gray-900">{row.description}</td>
              <td className="px-4 py-3 text-gray-700">{row.reported_by}</td>
              <td className="px-4 py-3 text-gray-700">{row.assigned_owner}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.status)}`}>
                  {labelFor(labels, "status", row.status)}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">{row.created_at}</td>
              {showActions && (
                <td className="px-4 py-3 space-y-2 min-w-[180px]">
                  <div className="flex gap-1">
                    <input
                      type="text"
                      placeholder={labels.ownerPlaceholder}
                      value={ownerDraft[row.id] ?? ""}
                      onChange={(e) => setOwnerDraft({ ...ownerDraft, [row.id]: e.target.value })}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
                    />
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => onAssign(row.id, ownerDraft[row.id] ?? labels.defaultOwner)}
                      className="shrink-0 text-xs font-medium text-indigo-700 hover:text-indigo-900 disabled:opacity-60"
                    >
                      {labels.assign}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={busy} onClick={() => onEscalate(row.id)} className="text-xs font-medium text-amber-800 hover:text-amber-950 disabled:opacity-60">
                      {labels.escalate}
                    </button>
                    <button type="button" disabled={busy} onClick={() => onRecovery(row.id, "create_task")} className="text-xs font-medium text-teal-700 hover:text-teal-900 disabled:opacity-60">
                      {labels.createTask}
                    </button>
                    <button type="button" disabled={busy} onClick={() => onRecovery(row.id, "schedule_inspection")} className="text-xs font-medium text-sky-700 hover:text-sky-900 disabled:opacity-60">
                      {labels.scheduleInspection}
                    </button>
                    <button type="button" disabled={busy} onClick={() => onResolve(row.id)} className="text-xs font-medium text-emerald-700 hover:text-emerald-900 disabled:opacity-60">
                      {labels.resolve}
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmergencyTable({ rows, labels }: { rows: HostsEmergencyEventRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) {
    return <EmptyBoard title={labels.emptyEmergenciesTitle} message={labels.emptyEmergenciesMessage} />;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-red-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-red-100 bg-red-50 text-xs uppercase tracking-wide text-red-800">
          <tr>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.emergencyType}</th>
            <th className="px-4 py-3">{labels.description}</th>
            <th className="px-4 py-3">{labels.reportedBy}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.createdDate}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-red-50">
              <td className="px-4 py-3 text-gray-700">{row.property}</td>
              <td className="px-4 py-3 font-medium text-red-900">{labelFor(labels, "emergency", row.event_type)}</td>
              <td className="px-4 py-3 text-gray-900">{row.description}</td>
              <td className="px-4 py-3 text-gray-700">{row.reported_by}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.status)}`}>
                  {labelFor(labels, "emergencystatus", row.status)}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">{row.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecoveryTable({ rows, labels }: { rows: HostsRecoveryActionRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) {
    return <EmptyBoard title={labels.emptyRecoveryTitle} message={labels.emptyRecoveryMessage} />;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.recoveryAction}</th>
            <th className="px-4 py-3">{labels.summary}</th>
            <th className="px-4 py-3">{labels.createdDate}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 text-gray-700">{labelFor(labels, "recovery", row.action_type)}</td>
              <td className="px-4 py-3 text-gray-900">{row.summary}</td>
              <td className="px-4 py-3 text-gray-700">{row.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlaybookGrid({
  playbooks,
  labels,
  busy,
  incidentId,
  onInitiate,
}: {
  playbooks: HostsIncidentPlaybook[];
  labels: Record<string, string>;
  busy: boolean;
  incidentId: string;
  onInitiate: (playbookKey: string) => void;
}) {
  if (playbooks.length === 0) {
    return <EmptyBoard title={labels.emptyPlaybooksTitle} message={labels.emptyPlaybooksMessage} />;
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {playbooks.map((pb) => (
        <div key={pb.key} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">{pb.label}</h3>
          <ol className="mt-3 list-decimal space-y-1 pl-4 text-sm text-gray-600">
            {pb.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          {incidentId && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onInitiate(pb.key)}
              className="mt-4 inline-flex rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-900 hover:bg-indigo-100 disabled:opacity-60"
            >
              {labels.initiatePlaybook}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export function AipifyHostsIncidentCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsIncidentCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsIncidentCenterSectionKey>("active_incidents");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [newDescription, setNewDescription] = useState("");
  const [newIncidentType, setNewIncidentType] = useState("guest_complaint");
  const [newSeverity, setNewSeverity] = useState("medium");
  const [newPropertyId, setNewPropertyId] = useState("");
  const [emergencyDescription, setEmergencyDescription] = useState("");
  const [emergencyType, setEmergencyType] = useState("major_utility_failure");
  const [playbookIncidentId, setPlaybookIncidentId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ section: activeSection });
    const res = await fetch(`/api/aipify/aipify-hosts/incident-center/dashboard?${params.toString()}`);
    if (res.ok) {
      const parsed = parseAipifyHostsIncidentCenterDashboard(await res.json());
      setDashboard(parsed);
      if (parsed?.active_incidents[0]) {
        setPlaybookIncidentId((prev) => prev || parsed.active_incidents[0].id);
      }
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/incident-center/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsIncidentCenterActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(labels.actionRecorded);
      setNewDescription("");
      setEmergencyDescription("");
      await load();
    } else {
      setActionMessage(labels.actionFailed);
    }
  };

  if (loading && !dashboard) return <AipifyLoader label={labels.loading} centered fullPage />;

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-rose-100 bg-rose-50/40 p-6">
        <p className="text-sm font-medium text-rose-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-rose-900">{labels.governanceNote}</p>
        <Link
          href="/app/aipify-hosts"
          className="mt-4 inline-flex rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-900 hover:bg-rose-50"
        >
          {labels.backToHosts}
        </Link>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={labels.activeIncidents} value={dashboard.stats.active_incidents} />
        <MetricCard label={labels.criticalIncidents} value={dashboard.stats.critical_incidents} />
        <MetricCard label={labels.openEmergencies} value={dashboard.stats.open_emergencies} />
        <MetricCard label={labels.recoveryActions} value={dashboard.stats.recovery_actions_count} />
      </dl>

      <section className="flex flex-wrap gap-2">
        {dashboard.sections.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => setActiveSection(section.key as HostsIncidentCenterSectionKey)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeSection === section.key
                ? "bg-rose-700 text-white"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {labelFor(labels, "section", section.key)}
          </button>
        ))}
      </section>

      {actionMessage && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">{actionMessage}</p>
      )}

      {(activeSection === "active_incidents" || activeSection === "emergency_events") && (
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-900">{labels.reportIncident}</h3>
            <select value={newIncidentType} onChange={(e) => setNewIncidentType(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              {dashboard.incident_categories.map((c) => (
                <option key={c} value={c}>{labelFor(labels, "cat", c)}</option>
              ))}
            </select>
            <select value={newSeverity} onChange={(e) => setNewSeverity(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              {dashboard.severity_levels.map((s) => (
                <option key={s} value={s}>{labelFor(labels, "severity", s)}</option>
              ))}
            </select>
            <select value={newPropertyId} onChange={(e) => setNewPropertyId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">{labels.allProperties}</option>
              {dashboard.properties.map((p) => (
                <option key={p.id} value={p.id}>{p.display_name}</option>
              ))}
            </select>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder={labels.descriptionPlaceholder}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              disabled={busy || !newDescription.trim()}
              onClick={() =>
                void runAction({
                  action: "create_incident",
                  incident_type: newIncidentType,
                  severity: newSeverity,
                  description: newDescription,
                  property_id: newPropertyId || undefined,
                })
              }
              className="inline-flex rounded-lg bg-rose-700 px-4 py-2 text-sm font-medium text-white hover:bg-rose-800 disabled:opacity-60"
            >
              {labels.reportIncident}
            </button>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50/30 p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-red-950">{labels.reportEmergency}</h3>
            <select value={emergencyType} onChange={(e) => setEmergencyType(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              {dashboard.emergency_types.map((t) => (
                <option key={t} value={t}>{labelFor(labels, "emergency", t)}</option>
              ))}
            </select>
            <textarea
              value={emergencyDescription}
              onChange={(e) => setEmergencyDescription(e.target.value)}
              placeholder={labels.emergencyPlaceholder}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              disabled={busy || !emergencyDescription.trim()}
              onClick={() =>
                void runAction({
                  action: "report_emergency",
                  event_type: emergencyType,
                  description: emergencyDescription,
                  property_id: newPropertyId || undefined,
                })
              }
              className="inline-flex rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-60"
            >
              {labels.reportEmergency}
            </button>
          </div>
        </section>
      )}

      {activeSection === "active_incidents" && (
        <IncidentTable
          rows={dashboard.active_incidents}
          labels={labels}
          busy={busy}
          showActions
          onAssign={(id, owner) => void runAction({ action: "assign_owner", incident_id: id, owner })}
          onEscalate={(id) => void runAction({ action: "escalate", incident_id: id })}
          onResolve={(id) => void runAction({ action: "update_status", incident_id: id, status: "resolved" })}
          onRecovery={(id, actionType) => void runAction({ action: "recovery_action", incident_id: id, action_type: actionType })}
        />
      )}

      {activeSection === "emergency_events" && (
        <>
          <EmergencyTable rows={dashboard.emergency_events} labels={labels} />
          {dashboard.emergency_contacts.length > 0 && (
            <section>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">{labels.emergencyContacts}</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {dashboard.emergency_contacts.map((c) => (
                  <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{labelFor(labels, "contact", c.contact_role)}</p>
                    <p className="mt-1 font-semibold text-gray-900">{c.contact_name}</p>
                    <p className="text-sm text-gray-600">{c.contact_phone ?? "—"}</p>
                    <p className="text-sm text-gray-600">{c.contact_email ?? ""}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {activeSection === "incident_history" && (
        <IncidentTable
          rows={dashboard.incident_history}
          labels={labels}
          busy={busy}
          onAssign={() => {}}
          onEscalate={() => {}}
          onResolve={() => {}}
          onRecovery={() => {}}
        />
      )}

      {activeSection === "recovery_actions" && <RecoveryTable rows={dashboard.recovery_actions} labels={labels} />}

      {activeSection === "incident_playbooks" && (
        <>
          {dashboard.active_incidents.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-sm text-gray-700">{labels.selectIncident}</label>
              <select
                value={playbookIncidentId}
                onChange={(e) => setPlaybookIncidentId(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {dashboard.active_incidents.map((i) => (
                  <option key={i.id} value={i.id}>{i.description.slice(0, 60)}</option>
                ))}
              </select>
            </div>
          )}
          <PlaybookGrid
            playbooks={dashboard.playbooks}
            labels={labels}
            busy={busy}
            incidentId={playbookIncidentId}
            onInitiate={(key) =>
              void runAction({ action: "initiate_playbook", incident_id: playbookIncidentId, playbook_key: key })
            }
          />
        </>
      )}

      {dashboard.timeline.length > 0 && activeSection !== "incident_playbooks" && (
        <section>
          <h3 className="mb-3 text-lg font-semibold text-gray-900">{labels.timeline}</h3>
          <ol className="space-y-2 border-l-2 border-rose-200 pl-4">
            {dashboard.timeline.map((t) => (
              <li key={t.id} className="text-sm">
                <span className="font-medium text-gray-900">{labelFor(labels, "timeline", t.timeline_type)}</span>
                <span className="text-gray-500"> · {t.created_at}</span>
                <p className="text-gray-600">{t.summary}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
