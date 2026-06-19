"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseGovernanceCenter,
  type GovernanceCenter,
  type GovernanceManagementLabels,
  type GovernancePolicy,
} from "@/lib/governance-management";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

type Tab =
  | "overview"
  | "policies"
  | "approvals"
  | "accessReviews"
  | "compliance"
  | "audit"
  | "risk"
  | "controls"
  | "reports";

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700 ring-gray-200",
  review_required: "bg-sky-50 text-sky-900 ring-sky-200",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  expiring: "bg-amber-50 text-amber-900 ring-amber-200",
  retired: "bg-gray-100 text-gray-500 ring-gray-200",
};

function PolicyRow({ policy, labels, onAcknowledge, busy }: {
  policy: GovernancePolicy;
  labels: GovernanceManagementLabels;
  onAcknowledge: (id: string, response: string) => void;
  busy: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-gray-500">{policy.policy_number}</p>
          <h3 className="font-semibold text-gray-900">{policy.title}</h3>
          <p className="mt-1 capitalize text-gray-500">{policy.category.replace(/_/g, " ")}</p>
        </div>
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[policy.status] ?? STATUS_STYLE.draft}`}>
          {policy.status.replace(/_/g, " ")}
        </span>
      </div>
      {policy.requires_acknowledgement && policy.status === "active" ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" disabled={busy} onClick={() => onAcknowledge(policy.id, "accepted")} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{labels.acknowledge}</button>
          <button type="button" disabled={busy} onClick={() => onAcknowledge(policy.id, "declined")} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs">{labels.decline}</button>
          <button type="button" disabled={busy} onClick={() => onAcknowledge(policy.id, "clarification_requested")} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600">{labels.clarify}</button>
        </div>
      ) : null}
    </div>
  );
}

type Props = {
  labels: GovernanceManagementLabels;
  initialTab?: Tab;
  titleOverride?: string;
};

export function GovernanceManagementPanel({ labels, initialTab, titleOverride }: Props) {
  const [center, setCenter] = useState<GovernanceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab ?? "overview");
  const [busy, setBusy] = useState(false);
  const [policyTitle, setPolicyTitle] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/governance");
    if (res.ok) setCenter(parseGovernanceCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/governance/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) return <div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /></div>;
  if (!center?.found) return <AipifyModuleAccessDenied message={labels.accessDenied} />;

  const overview = center.overview ?? {};
  const routes = center.routes;

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: labels.overview },
    { key: "policies", label: labels.policies },
    { key: "approvals", label: labels.approvals },
    { key: "accessReviews", label: labels.accessReviews },
    { key: "compliance", label: labels.compliance },
    { key: "audit", label: labels.audit },
    { key: "risk", label: labels.risk },
    { key: "controls", label: labels.controls },
    { key: "reports", label: labels.reports },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        {initialTab ? (
          <Link href="/app/governance" className="text-sm text-indigo-600 hover:underline">{labels.backToGovernance}</Link>
        ) : null}
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{titleOverride ?? labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        {center.companion_note ? <p className="mt-1 text-sm text-gray-500">{center.companion_note}</p> : null}
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {routes?.approval_center ? <Link href={routes.approval_center} className="text-indigo-700 hover:underline">{labels.approvalCenterLink}</Link> : null}
          {routes?.tacc ? <Link href={routes.tacc} className="text-indigo-700 hover:underline">{labels.taccLink}</Link> : null}
          {routes?.policies && !initialTab ? <Link href={routes.policies} className="text-indigo-700 hover:underline">{labels.policies}</Link> : null}
          {routes?.audit && tab !== "audit" ? <Link href={routes.audit} className="text-indigo-700 hover:underline">{labels.audit}</Link> : null}
        </div>
      </div>

      {!initialTab ? (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {([
            [labels.governanceHealth, overview.governance_health],
            [labels.openRisks, overview.open_risks],
            [labels.pendingApprovals, overview.pending_approvals],
            [labels.pendingReviews, overview.pending_access_reviews],
            [labels.activePolicies, overview.active_policies],
          ] as [string, unknown][]).map(([label, value]) => (
            <div key={label} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">{String(value ?? "—")}</p>
            </div>
          ))}
        </div>
      ) : null}

      {!initialTab ? (
        <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-gray-200 pb-2">
          {tabs.map((t) => (
            <button key={t.key} type="button" onClick={() => setTab(t.key)} className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${tab === t.key ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>{t.label}</button>
          ))}
        </div>
      ) : null}

      {(tab === "policies" || initialTab === "policies") && (
        <div className="space-y-4">
          <form className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row" onSubmit={(e) => {
            e.preventDefault();
            void runAction("create_policy", { title: policyTitle, requires_acknowledgement: true });
            setPolicyTitle("");
          }}>
            <input value={policyTitle} onChange={(e) => setPolicyTitle(e.target.value)} placeholder={labels.policyTitle} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
            <button type="submit" disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.createPolicy}</button>
          </form>
          {(center.policies ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noPolicies} message={labels.noPoliciesHint} primaryAction={{ label: labels.createPolicy, href: "#" }} />
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {(center.policies ?? []).map((p) => (
                <PolicyRow key={p.id} policy={p} labels={labels} busy={busy} onAcknowledge={(id, response) => void runAction("acknowledge_policy", { policy_id: id, response })} />
              ))}
            </div>
          )}
        </div>
      )}

      {(tab === "approvals" || initialTab === "approvals") && (
        <div className="space-y-2">
          {(center.approvals ?? []).map((a, i) => (
            <div key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white p-4 text-sm">
              <div>
                <p className="font-medium text-gray-900">{String(a.title ?? "")}</p>
                <p className="text-gray-500">{String(a.request_type ?? "")} · {String(a.summary ?? "")}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" disabled={busy} onClick={() => void runAction("decide_approval", { approval_id: a.id, decision: "approved" })} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white">{labels.approve}</button>
                <button type="button" disabled={busy} onClick={() => void runAction("decide_approval", { approval_id: a.id, decision: "rejected" })} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs">{labels.reject}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(tab === "accessReviews" || initialTab === "accessReviews") && (
        <div className="space-y-4">
          <button type="button" disabled={busy} onClick={() => void runAction("create_access_review", { title: "Quarterly access review" })} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.createReview}</button>
          {(center.access_reviews ?? []).map((r, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
              <p className="font-medium text-gray-900">{String(r.title ?? "")}</p>
              <p className="text-gray-500">{String(r.status ?? "")} · {String(r.item_count ?? 0)} items · due {String(r.due_date ?? "—")}</p>
            </div>
          ))}
        </div>
      )}

      {(tab === "compliance" || initialTab === "compliance") && center.compliance ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-4">
            {["compliant", "requires_attention", "high_risk", "critical_risk"].map((k) => (
              <div key={k} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
                <p className="text-xs uppercase text-gray-500">{k.replace(/_/g, " ")}</p>
                <p className="text-xl font-semibold">{String(center.compliance?.[k] ?? 0)}</p>
              </div>
            ))}
          </div>
          <button type="button" disabled={busy} onClick={() => void runAction("seed_compliance")} className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-800">{labels.save}</button>
          {(center.compliance.records ?? []).map((c, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
              <p className="font-medium text-gray-900">{String(c.title ?? "")}</p>
              <p className="text-gray-500">{String(c.compliance_type ?? "")} · {String(c.status ?? "")}</p>
            </div>
          ))}
        </div>
      ) : null}

      {(tab === "risk" || initialTab === "risk") && (
        <div className="space-y-4">
          <button type="button" disabled={busy} onClick={() => void runAction("create_risk", { title: "Operational risk review", category: "operational" })} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.createRisk}</button>
          {(center.risks ?? []).map((r, i) => (
            <div key={i} className="rounded-xl border border-amber-100 bg-amber-50/30 p-4 text-sm">
              <p className="font-medium text-gray-900">{String(r.risk_number ?? "")} · {String(r.title ?? "")}</p>
              <p className="text-gray-600">{String(r.category ?? "")} · impact {String(r.impact ?? "")} · {String(r.status ?? "")}</p>
            </div>
          ))}
        </div>
      )}

      {(tab === "controls" || initialTab === "controls") && (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.controls ?? []).map((c, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
              <p className="font-medium text-gray-900">{String(c.title ?? "")}</p>
              <p className="text-gray-500">{String(c.trigger_action ?? "")}</p>
              <button type="button" disabled={busy} onClick={() => void runAction("toggle_control", { control_id: c.id, is_active: !c.is_active })} className="mt-2 text-xs text-indigo-700 hover:underline">
                {c.is_active ? "Disable" : "Enable"}
              </button>
            </div>
          ))}
        </div>
      )}

      {(tab === "audit" || initialTab === "audit") && (
        <ul className="space-y-2">
          {(center.audit_recent ?? []).map((a, i) => (
            <li key={i} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 text-sm">
              <p className="font-medium text-gray-900">{a.summary}</p>
              <p className="text-xs text-gray-500">{a.event_category} · {a.event_type}</p>
            </li>
          ))}
        </ul>
      )}

      {(tab === "reports" || initialTab === "reports") && center.reports ? (
        <div className="rounded-xl border border-gray-200 bg-white p-5 grid gap-4 sm:grid-cols-2 text-sm">
          {Object.entries(center.reports).map(([k, v]) => (
            <div key={k}>
              <p className="text-gray-500 capitalize">{k.replace(/_/g, " ")}</p>
              <p className="text-lg font-semibold">{typeof v === "object" ? JSON.stringify(v) : String(v ?? "—")}</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "overview" && !initialTab ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {(center.policies ?? []).slice(0, 4).map((p) => (
            <PolicyRow key={p.id} policy={p} labels={labels} busy={busy} onAcknowledge={(id, response) => void runAction("acknowledge_policy", { policy_id: id, response })} />
          ))}
        </div>
      ) : null}

      {center.audit_recent && center.audit_recent.length > 0 && tab !== "audit" && !initialTab ? (
        <section>
          <h2 className="text-lg font-semibold text-gray-900">{labels.auditLog}</h2>
          <ul className="mt-3 space-y-2">
            {center.audit_recent.slice(0, 6).map((a, i) => (
              <li key={i} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 text-sm"><p className="font-medium text-gray-900">{a.summary}</p></li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
