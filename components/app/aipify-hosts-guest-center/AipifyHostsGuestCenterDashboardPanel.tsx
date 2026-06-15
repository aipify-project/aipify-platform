"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsGuestCenterActionResult,
  parseAipifyHostsGuestCenterDashboard,
  type HostsGuestCenterDashboard,
  type HostsGuestCenterSectionKey,
  type HostsGuestRow,
} from "@/lib/aipify/aipify-hosts-guest-center";

type Props = { labels: Record<string, string> };

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    upcoming: "bg-sky-50 text-sky-800 ring-sky-200",
    checked_in: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    checked_out: "bg-gray-100 text-gray-700 ring-gray-200",
    cancelled: "bg-red-50 text-red-800 ring-red-200",
    new: "bg-sky-50 text-sky-800 ring-sky-200",
    assigned: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    awaiting_response: "bg-amber-50 text-amber-900 ring-amber-200",
    resolved: "bg-teal-50 text-teal-800 ring-teal-200",
    closed: "bg-gray-100 text-gray-600 ring-gray-200",
    first_stay: "bg-violet-50 text-violet-800 ring-violet-200",
    returning: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    frequent: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function EmptyBoard({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: { label: string; href?: string; onClick?: () => void };
}) {
  if (action) {
    return (
      <PlatformEmptyState
        title={title}
        message={message}
        primaryAction={action.href ? { label: action.label, href: action.href } : { label: action.label, onClick: action.onClick }}
      />
    );
  }
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-8 text-center">
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}

function GuestTable({
  rows,
  labels,
  onSelect,
  selectedId,
}: {
  rows: HostsGuestRow[];
  labels: Record<string, string>;
  onSelect: (id: string) => void;
  selectedId?: string;
}) {
  if (rows.length === 0) {
    return (
      <EmptyBoard
        title={labels.emptyGuestsTitle}
        message={labels.emptyGuestsMessage}
        action={{ label: labels.emptyGuestsCta, href: "/app/aipify-hosts/properties" }}
      />
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">{labels.guestName}</th>
            <th className="px-4 py-3">{labels.property}</th>
            <th className="px-4 py-3">{labels.checkInDate}</th>
            <th className="px-4 py-3">{labels.checkOutDate}</th>
            <th className="px-4 py-3">{labels.stayStatus}</th>
            <th className="px-4 py-3">{labels.guestTier}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={`cursor-pointer border-b border-gray-100 hover:bg-rose-50/40 ${selectedId === row.id ? "bg-rose-50" : ""}`}
              onClick={() => onSelect(row.id)}
            >
              <td className="px-4 py-3 font-medium text-gray-900">{row.full_name}</td>
              <td className="px-4 py-3 text-gray-700">{row.property}</td>
              <td className="px-4 py-3 text-gray-700">{row.check_in_date ?? "—"}</td>
              <td className="px-4 py-3 text-gray-700">{row.check_out_date ?? "—"}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.status)}`}>
                  {labelFor(labels, "stay", row.status)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(row.guest_tier)}`}>
                  {labelFor(labels, "tier", row.guest_tier)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AipifyHostsGuestCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsGuestCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsGuestCenterSectionKey>("active_guests");
  const [activeFilter, setActiveFilter] = useState("active_guests");
  const [selectedGuestId, setSelectedGuestId] = useState("");
  const [noteText, setNoteText] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ section: activeSection, filter: activeFilter });
    if (selectedGuestId) params.set("guest_id", selectedGuestId);
    const res = await fetch(`/api/aipify/aipify-hosts/guest-center/dashboard?${params.toString()}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsGuestCenterDashboard(await res.json()));
    } else {
      setError(true);
    }
    setLoading(false);
  }, [activeSection, activeFilter, selectedGuestId]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (body: Record<string, unknown>) => {
    setBusy(true);
    setActionMessage(null);
    const res = await fetch("/api/aipify/aipify-hosts/guest-center/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsGuestCenterActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(labels.actionRecorded);
      setNoteText("");
      await load();
    } else {
      setActionMessage(labels.actionFailed);
    }
  };

  if (loading && !dashboard) return <AipifyLoader centered fullPage />;

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  const profile = dashboard.guest_profile;
  const sectionRows =
    activeSection === "active_guests"
      ? dashboard.active_guests
      : activeSection === "upcoming_guests"
        ? dashboard.upcoming_guests
        : activeSection === "guest_history"
          ? dashboard.guest_history
          : dashboard.guests;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-rose-100 bg-rose-50/40 p-6">
        <p className="text-sm font-medium text-rose-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-rose-900">{labels.governanceNote}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/app/aipify-hosts" className="inline-flex rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-900 hover:bg-rose-50">
            {labels.backToHosts}
          </Link>
          {labels.exploreGuidance && (
            <Link href="/app/aipify-hosts/knowledge" className="inline-flex rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-900 hover:bg-rose-50">
              {labels.exploreGuidance}
            </Link>
          )}
        </div>
      </section>

      {dashboard.notifications.length > 0 && (
        <section className="space-y-2">
          {dashboard.notifications.filter((n) => n.active).map((n) => (
            <div key={n.key} className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              {n.message}
            </div>
          ))}
        </section>
      )}

      <section className="flex flex-wrap gap-2">
        {dashboard.filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActiveFilter(f.key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ring-1 ${
              activeFilter === f.key ? "bg-rose-700 text-white ring-rose-700" : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </section>

      <nav className="flex gap-1 overflow-x-auto border-b border-gray-200 pb-px">
        {dashboard.sections.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActiveSection(s.key as HostsGuestCenterSectionKey)}
            className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium ${
              activeSection === s.key ? "border border-b-0 border-gray-200 bg-white text-rose-900" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {(activeSection === "active_guests" || activeSection === "upcoming_guests" || activeSection === "guest_history") && (
        <GuestTable rows={sectionRows} labels={labels} selectedId={selectedGuestId} onSelect={setSelectedGuestId} />
      )}

      {activeSection === "guest_requests" && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          {dashboard.guest_requests.length === 0 ? (
            <EmptyBoard
              title={labels.emptyRequestsTitle}
              message={labels.emptyRequestsMessage}
              action={{ label: labels.emptyRequestsCta, onClick: () => setActiveSection("active_guests") }}
            />
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">{labels.guestName}</th>
                  <th className="px-4 py-3">{labels.property}</th>
                  <th className="px-4 py-3">{labels.requestType}</th>
                  <th className="px-4 py-3">{labels.requestStatus}</th>
                  <th className="px-4 py-3">{labels.actions}</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.guest_requests.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.guest_name}</td>
                    <td className="px-4 py-3 text-gray-700">{r.property}</td>
                    <td className="px-4 py-3 text-gray-700">{labelFor(labels, "request", r.request_type)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(r.status)}`}>
                        {labelFor(labels, "reqstatus", r.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {r.status !== "resolved" && r.status !== "closed" && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void runAction({ action: "update_request_status", request_id: r.id, status: "resolved" })}
                          className="text-xs font-medium text-rose-700 hover:text-rose-900 disabled:opacity-60"
                        >
                          {labels.markResolved}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeSection === "guest_notes" && (
        <div className="space-y-4">
          {selectedGuestId && (
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-gray-700">{labels.addNote}</span>
                <textarea
                  id="guest-note-input"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder={labels.notePlaceholder}
                  className="rounded-lg border border-gray-300 px-3 py-2"
                />
              </label>
              <button
                type="button"
                disabled={busy || !noteText.trim()}
                onClick={() => void runAction({ action: "add_note", guest_id: selectedGuestId, note_text: noteText })}
                className="mt-3 rounded-lg bg-rose-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {labels.saveNote}
              </button>
              <p className="mt-2 text-xs text-gray-500">{labels.notesGovernance}</p>
            </div>
          )}
          {!selectedGuestId && (
            <PlatformEmptyState
              title={labels.selectGuestForNoteTitle}
              message={labels.selectGuestForNote}
              primaryAction={{ label: labels.selectGuestCta, onClick: () => setActiveSection("active_guests") }}
            />
          )}
          <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
            {dashboard.guest_notes.length === 0 ? (
              <li className="px-4 py-2">
                <PlatformEmptyState
                  title={labels.emptyNotesTitle}
                  message={labels.emptyNotesMessage}
                  primaryAction={
                    selectedGuestId
                      ? { label: labels.addNote, onClick: () => document.getElementById("guest-note-input")?.focus() }
                      : { label: labels.selectGuestCta, onClick: () => setActiveSection("active_guests") }
                  }
                />
              </li>
            ) : (
              dashboard.guest_notes.map((n) => (
                <li key={n.id} className="px-4 py-3">
                  <p className="font-medium text-gray-900">{n.guest_name}</p>
                  <p className="mt-1 text-sm text-gray-700">{n.note_text}</p>
                  <p className="mt-1 text-xs text-gray-500">{n.created_at}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {activeSection === "guest_timeline" && (
        <div>
          {!selectedGuestId ? (
            <PlatformEmptyState
              title={labels.selectGuestForTimelineTitle}
              message={labels.selectGuestForTimeline}
              primaryAction={{ label: labels.selectGuestCta, onClick: () => setActiveSection("active_guests") }}
            />
          ) : dashboard.guest_timeline.length === 0 ? (
            <EmptyBoard title={labels.emptyTimelineTitle} message={labels.emptyTimelineMessage} />
          ) : (
            <ol className="relative space-y-4 border-l border-gray-200 pl-6">
              {dashboard.guest_timeline.map((ev, i) => (
                <li key={`${ev.type}-${i}`} className="text-sm">
                  <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-rose-400" />
                  <p className="font-medium text-gray-900">{ev.label}</p>
                  <p className="text-gray-600">{ev.when} · {labelFor(labels, "timeline", ev.type)}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {profile && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.guestProfile}</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
            <div><dt className="text-gray-500">{labels.fullName}</dt><dd className="font-medium text-gray-900">{profile.full_name}</dd></div>
            <div><dt className="text-gray-500">{labels.contactEmail}</dt><dd className="font-medium text-gray-900">{profile.contact_email ?? "—"}</dd></div>
            <div><dt className="text-gray-500">{labels.contactPhone}</dt><dd className="font-medium text-gray-900">{profile.contact_phone ?? "—"}</dd></div>
            <div><dt className="text-gray-500">{labels.assignedProperty}</dt><dd className="font-medium text-gray-900">{profile.property}</dd></div>
            <div><dt className="text-gray-500">{labels.currentStayStatus}</dt><dd className="font-medium text-gray-900">{labelFor(labels, "stay", profile.status)}</dd></div>
            <div><dt className="text-gray-500">{labels.guestTier}</dt><dd className="font-medium text-gray-900">{labelFor(labels, "tier", profile.guest_tier)}</dd></div>
          </dl>
        </section>
      )}

      {actionMessage && (
        <p className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-900">{actionMessage}</p>
      )}
    </div>
  );
}
