"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  EMPLOYEE_STATUS_STYLE,
  parseEmployeeDirectory,
  parseEmployeeManagementCenter,
  type EmployeeManagementCenter,
  type EmployeeManagementLabels,
  type EmployeeRecord,
} from "@/lib/employee-management";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

type Tab = "overview" | "employees" | "invitations" | "departments" | "access_control" | "activity";

export function EmployeeManagementPanel({ labels }: { labels: EmployeeManagementLabels }) {
  const [center, setCenter] = useState<EmployeeManagementCenter | null>(null);
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [invitations, setInvitations] = useState<Record<string, unknown>[]>([]);
  const [departments, setDepartments] = useState<Record<string, unknown>[]>([]);
  const [activity, setActivity] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ full_name: "", email: "", org_role: "employee", job_title: "" });
  const [offboardTarget, setOffboardTarget] = useState<string | null>(null);

  const loadCenter = useCallback(async () => {
    const res = await fetch("/api/app/employees");
    if (res.ok) setCenter(parseEmployeeManagementCenter(await res.json()));
    else setCenter(null);
  }, []);

  const loadSection = useCallback(async (section: Tab, q?: string) => {
    if (section === "overview") return;
    const params = new URLSearchParams({ section: section === "employees" ? "employees" : section });
    if (q) params.set("search", q);
    const res = await fetch(`/api/app/employees/section?${params}`);
    if (!res.ok) return;
    const data = (await res.json()) as Record<string, unknown>;
    if (section === "employees") setEmployees(parseEmployeeDirectory(data));
    if (section === "invitations") setInvitations(Array.isArray(data.invitations) ? data.invitations as Record<string, unknown>[] : []);
    if (section === "departments") setDepartments(Array.isArray(data.departments) ? data.departments as Record<string, unknown>[] : []);
    if (section === "activity") setActivity(Array.isArray(data.activity) ? data.activity as Record<string, unknown>[] : []);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    await loadCenter();
    await loadSection(tab, search || undefined);
    setLoading(false);
  }, [loadCenter, loadSection, tab, search]);

  useEffect(() => { void refresh(); }, [refresh]);

  useEffect(() => {
    if (tab !== "overview") void loadSection(tab, search || undefined);
  }, [tab, search, loadSection]);

  async function runAction(actionType: string, payload: Record<string, unknown>) {
    setBusy(true);
    await fetch("/api/app/employees/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: actionType, payload }),
    });
    setBusy(false);
    await refresh();
  }

  async function submitInvite(e: React.FormEvent) {
    e.preventDefault();
    await runAction("invite_employee", inviteForm);
    setShowInvite(false);
    setInviteForm({ full_name: "", email: "", org_role: "employee", job_title: "" });
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!center?.found) {
    return (
      <AipifyModuleAccessDenied message={labels.accessDenied} />
    );
  }

  const seats = center.seat_licensing;
  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: labels.overview },
    { key: "employees", label: labels.employees },
    { key: "invitations", label: labels.invitations },
    { key: "departments", label: labels.departments },
    { key: "access_control", label: labels.accessControl },
    { key: "activity", label: labels.activity },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
          <p className="mt-2 text-gray-600">{labels.subtitle}</p>
          {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
          {!center.app_license_active ? (
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{labels.appSuspended}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/app/employees/me" className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            {labels.myWorkspace}
          </Link>
          <button
            type="button"
            onClick={() => setShowInvite(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {labels.inviteEmployee}
          </button>
        </div>
      </div>

      {showInvite ? (
        <form onSubmit={(e) => void submitInvite(e)} className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-6">
          <h2 className="font-semibold text-indigo-950">{labels.inviteEmployee}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input required placeholder={labels.name} value={inviteForm.full_name} onChange={(e) => setInviteForm({ ...inviteForm, full_name: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" />
            <input required type="email" placeholder={labels.email} value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" />
            <input placeholder={labels.jobTitle} value={inviteForm.job_title} onChange={(e) => setInviteForm({ ...inviteForm, job_title: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" />
            <select value={inviteForm.org_role} onChange={(e) => setInviteForm({ ...inviteForm, org_role: e.target.value })} className="rounded-lg border px-3 py-2 text-sm">
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="team_lead">Team Lead</option>
              <option value="read_only">Read Only</option>
            </select>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-60">{labels.sendInvite}</button>
            <button type="button" onClick={() => setShowInvite(false)} className="rounded-lg border px-4 py-2 text-sm">{labels.cancel}</button>
          </div>
        </form>
      ) : null}

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${tab === t.key ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && seats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: labels.totalSeats, value: seats.total_seats },
            { label: labels.usedSeats, value: seats.used_seats },
            { label: labels.availableSeats, value: seats.available_seats },
            { label: labels.pendingInvitations, value: seats.pending_invitations },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "employees" ? (
        <>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full max-w-md rounded-lg border px-3 py-2 text-sm"
          />
          {employees.length === 0 ? (
            <PlatformEmptyState
              title={labels.noEmployees}
              message={labels.subtitle}
              primaryAction={{ label: labels.inviteEmployee, onClick: () => setShowInvite(true) }}
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="min-w-full text-sm">
                <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">{labels.name}</th>
                    <th className="px-4 py-3">{labels.email}</th>
                    <th className="px-4 py-3">{labels.department}</th>
                    <th className="px-4 py-3">{labels.role}</th>
                    <th className="px-4 py-3">{labels.status}</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.employee_id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium text-gray-900">{emp.full_name}</td>
                      <td className="px-4 py-3 text-gray-600">{emp.email}</td>
                      <td className="px-4 py-3 text-gray-600">{emp.department_name ?? "—"}</td>
                      <td className="px-4 py-3 capitalize text-gray-600">{emp.org_role.replace(/_/g, " ")}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs ring-1 ${EMPLOYEE_STATUS_STYLE[emp.employee_status] ?? ""}`}>
                          {emp.employee_status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {emp.employee_status === "active" ? (
                            <button type="button" disabled={busy} onClick={() => void runAction("suspend_employee", { employee_id: emp.employee_id })} className="text-xs text-orange-700 hover:underline">{labels.suspend}</button>
                          ) : null}
                          {emp.employee_status === "suspended" ? (
                            <button type="button" disabled={busy} onClick={() => void runAction("reactivate_employee", { employee_id: emp.employee_id })} className="text-xs text-emerald-700 hover:underline">{labels.reactivate}</button>
                          ) : null}
                          {emp.employee_status !== "offboarded" ? (
                            offboardTarget === emp.employee_id ? (
                              <button type="button" disabled={busy} onClick={() => void runAction("offboard_employee", { employee_id: emp.employee_id })} className="text-xs text-red-700 hover:underline">{labels.confirmOffboard}</button>
                            ) : (
                              <button type="button" onClick={() => setOffboardTarget(emp.employee_id)} className="text-xs text-red-700 hover:underline">{labels.offboard}</button>
                            )
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : null}

      {tab === "invitations" ? (
        invitations.length === 0 ? (
          <p className="text-sm text-gray-500">{labels.noInvitations}</p>
        ) : (
          <ul className="space-y-2">
            {invitations.map((inv) => (
              <li key={String(inv.id)} className="flex items-center justify-between rounded-lg border bg-white px-4 py-3 text-sm">
                <span>{String(inv.full_name)} · {String(inv.email)}</span>
                <button type="button" disabled={busy} onClick={() => void runAction("cancel_invitation", { invitation_id: inv.id })} className="text-red-700 hover:underline">{labels.cancel}</button>
              </li>
            ))}
          </ul>
        )
      ) : null}

      {tab === "departments" ? (
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d) => (
            <li key={String(d.id)} className="rounded-lg border bg-white px-4 py-3 text-sm font-medium text-gray-900">{String(d.name)}</li>
          ))}
        </ul>
      ) : null}

      {tab === "access_control" ? (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-5">
          <p className="text-sm text-indigo-950">{labels.privacyNote}</p>
          <Link href="/app/settings/roles-permissions" className="mt-3 inline-block text-sm font-medium text-indigo-700 hover:underline">{labels.manageModuleAccess}</Link>
          <Link href="/app/settings/module-access" className="ml-4 inline-block text-sm font-medium text-indigo-700 hover:underline">Module grants</Link>
          <Link href="/app/store" className="ml-4 inline-block text-sm font-medium text-indigo-700 hover:underline">{labels.purchaseSeats}</Link>
        </div>
      ) : null}

      {tab === "activity" ? (
        <ul className="space-y-2">
          {activity.map((a) => (
            <li key={String(a.id)} className="rounded-lg border bg-white px-4 py-3 text-sm">
              <span className="font-medium text-gray-900">{String(a.summary)}</span>
              <span className="ml-2 text-xs text-gray-500">{String(a.action)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
