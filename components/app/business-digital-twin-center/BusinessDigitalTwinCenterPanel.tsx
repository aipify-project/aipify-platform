"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseBusinessDigitalTwinAction,
  parseBusinessDigitalTwinCenter,
  type BusinessDigitalTwinCenter,
  type CapacityItem,
  type CompanionInsight,
  type DependencyItem,
  type OperationalImpact,
  type ProcessMapItem,
  type ScenarioPlan,
  type TwinEntity,
  type WorkflowSimulation,
} from "@/lib/business-digital-twin-center";
import type { BusinessDigitalTwinCenterLabels } from "@/lib/business-digital-twin-center/labels";
import { getScenarioCaseLabel } from "@/lib/business-digital-twin-center/labels";
import { TwinStatusBadge } from "./TwinStatusBadge";

type Props = { labels: BusinessDigitalTwinCenterLabels };

function EntitySection({ title, items, labels }: { title: string; items: TwinEntity[]; labels: BusinessDigitalTwinCenterLabels }) {
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
                  {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
                  <dl className="mt-2 grid gap-1 text-xs text-zinc-500 sm:grid-cols-2">
                    <div><dt className="inline font-medium">{labels.entity.owner}: </dt><dd className="inline">{item.owner}</dd></div>
                    <div><dt className="inline font-medium">{labels.entity.criticality}: </dt><dd className="inline">{item.criticality}</dd></div>
                    {item.dependencies ? <div className="sm:col-span-2"><dt className="inline font-medium">{labels.entity.dependencies}: </dt><dd className="inline">{item.dependencies}</dd></div> : null}
                  </dl>
                </div>
                <TwinStatusBadge statusKey={item.statusKey} labels={labels.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function BusinessDigitalTwinCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<BusinessDigitalTwinCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/intelligence/digital-twin");
    if (res.ok) setCenter(parseBusinessDigitalTwinCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleAction = async (itemType: string, id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/intelligence/digital-twin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action }),
    });
    if (parseBusinessDigitalTwinAction(await res.json()).ok) await load();
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

  const scenariosByName = center.scenarioPlanning.reduce<Record<string, ScenarioPlan[]>>((acc, s) => {
    acc[s.scenarioName] = acc[s.scenarioName] ?? [];
    acc[s.scenarioName].push(s);
    return acc;
  }, {});

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

      <section className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5 space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.executiveDashboard.title}</h2>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div><dt className="font-medium text-zinc-700">{labels.executiveDashboard.organizationOverview}</dt><dd className="text-zinc-600">{center.executiveDashboard.organizationOverview}</dd></div>
          <div><dt className="font-medium text-zinc-700">{labels.executiveDashboard.operationalHealth}</dt><dd className="text-zinc-600">{center.executiveDashboard.operationalHealth}</dd></div>
          <div><dt className="font-medium text-zinc-700">{labels.executiveDashboard.dependencies}</dt><dd className="text-zinc-600">{center.executiveDashboard.dependencyCount}</dd></div>
          <div><dt className="font-medium text-zinc-700">{labels.executiveDashboard.simulations}</dt><dd className="text-zinc-600">{center.executiveDashboard.simulationCount}</dd></div>
          <div><dt className="font-medium text-zinc-700">{labels.executiveDashboard.strategicRisks}</dt><dd className="text-zinc-600">{center.executiveDashboard.strategicRiskCount}</dd></div>
        </dl>
      </section>

      {center.companionInsights.length > 0 ? (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-5 space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.companionInsights.title}</h2>
          {center.companionInsights.map((item: CompanionInsight) => (
            <div key={item.id} className="rounded-xl border border-indigo-100 bg-white p-4">
              <p className="font-medium text-indigo-900">{item.recommendation}</p>
              <p className="mt-2 text-sm text-zinc-700">{labels.companionInsights.reason}: {item.reason}</p>
              {center.canManage ? (
                <div className="mt-3 flex gap-2">
                  <button type="button" disabled={busy} onClick={() => void handleAction("insight", item.id, "acknowledge")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50">{labels.actions.acknowledge}</button>
                  <button type="button" disabled={busy} onClick={() => void handleAction("insight", item.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.actions.dismiss}</button>
                </div>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {center.dependencyIntelligence.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.dependencyIntelligence.title}</h2>
          <ul className="space-y-3">
            {center.dependencyIntelligence.map((dep: DependencyItem) => (
              <li key={dep.id} className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-zinc-900">{dep.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{dep.summary}</p>
                    {dep.suggestedAction ? <p className="mt-2 text-sm text-indigo-700">{labels.dependencyIntelligence.suggestedAction}: {dep.suggestedAction}</p> : null}
                  </div>
                  <TwinStatusBadge statusKey={dep.statusKey} labels={labels.status} />
                </div>
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("dependency", dep.id, "resolve")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50">{labels.actions.resolve}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("dependency", dep.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.actions.dismiss}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.processMapping.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.processMapping.title}</h2>
          <ul className="space-y-3">
            {center.processMapping.map((proc: ProcessMapItem) => (
              <li key={proc.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-zinc-900">{proc.title}</p>
                    <dl className="mt-2 grid gap-1 text-xs text-zinc-600 sm:grid-cols-2">
                      <div><dt className="inline font-medium">{labels.processMapping.start}: </dt><dd className="inline">{proc.startLabel}</dd></div>
                      <div><dt className="inline font-medium">{labels.processMapping.actions}: </dt><dd className="inline">{proc.actionsLabel}</dd></div>
                      <div><dt className="inline font-medium">{labels.processMapping.approvals}: </dt><dd className="inline">{proc.approvalsLabel}</dd></div>
                      <div><dt className="inline font-medium">{labels.processMapping.outcomes}: </dt><dd className="inline">{proc.outcomesLabel}</dd></div>
                    </dl>
                  </div>
                  <TwinStatusBadge statusKey={proc.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.workflowSimulations.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.workflowSimulations.title}</h2>
          <ul className="space-y-3">
            {center.workflowSimulations.map((sim: WorkflowSimulation) => (
              <li key={sim.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-zinc-900">{sim.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{sim.prompt}</p>
                    <p className="mt-2 text-sm text-indigo-700">{labels.workflowSimulations.impact}: {sim.impactSummary}</p>
                  </div>
                  <TwinStatusBadge statusKey={sim.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.capacityIntelligence.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.capacityIntelligence.title}</h2>
          <ul className="space-y-3">
            {center.capacityIntelligence.map((cap: CapacityItem) => (
              <li key={cap.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-zinc-900">{cap.teamLabel}</p>
                    <dl className="mt-2 grid gap-1 text-xs text-zinc-600 sm:grid-cols-2">
                      <div><dt className="inline font-medium">{labels.capacityIntelligence.workload}: </dt><dd className="inline">{cap.workloadPct}%</dd></div>
                      <div><dt className="inline font-medium">{labels.capacityIntelligence.bottleneck}: </dt><dd className="inline">{cap.bottleneckLabel}</dd></div>
                      <div className="sm:col-span-2"><dt className="inline font-medium">{labels.capacityIntelligence.availableResources}: </dt><dd className="inline">{cap.availableResources}</dd></div>
                      {cap.daysToCapacity != null ? <div><dt className="inline font-medium">{labels.capacityIntelligence.daysToCapacity}: </dt><dd className="inline">{cap.daysToCapacity}</dd></div> : null}
                    </dl>
                  </div>
                  <TwinStatusBadge statusKey={cap.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.operationalImpacts.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.operationalImpacts.title}</h2>
          <ul className="space-y-3">
            {center.operationalImpacts.map((impact: OperationalImpact) => (
              <li key={impact.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-zinc-900">{impact.changeTitle}</p>
                    <p className="mt-1 text-sm text-zinc-600">{labels.operationalImpacts.impact}: {impact.impactSummary}</p>
                    <p className="mt-1 text-sm text-amber-800">{labels.operationalImpacts.risk}: {impact.riskSummary}</p>
                    <p className="mt-1 text-xs text-zinc-500">{labels.operationalImpacts.affectedTeams}: {impact.affectedTeams}</p>
                    <p className="mt-1 text-xs text-zinc-500">{labels.operationalImpacts.affectedSystems}: {impact.affectedSystems}</p>
                  </div>
                  <TwinStatusBadge statusKey={impact.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {Object.keys(scenariosByName).length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.scenarioPlanning.title}</h2>
          {Object.entries(scenariosByName).map(([name, scenarios]) => (
            <div key={name} className="rounded-xl border border-zinc-200 p-4">
              <p className="font-medium text-zinc-900">{name}</p>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {scenarios.map((s) => (
                  <div key={s.id} className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 text-sm">
                    <p className="text-xs font-medium uppercase text-indigo-700">{getScenarioCaseLabel(s.caseType, labels.scenarioPlanning)}</p>
                    <p className="mt-2 text-zinc-600">{s.summary}</p>
                    <p className="mt-2 text-xs text-zinc-500">{labels.scenarioPlanning.expectedRevenue}: {s.expectedRevenue}</p>
                    <p className="mt-1 text-xs text-zinc-500">{labels.scenarioPlanning.expectedSupportLoad}: {s.expectedSupportLoad}</p>
                    <p className="mt-1 text-xs text-zinc-500">{labels.scenarioPlanning.expectedStaffing}: {s.expectedStaffing}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : null}

      <EntitySection title={labels.sections.organizationModel} items={center.sections.organizationModel} labels={labels} />
      <EntitySection title={labels.sections.teams} items={center.sections.teams} labels={labels} />
      <EntitySection title={labels.sections.customers} items={center.sections.customers} labels={labels} />
      <EntitySection title={labels.sections.vendors} items={center.sections.vendors} labels={labels} />
      <EntitySection title={labels.sections.projects} items={center.sections.projects} labels={labels} />
      <EntitySection title={labels.sections.systems} items={center.sections.systems} labels={labels} />
      <EntitySection title={labels.sections.workflows} items={center.sections.workflows} labels={labels} />
      <EntitySection title={labels.sections.dependencies} items={center.sections.dependencies} labels={labels} />
      <EntitySection title={labels.sections.simulations} items={center.sections.simulations} labels={labels} />

      <div className="flex flex-wrap gap-4 text-sm">
        <Link href="/app/digital-twin" className="text-indigo-700 hover:text-indigo-800">{labels.links.legacyTwin}</Link>
        <Link href="/app/executive/organizational-digital-twin" className="text-indigo-700 hover:text-indigo-800">{labels.links.executiveTwin}</Link>
      </div>
    </div>
  );
}
