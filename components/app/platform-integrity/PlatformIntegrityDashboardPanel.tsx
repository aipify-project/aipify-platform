"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parsePlatformIntegrityDashboard,
  type PlatformIntegrityDashboard,
  type IntegrityFinding,
  type IntegrityAction,
} from "@/lib/aipify/platform-integrity";

type PlatformIntegrityDashboardPanelProps = {
  labels: Record<string, string>;
};

function bandClass(band?: string) {
  switch (band) {
    case "exceptional":
      return "text-emerald-700";
    case "strong":
      return "text-teal-700";
    case "improvements_recommended":
      return "text-amber-700";
    case "concerns_identified":
      return "text-orange-700";
    case "critical_review_required":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
}

function severityClass(severity?: string) {
  switch (severity) {
    case "healthy":
      return "bg-emerald-100 text-emerald-800";
    case "monitor":
      return "bg-blue-100 text-blue-800";
    case "attention_required":
      return "bg-amber-100 text-amber-800";
    case "critical_review_required":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function FindingCard({
  finding,
  labels,
  acting,
  onAcknowledge,
}: {
  finding: IntegrityFinding;
  labels: Record<string, string>;
  acting: string | null;
  onAcknowledge: (id: string) => void;
}) {
  const actions = Array.isArray(finding.recommended_actions)
    ? (finding.recommended_actions as string[])
    : [];

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${severityClass(finding.severity)}`}>
          {finding.severity?.replace(/_/g, " ")}
        </span>
        <span className="text-xs capitalize text-gray-500">{finding.domain?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-2 font-medium text-gray-900">{finding.summary}</p>
      {finding.potential_impact ? (
        <p className="mt-1 text-sm text-gray-600">
          <span className="font-medium">{labels.potentialImpact}: </span>
          {finding.potential_impact}
        </p>
      ) : null}
      {actions.length > 0 ? (
        <ul className="mt-2 list-inside list-disc text-xs text-violet-700">
          {actions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      ) : null}
      {finding.governance_requirements ? (
        <p className="mt-2 text-xs text-amber-700">
          {labels.governance}: {finding.governance_requirements}
        </p>
      ) : null}
      {finding.status === "open" ? (
        <button
          type="button"
          disabled={acting === finding.id}
          onClick={() => onAcknowledge(finding.id)}
          className="mt-3 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {labels.acknowledge}
        </button>
      ) : null}
    </article>
  );
}

export function PlatformIntegrityDashboardPanel({ labels }: PlatformIntegrityDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<PlatformIntegrityDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/platform-integrity/dashboard");
    if (res.ok) setDashboard(parsePlatformIntegrityDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/platform-integrity/briefings/generate", { method: "POST" });
    await load();
  };

  const acknowledgeFinding = async (id: string) => {
    setActing(id);
    await fetch(`/api/aipify/platform-integrity/findings/${id}/acknowledge`, { method: "POST" });
    setActing(null);
    await load();
  };

  const completeAction = async (id: string) => {
    setActing(id);
    await fetch(`/api/aipify/platform-integrity/actions/${id}/complete`, { method: "POST" });
    setActing(null);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold text-indigo-900">{labels.integrityScore}</h2>
        <p className={`mt-2 text-4xl font-bold ${bandClass(dashboard.integrity_band)}`}>
          {dashboard.integrity_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className={`mt-1 text-sm font-medium ${bandClass(dashboard.integrity_band)}`}>
          {dashboard.integrity_band_label}
        </p>
        <p className="mt-2 text-sm text-indigo-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-indigo-700">{dashboard.safety_note}</p>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {labels.generateBriefing}
        </button>
      </section>

      {dashboard.score_components ? (
        <section className="rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.scoreComponents}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(dashboard.score_components).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs capitalize text-gray-500">{key.replace(/_/g, " ")}</p>
                <p className="text-lg font-semibold text-gray-900">{Math.round(value)}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.findings}</h2>
        {dashboard.findings.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noFindings}</p>
        ) : (
          <div className="mt-3 space-y-3">
            {dashboard.findings.map((f) => (
              <FindingCard
                key={f.id}
                finding={f}
                labels={labels}
                acting={acting}
                onAcknowledge={acknowledgeFinding}
              />
            ))}
          </div>
        )}
      </section>

      {dashboard.actions.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recommendedActions}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.actions.map((a: IntegrityAction) => (
              <li key={a.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <p className="text-gray-900">{a.action_description}</p>
                {a.requires_governance ? (
                  <p className="mt-1 text-xs text-amber-700">{labels.requiresGovernance}</p>
                ) : null}
                {a.status === "pending" ? (
                  <button
                    type="button"
                    disabled={acting === a.id}
                    onClick={() => completeAction(a.id)}
                    className="mt-2 rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {labels.completeAction}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.deprecated_assets.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.deprecatedAssets}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.deprecated_assets.map((d) => (
              <li key={d.id} className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm">
                <span className="font-medium capitalize text-amber-900">{d.asset_type}: </span>
                {d.asset_title}
                <p className="mt-1 text-xs text-amber-800">{d.reason}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.briefings.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.briefings}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.briefings.map((b) => (
              <li key={b.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
                {b.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.review_domains && dashboard.review_domains.length > 0 ? (
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.reviewDomains}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {dashboard.review_domains.map((d) => (
              <span key={d.key} className="rounded-full bg-white px-3 py-1 text-xs text-gray-700 shadow-sm">
                {d.label}
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
