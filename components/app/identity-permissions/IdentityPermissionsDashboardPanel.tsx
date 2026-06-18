"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseIdentityPermissionsDashboard,
  type IdentityPermissionsDashboard,
} from "@/lib/aipify/identity-permissions";

type IdentityPermissionsDashboardPanelProps = {
  labels: Record<string, string>;
};

function badgeClass(value?: string) {
  switch (value) {
    case "active":
    case "approved":
    case "ready":
    case "low":
      return "bg-emerald-100 text-emerald-800";
    case "pending":
    case "invited":
    case "medium":
    case "planned":
    case "scaffold":
      return "bg-amber-100 text-amber-800";
    case "suspended":
    case "locked":
    case "high":
      return "bg-orange-100 text-orange-800";
    case "rejected":
    case "deleted":
    case "expired":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function IdentityPermissionsDashboardPanel({
  labels,
}: IdentityPermissionsDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<IdentityPermissionsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [savingAccessReview, setSavingAccessReview] = useState(false);
  const [savingCompanionPrefs, setSavingCompanionPrefs] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/identity-permissions/dashboard");
    if (res.ok) setDashboard(parseIdentityPermissionsDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function resolveApproval(id: string, decision: "approve" | "reject") {
    setActionId(id);
    await fetch(`/api/identity/approvals/${id}/${decision}`, { method: "POST" });
    await load();
    setActionId(null);
  }

  const saveAccessReviewToggle = async (key: string, value: boolean) => {
    setSavingAccessReview(true);
    setActionError(null);
    const res = await fetch("/api/aipify/identity-permissions/access-review-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: value }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.accessReviewSaveFailed);
    } else {
      await load();
    }
    setSavingAccessReview(false);
  };

  const saveCompanionPrefToggle = async (key: string, value: boolean) => {
    setSavingCompanionPrefs(true);
    setActionError(null);
    const res = await fetch("/api/aipify/identity-permissions/companion-permission-prefs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: value }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.companionPrefsSaveFailed);
    } else {
      await load();
    }
    setSavingCompanionPrefs(false);
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const successCriteria = Array.isArray(dashboard.success_criteria) ? dashboard.success_criteria : [];
  const defaultRoles = Array.isArray(dashboard.default_roles) ? dashboard.default_roles : [];
  const permissionCategories = Array.isArray(dashboard.permission_categories)
    ? dashboard.permission_categories
    : [];
  const blueprintLinks = Array.isArray(dashboard.blueprint_integration_links)
    ? dashboard.blueprint_integration_links
    : [];
  const accessReviewSettings = dashboard.access_reviews?.settings ?? {};
  const companionPrefs = dashboard.companion_permission_prefs ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/aipify-core" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.aipifyCore}
        </Link>
        <Link href="/app/multi-tenant" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.multiTenant}
        </Link>
        <Link
          href="/app/organization-workspace-engine"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.organizationWorkspace}
        </Link>
        <Link href="/app/team" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.team}
        </Link>
        <Link href="/app/approvals" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.approvals}
        </Link>
      </div>

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold text-violet-900">{labels.engineTitle}</h2>
        {dashboard.mission && <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.mission}</p>}
        <p className="mt-2 text-sm text-violet-900">{dashboard.philosophy}</p>
        {dashboard.build_philosophy && (
          <p className="mt-2 text-xs font-medium text-violet-800">{dashboard.build_philosophy}</p>
        )}
        {dashboard.abos_principle && (
          <p className="mt-2 text-xs text-violet-700">{dashboard.abos_principle}</p>
        )}
        <p className="mt-2 text-sm text-violet-900">
          {labels.role}:{" "}
          <span className="font-medium capitalize">{dashboard.current_role?.replace(/_/g, " ")}</span>
        </p>
        <p className="mt-1 text-xs text-violet-700">{dashboard.safety_note}</p>
      </section>

      {actionError && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {actionError}
        </p>
      )}

      {successCriteria.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {successCriteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              const note = typeof item.note === "string" ? item.note : null;
              return (
                <li key={label} className="flex flex-col gap-0.5">
                  <span className={met ? "text-green-800" : "text-gray-700"}>
                    {met ? "✓" : "○"} {label}
                  </span>
                  {note && <span className="text-xs text-gray-500">{note}</span>}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {defaultRoles.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.defaultRoles}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {defaultRoles.map((r) => {
              const key = typeof r.key === "string" ? r.key : "";
              const label = typeof r.label === "string" ? r.label : key;
              const implemented = Boolean(r.implemented);
              return (
                <span
                  key={key}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${implemented ? "bg-slate-100 text-slate-800" : "bg-amber-50 text-amber-800"}`}
                  title={typeof r.note === "string" ? r.note : undefined}
                >
                  {label}
                  {!implemented ? ` · ${labels.scaffold}` : ""}
                </span>
              );
            })}
          </div>
        </section>
      )}

      {permissionCategories.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.permissionCategories}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {permissionCategories.map((cat) => {
              const category = typeof cat.category === "string" ? cat.category : "";
              return (
                <article key={category} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
                  <p className="font-medium capitalize text-gray-900">{category}</p>
                  {typeof cat.description === "string" && (
                    <p className="mt-1 text-xs text-gray-600">{cat.description}</p>
                  )}
                  {Array.isArray(cat.examples) && cat.examples.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {cat.examples.map((ex) => (
                        <span key={ex} className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-gray-600">
                          {ex}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {dashboard.least_privilege_note && (
        <section className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-4 text-sm text-emerald-900">
          <h3 className="text-sm font-semibold">{labels.leastPrivilege}</h3>
          <p className="mt-2">{dashboard.least_privilege_note}</p>
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.activeUsers}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.active_users ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.pendingInvitations}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.pending_invitations ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.pendingApprovals}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.pending_approvals ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.suspendedUsers}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.suspended_users ?? 0}</p>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.accessReviews}</h3>
        <p className="mt-1 text-xs text-gray-600">{labels.accessReviewsNote}</p>
        {(dashboard.access_reviews?.pending_count ?? 0) > 0 && (
          <p className="mt-2 text-sm text-amber-800">
            {labels.pendingAccessReviews}: {dashboard.access_reviews?.pending_count}
          </p>
        )}
        <div className="mt-3 space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(accessReviewSettings.scheduled_reviews_enabled)}
              disabled={savingAccessReview}
              onChange={(e) => void saveAccessReviewToggle("scheduled_reviews_enabled", e.target.checked)}
            />
            {labels.scheduledReviews}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(accessReviewSettings.privileged_accounts_only)}
              disabled={savingAccessReview}
              onChange={(e) => void saveAccessReviewToggle("privileged_accounts_only", e.target.checked)}
            />
            {labels.privilegedAccountsOnly}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(accessReviewSettings.notify_owners)}
              disabled={savingAccessReview}
              onChange={(e) => void saveAccessReviewToggle("notify_owners", e.target.checked)}
            />
            {labels.notifyOwners}
          </label>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.companionPermissionPrefs}</h3>
        <p className="mt-1 text-xs text-gray-600">{labels.companionPermissionPrefsNote}</p>
        {typeof dashboard.self_love_connection?.note === "string" && (
          <p className="mt-2 text-xs text-amber-700">{dashboard.self_love_connection.note as string}</p>
        )}
        <div className="mt-3 space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(companionPrefs.companion_view_default)}
              disabled={savingCompanionPrefs}
              onChange={(e) => void saveCompanionPrefToggle("companion_view_default", e.target.checked)}
            />
            {labels.companionViewDefault}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(companionPrefs.companion_manage_restricted)}
              disabled={savingCompanionPrefs}
              onChange={(e) => void saveCompanionPrefToggle("companion_manage_restricted", e.target.checked)}
            />
            {labels.companionManageRestricted}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(companionPrefs.self_love_boundary_respected)}
              disabled={savingCompanionPrefs}
              onChange={(e) => void saveCompanionPrefToggle("self_love_boundary_respected", e.target.checked)}
            />
            {labels.selfLoveBoundary}
          </label>
        </div>
      </section>

      {Array.isArray(dashboard.audit_requirements) && dashboard.audit_requirements.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.auditRequirements}</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            {dashboard.audit_requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {blueprintLinks.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.blueprintLinks}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {blueprintLinks.map((link) => (
              <Link
                key={link.route}
                href={typeof link.route === "string" ? link.route : "#"}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {dashboard.role_distribution.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.roleDistribution}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {dashboard.role_distribution.map((r) => (
              <span
                key={r.role}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-800"
              >
                {r.role.replace(/_/g, " ")} · {r.count}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.approval_requests.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.approvalQueue}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.approval_requests.map((r) => (
              <li key={r.id} className="rounded-lg border border-amber-100 bg-amber-50/30 px-3 py-2 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium capitalize text-amber-900">
                    {r.action_type?.replace(/_/g, " ")}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs uppercase ${badgeClass(r.risk_level)}`}>
                    {r.risk_level}
                  </span>
                </div>
                {r.status === "pending" && dashboard.can_approve_medium ? (
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      disabled={actionId === r.id}
                      onClick={() => void resolveApproval(r.id, "approve")}
                      className="rounded border border-emerald-200 bg-white px-2 py-1 text-xs text-emerald-800"
                    >
                      {labels.approve}
                    </button>
                    <button
                      type="button"
                      disabled={actionId === r.id}
                      onClick={() => void resolveApproval(r.id, "reject")}
                      className="rounded border border-rose-200 bg-white px-2 py-1 text-xs text-rose-800"
                    >
                      {labels.reject}
                    </button>
                  </div>
                ) : (
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(r.status)}`}>
                    {r.status}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.ai_risk_classification.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.aiRiskClassification}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {dashboard.ai_risk_classification.map((r) => (
              <article key={r.level} className="rounded-lg border border-violet-100 bg-violet-50/30 p-3 text-sm">
                <span className={`rounded-full px-2 py-0.5 text-xs uppercase ${badgeClass(r.level)}`}>
                  {r.level}
                </span>
                <p className="mt-2 text-xs text-violet-800">
                  {r.auto_execute ? labels.autoAllowed : labels.approvalRequired}
                </p>
                <ul className="mt-2 list-disc pl-4 text-xs text-violet-700">
                  {r.examples.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.user_permissions.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.yourPermissions}</h2>
          <div className="mt-2 flex flex-wrap gap-1">
            {dashboard.user_permissions.map((p) => (
              <span key={p} className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-700">
                {p}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.mfa_readiness.length > 0 ? (
        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-gray-900">{labels.mfaReadiness}</h2>
            <a
              href="/app/settings/two-factor"
              className="text-xs font-medium text-violet-600 hover:text-violet-700"
            >
              {labels.twoFactorSetup}
            </a>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {dashboard.mfa_readiness.map((m) => (
              <span
                key={m.method}
                className={`rounded-full px-3 py-1 text-xs capitalize ${badgeClass(m.status)}`}
              >
                {m.method.replace(/_/g, " ")} · {m.status}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.recent_access_events.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentAccessEvents}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.recent_access_events.map((e) => (
              <li key={e.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                <span className="font-medium capitalize">{e.action_type?.replace(/_/g, " ")}</span>
                {e.actor_role ? (
                  <span className="ml-2 text-xs text-gray-500 capitalize">({e.actor_role.replace(/_/g, " ")})</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
