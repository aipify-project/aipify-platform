"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsTeamCenterActionResult,
  parseAipifyHostsTeamCenterDashboard,
  type HostsTeamCenterDashboard,
  type HostsTeamCenterSectionKey,
  type HostsTeamMemberRow,
} from "@/lib/aipify/aipify-hosts-team-center";

type Props = { labels: Record<string, string> };

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    pending: "bg-amber-50 text-amber-900 ring-amber-200",
    accepted: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    expired: "bg-gray-100 text-gray-600 ring-gray-200",
    revoked: "bg-red-50 text-red-800 ring-red-200",
    owner: "bg-violet-50 text-violet-800 ring-violet-200",
    property_manager: "bg-indigo-50 text-indigo-800 ring-indigo-200",
    cleaner: "bg-sky-50 text-sky-800 ring-sky-200",
    maintenance: "bg-orange-50 text-orange-800 ring-orange-200",
    support: "bg-teal-50 text-teal-800 ring-teal-200",
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

export function AipifyHostsTeamCenterDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsTeamCenterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState<HostsTeamCenterSectionKey>("team_members");
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("cleaner");
  const [selectedMember, setSelectedMember] = useState<HostsTeamMemberRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams({ section: activeSection });
    const res = await fetch(`/api/aipify/aipify-hosts/team-center/dashboard?${params.toString()}`);
    if (res.ok) {
      setDashboard(parseAipifyHostsTeamCenterDashboard(await res.json()));
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
    const res = await fetch("/api/aipify/aipify-hosts/team-center/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = parseAipifyHostsTeamCenterActionResult(await res.json());
    setBusy(false);
    if (result.success) {
      setActionMessage(labels.actionRecorded);
      setInviteEmail("");
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
      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6">
        <p className="text-sm font-medium text-indigo-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-indigo-900">{labels.governanceNote}</p>
        <Link
          href="/app/aipify-hosts"
          className="mt-4 inline-flex rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-50"
        >
          {labels.backToHosts}
        </Link>
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

      <nav className="flex gap-1 overflow-x-auto border-b border-gray-200 pb-px">
        {dashboard.sections.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActiveSection(s.key as HostsTeamCenterSectionKey)}
            className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium ${
              activeSection === s.key
                ? "border border-b-0 border-gray-200 bg-white text-indigo-900"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {activeSection === "team_members" && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          {dashboard.team_members.length === 0 ? (
            <EmptyBoard title={labels.emptyMembersTitle} message={labels.emptyMembersMessage} />
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">{labels.memberName}</th>
                  <th className="px-4 py-3">{labels.email}</th>
                  <th className="px-4 py-3">{labels.role}</th>
                  <th className="px-4 py-3">{labels.propertiesAssigned}</th>
                  <th className="px-4 py-3">{labels.actions}</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.team_members.map((m) => (
                  <tr key={m.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">{m.full_name}</td>
                    <td className="px-4 py-3 text-gray-700">{m.email}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(m.role_key)}`}>
                        {labelFor(labels, "role", m.role_key)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {m.property_names.length > 0 ? m.property_names.join(", ") : labels.allProperties}
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        type="button"
                        className="text-xs font-medium text-indigo-700 hover:text-indigo-900"
                        onClick={() => setSelectedMember(m)}
                      >
                        {labels.manageMember}
                      </button>
                      {m.role_key !== "owner" && (
                        <button
                          type="button"
                          disabled={busy}
                          className="text-xs font-medium text-red-700 hover:text-red-900 disabled:opacity-60"
                          onClick={() => void runAction({ action: "remove_member", member_id: m.id })}
                        >
                          {labels.removeMember}
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

      {activeSection === "roles" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {dashboard.roles.map((role) => (
            <article key={role.key} className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold text-gray-900">{role.label}</h3>
              <ul className="mt-3 space-y-1 text-sm text-gray-600">
                {(dashboard.role_permissions[role.key] ?? []).map((perm) => (
                  <li key={perm}>· {labelFor(labels, "perm", perm)}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}

      {activeSection === "permissions" && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">{labels.role}</th>
                <th className="px-4 py-3">{labels.permissions}</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.roles.map((role) => (
                <tr key={role.key} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{role.label}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {(dashboard.role_permissions[role.key] ?? [])
                      .map((p) => labelFor(labels, "perm", p))
                      .join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === "invitations" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-gray-900">{labels.sendInvitation}</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder={labels.emailPlaceholder}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm sm:col-span-1"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {dashboard.roles.filter((r) => r.key !== "owner").map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={busy || !inviteEmail.trim()}
                onClick={() =>
                  void runAction({
                    action: "send_invitation",
                    email: inviteEmail,
                    role_key: inviteRole,
                    property_ids: [],
                  })
                }
                className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {labels.sendInvite}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            {dashboard.invitations.length === 0 ? (
              <EmptyBoard title={labels.emptyInvitationsTitle} message={labels.emptyInvitationsMessage} />
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">{labels.email}</th>
                    <th className="px-4 py-3">{labels.role}</th>
                    <th className="px-4 py-3">{labels.invitationStatus}</th>
                    <th className="px-4 py-3">{labels.expiresAt}</th>
                    <th className="px-4 py-3">{labels.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.invitations.map((inv) => (
                    <tr key={inv.id} className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-900">{inv.email}</td>
                      <td className="px-4 py-3">{labelFor(labels, "role", inv.role_key)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusBadge(inv.status)}`}>
                          {labelFor(labels, "invstatus", inv.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{inv.expires_at ?? "—"}</td>
                      <td className="px-4 py-3">
                        {inv.status === "pending" && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void runAction({ action: "revoke_invitation", invitation_id: inv.id })}
                            className="text-xs font-medium text-red-700 hover:text-red-900 disabled:opacity-60"
                          >
                            {labels.revokeInvitation}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeSection === "activity_log" && (
        <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
          {dashboard.activity_log.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-gray-500">{labels.emptyActivityMessage}</li>
          ) : (
            dashboard.activity_log.map((ev) => (
              <li key={ev.id} className="px-4 py-3">
                <p className="font-medium text-gray-900">{ev.summary ?? labelFor(labels, "activity", ev.event_type)}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {ev.when} · {labelFor(labels, "activity", ev.event_type)}
                </p>
              </li>
            ))
          )}
        </ul>
      )}

      {selectedMember && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-semibold text-gray-900">{labels.manageMemberTitle}</h2>
            <button type="button" className="text-sm text-gray-500 hover:text-gray-700" onClick={() => setSelectedMember(null)}>
              {labels.close}
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-600">{selectedMember.full_name} · {selectedMember.email}</p>
          <label className="mt-4 flex flex-col gap-2 text-sm">
            <span className="font-medium text-gray-700">{labels.changeRole}</span>
            <select
              defaultValue={selectedMember.role_key}
              disabled={selectedMember.role_key === "owner" || busy}
              onChange={(e) =>
                void runAction({
                  action: "update_role",
                  member_id: selectedMember.id,
                  role_key: e.target.value,
                })
              }
              className="rounded-lg border border-gray-300 px-3 py-2"
            >
              {dashboard.roles.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          {dashboard.properties.length > 0 && selectedMember.role_key !== "owner" && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">{labels.assignProperties}</p>
              <ul className="mt-2 space-y-2">
                {dashboard.properties.map((prop) => (
                  <li key={prop.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      defaultChecked={selectedMember.property_ids.includes(prop.id)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...new Set([...selectedMember.property_ids, prop.id])]
                          : selectedMember.property_ids.filter((id) => id !== prop.id);
                        void runAction({
                          action: "update_properties",
                          member_id: selectedMember.id,
                          property_ids: next,
                        });
                      }}
                    />
                    {prop.display_name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {actionMessage && (
        <p className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">{actionMessage}</p>
      )}
    </div>
  );
}
