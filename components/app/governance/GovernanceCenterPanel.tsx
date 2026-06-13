"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseGovernanceCenter, type GovernanceCenter } from "@/lib/aipify/governance";

type GovernanceCenterPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    privacy: string;
    upgradeTitle: string;
    upgradeBody: string;
    upgradeCta: string;
    metrics: {
      pending: string;
      blocked: string;
      trust: string;
      audit: string;
    };
    sections: {
      approvals: string;
      audit: string;
      trust: string;
      permissions: string;
    };
    emergency: {
      active: string;
      stop: string;
      resume: string;
      reason: string;
    };
    approval: {
      approve: string;
      reject: string;
      approveAlways: string;
      pauseCategory: string;
    };
    riskLevels: Record<string, string>;
    permissionLevels: Record<string, string>;
    emptyApprovals: string;
    emptyAudit: string;
    emptyTrust: string;
    links: {
      audit: string;
      trust: string;
      settings: string;
      approvalProfiles: string;
      financialGuardrails: string;
    };
  };
};

const RISK_STYLES: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-900",
  high: "bg-orange-100 text-orange-900",
  blocked: "bg-rose-100 text-rose-900",
};

export function GovernanceCenterPanel({ labels }: GovernanceCenterPanelProps) {
  const [center, setCenter] = useState<GovernanceCenter | null>(null);
  const [permissions, setPermissions] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [centerRes, permRes] = await Promise.all([
      fetch("/api/aipify/governance"),
      fetch("/api/aipify/governance/permissions"),
    ]);
    if (centerRes.ok) setCenter(parseGovernanceCenter(await centerRes.json()));
    if (permRes.ok) {
      const data = await permRes.json();
      setPermissions(Array.isArray(data.permissions) ? data.permissions : []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function resolveApproval(id: string, action: "approve" | "reject", resolution?: string) {
    setActingId(id);
    await fetch(`/api/aipify/governance/approvals/${id}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolution }),
    });
    await refresh();
    setActingId(null);
  }

  async function emergencyStop() {
    await fetch("/api/aipify/governance/emergency-stop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Manual governance emergency stop" }),
    });
    await refresh();
  }

  async function emergencyResume() {
    await fetch("/api/aipify/governance/emergency-resume", { method: "POST" });
    await refresh();
  }

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;

  if (!center?.has_customer) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <Link href="/app" className="text-sm text-indigo-600 hover:underline">{labels.back}</Link>
        <p className="text-sm text-gray-500">{labels.loading}</p>
      </div>
    );
  }

  if (center.upgrade_required || !center.has_access) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <Link href="/app" className="text-sm text-indigo-600 hover:underline">{labels.back}</Link>
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium">{labels.upgradeTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{labels.upgradeBody}</p>
          <Link href="/app/settings/billing" className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">
            {labels.upgradeCta}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/app" className="text-sm text-indigo-600 hover:underline">{labels.back}</Link>
          <h1 className="mt-2 text-2xl font-semibold">{labels.title}</h1>
          <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
          <p className="mt-2 text-xs text-gray-500">{labels.privacy}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/app/governance/audit" className="rounded-lg border px-3 py-1.5 text-sm">{labels.links.audit}</Link>
          <Link href="/app/governance/trust" className="rounded-lg border px-3 py-1.5 text-sm">{labels.links.trust}</Link>
          <Link href="/app/governance/financial-guardrails" className="rounded-lg border px-3 py-1.5 text-sm">{labels.links.financialGuardrails}</Link>
          <Link href="/app/governance/approval-profiles" className="rounded-lg border px-3 py-1.5 text-sm">{labels.links.approvalProfiles}</Link>
          <Link href="/app/settings/governance" className="rounded-lg border px-3 py-1.5 text-sm">{labels.links.settings}</Link>
        </div>
      </div>

      {center.emergency.enabled ? (
        <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4">
          <p className="font-medium text-rose-900">{labels.emergency.active}</p>
          {center.emergency.reason ? (
            <p className="mt-1 text-sm text-rose-800">{labels.emergency.reason}: {center.emergency.reason}</p>
          ) : null}
          <button type="button" onClick={() => void emergencyResume()} className="mt-3 rounded-lg bg-rose-700 px-4 py-2 text-sm text-white">
            {labels.emergency.resume}
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => void emergencyStop()} className="rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50">
          {labels.emergency.stop}
        </button>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [labels.metrics.pending, center.metrics.pending_approvals],
          [labels.metrics.blocked, center.metrics.blocked_actions],
          [labels.metrics.trust, `${center.metrics.avg_trust_score}%`],
          [labels.metrics.audit, center.metrics.audit_events_24h],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">{labels.sections.approvals}</h2>
        {center.pending_approvals.length === 0 ? (
          <p className="text-sm text-gray-500">{labels.emptyApprovals}</p>
        ) : (
          <div className="space-y-3">
            {center.pending_approvals.map((item) => (
              <div key={item.id} className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-1 text-sm text-gray-600">{item.summary}</p>
                    {item.explanation ? <p className="mt-2 text-xs text-gray-500">{item.explanation}</p> : null}
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${RISK_STYLES[item.risk_level] ?? "bg-gray-100"}`}>
                    {labels.riskLevels[item.risk_level] ?? item.risk_level}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" disabled={actingId === item.id || center.emergency.enabled}
                    onClick={() => void resolveApproval(item.id, "approve")}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white disabled:opacity-50">
                    {labels.approval.approve}
                  </button>
                  <button type="button" disabled={actingId === item.id}
                    onClick={() => void resolveApproval(item.id, "reject")}
                    className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50">
                    {labels.approval.reject}
                  </button>
                  <button type="button" disabled={actingId === item.id || center.emergency.enabled}
                    onClick={() => void resolveApproval(item.id, "approve", "always")}
                    className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50">
                    {labels.approval.approveAlways}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">{labels.sections.permissions}</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {permissions.map((perm) => (
            <div key={String(perm.id)} className="rounded-xl border bg-white px-3 py-2 text-sm">
              <span className="font-medium">{String(perm.action_key)}</span>
              <span className="ml-2 text-gray-500">
                {labels.permissionLevels[String(perm.permission_level)] ?? String(perm.permission_level)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">{labels.sections.trust}</h2>
        {center.trust_scores.length === 0 ? (
          <p className="text-sm text-gray-500">{labels.emptyTrust}</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {center.trust_scores.map((score) => (
              <div key={score.id} className="rounded-xl border bg-white p-3">
                <p className="font-medium">{score.action_key}</p>
                <p className="text-2xl font-semibold text-indigo-700">{score.trust_score}%</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">{labels.sections.audit}</h2>
        {center.recent_audit.length === 0 ? (
          <p className="text-sm text-gray-500">{labels.emptyAudit}</p>
        ) : (
          <div className="space-y-2">
            {center.recent_audit.slice(0, 8).map((entry) => (
              <div key={entry.id} className="rounded-xl border bg-white px-3 py-2 text-sm">
                <span className="font-medium">{entry.action}</span>
                <span className="ml-2 text-gray-500">{entry.action_category}</span>
                <span className="ml-2 text-xs text-gray-400">{new Date(entry.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
