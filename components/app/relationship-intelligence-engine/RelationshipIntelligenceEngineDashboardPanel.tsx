"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseRelationshipIntelligenceEngineDashboard,
  type RelationshipInsight,
  type RelationshipIntelligenceEngineDashboard,
  type RelationshipProfile,
} from "@/lib/aipify/relationship-intelligence-engine";

type Props = { labels: Record<string, string> };

export function RelationshipIntelligenceEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<RelationshipIntelligenceEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/relationship-intelligence-engine/dashboard");
    if (res.ok) {
      setDashboard(parseRelationshipIntelligenceEngineDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const resolveInsight = async (insightId: string, status: string) => {
    setResolvingId(insightId);
    setActionError(null);
    const res = await fetch("/api/aipify/relationship-intelligence-engine/insights", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ insight_id: insightId, status }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setResolvingId(null);
  };

  const exportManifest = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/relationship-intelligence-engine/export", {
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
  const profiles = dashboard.profiles ?? [];
  const insights = dashboard.sample_insights ?? [];
  const categories = dashboard.relationship_categories ?? [];
  const boundaries = dashboard.ethical_boundaries ?? [];
  const links = dashboard.integration_links ?? {};

  const openInsights = insights.filter((i: RelationshipInsight) => i.status === "open");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {links.personal_rsi && (
          <Link href="/app/assistant/relationships" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.personalRsi}
          </Link>
        )}
        {links.support_ai && (
          <Link href="/app/support-ai-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.supportAi}
          </Link>
        )}
        {links.partner_success && (
          <Link href="/app/partner-success-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
            {labels.partnerSuccess}
          </Link>
        )}
      </div>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.mission && <p className="mt-2 text-sm text-gray-700">{dashboard.mission}</p>}
        <p className="mt-2 text-xs text-indigo-700">{labels.distinctionNote}</p>
        {dashboard.self_love_note && (
          <p className="mt-2 text-xs text-indigo-600">{dashboard.self_love_note}</p>
        )}
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportManifest()}
        >
          {exporting ? labels.exporting : labels.exportManifest}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.totalProfiles}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.total_profiles ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.openInsights}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.open_insights ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.atRiskProfiles}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.at_risk_profiles ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.recentInteractions}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.recent_interactions ?? 0)}</p>
        </div>
      </div>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.categories}</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {categories.map((cat) => (
            <div key={String(cat.key)} className="rounded border border-gray-100 bg-gray-50 p-3">
              <p className="text-sm font-medium">{String(cat.label ?? cat.key)}</p>
              <p className="mt-1 text-xs text-gray-600">{String(cat.description ?? "")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.ethicalBoundaries}</h3>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-700">
          {boundaries.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.profiles}</h3>
        {profiles.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noProfiles}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {profiles.map((p: RelationshipProfile) => (
              <li key={String(p.id)} className="rounded border border-gray-100 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{String(p.display_name)}</span>
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs capitalize">{String(p.category)}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {labels.strength}: {String(p.relationship_strength)} · {labels.frequency}: {String(p.interaction_frequency)} · {labels.sentiment}: {String(p.sentiment_hint)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.insights}</h3>
        {openInsights.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noInsights}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {openInsights.map((ins: RelationshipInsight) => (
              <li key={String(ins.id)} className="rounded border border-gray-100 p-3 text-sm">
                <p>{String(ins.summary)}</p>
                {ins.recommended_action && (
                  <p className="mt-1 text-xs text-gray-600">{labels.recommendedAction}: {String(ins.recommended_action)}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded border border-indigo-200 px-2 py-0.5 text-xs disabled:opacity-50"
                    disabled={resolvingId === ins.id}
                    onClick={() => void resolveInsight(String(ins.id), "resolved")}
                  >
                    {labels.resolve}
                  </button>
                  <button
                    type="button"
                    className="rounded border border-gray-200 px-2 py-0.5 text-xs disabled:opacity-50"
                    disabled={resolvingId === ins.id}
                    onClick={() => void resolveInsight(String(ins.id), "dismissed")}
                  >
                    {labels.dismiss}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {dashboard.abos_principle && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.abosPrinciple}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.abos_principle}</p>
        </section>
      )}
    </div>
  );
}
