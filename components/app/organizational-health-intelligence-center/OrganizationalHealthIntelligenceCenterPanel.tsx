"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseOrganizationalHealthIntelligenceAction,
  parseOrganizationalHealthIntelligenceCenter,
  type CompanionIntervention,
  type EarlyWarningSignal,
  type ExecutiveWarningItem,
  type HealthCategoryScore,
  type HealthSectionItem,
  type OrganizationalHealthIntelligenceCenter,
  type PredictiveRiskItem,
  type ProjectHealthItem,
} from "@/lib/organizational-health-intelligence-center";
import type { OrganizationalHealthIntelligenceCenterLabels } from "@/lib/organizational-health-intelligence-center/labels";
import { getCategoryLabel } from "@/lib/organizational-health-intelligence-center/labels";
import { HealthIntelligenceStatusBadge } from "./HealthIntelligenceStatusBadge";

type Props = { labels: OrganizationalHealthIntelligenceCenterLabels };

function SectionBlock({ title, items, labels }: { title: string; items: HealthSectionItem[]; labels: OrganizationalHealthIntelligenceCenterLabels }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        <span className="text-sm text-zinc-500">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">{labels.emptyState}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-zinc-900">{item.title}</p>
                  <p className="mt-1 text-sm text-zinc-600">{item.summary}</p>
                  {item.detailLabel ? <p className="mt-2 text-xs text-zinc-500">{labels.detailLabel}: {item.detailLabel}</p> : null}
                  {item.trendWindow ? (
                    <p className="mt-1 text-xs text-indigo-700">
                      {labels.trends.window}: {labels.trends.windows[item.trendWindow as keyof typeof labels.trends.windows] ?? item.trendWindow}
                      {item.trendDirection ? ` · ${labels.trends.direction}: ${
                        item.trendDirection === "improvement" ? labels.trends.improvement
                          : item.trendDirection === "decline" ? labels.trends.decline
                            : labels.trends.stability
                      }` : ""}
                    </p>
                  ) : null}
                </div>
                <HealthIntelligenceStatusBadge statusKey={item.statusKey} labels={labels.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function WarningTierLabel({ tier, labels }: { tier: string; labels: OrganizationalHealthIntelligenceCenterLabels }) {
  if (tier === "critical") return <span className="text-xs font-medium uppercase text-red-700">{labels.executiveWarnings.critical}</span>;
  if (tier === "opportunity") return <span className="text-xs font-medium uppercase text-emerald-700">{labels.executiveWarnings.opportunity}</span>;
  return <span className="text-xs font-medium uppercase text-amber-700">{labels.executiveWarnings.emerging}</span>;
}

export function OrganizationalHealthIntelligenceCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<OrganizationalHealthIntelligenceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/intelligence/health");
    if (res.ok) setCenter(parseOrganizationalHealthIntelligenceCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleAction = async (itemType: string, id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/intelligence/health", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action }),
    });
    if (parseOrganizationalHealthIntelligenceAction(await res.json()).ok) await load();
    setBusy(false);
  };

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.title}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.accessDenied}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-600">{labels.philosophy}</p>
          {center.governanceNote ? <p className="mt-2 text-sm font-medium text-indigo-900">{center.governanceNote}</p> : null}
          {center.privacyNote ? <p className="mt-2 text-xs text-zinc-500">{center.privacyNote}</p> : null}
        </div>
        <button type="button" disabled={busy} onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.refresh}</button>
      </div>

      <section className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">{labels.organizationScore}</h2>
            <p className="mt-1 text-3xl font-bold text-indigo-900">{center.organizationHealthScore.scoreValue}</p>
          </div>
          <HealthIntelligenceStatusBadge
            statusKey={center.organizationHealthScore.statusKey}
            labels={labels.status}
            healthLevel={center.organizationHealthScore.healthLevel}
            healthLevelLabels={labels.healthLevel}
          />
        </div>
        {center.healthScores.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {center.healthScores.map((score: HealthCategoryScore) => (
              <div key={score.categoryKey} className="rounded-xl border border-indigo-100 bg-white p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-zinc-900">{getCategoryLabel(score.categoryKey, labels.healthScores.categories)}</p>
                  <span className="text-sm font-semibold text-indigo-800">{score.scoreValue}</span>
                </div>
                <div className="mt-2">
                  <HealthIntelligenceStatusBadge statusKey={score.statusKey} labels={labels.status} healthLevel={score.healthLevel} healthLevelLabels={labels.healthLevel} />
                </div>
                {score.contributingFactors ? (
                  <p className="mt-2 text-xs text-zinc-500">{labels.healthScores.contributingFactors}: {score.contributingFactors}</p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {center.earlyWarningSignals.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.earlyWarning.title}</h2>
          <ul className="space-y-3">
            {center.earlyWarningSignals.map((sig: EarlyWarningSignal) => (
              <li key={sig.id} className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-zinc-900">{sig.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{sig.summary}</p>
                    {sig.trendPctLabel ? <p className="mt-1 text-xs text-amber-800">{sig.trendPctLabel}</p> : null}
                  </div>
                  <HealthIntelligenceStatusBadge statusKey={sig.statusKey} labels={labels.status} />
                </div>
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("signal", sig.id, "resolve")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50">{labels.actions.resolve}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("signal", sig.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.actions.dismiss}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.executiveWarnings.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.executiveWarnings.title}</h2>
          <ul className="space-y-3">
            {center.executiveWarnings.map((w: ExecutiveWarningItem) => (
              <li key={w.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <WarningTierLabel tier={w.warningTier} labels={labels} />
                    <p className="mt-1 font-medium text-zinc-900">{w.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{w.summary}</p>
                    <p className="mt-1 text-xs text-zinc-500">{labels.executiveWarnings.impact}: {w.impactLevel}</p>
                  </div>
                  <HealthIntelligenceStatusBadge statusKey={w.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.companionInterventions.length > 0 ? (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-5 space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.interventions.title}</h2>
          {center.companionInterventions.map((item: CompanionIntervention) => (
            <div key={item.id} className="rounded-xl border border-indigo-100 bg-white p-4">
              <p className="font-medium text-indigo-900">{item.recommendation}</p>
              <p className="mt-2 text-sm text-zinc-700">{labels.interventions.reason}: {item.reason}</p>
              {center.canManage ? (
                <div className="mt-3 flex gap-2">
                  <button type="button" disabled={busy} onClick={() => void handleAction("intervention", item.id, "acknowledge")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50">{labels.actions.acknowledge}</button>
                  <button type="button" disabled={busy} onClick={() => void handleAction("intervention", item.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.actions.dismiss}</button>
                </div>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {center.predictiveRisks.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.predictiveRisks.title}</h2>
          <ul className="space-y-3">
            {center.predictiveRisks.map((risk: PredictiveRiskItem) => (
              <li key={risk.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-zinc-900">{risk.riskLabel}</p>
                    <p className="mt-1 text-sm text-zinc-600">{risk.summary}</p>
                    <p className="mt-2 text-xs text-zinc-500">
                      {labels.predictiveRisks.probability}: {risk.probability} · {labels.predictiveRisks.impact}: {risk.impact} · {labels.predictiveRisks.urgency}: {risk.urgency}
                    </p>
                    {risk.contributingFactors ? (
                      <p className="mt-1 text-xs text-zinc-500">{labels.predictiveRisks.contributingFactors}: {risk.contributingFactors}</p>
                    ) : null}
                  </div>
                  <HealthIntelligenceStatusBadge statusKey={risk.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.projectHealth.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.projectHealth.title}</h2>
          <ul className="space-y-3">
            {center.projectHealth.map((project: ProjectHealthItem) => (
              <li key={project.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-zinc-900">{project.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{project.summary}</p>
                    <dl className="mt-2 grid gap-1 text-xs text-zinc-500 sm:grid-cols-2">
                      <div><dt className="inline font-medium">{labels.projectHealth.projectStatus}: </dt><dd className="inline">{project.projectStatus}</dd></div>
                      <div><dt className="inline font-medium">{labels.projectHealth.timelineHealth}: </dt><dd className="inline">{project.timelineHealth}</dd></div>
                      <div><dt className="inline font-medium">{labels.projectHealth.dependencyHealth}: </dt><dd className="inline">{project.dependencyHealth}</dd></div>
                      <div><dt className="inline font-medium">{labels.projectHealth.resourceHealth}: </dt><dd className="inline">{project.resourceHealth}</dd></div>
                    </dl>
                  </div>
                  <HealthIntelligenceStatusBadge statusKey={project.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <SectionBlock title={labels.sections.healthOverview} items={center.sections.healthOverview} labels={labels} />
      <SectionBlock title={labels.sections.riskSignals} items={center.sections.riskSignals} labels={labels} />
      <SectionBlock title={labels.sections.performanceTrends} items={center.sections.performanceTrends} labels={labels} />
      <SectionBlock title={labels.sections.teamHealth} items={center.sections.teamHealth} labels={labels} />
      <SectionBlock title={labels.sections.customerHealth} items={center.sections.customerHealth} labels={labels} />
      <SectionBlock title={labels.sections.operationalHealth} items={center.sections.operationalHealth} labels={labels} />
      <SectionBlock title={labels.sections.financialHealth} items={center.sections.financialHealth} labels={labels} />

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/app/organizational-health-engine" className="text-indigo-700 hover:text-indigo-800">{labels.links.legacyEngine}</Link>
        <Link href="/app/executive/organizational-health" className="text-indigo-700 hover:text-indigo-800">{labels.links.executiveHealth}</Link>
      </div>
    </div>
  );
}
