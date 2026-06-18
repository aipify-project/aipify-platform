"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseAutonomousOrganizationAction,
  parseAutonomousOrganizationCenter,
  type AutonomousOperation,
  type AutonomousOrganizationCenter,
  type AutonomySectionItem,
  type CompanionDelegationItem,
  type DelegationItem,
  type OversightItem,
  type PerformanceMetric,
  type PolicyItem,
} from "@/lib/autonomous-organization-center";
import type { AutonomousOrganizationCenterLabels } from "@/lib/autonomous-organization-center/labels";
import { getAutonomyLevelLabel } from "@/lib/autonomous-organization-center/labels";
import { AutonomyStatusBadge } from "./AutonomyStatusBadge";

type Props = { labels: AutonomousOrganizationCenterLabels };

function SectionCard({ title, items }: { title: string; items: AutonomySectionItem[] }) {
  if (items.length === 0) return null;
  const item = items[0];
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{title}</p>
      <p className="mt-1 font-semibold text-zinc-900">{item.title}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      {item.metricValue ? <p className="mt-2 text-lg font-bold text-teal-900">{item.metricLabel}: {item.metricValue}</p> : null}
    </div>
  );
}

export function AutonomousOrganizationCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<AutonomousOrganizationCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/autonomy");
    if (res.ok) setCenter(parseAutonomousOrganizationCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleAction = async (itemType: string, id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/autonomy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action }),
    });
    if (parseAutonomousOrganizationAction(await res.json()).ok) await load();
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

  const currentLevelLabel = getAutonomyLevelLabel(center.autonomySettings.currentAutonomyLevel, center.autonomyLevels);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-600">{labels.philosophy}</p>
          {center.governanceNote ? <p className="mt-2 text-sm font-medium text-teal-900">{center.governanceNote}</p> : null}
          {center.privacyNote ? <p className="mt-2 text-xs text-zinc-500">{center.privacyNote}</p> : null}
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link href="/app/autonomous" className="text-teal-700 hover:underline">{labels.links.legacyAutonomous}</Link>
            <Link href="/app/approvals" className="text-teal-700 hover:underline">{labels.links.approvals}</Link>
            <Link href="/app/action-center" className="text-teal-700 hover:underline">{labels.links.actionCenter}</Link>
            <Link href="/app/human-oversight-engine" className="text-teal-700 hover:underline">{labels.links.humanOversight}</Link>
          </div>
        </div>
        <button type="button" disabled={busy} onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.refresh}</button>
      </div>

      <section className="rounded-2xl border border-teal-100 bg-teal-50/40 p-5">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.enterpriseControls.title}</h2>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-700">
          <span>{center.autonomySettings.autonomyEnabled ? labels.enterpriseControls.enabled : labels.enterpriseControls.disabled}</span>
          <span>{labels.currentLevel}: {currentLevelLabel}</span>
          {center.autonomySettings.executiveApprovalRequired ? <span>{labels.enterpriseControls.executiveApproval}</span> : null}
        </div>
      </section>

      {center.executiveAutonomyDashboard.length > 0 ? (
        <section className="rounded-2xl border border-teal-200 bg-teal-50/40 p-5">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.executiveAutonomyDashboard.title}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {center.executiveAutonomyDashboard.map((m: PerformanceMetric) => (
              <div key={m.id} className="rounded-xl border border-teal-100 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 capitalize">{m.metricKey.replace(/_/g, " ")}</p>
                <p className="mt-1 text-2xl font-bold text-teal-900">{m.metricValue}</p>
                {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <SectionCard title={labels.sections.autonomousOperations} items={center.sections.autonomousOperations} />
        <SectionCard title={labels.sections.delegatedResponsibilities} items={center.sections.delegatedResponsibilities} />
        <SectionCard title={labels.sections.approvalPolicies} items={center.sections.approvalPolicies} />
        <SectionCard title={labels.sections.humanOversight} items={center.sections.humanOversight} />
        <SectionCard title={labels.sections.autonomousPerformance} items={center.sections.autonomousPerformance} />
        <SectionCard title={labels.sections.governanceControls} items={center.sections.governanceControls} />
      </div>

      {center.autonomyLevels.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.autonomyLevels.title}</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {center.autonomyLevels.map((level) => (
              <div
                key={level.level}
                className={`rounded-xl border p-4 ${center.autonomySettings.currentAutonomyLevel === level.level ? "border-teal-300 bg-teal-50/50" : "border-zinc-200 bg-white"}`}
              >
                <p className="text-xs font-medium text-teal-800">Level {level.level}</p>
                <p className="mt-1 font-medium text-zinc-900">{level.label}</p>
                <p className="mt-1 text-sm text-zinc-600">{level.description}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.delegationFramework.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.delegationFramework.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {center.delegationFramework.map((d: DelegationItem) => (
              <div key={d.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="font-medium text-zinc-900">{d.delegationName}</p>
                <p className="mt-1 text-xs capitalize text-zinc-500">{d.delegationCategory.replace(/_/g, " ")}</p>
                <p className="mt-2 text-sm text-zinc-600">{labels.autonomyLevel}: {getAutonomyLevelLabel(d.autonomyLevel, center.autonomyLevels)}</p>
                <p className="mt-1 text-xs text-zinc-500">{labels.owner}: {d.ownerName}</p>
                <div className="mt-2"><AutonomyStatusBadge statusKey={d.statusKey} labels={labels.status} /></div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.policyEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.policyEngine.title}</h2>
          <ul className="space-y-3">
            {center.policyEngine.map((p: PolicyItem) => (
              <li key={p.id} className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-zinc-900">{p.policyName}</p>
                    <p className="mt-1 text-sm text-zinc-600">{p.ruleLabel}</p>
                    <p className="mt-1 text-sm font-medium text-amber-900">{labels.threshold}: {p.thresholdLabel}</p>
                  </div>
                  <AutonomyStatusBadge statusKey={p.statusKey} labels={labels.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.humanOversightCenter.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.humanOversightCenter.title}</h2>
          <ul className="space-y-3">
            {center.humanOversightCenter.map((o: OversightItem) => (
              <li key={o.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500">{o.oversightType.replace(/_/g, " ")}</p>
                    <p className="mt-1 font-medium text-zinc-900">{o.title}</p>
                    {o.summary ? <p className="mt-1 text-sm text-zinc-600">{o.summary}</p> : null}
                    <p className="mt-2 text-xs text-zinc-500">{labels.owner}: {o.ownerName} · {labels.policy}: {o.policyUsed}</p>
                  </div>
                  <AutonomyStatusBadge statusKey={o.statusKey} labels={labels.status} />
                </div>
                {center.canManage ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("oversight", o.id, "approve")} className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{labels.actions.approve}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("oversight", o.id, "reject")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.reject}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("oversight", o.id, "escalate")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.escalate}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("oversight", o.id, "override")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.override}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(center.autonomousSupportOperations.length > 0 || center.autonomousAdminOperations.length > 0) ? (
        <section className="grid gap-6 lg:grid-cols-2">
          {center.autonomousSupportOperations.length > 0 ? (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-zinc-900">{labels.autonomousSupportOperations.title}</h2>
              <ul className="space-y-2">
                {center.autonomousSupportOperations.map((op: AutonomousOperation) => (
                  <li key={op.id} className="rounded-lg border border-zinc-100 bg-white px-4 py-3">
                    <p className="font-medium text-zinc-900">{op.operationName}</p>
                    <p className="text-xs text-zinc-500">{labels.lastRun}: {op.lastRunLabel} · {labels.successRate}: {op.successRateLabel}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {center.autonomousAdminOperations.length > 0 ? (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-zinc-900">{labels.autonomousAdminOperations.title}</h2>
              <ul className="space-y-2">
                {center.autonomousAdminOperations.map((op: AutonomousOperation) => (
                  <li key={op.id} className="rounded-lg border border-zinc-100 bg-white px-4 py-3">
                    <p className="font-medium text-zinc-900">{op.operationName}</p>
                    <p className="text-xs text-zinc-500">{labels.lastRun}: {op.lastRunLabel} · {labels.successRate}: {op.successRateLabel}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      {center.autonomousPerformanceDashboard.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.autonomousPerformanceDashboard.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {center.autonomousPerformanceDashboard.map((m: PerformanceMetric) => (
              <div key={m.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                <p className="text-xs font-medium uppercase text-zinc-500 capitalize">{m.metricKey.replace(/_/g, " ")}</p>
                <p className="mt-1 text-xl font-bold text-teal-900">{m.metricValue}</p>
                {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.companionDelegationAdvisor.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.companionAdvisor.title}</h2>
          <ul className="space-y-3">
            {center.companionDelegationAdvisor.map((item: CompanionDelegationItem) => (
              <li key={item.id} className="rounded-xl border border-teal-200 bg-teal-50/30 p-4">
                <p className="font-medium text-zinc-900">{item.suggestion}</p>
                {item.reason ? <p className="mt-2 text-sm text-zinc-600"><span className="font-medium">{labels.companionAdvisor.reason}:</span> {item.reason}</p> : null}
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
                    <button type="button" disabled={busy} onClick={() => void handleAction("companion", item.id, "approve")} className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{labels.actions.approve}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("companion", item.id, "acknowledge")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.acknowledge}</button>
                    <button type="button" disabled={busy} onClick={() => void handleAction("companion", item.id, "dismiss")} className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.dismiss}</button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
