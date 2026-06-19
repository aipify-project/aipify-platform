"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseOrganizationManagementCenter,
  type OrganizationManagementCenter,
  type OrganizationManagementLabels,
  type OrgDepartment,
} from "@/lib/organization-management";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

type Tab = "overview" | "departments" | "teams" | "locations" | "managers" | "organizationChart" | "policies" | "reports";

function ChartNode({ node, depth = 0 }: { node: Record<string, unknown>; depth?: number }) {
  const name = String(node.name ?? node.type ?? "");
  const children = [
    ...(Array.isArray(node.departments) ? (node.departments as Record<string, unknown>[]) : []),
    ...(Array.isArray(node.teams) ? (node.teams as Record<string, unknown>[]) : []),
    ...(Array.isArray(node.employees) ? (node.employees as Record<string, unknown>[]) : []),
  ];
  return (
    <div style={{ marginLeft: depth * 16 }} className="border-l border-gray-200 pl-3">
      <p className="py-1 text-sm font-medium text-gray-900">{name}</p>
      {children.map((child, i) => (
        <ChartNode key={`${String(child.id ?? child.name)}-${i}`} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

function DepartmentCard({ dept, labels }: { dept: OrgDepartment; labels: OrganizationManagementLabels }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900">{dept.name}</h3>
          {dept.description ? <p className="mt-1 text-sm text-gray-600 line-clamp-2">{dept.description}</p> : null}
        </div>
        <div className="text-right text-xs text-gray-500">
          <p>{labels.activeEmployees}: {dept.metrics?.active_employees ?? 0}</p>
          <p>{labels.teams}: {dept.metrics?.teams ?? 0}</p>
          <p>{labels.openTasks}: {dept.metrics?.open_tasks ?? 0}</p>
        </div>
      </div>
      {dept.teams && dept.teams.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {dept.teams.map((t) => (
            <span key={t.id} className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-800">{t.name}</span>
          ))}
        </div>
      ) : null}
      {dept.assigned_packs && dept.assigned_packs.length > 0 ? (
        <p className="mt-2 text-xs text-gray-500">{labels.assignedPacks}: {dept.assigned_packs.map((p) => p.pack_key).join(", ")}</p>
      ) : null}
      {dept.assigned_domains && dept.assigned_domains.length > 0 ? (
        <p className="mt-1 text-xs text-gray-500">{labels.assignedDomains}: {dept.assigned_domains.map((d) => d.domain).join(", ")}</p>
      ) : null}
    </div>
  );
}

export function OrganizationManagementPanel({ labels }: { labels: OrganizationManagementLabels }) {
  const [center, setCenter] = useState<OrganizationManagementCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [busy, setBusy] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptName, setDeptName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamDeptId, setTeamDeptId] = useState("");
  const [locName, setLocName] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/organization");
    if (res.ok) setCenter(parseOrganizationManagementCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/organization/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) return <div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /></div>;
  if (!center?.found) return <AipifyModuleAccessDenied message={labels.accessDenied} />;

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: labels.overview },
    { key: "departments", label: labels.departments },
    { key: "teams", label: labels.teams },
    { key: "locations", label: labels.locations },
    { key: "managers", label: labels.managers },
    { key: "organizationChart", label: labels.organizationChart },
    { key: "policies", label: labels.policies },
    { key: "reports", label: labels.reports },
  ];

  const routes = center.routes;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        {center.organization ? <p className="mt-1 text-sm text-gray-700">{center.organization.name}</p> : null}
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {routes?.employees ? <Link href={routes.employees} className="text-indigo-700 hover:underline">{labels.employeesLink}</Link> : null}
          {routes?.domains ? <Link href={routes.domains} className="text-indigo-700 hover:underline">{labels.domainsLink}</Link> : null}
        </div>
      </div>

      {center.overview ? (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-5">
          {[
            [labels.departments, center.overview.departments],
            [labels.teams, center.overview.teams],
            [labels.locations, center.overview.locations],
            [labels.employees, center.overview.active_employees],
            [labels.managers, center.overview.managers],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">{value ?? 0}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={labels.searchPlaceholder} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button type="button" disabled={busy || !searchQuery.trim()} onClick={() => void fetch(`/api/app/organization/search?q=${encodeURIComponent(searchQuery)}`)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.search}</button>
      </div>

      <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-gray-200 pb-2">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${tab === t.key ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>{t.label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {(center.departments ?? []).slice(0, 6).map((d) => <DepartmentCard key={d.id} dept={d} labels={labels} />)}
        </div>
      )}

      {tab === "departments" && (
        <div className="space-y-4">
          <form className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row" onSubmit={(e) => { e.preventDefault(); void runAction("create_department", { name: deptName }); setDeptName(""); }}>
            <input value={deptName} onChange={(e) => setDeptName(e.target.value)} placeholder={labels.departmentName} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
            <button type="submit" disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.createDepartment}</button>
          </form>
          {(center.departments ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noDepartments} message={labels.subtitle} primaryAction={{ label: labels.createDepartment, href: "#" }} />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">{(center.departments ?? []).map((d) => <DepartmentCard key={d.id} dept={d} labels={labels} />)}</div>
          )}
        </div>
      )}

      {tab === "teams" && (
        <div className="space-y-4">
          <form className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row" onSubmit={(e) => { e.preventDefault(); void runAction("create_team", { name: teamName, department_id: teamDeptId }); setTeamName(""); }}>
            <select value={teamDeptId} onChange={(e) => setTeamDeptId(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" required>
              <option value="">{labels.departments}</option>
              {(center.departments ?? []).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder={labels.teamName} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
            <button type="submit" disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.createTeam}</button>
          </form>
          {(center.teams ?? []).length === 0 ? <p className="text-sm text-gray-500">{labels.noTeams}</p> : (
            <div className="space-y-2">
              {(center.teams ?? []).map((t) => (
                <div key={t.id} className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="font-medium text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.department_name} · {t.member_count ?? 0} {labels.employees.toLowerCase()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "locations" && (
        <div className="space-y-4">
          <form className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row" onSubmit={(e) => { e.preventDefault(); void runAction("create_location", { name: locName }); setLocName(""); }}>
            <input value={locName} onChange={(e) => setLocName(e.target.value)} placeholder={labels.locationName} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
            <button type="submit" disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.createLocation}</button>
          </form>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(center.locations ?? []).map((l) => (
              <div key={l.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="font-medium text-gray-900">{l.name}</p>
                <p className="text-sm text-gray-500 capitalize">{l.location_type}{l.city ? ` · ${l.city}` : ""}{l.country ? `, ${l.country}` : ""}</p>
                <p className="mt-1 text-xs text-gray-500">{l.employee_count ?? 0} {labels.employees.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "managers" && (
        <div className="space-y-2">
          {(center.managers ?? []).length === 0 ? <p className="text-sm text-gray-500">{labels.managers}</p> : (
            (center.managers ?? []).map((m, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
                <p className="font-medium text-gray-900">{String(m.department_name ?? "")}</p>
                <p className="text-gray-500">{String(m.manager_role ?? "manager")}</p>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "organizationChart" && center.organization_chart ? (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <ChartNode node={center.organization_chart} />
        </div>
      ) : null}

      {tab === "policies" && (
        <ul className="space-y-2">
          {(center.policies ?? []).map((p) => (
            <li key={p.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="font-medium text-gray-900">{p.title}</p>
            </li>
          ))}
          {(center.policies ?? []).length === 0 ? <p className="text-sm text-gray-500">{labels.policies}</p> : null}
        </ul>
      )}

      {tab === "reports" && center.reports ? (
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{labels.departmentSize}</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              {Array.isArray(center.reports.department_sizes)
                ? (center.reports.department_sizes as { department?: string; employees?: number }[]).map((r, i) => (
                  <li key={i}>{r.department}: {r.employees}</li>
                ))
                : null}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{labels.packUsage}</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              {Array.isArray(center.reports.pack_usage)
                ? (center.reports.pack_usage as { pack_key?: string; department?: string }[]).map((r, i) => (
                  <li key={i}>{r.pack_key} → {r.department}</li>
                ))
                : null}
            </ul>
          </div>
        </div>
      ) : null}

      {center.audit_recent && center.audit_recent.length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold text-gray-900">{labels.auditLog}</h2>
          <ul className="mt-3 space-y-2">
            {center.audit_recent.slice(0, 8).map((a, i) => (
              <li key={i} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 text-sm">
                <p className="font-medium text-gray-900">{a.summary}</p>
                <p className="text-xs text-gray-500">{a.action}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
