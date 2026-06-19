"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseRolePermissionMatrixAudit,
  parseRolePermissionMatrixCenter,
  parseRolePermissionMatrixRoleDetail,
  type RoleMatrixRole,
  type RolePermissionAuditEntry,
  type RolePermissionMatrixCenter,
  type RolePermissionMatrixLabels,
  type RolePermissionMatrixRoleDetail,
} from "@/lib/role-permission-matrix";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

type Tab = "roles" | "permissions" | "templates" | "audit";

export function RolePermissionMatrixPanel({ labels }: { labels: RolePermissionMatrixLabels }) {
  const [center, setCenter] = useState<RolePermissionMatrixCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("roles");
  const [selectedRole, setSelectedRole] = useState<RoleMatrixRole | null>(null);
  const [roleDetail, setRoleDetail] = useState<RolePermissionMatrixRoleDetail | null>(null);
  const [auditEntries, setAuditEntries] = useState<RolePermissionAuditEntry[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/role-permission-matrix");
    if (res.ok) setCenter(parseRolePermissionMatrixCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (!selectedRole) {
      setRoleDetail(null);
      return;
    }
    void (async () => {
      const res = await fetch(`/api/app/role-permission-matrix/section?section=role&role_key=${encodeURIComponent(selectedRole.role_key)}`);
      if (res.ok) setRoleDetail(parseRolePermissionMatrixRoleDetail(await res.json()));
      else setRoleDetail(null);
    })();
  }, [selectedRole]);

  useEffect(() => {
    if (tab !== "audit") return;
    void (async () => {
      const res = await fetch("/api/app/role-permission-matrix/section?section=audit");
      if (res.ok) {
        const parsed = parseRolePermissionMatrixAudit(await res.json());
        setAuditEntries(parsed?.audit ?? []);
      } else {
        setAuditEntries([]);
      }
    })();
  }, [tab]);

  async function applyTemplate(templateKey: string) {
    setBusy(true);
    await fetch("/api/app/role-permission-matrix/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: "apply_template", payload: { template_key: templateKey, target_role_key: "employee" } }),
    });
    setBusy(false);
    await load();
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

  const tabs: { key: Tab; label: string }[] = [
    { key: "roles", label: labels.roles },
    { key: "permissions", label: labels.permissions },
    { key: "templates", label: labels.templates },
    { key: "audit", label: labels.audit },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">← {labels.back}</Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        {center.visibility_rule ? <p className="mt-1 text-xs text-zinc-500">{center.visibility_rule}</p> : null}
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href={center.employees_route ?? "/app/employees"} className="text-indigo-700 hover:underline">{labels.manageEmployees}</Link>
          <Link href={center.module_access_route ?? "/app/settings/module-access"} className="text-indigo-700 hover:underline">{labels.moduleAccessLink}</Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${tab === t.key ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "roles" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(center.roles ?? []).map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={`rounded-xl border p-4 text-left transition ${selectedRole?.id === role.id ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-white hover:border-indigo-200"}`}
            >
              <p className="font-semibold text-gray-900">{role.name}</p>
              <p className="mt-1 text-xs text-gray-500 capitalize">{role.role_key.replace(/_/g, " ")} · {role.base_role}</p>
              <p className="mt-2 text-xs text-gray-600">
                {role.assigned_count ?? 0} {labels.assignedEmployees.toLowerCase()} · {role.permission_count ?? 0} {labels.permissions.toLowerCase()}
              </p>
              {role.department_scope_type && role.department_scope_type !== "organization" ? (
                <p className="mt-1 text-xs text-indigo-700">{labels.departmentScope}: {role.department_scope_type}</p>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      {tab === "permissions" ? (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="mb-3 text-sm font-medium text-gray-700">{labels.permissionCategories}: {(center.permission_categories ?? []).join(", ")}</p>
          <div className="max-h-96 overflow-y-auto">
            <ul className="space-y-1 text-sm font-mono text-gray-700">
              {(center.permissions ?? []).slice(0, 120).map((p) => (
                <li key={p.permission_key}>{p.permission_key}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {tab === "templates" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(center.templates ?? []).map((tpl) => (
            <div key={tpl.template_key} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="font-semibold text-gray-900">{tpl.name}</p>
              <p className="mt-1 text-sm text-gray-600">{tpl.description}</p>
              <button type="button" disabled={busy} onClick={() => void applyTemplate(tpl.template_key)} className="mt-3 text-sm font-medium text-indigo-700 hover:underline disabled:opacity-60">
                {labels.applyTemplate}
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "audit" ? (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          {auditEntries.length === 0 ? (
            <p className="text-sm text-gray-500">{labels.noAuditEntries}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="pb-2 pr-4">{labels.auditAction}</th>
                    <th className="pb-2 pr-4">{labels.roleName}</th>
                    <th className="pb-2 pr-4">{labels.description}</th>
                    <th className="pb-2">{labels.auditTimestamp}</th>
                  </tr>
                </thead>
                <tbody>
                  {auditEntries.map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium text-gray-900">{entry.action}</td>
                      <td className="py-2 pr-4 text-gray-700">{entry.role_key ?? "—"}</td>
                      <td className="py-2 pr-4 text-gray-600">{entry.summary ?? "—"}</td>
                      <td className="py-2 text-gray-500">{entry.created_at ? new Date(entry.created_at).toLocaleString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}

      {selectedRole ? (
        <section className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-5">
          <h2 className="font-semibold text-indigo-950">{selectedRole.name}</h2>
          <p className="mt-1 text-sm text-indigo-900">{selectedRole.description || labels.description}</p>
          <p className="mt-2 text-xs text-indigo-800">{labels.status}: {selectedRole.status}</p>
          {roleDetail?.permissions?.length ? (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-indigo-800">{labels.permissions}</p>
              <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto font-mono text-xs text-indigo-950">
                {roleDetail.permissions.filter((p) => p.granted).map((p) => (
                  <li key={p.permission_key}>{p.permission_key}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-3 text-sm text-indigo-800">{labels.noPermissions}</p>
          )}
        </section>
      ) : null}
    </div>
  );
}
