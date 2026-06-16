"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsAccessCenterDashboard,
  type HostsAccessCenterDashboard,
  type HostsAccessCenterSectionKey,
  type HostsAccessEventRow,
  type HostsAccessInstructionRow,
  type HostsAccessOverviewRow,
  type HostsLockboxRow,
  type HostsSmartLockRow,
  type HostsTemporaryCodeRow,
} from "@/lib/aipify/aipify-hosts-access-center";

type Props = { labels: Record<string, string> };

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

function OverviewTable({ rows, labels }: { rows: HostsAccessOverviewRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) {
    return <EmptyBoard title={labels.emptyOverviewTitle} message={labels.emptyOverviewMessage} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.accessMethod}</th>
            <th className="px-4 py-3">{labels.accessReady}</th>
            <th className="px-4 py-3">{labels.upcomingArrivals}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.property_id} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{row.property}</td>
              <td className="px-4 py-3 text-gray-700">{labelFor(labels, "method", row.access_method)}</td>
              <td className="px-4 py-3">
                <span className={row.access_ready ? "text-emerald-700" : "text-amber-700"}>
                  {row.access_ready ? labels.ready : labels.notReady}
                </span>
                {row.missing_instructions && (
                  <p className="mt-1 text-xs text-amber-700">{labels.missingInstructionsFlag}</p>
                )}
              </td>
              <td className="px-4 py-3 text-gray-700">{row.upcoming_arrivals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SmartLocksTable({ rows, labels }: { rows: HostsSmartLockRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) {
    return (
      <div className="space-y-3">
        <EmptyBoard title={labels.emptyLocksTitle} message={labels.emptyLocksMessage} />
        <p className="text-xs text-gray-500">{labels.locksFutureNote}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.deviceLabel}</th>
            <th className="px-4 py-3">{labels.provider}</th>
            <th className="px-4 py-3">{labels.integrationStatus}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 text-gray-900">{row.property}</td>
              <td className="px-4 py-3 text-gray-700">{row.device_label}</td>
              <td className="px-4 py-3 text-gray-700">{labelFor(labels, "provider", row.provider)}</td>
              <td className="px-4 py-3 text-gray-700">{labelFor(labels, "integration", row.integration_status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LockboxesTable({ rows, labels }: { rows: HostsLockboxRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) {
    return <EmptyBoard title={labels.emptyLockboxesTitle} message={labels.emptyLockboxesMessage} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900">{row.property}</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-gray-500">{labels.lockboxLocation}</dt>
              <dd className="text-gray-800">{row.lockbox_location}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{labels.verificationStatus}</dt>
              <dd className="text-gray-800">{labelFor(labels, "verification", row.verification_status)}</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
}

function InstructionsGrid({ rows, labels }: { rows: HostsAccessInstructionRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) {
    return <EmptyBoard title={labels.emptyInstructionsTitle} message={labels.emptyInstructionsMessage} />;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {rows.map((row) => (
        <div key={row.property_id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900">{row.property}</h3>
            {!row.complete && <span className="text-xs font-medium text-amber-700">{labels.incompleteInstructions}</span>}
          </div>
          <dl className="mt-3 space-y-2 text-sm">
            <div><dt className="text-gray-500">{labels.checkInGuidance}</dt><dd className="text-gray-800">{row.check_in_guidance ?? "—"}</dd></div>
            <div><dt className="text-gray-500">{labels.parkingGuidance}</dt><dd className="text-gray-800">{row.parking_guidance ?? "—"}</dd></div>
            <div><dt className="text-gray-500">{labels.buildingEntry}</dt><dd className="text-gray-800">{row.building_entry_instructions ?? "—"}</dd></div>
            <div><dt className="text-gray-500">{labels.wifiInformation}</dt><dd className="text-gray-800">{row.wifi_information ?? "—"}</dd></div>
          </dl>
        </div>
      ))}
    </div>
  );
}

function CodesTable({ rows, labels }: { rows: HostsTemporaryCodeRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) {
    return (
      <div className="space-y-3">
        <EmptyBoard title={labels.emptyCodesTitle} message={labels.emptyCodesMessage} />
        <p className="text-xs text-gray-500">{labels.codesManualNote}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.guestName}</th>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.codeMasked}</th>
            <th className="px-4 py-3">{labels.validUntil}</th>
            <th className="px-4 py-3">{labels.codeStatus}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{row.guest_name}</td>
              <td className="px-4 py-3 text-gray-700">{row.property}</td>
              <td className="px-4 py-3 font-mono text-gray-700">{row.code_masked}</td>
              <td className="px-4 py-3 text-gray-700">{row.valid_until}</td>
              <td className="px-4 py-3 text-gray-700">{labelFor(labels, "codestatus", row.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EventsList({ rows, labels }: { rows: HostsAccessEventRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) {
    return <EmptyBoard title={labels.emptyEventsTitle} message={labels.emptyEventsMessage} />;
  }

  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.id} className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-gray-900">{row.property}</span>
            <span className="text-xs text-gray-500">{row.created_at}</span>
          </div>
          <p className="mt-1 text-sm text-gray-700">{row.summary ?? row.event_type.replace(/_/g, " ")}</p>
        </li>
      ))}
    </ul>
  );
}

export function AipifyHostsAccessCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsAccessCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsAccessCenterSectionKey>("access_overview");
  const [activeFilter, setActiveFilter] = useState("all_properties");

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ section: activeSection, filter: activeFilter });
    const res = await fetch(`/api/aipify/aipify-hosts/access-center/dashboard?${params}`);
    if (res.ok) {
      const parsed = parseAipifyHostsAccessCenterDashboard(await res.json());
      if (parsed?.has_customer) {
        setDashboard(parsed);
        setActiveSection(parsed.active_section as HostsAccessCenterSectionKey);
        setActiveFilter(parsed.active_filter);
      } else {
        setDashboard(null);
        setError(true);
      }
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection, activeFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !dashboard) return <AipifyLoader label={labels.loading ?? "Loading"} centered fullPage />;

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
      <section className="rounded-2xl border border-teal-100 bg-teal-50/40 p-6">
        <p className="text-sm font-medium text-teal-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-teal-900">{labels.governanceNote}</p>
        <Link
          href="/app/aipify-hosts"
          className="mt-4 inline-flex rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-900 hover:bg-teal-50"
        >
          {labels.backToHosts}
        </Link>
      </section>

      {dashboard.notifications.some((n) => n.active) && (
        <section className="space-y-2">
          {dashboard.notifications.filter((n) => n.active).map((n) => (
            <p key={n.key} className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {n.message}
            </p>
          ))}
        </section>
      )}

      <section className="flex flex-wrap gap-2">
        {dashboard.filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setActiveFilter(filter.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeFilter === filter.key ? "bg-teal-700 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </section>

      <section className="flex flex-wrap gap-2">
        {dashboard.sections.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => setActiveSection(section.key as HostsAccessCenterSectionKey)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeSection === section.key ? "bg-teal-700 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {section.label}
          </button>
        ))}
      </section>

      {activeSection === "access_overview" && <OverviewTable rows={dashboard.access_overview} labels={labels} />}
      {activeSection === "smart_locks" && <SmartLocksTable rows={dashboard.smart_locks} labels={labels} />}
      {activeSection === "lockboxes" && <LockboxesTable rows={dashboard.lockboxes} labels={labels} />}
      {activeSection === "access_instructions" && <InstructionsGrid rows={dashboard.access_instructions} labels={labels} />}
      {activeSection === "temporary_codes" && <CodesTable rows={dashboard.temporary_codes} labels={labels} />}
      {activeSection === "access_events" && <EventsList rows={dashboard.access_events} labels={labels} />}
      {activeSection === "property_access_profile" && dashboard.property_access_profile && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900">{labels.propertyAccessProfile}</h3>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
              <div><dt className="text-gray-500">{labels.property}</dt><dd className="font-medium text-gray-900">{dashboard.property_access_profile.property}</dd></div>
              <div><dt className="text-gray-500">{labels.accessMethod}</dt><dd className="text-gray-800">{labelFor(labels, "method", dashboard.property_access_profile.access_method)}</dd></div>
              <div className="sm:col-span-2"><dt className="text-gray-500">{labels.accessInstructions}</dt><dd className="text-gray-800">{dashboard.property_access_profile.access_instructions ?? "—"}</dd></div>
              <div className="sm:col-span-2"><dt className="text-gray-500">{labels.emergencyProcedure}</dt><dd className="text-gray-800">{dashboard.property_access_profile.emergency_access_procedure ?? "—"}</dd></div>
              <div><dt className="text-gray-500">{labels.backupContact}</dt><dd className="text-gray-800">{dashboard.property_access_profile.backup_contact ?? "—"}</dd></div>
              <div><dt className="text-gray-500">{labels.accessReady}</dt><dd className={dashboard.property_access_profile.access_ready ? "text-emerald-700" : "text-amber-700"}>{dashboard.property_access_profile.access_ready ? labels.ready : labels.notReady}</dd></div>
            </dl>
          </div>
          {dashboard.access_timeline.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">{labels.accessTimeline}</h3>
              <ul className="mt-4 space-y-3">
                {dashboard.access_timeline.map((event, index) => (
                  <li key={`${event.type}-${index}`} className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 text-sm last:border-0 last:pb-0">
                    <span className="font-medium text-gray-900">{labelFor(labels, "timeline", event.type)}</span>
                    <span className="text-gray-500">{event.when}</span>
                    {event.label && <span className="w-full text-gray-600">{event.label}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-500">{labels.exploreGuidance}</p>
    </div>
  );
}
