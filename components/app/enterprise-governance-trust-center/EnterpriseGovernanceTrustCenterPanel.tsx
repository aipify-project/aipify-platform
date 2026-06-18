"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseEnterpriseGovernanceTrustAction,
  parseEnterpriseGovernanceTrustCenter,
  type ApprovalIntelItem,
  type AuditEventItem,
  type CompanionTrustItem,
  type ComplianceItem,
  type EnterpriseGovernanceTrustCenter,
  type ExecutiveTrustMetric,
  type ExplainabilityItem,
  type GovernanceApiItem,
  type GovernanceFrameworkItem,
  type PolicyItem,
  type TrustScoreItem,
  type TrustSectionItem,
  type TransparencyItem,
} from "@/lib/enterprise-governance-trust-center";
import type { EnterpriseGovernanceTrustCenterLabels } from "@/lib/enterprise-governance-trust-center/labels";
import { TrustStatusBadge } from "./TrustStatusBadge";

type Props = { labels: EnterpriseGovernanceTrustCenterLabels };

function SectionCard({ title, items }: { title: string; items: TrustSectionItem[] }) {
  if (items.length === 0) return null;
  const item = items[0];
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{title}</p>
      <p className="mt-1 font-semibold text-zinc-900">{item.title}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      {item.metricValue ? <p className="mt-2 text-lg font-bold text-emerald-900">{item.metricLabel}: {item.metricValue}</p> : null}
    </div>
  );
}

export function EnterpriseGovernanceTrustCenterPanel({ labels }: Props) {
  const [center, setCenter] = useState<EnterpriseGovernanceTrustCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/governance/trust");
    if (res.ok) setCenter(parseEnterpriseGovernanceTrustCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleAction = async (itemType: string, id: string, action: string) => {
    setBusy(true);
    const res = await fetch("/api/governance/trust", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "manage", item_type: itemType, item_id: id, manage_action: action }),
    });
    if (parseEnterpriseGovernanceTrustAction(await res.json()).ok) await load();
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

  const orgScore = center.trustScoreEngine.find((s) => s.scoreCategory === "organization_total");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-600">{labels.philosophy}</p>
          {center.governanceNote ? <p className="mt-2 text-sm font-medium text-emerald-900">{center.governanceNote}</p> : null}
          {center.privacyNote ? <p className="mt-2 text-xs text-zinc-500">{center.privacyNote}</p> : null}
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link href="/app/governance" className="text-emerald-700 hover:underline">{labels.links.governance}</Link>
            <Link href="/app/governance/audit" className="text-emerald-700 hover:underline">{labels.links.audit}</Link>
            <Link href="/app/governance/trust-transparency" className="text-emerald-700 hover:underline">{labels.links.trustTransparency}</Link>
            <Link href="/app/governance/approval-center" className="text-emerald-700 hover:underline">{labels.links.approvalCenter}</Link>
            <Link href="/app/governance/permissions-access" className="text-emerald-700 hover:underline">{labels.links.permissionsAccess}</Link>
          </div>
        </div>
        <button type="button" disabled={busy} onClick={() => void load()} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">{labels.refresh}</button>
      </div>

      <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
        <h2 className="text-lg font-semibold text-zinc-900">{labels.governanceControls.title}</h2>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-700">
          <span>{center.trustSettings.trustCenterEnabled ? labels.governanceControls.enabled : labels.governanceControls.disabled}</span>
          {center.trustSettings.transparencyModeEnabled ? <span>{labels.governanceControls.transparency}</span> : null}
          {orgScore ? <span className="font-semibold text-emerald-900">{orgScore.scoreLabel}: {orgScore.scoreValue}/100</span> : null}
        </div>
      </section>

      {center.executiveTrustDashboard.length > 0 ? (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.executiveTrustDashboard.title}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {center.executiveTrustDashboard.map((m: ExecutiveTrustMetric) => (
              <div key={m.id} className="rounded-xl border border-emerald-100 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 capitalize">{m.metricKey.replace(/_/g, " ")}</p>
                <p className="mt-1 text-2xl font-bold text-emerald-900">{m.metricValue}</p>
                {m.trendLabel ? <p className="mt-1 text-xs text-zinc-600">{m.trendLabel}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <SectionCard title={labels.sections.trustOverview} items={center.sections.trust_overview} />
        <SectionCard title={labels.sections.governanceStatus} items={center.sections.governance_status} />
        <SectionCard title={labels.sections.complianceCenter} items={center.sections.compliance_center} />
        <SectionCard title={labels.sections.auditCenter} items={center.sections.audit_center} />
        <SectionCard title={labels.sections.riskCenter} items={center.sections.risk_center} />
        <SectionCard title={labels.sections.approvalCenter} items={center.sections.approval_center} />
        <SectionCard title={labels.sections.policyCenter} items={center.sections.policy_center} />
      </div>

      {center.trustScoreEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.trustScoreEngine.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {center.trustScoreEngine.filter((s) => s.scoreCategory !== "organization_total").map((s: TrustScoreItem) => (
              <div key={s.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium uppercase text-zinc-500">{s.scoreLabel}</p>
                <p className="mt-1 text-2xl font-bold text-emerald-900">{s.scoreValue}</p>
                <div className="mt-2"><TrustStatusBadge statusKey={s.statusKey} labels={labels.status} /></div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.governanceFramework.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.governanceFramework.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {center.governanceFramework.map((f: GovernanceFrameworkItem) => (
              <div key={f.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="font-medium text-zinc-900">{f.areaName}</p>
                <p className="mt-1 text-sm text-zinc-600">{f.governanceLabel}</p>
                <div className="mt-2"><TrustStatusBadge statusKey={f.statusKey} labels={labels.status} /></div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.complianceCenter.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.complianceCenter.title}</h2>
          <ul className="space-y-3">
            {center.complianceCenter.map((c: ComplianceItem) => (
              <li key={c.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-zinc-900">{c.frameworkName}</p>
                    <p className="mt-1 text-sm text-emerald-800">{c.complianceStatus}</p>
                    {c.outstandingIssues ? <p className="mt-1 text-xs text-zinc-500">{labels.outstandingIssues}: {c.outstandingIssues}</p> : null}
                    {c.requiredActions ? <p className="mt-1 text-xs text-zinc-500">{labels.requiredActions}: {c.requiredActions}</p> : null}
                  </div>
                  <TrustStatusBadge statusKey={c.statusKey} labels={labels.status} />
                </div>
                {center.canManage ? (
                  <button type="button" disabled={busy} onClick={() => void handleAction("compliance", c.id, "resolve")} className="mt-2 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 disabled:opacity-50">{labels.actions.resolve}</button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.universalAuditLayer.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.universalAuditLayer.title}</h2>
          <ul className="space-y-3">
            {center.universalAuditLayer.map((a: AuditEventItem) => (
              <li key={a.id} className="rounded-xl border border-zinc-100 bg-white p-4">
                <p className="font-medium text-zinc-900">{a.eventAction}</p>
                <div className="mt-2 grid gap-1 text-xs text-zinc-600 sm:grid-cols-2">
                  <span>{labels.who}: {a.actorName}</span>
                  <span>{labels.what}: {a.eventWhat}</span>
                  <span>{labels.why}: {a.eventWhy}</span>
                  <span>{labels.result}: {a.eventResult}</span>
                </div>
                {a.approvalHistoryLabel ? <p className="mt-2 text-xs text-emerald-800">{labels.approvalHistory}: {a.approvalHistoryLabel}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.explainabilityEngine.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.explainabilityEngine.title}</h2>
          <ul className="space-y-3">
            {center.explainabilityEngine.map((e: ExplainabilityItem) => (
              <li key={e.id} className="rounded-xl border border-blue-100 bg-blue-50/30 p-4">
                <p className="text-xs font-medium uppercase text-zinc-500">{e.explainType}</p>
                <p className="mt-1 font-medium text-zinc-900">{e.title}</p>
                <div className="mt-2 space-y-1 text-sm text-zinc-600">
                  {e.whyLabel ? <p><span className="font-medium">{labels.whyExplain}:</span> {e.whyLabel}</p> : null}
                  {e.howLabel ? <p><span className="font-medium">{labels.howExplain}:</span> {e.howLabel}</p> : null}
                  {e.dataUsedLabel ? <p><span className="font-medium">{labels.dataUsed}:</span> {e.dataUsedLabel}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.approvalIntelligence.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.approvalIntelligence.title}</h2>
          <ul className="space-y-2">
            {center.approvalIntelligence.map((i: ApprovalIntelItem) => (
              <li key={i.id} className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-amber-100 bg-amber-50/30 px-4 py-3">
                <div>
                  <p className="font-medium text-zinc-900">{i.title}</p>
                  {i.summary ? <p className="mt-1 text-sm text-zinc-600">{i.summary}</p> : null}
                </div>
                <TrustStatusBadge statusKey={i.statusKey} labels={labels.status} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.policyManagement.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.policyManagement.title}</h2>
          <ul className="space-y-2">
            {center.policyManagement.map((p: PolicyItem) => (
              <li key={p.id} className="rounded-lg border border-zinc-100 bg-white px-4 py-3">
                <p className="font-medium text-zinc-900">{p.policyName}</p>
                <p className="text-xs capitalize text-zinc-500">{p.policyType.replace(/_/g, " ")}</p>
                <p className="mt-1 text-sm text-zinc-600">{p.ruleLabel}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.enterpriseTransparencyMode.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.enterpriseTransparencyMode.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.enterpriseTransparencyMode.map((t: TransparencyItem) => (
              <div key={t.id} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                <p className="font-medium text-zinc-900">{t.sourceName}</p>
                <p className="mt-1 text-sm text-zinc-600">{t.sourceLabel}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.governanceApis.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.governanceApis.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {center.governanceApis.map((api: GovernanceApiItem) => (
              <div key={api.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="font-medium text-zinc-900">{api.integrationName}</p>
                <p className="mt-1 text-xs capitalize text-zinc-500">{api.integrationType.replace(/_/g, " ")}</p>
                <p className="mt-2 text-sm text-zinc-600">{api.statusLabel}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {center.companionTrustAdvisor.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900">{labels.companionAdvisor.title}</h2>
          <ul className="space-y-3">
            {center.companionTrustAdvisor.map((item: CompanionTrustItem) => (
              <li key={item.id} className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4">
                <p className="text-sm text-zinc-700">{item.explanation}</p>
                {item.contextLabel ? <p className="mt-2 text-xs text-zinc-500"><span className="font-medium">{labels.companionAdvisor.context}:</span> {item.contextLabel}</p> : null}
                {center.canManage ? (
                  <div className="mt-3 flex gap-2">
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
