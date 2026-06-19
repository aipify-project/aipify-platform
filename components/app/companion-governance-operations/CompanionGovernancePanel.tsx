"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  CONFIDENCE_BADGES,
  GOVERNANCE_TABS,
  SEVERITY_BADGES,
  TRUST_LABEL_BADGES,
  parseCompanionGovernanceCenter,
  type CompanionGovernanceCenter,
  type CompanionGovernanceLabels,
  type CompanionGovernanceTab,
  type GovernanceAction,
} from "@/lib/customer-companion-governance-operations";

type Props = {
  labels: CompanionGovernanceLabels;
  backHref: string;
  initialTab?: CompanionGovernanceTab;
  visibleTabs?: CompanionGovernanceTab[];
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function JsonList({ items }: { items: Record<string, unknown>[] }) {
  if (!items.length) return <p className="text-sm text-zinc-500">—</p>;
  return (
    <>
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-sm">
          <p className="font-medium text-zinc-900">
            {String(
              item.capability_title ?? item.policy_title ?? item.principle_title ??
                item.recommendation_title ?? item.alert_title ?? item.risk_title ??
                item.knowledge_title ?? item.review_title ?? item.boundary_title ?? i
            )}
          </p>
          {(item.summary ?? item.policy_rule ?? item.reason_summary ?? item.description) ? (
            <p className="mt-1 text-zinc-600">
              {String(item.summary ?? item.policy_rule ?? item.reason_summary ?? item.description)}
            </p>
          ) : null}
          {item.confidence_level ? (
            <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${CONFIDENCE_BADGES[String(item.confidence_level)] ?? CONFIDENCE_BADGES.moderate}`}>
              {String(item.confidence_level)} {item.confidence_score != null ? `· ${item.confidence_score}%` : ""}
            </span>
          ) : null}
          {item.severity ? (
            <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${SEVERITY_BADGES[String(item.severity)] ?? SEVERITY_BADGES.info}`}>
              {String(item.severity)}
            </span>
          ) : null}
        </div>
      ))}
    </>
  );
}

function ActionCard({
  item,
  labels,
  busy,
  onApprove,
  onDeny,
}: {
  item: GovernanceAction;
  labels: CompanionGovernanceLabels;
  busy: boolean;
  onApprove: (key: string) => void;
  onDeny: (key: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="font-medium text-zinc-900">{item.action_title}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      <p className="mt-2 text-xs text-zinc-500">
        {item.action_type} · {item.sensitivity_level} · {item.approval_status}
      </p>
      {item.approval_status === "pending" ? (
        <div className="mt-3 flex gap-2">
          <button type="button" disabled={busy} onClick={() => onApprove(item.action_key)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
            {labels.actions.approveAction}
          </button>
          <button type="button" disabled={busy} onClick={() => onDeny(item.action_key)}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium disabled:opacity-50">
            {labels.actions.denyAction}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function CompanionGovernancePanel({
  labels,
  backHref,
  initialTab = "overview",
  visibleTabs,
}: Props) {
  const tabs = visibleTabs ?? GOVERNANCE_TABS;
  const [center, setCenter] = useState<CompanionGovernanceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<CompanionGovernanceTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/companion-governance-operations");
    if (res.ok) setCenter(parseCompanionGovernanceCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/companion-governance-operations/action", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_type, ...payload }),
      });
      if (res.ok) await load();
    } finally { setBusy(false); }
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered /><span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;

  const overview = center.overview ?? {};
  const capabilities = center.capabilities ?? [];
  const boundaries = (center.permissions?.permission_boundaries as Record<string, unknown>[]) ?? [];
  const governanceActions = center.actions ?? [];
  const recommendations = (center.oversight?.recommendations as Record<string, unknown>[]) ?? [];
  const alerts = (center.oversight?.alerts as Record<string, unknown>[]) ?? [];
  const risks = (center.oversight?.risk_events as Record<string, unknown>[]) ?? [];
  const ethics = (center.oversight?.ethics_framework as Record<string, unknown>[]) ?? [];
  const transparency = center.oversight?.transparency_engine as Record<string, unknown> | undefined;
  const policies = center.policies ?? [];
  const pendingApprovals = (center.approvals?.pending as Record<string, unknown>[]) ?? [];
  const knowledgeGov = (center.integrations?.knowledge_governance as Record<string, unknown>[]) ?? [];
  const memoryGov = center.integrations?.memory_governance as Record<string, unknown> | undefined;
  const specialistGov = center.integrations?.specialist_governance as Record<string, unknown> | undefined;
  const reviewBoard = (center.reports?.review_board as Record<string, unknown>[]) ?? [];
  const trustLabel = String(center.trust_score?.trust_label ?? center.executive_dashboard?.trust_label ?? "trusted");

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.philosophy ? <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p> : null}
        <p className="mt-3">
          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${TRUST_LABEL_BADGES[trustLabel] ?? TRUST_LABEL_BADGES.trusted}`}>
            {labels.trustLabels[trustLabel] ?? trustLabel.replace(/_/g, " ")}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_trust_score")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshTrust}
        </button>
        <Link href="/app/approvals" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openApprovals}</Link>
        <Link href="/app/companion/orchestration" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openOrchestration}</Link>
        <Link href="/app/companion/memory" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openMemory}</Link>
        <Link href="/app/companion/governance/audit" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openAudit}</Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewCard label={labels.overview.capabilities} value={Number(overview.capabilities ?? 0)} />
          <OverviewCard label={labels.overview.policies} value={Number(overview.policies ?? 0)} />
          <OverviewCard label={labels.overview.pendingApprovals} value={Number(overview.pending_approvals ?? 0)} />
          <OverviewCard label={labels.overview.governanceAlerts} value={Number(overview.governance_alerts ?? 0)} />
          <OverviewCard label={labels.overview.riskEvents} value={Number(overview.risk_events ?? 0)} />
          <OverviewCard label={labels.overview.trustScore} value={Number(overview.trust_score ?? 0)} />
          <OverviewCard label={labels.overview.auditEntries} value={Number(overview.audit_entries ?? 0)} />
        </dl>
      ) : null}

      {tab === "permissions" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.sections.permissionBoundaries}</h2>
          <div className="mt-4"><JsonList items={boundaries} /></div>
        </section>
      ) : null}

      {tab === "capabilities" ? (
        <section className="space-y-3"><JsonList items={capabilities} /></section>
      ) : null}

      {tab === "actions" ? (
        <section className="space-y-3">
          {governanceActions.map((item) => (
            <ActionCard key={item.action_key} item={item} labels={labels} busy={busy}
              onApprove={(key) => void runAction("approve_action", { action_key: key })}
              onDeny={(key) => void runAction("deny_action", { action_key: key })} />
          ))}
        </section>
      ) : null}

      {tab === "oversight" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.recommendations}</h2>
            <div className="mt-4"><JsonList items={recommendations} /></div>
          </section>
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.transparencyEngine}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
              {((transparency?.prompts as string[]) ?? []).map((p) => <li key={p}>{p}</li>)}
            </ul>
          </section>
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.riskDetection}</h2>
            <div className="mt-4"><JsonList items={[...alerts, ...risks]} /></div>
          </section>
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.ethicsFramework}</h2>
            <div className="mt-4"><JsonList items={ethics} /></div>
          </section>
        </div>
      ) : null}

      {tab === "approvals" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <JsonList items={pendingApprovals} />
        </section>
      ) : null}

      {tab === "policies" ? (
        <section className="space-y-3"><JsonList items={policies} /></section>
      ) : null}

      {tab === "executive" ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.executive_dashboard ?? {}).map(([key, value]) => (
            <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
          ))}
          <div className="col-span-full grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-zinc-900">{labels.sections.knowledgeGovernance}</h2>
              <div className="mt-4"><JsonList items={knowledgeGov} /></div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-zinc-900">{labels.sections.memoryGovernance}</h2>
              <p className="mt-2 text-sm text-zinc-600">Phase {String(memoryGov?.phase ?? "558")} · {String(memoryGov?.memory_items ?? 0)} items</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-zinc-900">{labels.sections.specialistGovernance}</h2>
              <p className="mt-2 text-sm text-zinc-600">Phase {String(specialistGov?.phase ?? "559")} · {String(specialistGov?.specialists ?? 0)} specialists</p>
            </div>
          </div>
          <div className="col-span-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.reviewBoard}</h2>
            <div className="mt-4"><JsonList items={reviewBoard} /></div>
          </div>
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm text-sm text-zinc-600">
          <pre className="overflow-x-auto whitespace-pre-wrap">{JSON.stringify(center.reports ?? {}, null, 2)}</pre>
        </section>
      ) : null}

      {tab === "audit" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            {(center.audit_recent ?? []).map((entry, i) => (
              <li key={`${entry.event_type}-${i}`}>
                [{entry.audit_category ?? "governance"}] {entry.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
