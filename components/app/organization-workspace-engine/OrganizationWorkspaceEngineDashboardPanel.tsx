"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseOrganizationWorkspaceEngineDashboard,
  type OrganizationWorkspace,
  type OrganizationWorkspaceEngineDashboard,
  type WorkspaceCustomRole,
} from "@/lib/aipify/organization-workspace-engine";

type Props = { labels: Record<string, string> };

export function OrganizationWorkspaceEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<OrganizationWorkspaceEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [switching, setSwitching] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [roleName, setRoleName] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/organization-workspace-engine/dashboard");
    if (res.ok) {
      setDashboard(parseOrganizationWorkspaceEngineDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const switchWorkspace = async (workspaceId: string) => {
    setSwitching(workspaceId);
    setActionError(null);
    const res = await fetch("/api/aipify/organization-workspace-engine/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspace_id: workspaceId }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.switchFailed);
    } else {
      await load();
    }
    setSwitching(null);
  };

  const createWorkspace = async () => {
    if (!workspaceName.trim() || !workspaceSlug.trim()) return;
    setCreating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/organization-workspace-engine/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: workspaceName.trim(),
        slug: workspaceSlug.trim().toLowerCase(),
        description: "",
        settings: { metadata_only: true },
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.createFailed);
    } else {
      setWorkspaceName("");
      setWorkspaceSlug("");
      await load();
    }
    setCreating(false);
  };

  const createCustomRole = async () => {
    if (!roleName.trim()) return;
    setActionError(null);
    const res = await fetch("/api/aipify/organization-workspace-engine/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: roleName.trim(),
        permissions: ["workspaces.view", "workspaces.switch"],
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.roleCreateFailed);
    } else {
      setRoleName("");
      await load();
    }
  };

  const exportSummary = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/organization-workspace-engine/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.exportFailed);
    }
    setExporting(false);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const org = dashboard.organization ?? {};
  const workspaces = dashboard.workspaces ?? [];
  const customRoles = dashboard.custom_roles ?? [];
  const currentWorkspace = dashboard.current_workspace ?? {};
  const currentWorkspaceId =
    typeof currentWorkspace.workspace_id === "string" ? currentWorkspace.workspace_id : undefined;
  const integrationLinks = dashboard.integration_links ?? {};
  const roleDistribution =
    typeof summary.role_distribution === "object" && summary.role_distribution
      ? (summary.role_distribution as Record<string, number>)
      : {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/multi-tenant" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.multiTenant}
        </Link>
        <Link href="/app/identity-access" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.identityPermissions}
        </Link>
      </div>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-indigo-700">{labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportSummary()}
        >
          {exporting ? labels.exporting : labels.exportSummary}
        </button>
      </div>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.orgStructure}</h3>
        <p className="mt-1 text-sm text-gray-600">
          {String(org.name ?? "")} ({String(org.slug ?? "")})
        </p>
        <ul className="mt-2 list-inside list-disc text-xs text-gray-500">
          <li>{labels.hierarchyOrg}</li>
          <li>{labels.hierarchyWorkspace}</li>
          <li>{labels.hierarchyUsers}</li>
          <li>{labels.hierarchyRoles}</li>
        </ul>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.totalWorkspaces}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.total_workspaces ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.activeWorkspaces}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.active_workspaces ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.totalMembers}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.total_members ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.customRoles}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.custom_roles ?? 0)}</p>
        </div>
      </div>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.workspaces}</h3>
        {workspaces.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noWorkspaces}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {workspaces.map((ws: OrganizationWorkspace) => (
              <li
                key={ws.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
              >
                <div>
                  <span className="font-medium">{ws.name}</span>
                  <span className="ml-2 text-xs text-gray-500">/{ws.slug}</span>
                  {ws.id === currentWorkspaceId && (
                    <span className="ml-2 rounded bg-indigo-100 px-1.5 py-0.5 text-xs text-indigo-700">
                      {labels.current}
                    </span>
                  )}
                  <span className="ml-2 text-xs text-gray-400">
                    {String(ws.member_count ?? 0)} {labels.members}
                  </span>
                </div>
                <button
                  type="button"
                  className="rounded border border-indigo-200 px-2 py-0.5 text-xs disabled:opacity-50"
                  disabled={switching === ws.id || ws.id === currentWorkspaceId}
                  onClick={() => ws.id && void switchWorkspace(ws.id)}
                >
                  {switching === ws.id ? labels.switching : labels.switchWorkspace}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.createWorkspace}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            className="rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder={labels.workspaceNamePlaceholder}
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
          <input
            className="rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder={labels.workspaceSlugPlaceholder}
            value={workspaceSlug}
            onChange={(e) => setWorkspaceSlug(e.target.value)}
          />
          <button
            type="button"
            className="rounded bg-indigo-600 px-3 py-1 text-sm text-white disabled:opacity-50"
            disabled={creating}
            onClick={() => void createWorkspace()}
          >
            {creating ? labels.creating : labels.createWorkspaceButton}
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.roleSummary}</h3>
        {Object.keys(roleDistribution).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noRoleData}</p>
        ) : (
          <ul className="mt-2 flex flex-wrap gap-2">
            {Object.entries(roleDistribution).map(([role, count]) => (
              <li key={role} className="rounded bg-gray-100 px-2 py-1 text-xs">
                {role}: {count}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.customRolesSection}</h3>
        {customRoles.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noCustomRoles}</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {customRoles.map((role: WorkspaceCustomRole) => (
              <li key={role.id}>
                <span className="font-medium">{role.name}</span>
                {role.description && (
                  <span className="ml-2 text-gray-500">{role.description}</span>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            className="rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder={labels.roleNamePlaceholder}
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
          <button
            type="button"
            className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-800"
            onClick={() => void createCustomRole()}
          >
            {labels.createCustomRole}
          </button>
        </div>
      </section>

      {Object.keys(integrationLinks).length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-2 space-y-1 text-xs text-gray-600">
            {Object.entries(integrationLinks).map(([key, link]) => {
              const route =
                typeof link === "object" && link && "route" in link
                  ? String((link as Record<string, unknown>).route)
                  : null;
              return (
                <li key={key}>
                  {route ? (
                    <Link href={route} className="text-indigo-600 hover:underline">
                      {key}
                    </Link>
                  ) : (
                    key
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {dashboard.principles && dashboard.principles.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
