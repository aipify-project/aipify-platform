"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { parseCreateAipifyHostsPropertyResult } from "@/lib/aipify/aipify-hosts";
import {
  parseAipifyHostsPropertyCenterActionResult,
  parseAipifyHostsPropertyCenterDashboard,
  type HostsPropertyCenterDashboard,
  type HostsPropertyCenterSectionKey,
} from "@/lib/aipify/aipify-hosts-property-center";

type Props = {
  labels: Record<string, string>;
};

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    inactive: "bg-gray-100 text-gray-700 ring-gray-200",
    under_maintenance: "bg-amber-50 text-amber-900 ring-amber-200",
    seasonal_closure: "bg-sky-50 text-sky-800 ring-sky-200",
    occupied: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    vacant: "bg-gray-100 text-gray-600 ring-gray-200",
    low: "bg-gray-100 text-gray-700 ring-gray-200",
    moderate: "bg-amber-50 text-amber-900 ring-amber-200",
    high: "bg-orange-50 text-orange-900 ring-orange-200",
    critical: "bg-red-50 text-red-900 ring-red-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function EmptyBoard({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-8 text-center">
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}

export function AipifyHostsPropertyCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsPropertyCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [activeSection, setActiveSection] = useState<HostsPropertyCenterSectionKey>("overview");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newPropertyName, setNewPropertyName] = useState("");
  const [editDetails, setEditDetails] = useState(false);
  const [formDetails, setFormDetails] = useState<Record<string, string | number>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ section: activeSection });
    if (selectedPropertyId) params.set("property_id", selectedPropertyId);
    const res = await fetch(`/api/aipify/aipify-hosts/property-center/dashboard?${params.toString()}`);
    if (res.ok) {
      const parsed = parseAipifyHostsPropertyCenterDashboard(await res.json());
      setDashboard(parsed);
      if (parsed?.details && !editDetails) {
        setFormDetails({
          display_name: parsed.overview?.property_name ?? "",
          description: parsed.details.description ?? "",
          address: parsed.details.address ?? "",
          max_guests: parsed.details.max_guests,
          bedrooms: parsed.details.bedrooms,
          bathrooms: parsed.details.bathrooms,
          check_in_time: parsed.details.check_in_time,
          check_out_time: parsed.details.check_out_time,
          property_type: parsed.details.property_type,
          operational_status: parsed.details.operational_status,
        });
      }
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection, selectedPropertyId]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/property-center/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsPropertyCenterActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(labels.actionRecorded);
      setEditDetails(false);
      if (body.action === "archive") setSelectedPropertyId("");
      await load();
    } else {
      setActionMessage(labels.actionFailed);
    }
  };

  const handleCreateProperty = async () => {
    if (!newPropertyName.trim()) return;
    setBusy(true);
    const res = await fetch("/api/aipify/aipify-hosts/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name: newPropertyName.trim() }),
    });
    const result = parseCreateAipifyHostsPropertyResult(await res.json());
    setBusy(false);
    if (result.success && result.property?.id) {
      setNewPropertyName("");
      setShowCreate(false);
      setSelectedPropertyId(result.property.id);
      setActionMessage(labels.propertyCreated);
      await load();
    } else if (result.upgrade_required) {
      setActionMessage(labels.upgradeRequired);
    } else {
      setActionMessage(labels.createFailed);
    }
  };

  const labelFor = (key: string, fallback: string) => labels[`type_${key}`] ?? labels[`status_${key}`] ?? labels[`role_${key}`] ?? labels[`amenity_${key}`] ?? fallback.replace(/_/g, " ");

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

  const licensing = dashboard.licensing as { can_add_property?: boolean; upgrade_required?: boolean; property_limit?: number; active_property_count?: number };
  const canAdd = licensing.can_add_property !== false && !licensing.upgrade_required;
  const overview = dashboard.overview;
  const details = dashboard.details;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
        <p className="text-sm font-medium text-slate-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-slate-800">{labels.governanceNote}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/app/aipify-hosts" className="inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50">
            {labels.backToHosts}
          </Link>
          <Link href="/app/aipify-hosts/knowledge" className="inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50">
            {labels.exploreGuidance}
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">{labels.selectProperty}</span>
          <select
            value={selectedPropertyId}
            onChange={(e) => {
              setSelectedPropertyId(e.target.value);
              setActiveSection("overview");
            }}
            className="min-w-[220px] rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="">{labels.allPropertiesList}</option>
            {dashboard.properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.display_name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap gap-2">
          {canAdd ? (
            <button
              type="button"
              onClick={() => setShowCreate((v) => !v)}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
            >
              {labels.addProperty}
            </button>
          ) : (
            <Link href="/app/settings/billing" className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100">
              {labels.upgradeNow}
            </Link>
          )}
        </div>
      </section>

      {showCreate && canAdd && (
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900">{labels.addPropertyTitle}</h3>
          <p className="mt-1 text-sm text-gray-600">{labels.addPropertyDescription}</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={newPropertyName}
              onChange={(e) => setNewPropertyName(e.target.value)}
              placeholder={labels.propertyNamePlaceholder}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <button type="button" disabled={busy} onClick={() => void handleCreateProperty()} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
              {busy ? labels.saving : labels.saveProperty}
            </button>
          </div>
        </section>
      )}

      {!canAdd && licensing.upgrade_required && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {labels.upgradeWorkflow}
        </div>
      )}

      {!selectedPropertyId && (
        <section>
          {dashboard.properties.length === 0 ? (
            <EmptyBoard title={labels.emptyPropertiesTitle} message={labels.emptyPropertiesMessage} />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {dashboard.properties.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedPropertyId(p.id)}
                    className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm hover:border-slate-400"
                  >
                    <p className="font-semibold text-gray-900">{p.display_name}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {labels.healthScore}: {p.health_score}% · {p.status}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {selectedPropertyId && overview && (
        <>
          <section className="flex flex-wrap gap-2">
            {dashboard.routes && (
              <>
                <Link href={dashboard.routes.reports} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  {labels.viewReports}
                </Link>
                <Link href={dashboard.routes.operations} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  {labels.viewOperations}
                </Link>
                <button type="button" disabled={busy} onClick={() => setEditDetails(true)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60">
                  {labels.editProperty}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void runAction({ action: "archive", property_id: selectedPropertyId })}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-50 disabled:opacity-60"
                >
                  {labels.archiveProperty}
                </button>
              </>
            )}
          </section>

          <nav className="flex gap-1 overflow-x-auto border-b border-gray-200 pb-px">
            {dashboard.sections.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setActiveSection(s.key as HostsPropertyCenterSectionKey)}
                className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium ${
                  activeSection === s.key ? "border border-b-0 border-gray-200 bg-white text-slate-900" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>

          {activeSection === "overview" && (
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label={labels.propertyName} value={overview.property_name} />
              <MetricCard label={labels.propertyType} value={labelFor(overview.property_type, overview.property_type)} />
              <MetricCard label={labels.address} value={overview.address ?? "—"} />
              <MetricCard label={labels.status} value={labelFor(overview.status, overview.status)} />
              <MetricCard label={labels.occupancyStatus} value={labelFor(overview.occupancy_status, overview.occupancy_status)} />
              <MetricCard label={labels.healthScore} value={`${overview.property_health_score}%`} />
              <MetricCard label={labels.assignedTeam} value={overview.assigned_team.length} />
            </dl>
          )}

          {activeSection === "details" && details && (
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              {editDetails ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {(["display_name", "address", "description", "check_in_time", "check_out_time"] as const).map((field) => (
                    <label key={field} className="flex flex-col gap-1 text-sm sm:col-span-2">
                      <span className="font-medium text-gray-700">{labels[field] ?? field}</span>
                      <input
                        value={String(formDetails[field] ?? "")}
                        onChange={(e) => setFormDetails((f) => ({ ...f, [field]: e.target.value }))}
                        className="rounded-lg border border-gray-300 px-3 py-2"
                      />
                    </label>
                  ))}
                  {(["max_guests", "bedrooms", "bathrooms"] as const).map((field) => (
                    <label key={field} className="flex flex-col gap-1 text-sm">
                      <span className="font-medium text-gray-700">{labels[field] ?? field}</span>
                      <input
                        type="number"
                        value={Number(formDetails[field] ?? 0)}
                        onChange={(e) => setFormDetails((f) => ({ ...f, [field]: Number(e.target.value) }))}
                        className="rounded-lg border border-gray-300 px-3 py-2"
                      />
                    </label>
                  ))}
                  <div className="flex gap-2 sm:col-span-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void runAction({
                          action: "update_profile",
                          property_id: selectedPropertyId,
                          payload: formDetails,
                        })
                      }
                      className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                    >
                      {labels.saveChanges}
                    </button>
                    <button type="button" onClick={() => setEditDetails(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">
                      {labels.cancel}
                    </button>
                  </div>
                </div>
              ) : (
                <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div><dt className="text-gray-500">{labels.description}</dt><dd className="font-medium text-gray-900">{details.description}</dd></div>
                  <div><dt className="text-gray-500">{labels.max_guests}</dt><dd className="font-medium text-gray-900">{details.max_guests}</dd></div>
                  <div><dt className="text-gray-500">{labels.bedrooms}</dt><dd className="font-medium text-gray-900">{details.bedrooms}</dd></div>
                  <div><dt className="text-gray-500">{labels.bathrooms}</dt><dd className="font-medium text-gray-900">{details.bathrooms}</dd></div>
                  <div><dt className="text-gray-500">{labels.check_in_time}</dt><dd className="font-medium text-gray-900">{details.check_in_time}</dd></div>
                  <div><dt className="text-gray-500">{labels.check_out_time}</dt><dd className="font-medium text-gray-900">{details.check_out_time}</dd></div>
                </dl>
              )}
            </section>
          )}

          {activeSection === "amenities" && (
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {(dashboard.amenities ?? []).map((a) => (
                <li key={a} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800">
                  {labelFor(a, a)}
                </li>
              ))}
            </ul>
          )}

          {activeSection === "team" && (
            <div className="space-y-3">
              {(dashboard.team ?? []).map((member) => (
                <article key={member.role_key} className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">{labelFor(member.role_key, member.role_key)}</p>
                  <p className="mt-1 font-semibold text-gray-900">{member.assignee_name}</p>
                  {member.assignee_contact && <p className="text-sm text-gray-600">{member.assignee_contact}</p>}
                </article>
              ))}
            </div>
          )}

          {activeSection === "documents" && (
            <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
              {(dashboard.documents ?? []).map((doc) => (
                <li key={doc.id} className="px-4 py-3">
                  <p className="font-medium text-gray-900">{doc.title}</p>
                  <p className="text-sm text-gray-600">{doc.reference_label}</p>
                </li>
              ))}
            </ul>
          )}

          {activeSection === "tasks" && dashboard.tasks && (
            <div className="grid gap-4 lg:grid-cols-3">
              {(["open", "upcoming", "completed"] as const).map((bucket) => (
                <article key={bucket} className="rounded-xl border border-gray-200 bg-white p-4">
                  <h3 className="font-semibold text-gray-900">{labels[`tasks_${bucket}`]}</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {dashboard.tasks![bucket].map((t) => (
                      <li key={t.id} className="rounded-lg bg-gray-50 px-3 py-2">
                        <p className="font-medium text-gray-900">{t.title}</p>
                        <p className="text-gray-600">{labelFor(t.category, t.category)} · {t.due ?? t.completed_at}</p>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}

          {activeSection === "incidents" && dashboard.incidents && (
            <div className="grid gap-4 lg:grid-cols-2">
              <article className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="font-semibold text-gray-900">{labels.openIncidents}</h3>
                <ul className="mt-3 space-y-2">
                  {dashboard.incidents.open.map((inc) => (
                    <li key={inc.id} className="rounded-lg bg-amber-50/60 px-3 py-2 text-sm">
                      <p className="font-medium text-gray-900">{inc.summary}</p>
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ring-1 ${statusBadge(inc.severity)}`}>{labelFor(inc.severity, inc.severity)}</span>
                      <p className="mt-1 text-gray-600">{inc.owner}</p>
                    </li>
                  ))}
                </ul>
              </article>
              <article className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="font-semibold text-gray-900">{labels.resolvedIncidents}</h3>
                <ul className="mt-3 space-y-2">
                  {dashboard.incidents.resolved.map((inc) => (
                    <li key={inc.id} className="rounded-lg bg-gray-50 px-3 py-2 text-sm">
                      <p className="font-medium text-gray-900">{inc.summary}</p>
                      <p className="text-gray-600">{inc.resolved_at}</p>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          )}

          {activeSection === "timeline" && (
            <ol className="relative space-y-4 border-l border-gray-200 pl-6">
              {(dashboard.timeline ?? []).map((ev, i) => (
                <li key={`${ev.type}-${i}`} className="text-sm">
                  <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-slate-400" />
                  <p className="font-medium text-gray-900">{ev.label}</p>
                  <p className="text-gray-600">{ev.when} · {labelFor(ev.type, ev.type)}</p>
                </li>
              ))}
            </ol>
          )}
        </>
      )}

      {actionMessage && (
        <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">{actionMessage}</p>
      )}
    </div>
  );
}
