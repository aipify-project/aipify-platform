"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatDateTime } from "@/lib/i18n/format-date";
import {
  PERMISSION_ACCESS_CORE_PRINCIPLE,
  PERMISSION_ACCESS_VISION,
  parsePermissionAccessGovernanceCenter,
  type PermissionAccessGovernanceCenter,
  type PermissionGrant,
  type PermissionRequest,
} from "@/lib/permission-access-governance";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  visionTitle: string;
  governanceLink: string;
  identityAccessLink: string;
  approvalCenterLink: string;
  dashboardTitle: string;
  activeTitle: string;
  pendingRequestsTitle: string;
  highImpactTitle: string;
  revokedTitle: string;
  companionTitle: string;
  historyTitle: string;
  recommendationsTitle: string;
  executiveTitle: string;
  emptyActive: string;
  emptyPending: string;
  emptyRecommendations: string;
  resource: string;
  permission: string;
  purpose: string;
  riskLevel: string;
  grantedBy: string;
  grantedOn: string;
  expires: string;
  whatCanDo: string;
  whatCannotDo: string;
  revokeInstructions: string;
  whyNeeded: string;
  revoke: string;
  downgrade: string;
  approve: string;
  deny: string;
  dismiss: string;
  categories: Record<string, string>;
  riskLevels: Record<string, string>;
  permissionLevels: Record<string, string>;
  expirationTypes: Record<string, string>;
  eventTypes: Record<string, string>;
  metrics: {
    active: string;
    recentGranted: string;
    highImpact: string;
    revoked: string;
    pendingRequests: string;
    companion: string;
    compliance: string;
    avgReview: string;
  };
  privacyNote: string;
};

type Props = { labels: PanelLabels; locale: string };

const RISK_STYLES: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-800",
  moderate: "bg-sky-100 text-sky-800",
  elevated: "bg-amber-100 text-amber-900",
  high: "bg-rose-100 text-rose-900",
};

export function PermissionAccessGovernancePanel({ labels, locale }: Props) {
  const [center, setCenter] = useState<PermissionAccessGovernanceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/permission-access-governance/center");
    if (res.ok) setCenter(parsePermissionAccessGovernanceCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    await fetch("/api/permission-access-governance/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  const dash = center?.dashboard;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.governance && (
          <Link href={center.links.governance} className="text-slate-600 hover:underline">
            {labels.governanceLink}
          </Link>
        )}
        {center?.links?.identity_access && (
          <Link href={center.links.identity_access} className="text-slate-600 hover:underline">
            {labels.identityAccessLink}
          </Link>
        )}
        {center?.links?.approval_center && (
          <Link href={center.links.approval_center} className="text-slate-600 hover:underline">
            {labels.approvalCenterLink}
          </Link>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
          {labels.corePrinciple}: {PERMISSION_ACCESS_CORE_PRINCIPLE}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {labels.visionTitle}: {PERMISSION_ACCESS_VISION}
        </p>
      </div>

      {dash && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.dashboardTitle}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={labels.metrics.active} value={dash.active_count} />
            <Metric label={labels.metrics.recentGranted} value={dash.recent_granted_count} />
            <Metric label={labels.metrics.highImpact} value={dash.high_impact_count} />
            <Metric label={labels.metrics.pendingRequests} value={dash.pending_requests_count} />
            <Metric label={labels.metrics.companion} value={dash.companion_active_count} />
            <Metric label={labels.metrics.revoked} value={dash.revoked_count} />
            <Metric label={labels.metrics.compliance} value={`${dash.governance_compliance_rate}%`} />
            <Metric label={labels.metrics.avgReview} value={`${dash.avg_review_days}d`} />
          </dl>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.pendingRequestsTitle}</h2>
        {center?.pending_requests.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyPending}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {center?.pending_requests.map((req) => (
              <PermissionRequestCard
                key={req.request_key}
                req={req}
                labels={labels}
                locale={locale}
                expanded={expandedKey === req.request_key}
                onToggle={() =>
                  setExpandedKey(expandedKey === req.request_key ? null : req.request_key)
                }
                canRecord={center?.can_record ?? false}
                onAction={postAction}
              />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.activeTitle}</h2>
        {center?.active_permissions.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.emptyActive}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {center?.active_permissions.map((grant) => (
              <PermissionGrantCard
                key={grant.grant_key}
                grant={grant}
                labels={labels}
                locale={locale}
                expanded={expandedKey === grant.grant_key}
                onToggle={() =>
                  setExpandedKey(expandedKey === grant.grant_key ? null : grant.grant_key)
                }
                canRecord={center?.can_record ?? false}
                onAction={postAction}
              />
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.highImpactTitle}</h2>
          <ul className="mt-4 space-y-2">
            {center?.high_impact.map((g) => (
              <li key={g.grant_key} className="rounded-xl border border-amber-100 bg-amber-50/50 p-3 text-sm">
                <p className="font-medium text-gray-900">{g.resource_name}</p>
                <p className="text-gray-600">{g.permission_label}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.companionTitle}</h2>
          <ul className="mt-4 space-y-2">
            {center?.companion_overview.map((g) => (
              <li key={g.grant_key} className="rounded-xl border border-gray-100 p-3 text-sm">
                <p className="font-medium text-gray-900">{g.resource_name}</p>
                <p className="text-gray-600">{g.permission_label}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.historyTitle}</h2>
          <ul className="mt-4 space-y-2">
            {center?.recent_history.map((item) => (
              <li key={item.history_key} className="rounded-xl border border-gray-100 p-3 text-sm">
                <p className="font-medium text-gray-900">{item.resource_name}</p>
                <p className="text-gray-600">
                  {labels.eventTypes[item.event_type] ?? item.event_type} · {item.actor_label}
                </p>
                {item.created_at && (
                  <p className="text-xs text-gray-500">{formatDateTime(item.created_at, locale)}</p>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.recommendationsTitle}</h2>
          {center?.recommendations.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">{labels.emptyRecommendations}</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {center?.recommendations.map((rec) => (
                <li key={rec.recommendation_key} className="rounded-xl border border-slate-100 p-3 text-sm">
                  <p className="text-gray-800">{rec.message}</p>
                  {center?.can_manage && (
                    <button
                      type="button"
                      className="mt-2 text-xs text-slate-600 hover:underline"
                      onClick={() =>
                        void postAction({
                          action: "dismiss_recommendation",
                          recommendation_key: rec.recommendation_key,
                        })
                      }
                    >
                      {labels.dismiss}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {center?.privacy_note && (
        <p className="text-xs text-gray-500">
          {labels.privacyNote}: {center.privacy_note}
        </p>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function PermissionGrantCard({
  grant,
  labels,
  locale,
  expanded,
  onToggle,
  canRecord,
  onAction,
}: {
  grant: PermissionGrant;
  labels: PanelLabels;
  locale: string;
  expanded: boolean;
  onToggle: () => void;
  canRecord: boolean;
  onAction: (payload: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <button type="button" onClick={onToggle} className="w-full text-left">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-gray-900">{grant.resource_name}</p>
            <p className="mt-1 text-sm text-gray-600">{grant.permission_label}</p>
            <p className="mt-1 text-xs text-gray-500">
              {labels.categories[grant.category] ?? grant.category} ·{" "}
              {labels.permissionLevels[String(grant.permission_level)] ?? `Level ${grant.permission_level}`}
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${RISK_STYLES[grant.risk_level] ?? RISK_STYLES.moderate}`}
          >
            {labels.riskLevels[grant.risk_level] ?? grant.risk_level}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4 text-sm">
          <p>
            <span className="font-medium text-gray-800">{labels.purpose}:</span> {grant.purpose}
          </p>
          {grant.what_aipify_can_do && (
            <p>
              <span className="font-medium text-gray-800">{labels.whatCanDo}:</span>{" "}
              {grant.what_aipify_can_do}
            </p>
          )}
          {grant.what_aipify_cannot_do && (
            <p>
              <span className="font-medium text-gray-800">{labels.whatCannotDo}:</span>{" "}
              {grant.what_aipify_cannot_do}
            </p>
          )}
          {grant.revoke_instructions && (
            <p>
              <span className="font-medium text-gray-800">{labels.revokeInstructions}:</span>{" "}
              {grant.revoke_instructions}
            </p>
          )}
          <p className="text-xs text-gray-500">
            {labels.grantedBy}: {grant.granted_by_label}
            {grant.granted_at && ` · ${labels.grantedOn}: ${formatDateTime(grant.granted_at, locale)}`}
            {grant.expires_at && ` · ${labels.expires}: ${formatDateTime(grant.expires_at, locale)}`}
          </p>
          {canRecord && grant.status === "active" && (
            <div className="flex flex-wrap gap-2 pt-2">
              <ActionBtn
                label={labels.revoke}
                onClick={() => onAction({ action: "revoke", grant_key: grant.grant_key })}
                variant="danger"
              />
              {grant.permission_level > 1 && (
                <ActionBtn
                  label={labels.downgrade}
                  onClick={() =>
                    onAction({
                      action: "downgrade",
                      grant_key: grant.grant_key,
                      permission_level: grant.permission_level - 1,
                    })
                  }
                  variant="muted"
                />
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function PermissionRequestCard({
  req,
  labels,
  locale,
  expanded,
  onToggle,
  canRecord,
  onAction,
}: {
  req: PermissionRequest;
  labels: PanelLabels;
  locale: string;
  expanded: boolean;
  onToggle: () => void;
  canRecord: boolean;
  onAction: (payload: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <article className="rounded-2xl border-2 border-indigo-100 bg-indigo-50/30 p-4 shadow-sm">
      <button type="button" onClick={onToggle} className="w-full text-left">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-gray-900">{req.resource_name}</p>
            <p className="mt-1 text-sm text-gray-600">{req.permission_label}</p>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${RISK_STYLES[req.risk_level] ?? RISK_STYLES.moderate}`}
          >
            {labels.riskLevels[req.risk_level] ?? req.risk_level}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="mt-4 space-y-3 border-t border-indigo-100 pt-4 text-sm">
          <p>
            <span className="font-medium text-gray-800">{labels.whyNeeded}:</span> {req.why_needed}
          </p>
          <p>
            <span className="font-medium text-gray-800">{labels.whatCanDo}:</span>{" "}
            {req.what_aipify_can_do}
          </p>
          <p>
            <span className="font-medium text-gray-800">{labels.whatCannotDo}:</span>{" "}
            {req.what_aipify_cannot_do}
          </p>
          <p>
            <span className="font-medium text-gray-800">{labels.revokeInstructions}:</span>{" "}
            {req.revoke_instructions}
          </p>
          {req.expires_at && (
            <p className="text-xs text-gray-500">
              {labels.expires}: {formatDateTime(req.expires_at, locale)} (
              {labels.expirationTypes[req.expiration_type] ?? req.expiration_type})
            </p>
          )}
          {canRecord && (
            <div className="flex flex-wrap gap-2 pt-2">
              <ActionBtn
                label={labels.approve}
                onClick={() => onAction({ action: "approve_request", request_key: req.request_key })}
              />
              <ActionBtn
                label={labels.deny}
                onClick={() => onAction({ action: "deny_request", request_key: req.request_key })}
                variant="muted"
              />
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function ActionBtn({
  label,
  onClick,
  variant = "primary",
}: {
  label: string;
  onClick: () => void | Promise<void>;
  variant?: "primary" | "muted" | "danger";
}) {
  const styles =
    variant === "danger"
      ? "border-rose-200 bg-rose-50 text-rose-900 hover:bg-rose-100"
      : variant === "muted"
        ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
        : "border-indigo-200 bg-indigo-600 text-white hover:bg-indigo-700";
  return (
    <button
      type="button"
      onClick={() => void onClick()}
      className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${styles}`}
    >
      {label}
    </button>
  );
}
