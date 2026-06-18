"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseEmployeeLifecycleCenter,
  type EmployeeLifecycleCenter,
  type EmployeeLifecycleLabels,
  type LifecycleEmployee,
} from "@/lib/employee-lifecycle";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

type Tab = "overview" | "employees" | "invitations" | "onboarding" | "training" | "offboarding" | "reports";

const STAGE_STYLE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  onboarding: "bg-sky-50 text-sky-900 ring-sky-200",
  invited: "bg-violet-50 text-violet-800 ring-violet-200",
  offboarding: "bg-amber-50 text-amber-900 ring-amber-200",
  former: "bg-gray-100 text-gray-600 ring-gray-200",
};

function EmployeeRow({ emp, labels, busy, onStartOnboarding, onStartOffboarding }: {
  emp: LifecycleEmployee;
  labels: EmployeeLifecycleLabels;
  busy: boolean;
  onStartOnboarding: (id: string) => void;
  onStartOffboarding: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500">{emp.employee_number ?? emp.id.slice(0, 8)}</p>
          <h3 className="font-semibold text-gray-900">{emp.full_name}</h3>
          <p className="text-gray-500">{emp.email} · {emp.department_name ?? "—"} · {emp.org_role}</p>
        </div>
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STAGE_STYLE[emp.lifecycle_stage] ?? STAGE_STYLE.active}`}>
          {emp.lifecycle_stage.replace(/_/g, " ")}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {emp.lifecycle_stage !== "active" && emp.lifecycle_stage !== "offboarding" ? (
          <button type="button" disabled={busy} onClick={() => onStartOnboarding(emp.id)} className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-800">{labels.startOnboarding}</button>
        ) : null}
        {emp.lifecycle_stage !== "offboarding" && emp.lifecycle_stage !== "former" ? (
          <button type="button" disabled={busy} onClick={() => onStartOffboarding(emp.id)} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">{labels.startOffboarding}</button>
        ) : null}
      </div>
    </div>
  );
}

type Props = { labels: EmployeeLifecycleLabels; initialTab?: Tab };

export function EmployeeLifecyclePanel({ labels, initialTab }: Props) {
  const [center, setCenter] = useState<EmployeeLifecycleCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab ?? "overview");
  const [busy, setBusy] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/employee-lifecycle");
    if (res.ok) setCenter(parseEmployeeLifecycleCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/employee-lifecycle/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) return <div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /></div>;
  if (!center?.found) return <AipifyModuleAccessDenied message={labels.accessDenied} />;

  const overview = center.overview ?? {};
  const routes = center.routes;

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: labels.overview },
    { key: "employees", label: labels.employees },
    { key: "invitations", label: labels.invitations },
    { key: "onboarding", label: labels.onboarding },
    { key: "training", label: labels.training },
    { key: "offboarding", label: labels.offboarding },
    { key: "reports", label: labels.reports },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {routes?.onboarding ? <Link href={routes.onboarding} className="text-indigo-700 hover:underline">{labels.onboardingLink}</Link> : null}
          {routes?.offboarding ? <Link href={routes.offboarding} className="text-indigo-700 hover:underline">{labels.offboardingLink}</Link> : null}
          {routes?.governance ? <Link href={routes.governance} className="text-indigo-700 hover:underline">Governance</Link> : null}
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {([
          [labels.totalEmployees, overview.total_employees],
          [labels.activeEmployees, overview.active],
          [labels.onboardingActive, overview.onboarding],
          [labels.pendingInvitations, overview.pending_invitations],
          [labels.offboardingActive, overview.offboarding],
        ] as [string, unknown][]).map(([label, value]) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">{String(value ?? "—")}</p>
          </div>
        ))}
      </div>

      <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-gray-200 pb-2">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${tab === t.key ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>{t.label}</button>
        ))}
      </div>

      {tab === "invitations" || tab === "overview" ? (
        <form className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row" onSubmit={(e) => {
          e.preventDefault();
          void runAction("invite_employee", { full_name: inviteName, email: inviteEmail, org_role: "employee", employment_type: "full_time" });
          setInviteName("");
          setInviteEmail("");
        }}>
          <input value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder={labels.employeeName} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
          <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} type="email" placeholder={labels.employeeEmail} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
          <button type="submit" disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.inviteEmployee}</button>
        </form>
      ) : null}

      {(tab === "employees" || tab === "overview") && (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.employees ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noEmployees} message={labels.noEmployeesHint} primaryAction={{ label: labels.inviteEmployee, onClick: () => setTab("invitations") }} />
          ) : (
            (center.employees ?? []).slice(0, tab === "overview" ? 4 : 100).map((emp) => (
              <EmployeeRow
                key={emp.id}
                emp={emp}
                labels={labels}
                busy={busy}
                onStartOnboarding={(id) => void runAction("start_onboarding", { employee_profile_id: id, template_key: "general_employee" })}
                onStartOffboarding={(id) => void runAction("start_offboarding", { employee_profile_id: id })}
              />
            ))
          )}
        </div>
      )}

      {tab === "invitations" && (
        <div className="space-y-2">
          {(center.invitations ?? []).map((inv, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
              <p className="font-medium text-gray-900">{String(inv.full_name ?? "")}</p>
              <p className="text-gray-500">{String(inv.email ?? "")} · {String(inv.status ?? "")} · {String(inv.org_role ?? "")}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "onboarding" && (
        <div className="space-y-2">
          {(center.onboarding ?? []).map((run, i) => (
            <div key={i} className="rounded-xl border border-sky-100 bg-sky-50/40 p-4 text-sm">
              <p className="font-medium text-gray-900">{String(run.employee_name ?? "")}</p>
              <p className="text-gray-600">{String(run.status ?? "")} · {String(run.progress_percent ?? 0)}%</p>
            </div>
          ))}
        </div>
      )}

      {tab === "training" && (
        <div className="space-y-2">
          {(center.training ?? []).map((t, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
              <p className="font-medium text-gray-900">{String(t.employee_name ?? "")} — {String(t.title ?? "")}</p>
              <p className="text-gray-500">{String(t.training_type ?? "")} · {String(t.status ?? "")}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "offboarding" && (
        <div className="space-y-2">
          {(center.offboarding ?? []).map((run, i) => (
            <div key={i} className="rounded-xl border border-amber-100 bg-amber-50/40 p-4 text-sm">
              <p className="font-medium text-gray-900">{String(run.employee_name ?? "")}</p>
              <p className="text-gray-600">{String(run.status ?? "")} · {String(run.progress_percent ?? 0)}%</p>
            </div>
          ))}
        </div>
      )}

      {tab === "reports" && center.reports ? (
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm space-y-2">
          {Object.entries(center.reports).map(([k, v]) => (
            <p key={k}><span className="font-medium capitalize">{k.replace(/_/g, " ")}:</span> {typeof v === "object" ? JSON.stringify(v) : String(v)}</p>
          ))}
          {center.assets_summary ? <p>{labels.assetsAssigned}: {String(center.assets_summary.assets_assigned ?? 0)}</p> : null}
        </div>
      ) : null}

      {center.audit_recent && center.audit_recent.length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold text-gray-900">{labels.auditLog}</h2>
          <ul className="mt-3 space-y-2">
            {center.audit_recent.slice(0, 8).map((a, i) => (
              <li key={i} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 text-sm"><p className="font-medium text-gray-900">{a.summary}</p></li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
