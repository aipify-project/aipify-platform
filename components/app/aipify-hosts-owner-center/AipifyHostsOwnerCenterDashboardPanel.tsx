"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsOwnerCenterActionResult,
  parseAipifyHostsOwnerCenterDashboard,
  type HostsOwnerBlockRow,
  type HostsOwnerCenterDashboard,
  type HostsOwnerCenterSectionKey,
  type HostsOwnerOverrideRow,
} from "@/lib/aipify/aipify-hosts-owner-center";

type Props = { labels: Record<string, string> };

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    scheduled: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    completed: "bg-gray-100 text-gray-600 ring-gray-200",
    cancelled: "bg-red-50 text-red-700 ring-red-200",
    personal_stay: "bg-violet-50 text-violet-800 ring-violet-200",
    family_stay: "bg-purple-50 text-purple-800 ring-purple-200",
    maintenance_block: "bg-orange-50 text-orange-900 ring-orange-200",
    inspection_block: "bg-sky-50 text-sky-800 ring-sky-200",
    operational_block: "bg-amber-50 text-amber-900 ring-amber-200",
    seasonal_closure: "bg-slate-100 text-slate-800 ring-slate-200",
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

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function BlockTable({
  rows,
  labels,
  busy,
  onAction,
  showHistory,
}: {
  rows: HostsOwnerBlockRow[];
  labels: Record<string, string>;
  busy: boolean;
  onAction: (id: string, action: string) => void;
  showHistory?: boolean;
}) {
  if (rows.length === 0) {
    return <EmptyBoard title={labels.emptyBlocksTitle} message={labels.emptyBlocksMessage} />;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.blockType}</th>
            <th className="px-4 py-3">{labels.startDate}</th>
            <th className="px-4 py-3">{labels.endDate}</th>
            <th className="px-4 py-3">{labels.nights}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.notes}</th>
            {!showHistory && <th className="px-4 py-3">{labels.actions}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{row.property}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.block_type)}`}>
                  {labelFor(labels, "blocktype", row.block_type)}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700">{row.start_date}</td>
              <td className="px-4 py-3 text-gray-700">{row.end_date}</td>
              <td className="px-4 py-3 text-gray-700">{row.night_count}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.block_status)}`}>
                  {labelFor(labels, "blockstatus", row.block_status)}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{row.notes || "—"}</td>
              {!showHistory && (
                <td className="px-4 py-3 min-w-[180px]">
                  <div className="flex flex-wrap gap-2">
                    {row.block_status === "scheduled" && (
                      <button type="button" disabled={busy} onClick={() => onAction(row.id, "activate_block")} className="text-xs font-medium text-emerald-700 disabled:opacity-60">
                        {labels.activateBlock}
                      </button>
                    )}
                    {row.block_status !== "cancelled" && row.block_status !== "completed" && (
                      <button type="button" disabled={busy} onClick={() => onAction(row.id, "cancel_block")} className="text-xs font-medium text-red-700 disabled:opacity-60">
                        {labels.cancelBlock}
                      </button>
                    )}
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

function OverrideTable({ rows, labels }: { rows: HostsOwnerOverrideRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) {
    return <EmptyBoard title={labels.emptyOverridesTitle} message={labels.emptyOverridesMessage} />;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.overrideType}</th>
            <th className="px-4 py-3">{labels.startDate}</th>
            <th className="px-4 py-3">{labels.endDate}</th>
            <th className="px-4 py-3">{labels.notes}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{row.property}</td>
              <td className="px-4 py-3 text-gray-700">{labelFor(labels, "overridetype", row.override_type)}</td>
              <td className="px-4 py-3 text-gray-700">{row.start_date}</td>
              <td className="px-4 py-3 text-gray-700">{row.end_date}</td>
              <td className="px-4 py-3 text-gray-600">{row.notes || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AipifyHostsOwnerCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsOwnerCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsOwnerCenterSectionKey>("owner_stays");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const res = await fetch(`/api/aipify/aipify-hosts/owner-center/dashboard?section=${activeSection}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsOwnerCenterDashboard(await res.json()));
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
    const res = await fetch("/api/aipify/aipify-hosts/owner-center/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsOwnerCenterActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(result.summary ?? labels.actionRecorded);
      await load();
    } else {
      setActionMessage(labels.actionFailed);
    }
  };

  const runBlockAction = (id: string, actionType: string) => {
    void runAction({ action_type: actionType, block_id: id });
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

  const isOverrideSection = activeSection === "availability_overrides";
  const isHistorySection = activeSection === "block_history";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-6">
        <p className="text-sm font-medium text-amber-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-amber-900">{labels.governanceNote}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-amber-800">
          {dashboard.calendar_integration.master_calendar && <span className="rounded bg-white/80 px-2 py-1 ring-1 ring-amber-200">{labels.calMaster}</span>}
          {dashboard.calendar_integration.property_calendars && <span className="rounded bg-white/80 px-2 py-1 ring-1 ring-amber-200">{labels.calProperty}</span>}
          {dashboard.calendar_integration.occupancy_reports && <span className="rounded bg-white/80 px-2 py-1 ring-1 ring-amber-200">{labels.calOccupancy}</span>}
          {dashboard.calendar_integration.operations_center && <span className="rounded bg-white/80 px-2 py-1 ring-1 ring-amber-200">{labels.calOperations}</span>}
        </div>
        <Link href="/app/aipify-hosts" className="mt-4 inline-flex rounded-lg border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-50">
          {labels.backToHosts}
        </Link>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={labels.upcomingPersonalStays} value={dashboard.stats.upcoming_personal_stays} />
        <MetricCard label={labels.activePropertyBlocks} value={dashboard.stats.active_property_blocks} />
        <MetricCard label={labels.seasonalClosures} value={dashboard.stats.seasonal_closures} />
        <MetricCard label={labels.availabilityImpact} value={`${dashboard.stats.availability_impact_pct}%`} />
      </dl>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900">{labels.impactOverview}</h3>
        <dl className="mt-3 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div><dt className="text-gray-500">{labels.blockedNights}</dt><dd className="text-lg font-semibold text-gray-900">{dashboard.stats.blocked_nights}</dd></div>
          <div><dt className="text-gray-500">{labels.propertiesAffected}</dt><dd className="text-lg font-semibold text-gray-900">{dashboard.stats.properties_affected}</dd></div>
          <div><dt className="text-gray-500">{labels.blockConflicts}</dt><dd className={`text-lg font-semibold ${dashboard.stats.block_conflicts > 0 ? "text-red-700" : "text-emerald-700"}`}>{dashboard.stats.block_conflicts}</dd></div>
          <div><dt className="text-gray-500">{labels.reservationsBlocked}</dt><dd className="text-lg font-semibold text-amber-700">{labels.reservationsBlockedNote}</dd></div>
        </dl>
      </section>

      <section className="flex flex-wrap gap-2">
        {dashboard.sections.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => setActiveSection(section.key as HostsOwnerCenterSectionKey)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeSection === section.key ? "bg-amber-700 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {labelFor(labels, "section", section.key)}
          </button>
        ))}
      </section>

      {actionMessage && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">{actionMessage}</p>
      )}

      {isOverrideSection ? (
        <OverrideTable rows={dashboard.availability_overrides} labels={labels} />
      ) : (
        <BlockTable
          rows={dashboard.owner_blocks}
          labels={labels}
          busy={busy}
          onAction={runBlockAction}
          showHistory={isHistorySection}
        />
      )}
    </div>
  );
}
