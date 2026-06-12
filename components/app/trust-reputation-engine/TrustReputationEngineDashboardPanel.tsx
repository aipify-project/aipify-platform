"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseTrustReputationEngineDashboard,
  type OrganizationTrustProfile,
  type TrustReputationEngineDashboard,
} from "@/lib/aipify/trust-reputation-engine";

type Props = { labels: Record<string, string> };

export function TrustReputationEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<TrustReputationEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/trust-reputation-engine/dashboard");
    if (res.ok) setDashboard(parseTrustReputationEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const profileAction = async (payload: Record<string, unknown>) => {
    setActionError(null);
    const res = await fetch("/api/aipify/trust-reputation-engine/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
      return false;
    }
    await load();
    return true;
  };

  const revokeTrust = async (profile: OrganizationTrustProfile) => {
    if (!profile.id) return;
    setBusyId(profile.id);
    await profileAction({ action: "revoke", profile_id: profile.id, reason: labels.revokeDefaultReason });
    setBusyId(null);
  };

  const approveExpansion = async (profile: OrganizationTrustProfile) => {
    if (!profile.id) return;
    setBusyId(profile.id);
    await profileAction({ action: "review_expansion", profile_id: profile.id, approved: true });
    setBusyId(null);
  };

  const rejectExpansion = async (profile: OrganizationTrustProfile) => {
    if (!profile.id) return;
    setBusyId(profile.id);
    await profileAction({ action: "review_expansion", profile_id: profile.id, approved: false });
    setBusyId(null);
  };

  const exportManifest = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/trust-reputation-engine/export", {
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

  const summary = dashboard.summary ?? dashboard.executive_summary ?? {};
  const sections = dashboard.sections ?? {};
  const trustProfiles = sections.trust_profiles ?? [];
  const trustTrends = sections.trust_trends ?? [];
  const trustedWorkflows = sections.trusted_workflows ?? [];
  const approvalQuality = sections.approval_quality ?? [];
  const reputationIndicators = sections.reputation_indicators ?? [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-emerald-700">{labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-emerald-300 px-3 py-1 text-xs text-emerald-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportManifest()}
        >
          {exporting ? labels.exporting : labels.exportManifest}
        </button>
      </div>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.summary}</h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><dt className="text-gray-500">{labels.activeProfiles}</dt><dd>{String(summary.active_profiles ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.trustedProfiles}</dt><dd>{String(summary.trusted_profiles ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.underReviewProfiles}</dt><dd>{String(summary.under_review_profiles ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.avgTrustScore}</dt><dd>{String(summary.avg_trust_score ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.recentSignals}</dt><dd>{String(summary.recent_signals ?? 0)}</dd></div>
          <div><dt className="text-gray-500">{labels.entityTypes}</dt><dd>{String(summary.entity_type_count ?? 0)}</dd></div>
        </dl>
      </section>

      {dashboard.principles && dashboard.principles.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {dashboard.principles.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </section>
      )}

      {trustTrends.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.trustTrends}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {trustTrends.map((t) => (
              <li key={String(t.entity_type)} className="rounded border border-emerald-100 bg-emerald-50/30 p-3">
                <div className="font-medium">{String(t.entity_type)}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {labels.avgScore}: {String(t.avg_score ?? 0)} · {labels.profileCount}: {String(t.profile_count ?? 0)} · {labels.trustedCount}: {String(t.trusted_count ?? 0)}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {trustedWorkflows.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.trustedWorkflows}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(trustedWorkflows as OrganizationTrustProfile[]).map((profile) => (
              <li key={profile.id} className="rounded border border-emerald-100 p-3">
                <div className="font-medium">{String(profile.metadata?.label ?? profile.entity_type)}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {profile.entity_type} · {labels.trustLevel}: {profile.trust_level} · {labels.trustScore}: {profile.trust_score}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {approvalQuality.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.approvalQuality}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {approvalQuality.map((item) => (
              <li key={String(item.signal_type)} className="rounded border border-gray-100 p-3">
                <div className="font-medium">{String(item.signal_type)}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {labels.avgValue}: {String(item.avg_value ?? 0)} · {labels.signalCount}: {String(item.signal_count ?? 0)}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {reputationIndicators.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.reputationIndicators}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {reputationIndicators.slice(0, 10).map((signal) => (
              <li key={signal.id} className="rounded border border-gray-100 p-2 text-xs text-gray-600">
                {signal.signal_type}: {signal.signal_value}
              </li>
            ))}
          </ul>
        </section>
      )}

      {trustProfiles.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.trustProfiles}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(trustProfiles as OrganizationTrustProfile[]).map((profile) => (
              <li key={profile.id} className="rounded border border-emerald-100 bg-emerald-50/30 p-3">
                <div className="font-medium">{String(profile.metadata?.label ?? profile.entity_type)}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {profile.entity_type} · {labels.trustLevel}: {profile.trust_level} · {labels.trustScore}: {profile.trust_score} · {labels.status}: {profile.status}
                </div>
                {profile.id && profile.status === "under_review" && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                      disabled={busyId === profile.id}
                      onClick={() => void approveExpansion(profile)}
                    >
                      {labels.approveExpansion}
                    </button>
                    <button
                      type="button"
                      className="rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                      disabled={busyId === profile.id}
                      onClick={() => void rejectExpansion(profile)}
                    >
                      {labels.rejectExpansion}
                    </button>
                  </div>
                )}
                {profile.id && profile.status === "active" && (
                  <button
                    type="button"
                    className="mt-2 rounded border px-2 py-0.5 text-xs disabled:opacity-50"
                    disabled={busyId === profile.id}
                    onClick={() => void revokeTrust(profile)}
                  >
                    {labels.revokeTrust}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.integration_summaries && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationSummaries}</h3>
          <pre className="mt-2 overflow-x-auto text-xs text-gray-600">
            {JSON.stringify(dashboard.integration_summaries, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
