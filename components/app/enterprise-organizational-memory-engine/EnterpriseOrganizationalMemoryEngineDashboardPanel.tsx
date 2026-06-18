"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { formatExecutiveMetric, formatOverviewMetric } from "@/lib/ui/overview-metrics";
import {
  parseOrganizationalMemoryCenter,
  type OrganizationalMemoryCenter,
} from "@/lib/aipify/enterprise-organizational-memory-engine";

type Props = { labels: Record<string, string> };

export function EnterpriseOrganizationalMemoryEngineDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<OrganizationalMemoryCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const [decisionTitle, setDecisionTitle] = useState("");
  const [assetTitle, setAssetTitle] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/enterprise-organizational-memory-engine/dashboard");
    if (res.ok) {
      setCenter(parseOrganizationalMemoryCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (action: string, extra?: Record<string, unknown>) => {
    setActing(true);
    setActionError(null);
    const res = await fetch("/api/aipify/enterprise-organizational-memory-engine/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      setDecisionTitle("");
      setAssetTitle("");
      await load();
    }
    setActing(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader label={labels.loading} centered />
      </div>
    );
  }

  if (!center?.found || !center.has_access) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-medium">{labels.accessRequiredTitle}</p>
        <p className="mt-2 text-sm">{center?.error ?? labels.accessRequiredBody}</p>
      </div>
    );
  }

  const overview = center.overview ?? {};
  const ops = center.operations ?? {};

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricAssets, formatOverviewMetric(overview.knowledge_assets)],
            [labels.metricDocuments, formatOverviewMetric(overview.documents)],
            [labels.metricDecisions, formatOverviewMetric(overview.decisions_captured)],
            [labels.metricProcesses, formatOverviewMetric(overview.processes_captured)],
            [labels.metricCoverage, `${formatOverviewMetric(overview.knowledge_coverage)}%`],
            [labels.metricHealth, formatOverviewMetric(overview.memory_health_score)],
            [labels.metricGrowth, formatOverviewMetric(overview.knowledge_growth)],
            [labels.metricSources, formatOverviewMetric(overview.active_sources)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white bg-white/90 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.operationsTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            [labels.openSources, ops.sources_route],
            [labels.openOrganizational, ops.organizational_route],
            [labels.openDecisions, ops.decisions_route],
            [labels.openOperational, ops.operational_route],
            [labels.openCollective, ops.collective_route],
            [labels.openAnalytics, ops.analytics_route],
            [labels.openGovernance, ops.governance_route],
            [labels.openKnowledgeCenter, ops.knowledge_center_route],
            [labels.openLearning, ops.learning_route],
          ].map(([label, href]) =>
            href ? (
              <Link
                key={String(label)}
                href={href}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400"
              >
                {label}
              </Link>
            ) : null
          )}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sourcesTitle}</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {(center.knowledge_sources ?? []).map((source) => (
            <li key={source.id} className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
              <p className="font-medium text-gray-900">{source.source_name}</p>
              <p className="text-gray-600">{source.source_type}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.assetsTitle}</h2>
        {(center.knowledge_assets ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noAssets}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(center.knowledge_assets ?? []).slice(0, 8).map((asset) => (
              <li key={asset.id} className="flex justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <span className="font-medium text-gray-900">{asset.asset_title}</span>
                <span className="text-gray-600">
                  {asset.asset_type} · {asset.validation_status}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder={labels.assetTitlePlaceholder}
            value={assetTitle}
            onChange={(e) => setAssetTitle(e.target.value)}
          />
          <button
            type="button"
            disabled={acting || !assetTitle.trim()}
            onClick={() =>
              void runAction("add_knowledge_asset", {
                asset_title: assetTitle.trim(),
                asset_type: "operational",
              })
            }
            className="rounded-lg bg-teal-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {acting ? labels.acting : labels.addAsset}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("validate_knowledge", { asset_key: "POL-ONBOARD" })}
            className="rounded-lg border border-teal-200 px-4 py-2 text-sm font-medium text-teal-900 disabled:opacity-50"
          >
            {labels.validateKnowledge}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.decisionsTitle}</h2>
        {(center.decisions ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noDecisions}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(center.decisions ?? []).slice(0, 6).map((decision) => (
              <li key={decision.id} className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <p className="font-medium text-gray-900">{decision.decision_title}</p>
                <p className="text-gray-600">
                  {decision.decision_owner} · {decision.decision_status}
                </p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder={labels.decisionTitlePlaceholder}
            value={decisionTitle}
            onChange={(e) => setDecisionTitle(e.target.value)}
          />
          <button
            type="button"
            disabled={acting || !decisionTitle.trim()}
            onClick={() =>
              void runAction("record_decision", {
                decision_title: decisionTitle.trim(),
                decision_status: "proposed",
              })
            }
            className="rounded-lg bg-teal-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {acting ? labels.acting : labels.recordDecision}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.retentionTitle}</h2>
        <ul className="mt-4 space-y-2">
          {(center.retention_items ?? []).map((item) => (
            <li key={item.id} className="rounded-lg bg-gray-50 px-4 py-3 text-sm">
              <p className="font-medium text-gray-900">{item.retention_title}</p>
              <p className="text-gray-600">
                {item.gap_type} · {item.priority}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
        <div className="mt-4 space-y-4">
          {(center.advisor_signals ?? []).map((sig) => (
            <article key={sig.id} className="rounded-lg bg-gray-50 p-4">
              <p className="font-medium text-gray-900">{sig.observation}</p>
              {sig.recommendation ? (
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {labels.recommendation}: {sig.recommendation}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-500">{center.abos_principle}</p>
    </div>
  );
}
