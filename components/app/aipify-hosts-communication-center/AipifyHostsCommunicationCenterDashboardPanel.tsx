"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsCommunicationCenterActionResult,
  parseAipifyHostsCommunicationCenterDashboard,
  type HostsCommunicationAnnouncementRow,
  type HostsCommunicationCenterDashboard,
  type HostsCommunicationHistoryRow,
  type HostsCommunicationSectionKey,
  type HostsCommunicationTemplateRow,
  type HostsGuestCommunicationRow,
  type HostsTeamCommunicationRow,
} from "@/lib/aipify/aipify-hosts-communication-center";

type Props = { labels: Record<string, string> };

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600 ring-gray-200",
    scheduled: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    sent: "bg-sky-50 text-sky-800 ring-sky-200",
    delivered: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    failed: "bg-red-50 text-red-800 ring-red-200",
    email: "bg-blue-50 text-blue-800 ring-blue-200",
    sms: "bg-violet-50 text-violet-800 ring-violet-200",
    push: "bg-orange-50 text-orange-900 ring-orange-200",
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

function MetricCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

function GuestCommTable({
  rows,
  labels,
  busy,
  onAction,
}: {
  rows: HostsGuestCommunicationRow[];
  labels: Record<string, string>;
  busy: boolean;
  onAction: (id: string, action: string) => void;
}) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyGuestTitle} message={labels.emptyGuestMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.guestName}</th>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.messageType}</th>
            <th className="px-4 py-3">{labels.channel}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.sentDate}</th>
            <th className="px-4 py-3">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`border-b border-gray-100 ${row.comm_status === "failed" ? "bg-red-50/30" : ""}`}>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{row.guest_name}</div>
                <div className="text-xs text-gray-500">{row.subject}</div>
              </td>
              <td className="px-4 py-3 text-gray-700">{row.property}</td>
              <td className="px-4 py-3">{labelFor(labels, "msgType", row.message_type)}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.delivery_channel)}`}>{row.delivery_channel}</span>
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.comm_status)}`}>{labelFor(labels, "commStatus", row.comm_status)}</span>
              </td>
              <td className="px-4 py-3 text-gray-600">{row.sent_at ? row.sent_at.slice(0, 10) : row.scheduled_at.slice(0, 10) || "—"}</td>
              <td className="px-4 py-3 min-w-[160px]">
                <div className="flex flex-wrap gap-2">
                  {row.comm_status === "scheduled" && (
                    <button type="button" disabled={busy} onClick={() => onAction(row.id, "send_message")} className="text-xs font-medium text-indigo-700 disabled:opacity-60">{labels.sendNow}</button>
                  )}
                  {row.comm_status === "sent" && (
                    <button type="button" disabled={busy} onClick={() => onAction(row.id, "mark_delivered")} className="text-xs font-medium text-emerald-700 disabled:opacity-60">{labels.markDelivered}</button>
                  )}
                  {row.comm_status === "failed" && (
                    <button type="button" disabled={busy} onClick={() => onAction(row.id, "retry_failed")} className="text-xs font-medium text-orange-700 disabled:opacity-60">{labels.retryFailed}</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TeamCommTable({ rows, labels, busy, onAction }: { rows: HostsTeamCommunicationRow[]; labels: Record<string, string>; busy: boolean; onAction: (id: string, action: string) => void }) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyTeamTitle} message={labels.emptyTeamMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.recipient}</th>
            <th className="px-4 py-3">{labels.subject}</th>
            <th className="px-4 py-3">{labels.category}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.sentDate}</th>
            <th className="px-4 py-3">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{row.recipient}</td>
              <td className="px-4 py-3 text-gray-700">{row.subject}</td>
              <td className="px-4 py-3">{labelFor(labels, "msgType", row.category)}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.comm_status)}`}>{labelFor(labels, "commStatus", row.comm_status)}</span>
              </td>
              <td className="px-4 py-3 text-gray-600">{row.sent_at ? row.sent_at.slice(0, 10) : "—"}</td>
              <td className="px-4 py-3">
                {row.comm_status === "scheduled" && (
                  <button type="button" disabled={busy} onClick={() => onAction(row.id, "send_message")} className="text-xs font-medium text-indigo-700 disabled:opacity-60">{labels.sendNow}</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TemplatesGrid({ rows, labels, busy, onUse }: { rows: HostsCommunicationTemplateRow[]; labels: Record<string, string>; busy: boolean; onUse: (id: string) => void }) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyTemplatesTitle} message={labels.emptyTemplatesMessage} />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {rows.map((tpl) => (
        <div key={tpl.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-gray-900">{tpl.template_name}</h4>
              <p className="text-xs text-gray-500">{labelFor(labels, "tplType", tpl.template_type)}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(tpl.delivery_channel)}`}>{tpl.delivery_channel}</span>
          </div>
          <p className="mt-2 text-sm font-medium text-gray-800">{tpl.subject_line}</p>
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{tpl.body_template}</p>
          <button type="button" disabled={busy} onClick={() => onUse(tpl.id)} className="mt-3 text-xs font-medium text-indigo-700 disabled:opacity-60">{labels.useTemplate}</button>
        </div>
      ))}
    </div>
  );
}

function AnnouncementsTable({ rows, labels, busy, onPublish }: { rows: HostsCommunicationAnnouncementRow[]; labels: Record<string, string>; busy: boolean; onPublish: (id: string) => void }) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyAnnouncementsTitle} message={labels.emptyAnnouncementsMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.title}</th>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.announcementType}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`border-b border-gray-100 ${row.is_critical ? "bg-amber-50/40" : ""}`}>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{row.title}</div>
                <div className="text-xs text-gray-500 line-clamp-1">{row.body}</div>
              </td>
              <td className="px-4 py-3 text-gray-700">{row.property}</td>
              <td className="px-4 py-3">{labelFor(labels, "annType", row.announcement_type)}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.comm_status)}`}>{labelFor(labels, "commStatus", row.comm_status)}</span>
                {row.is_critical && <span className="ml-1 text-xs font-medium text-red-700">{labels.critical}</span>}
              </td>
              <td className="px-4 py-3">
                {row.comm_status !== "sent" && (
                  <button type="button" disabled={busy} onClick={() => onPublish(row.id)} className="text-xs font-medium text-indigo-700 disabled:opacity-60">{labels.publish}</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HistoryTable({ rows, labels }: { rows: HostsCommunicationHistoryRow[]; labels: Record<string, string> }) {
  if (rows.length === 0) return <EmptyBoard title={labels.emptyHistoryTitle} message={labels.emptyHistoryMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.sender}</th>
            <th className="px-4 py-3">{labels.recipient}</th>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.messageType}</th>
            <th className="px-4 py-3">{labels.channel}</th>
            <th className="px-4 py-3">{labels.status}</th>
            <th className="px-4 py-3">{labels.sentDate}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={`${row.id ?? i}-${row.sent_at}`} className="border-b border-gray-100">
              <td className="px-4 py-3 text-gray-700">{row.sender}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{row.recipient}</td>
              <td className="px-4 py-3 text-gray-600">{row.property}</td>
              <td className="px-4 py-3">{labelFor(labels, "msgType", row.message_type)}</td>
              <td className="px-4 py-3">{row.delivery_channel}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.comm_status)}`}>{labelFor(labels, "commStatus", row.comm_status)}</span>
              </td>
              <td className="px-4 py-3 text-gray-500">{row.sent_at ? row.sent_at.slice(0, 10) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AipifyHostsCommunicationCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsCommunicationCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsCommunicationSectionKey>("guest_communications");
  const [statusFilter, setStatusFilter] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ section: activeSection });
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/aipify/aipify-hosts/communication-center/dashboard?${params}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsCommunicationCenterDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/communication-center/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsCommunicationCenterActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(result.summary ?? labels.actionRecorded);
      await load();
    } else {
      setActionMessage(labels.actionFailed);
    }
  };

  const guestAction = (id: string, action: string) => void runAction({ action_type: action, comm_id: id, comm_type: "guest" });
  const teamAction = (id: string, action: string) => void runAction({ action_type: action, comm_id: id, comm_type: "team" });

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
      <section className="rounded-2xl border border-sky-100 bg-sky-50/40 p-6">
        <p className="text-sm font-medium text-sky-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-sky-900">{labels.governanceNote}</p>
        <Link href="/app/aipify-hosts" className="mt-4 inline-flex rounded-lg border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-sky-900 hover:bg-sky-50">
          {labels.backToHosts}
        </Link>
      </section>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={labels.guestMessages30d} value={dashboard.stats.guest_messages_30d} />
        <MetricCard label={labels.scheduledCount} value={dashboard.stats.scheduled_count} />
        <MetricCard label={labels.failedCount} value={dashboard.stats.failed_count} sub={dashboard.stats.failed_count > 0 ? labels.needsAttention : undefined} />
        <MetricCard label={labels.activeTemplates} value={dashboard.stats.active_templates} sub={`${dashboard.stats.pending_critical_announcements} ${labels.criticalPending}`} />
      </dl>

      <section className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-gray-600">
          {labels.filterStatus}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="ml-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm"
          >
            <option value="">{labels.allStatuses}</option>
            {dashboard.communication_statuses.map((s) => (
              <option key={s} value={s}>{labelFor(labels, "commStatus", s)}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="flex flex-wrap gap-2">
        {dashboard.sections.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => setActiveSection(section.key as HostsCommunicationSectionKey)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              activeSection === section.key ? "bg-sky-700 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {labelFor(labels, "section", section.key)}
          </button>
        ))}
      </section>

      {actionMessage && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">{actionMessage}</p>
      )}

      {activeSection === "guest_communications" && (
        <GuestCommTable rows={dashboard.guest_communications} labels={labels} busy={busy} onAction={guestAction} />
      )}
      {activeSection === "team_communications" && (
        <TeamCommTable rows={dashboard.team_communications} labels={labels} busy={busy} onAction={teamAction} />
      )}
      {activeSection === "templates" && (
        <TemplatesGrid rows={dashboard.templates} labels={labels} busy={busy} onUse={(id) => void runAction({ action_type: "use_template", template_id: id })} />
      )}
      {activeSection === "announcements" && (
        <AnnouncementsTable rows={dashboard.announcements} labels={labels} busy={busy} onPublish={(id) => void runAction({ action_type: "publish_announcement", announcement_id: id })} />
      )}
      {activeSection === "communication_history" && (
        <HistoryTable rows={dashboard.communication_history} labels={labels} />
      )}
    </div>
  );
}
