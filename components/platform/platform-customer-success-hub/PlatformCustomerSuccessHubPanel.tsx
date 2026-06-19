"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  HEALTH_STATUS_BADGES,
  SEVERITY_BADGES,
  parsePlatformCustomerSuccessHubCenter,
  type PlatformCustomerSuccessHubCenter,
  type PlatformCustomerSuccessHubLabels,
  type PlatformCustomerSuccessHubTab,
} from "@/lib/platform-customer-success-hub";

type Props = {
  labels: PlatformCustomerSuccessHubLabels;
  backHref: string;
  initialTab?: PlatformCustomerSuccessHubTab;
  visibleTabs?: PlatformCustomerSuccessHubTab[];
  titleOverride?: string;
  subtitleOverride?: string;
};

function OverviewCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function StatusPill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${className}`}>
      {label}
    </span>
  );
}

const ALL_TABS: PlatformCustomerSuccessHubTab[] = [
  "overview",
  "customer_health",
  "onboarding",
  "guidance",
  "success_plans",
  "adoption",
  "risks",
  "companion_insights",
  "executive",
  "reports",
];

export function PlatformCustomerSuccessHubPanel({
  labels,
  backHref,
  initialTab = "overview",
  visibleTabs,
  titleOverride,
  subtitleOverride,
}: Props) {
  const tabs = visibleTabs ?? ALL_TABS;
  const [center, setCenter] = useState<PlatformCustomerSuccessHubCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<PlatformCustomerSuccessHubTab>(initialTab);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/platform-customer-success-hub/overview");
    if (res.ok) setCenter(parsePlatformCustomerSuccessHubCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const performAction = useCallback(
    async (payload: Record<string, string>) => {
      setBusyId(payload.id ?? payload.customer_id ?? "busy");
      try {
        const res = await fetch("/api/platform-customer-success-hub/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) await load();
      } finally {
        setBusyId(null);
      }
    },
    [load]
  );

  if (loading && !center) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return <p className="p-6 text-sm text-red-600">{labels.emptyState}</p>;
  }

  const overview = center.overview ?? {};
  const companionInsights = (center.companion_insights?.insights as string[]) ?? [];
  const pendingAssistance =
    (center.companion_insights?.pending_assistance as Record<string, unknown>[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
          {titleOverride ?? labels.title}
        </h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{subtitleOverride ?? labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">
          {center.principle}
        </p>
        {center.routes?.legacy_operations ? (
          <p className="mt-3 text-sm text-zinc-600">
            <Link href={center.routes.legacy_operations} className="font-medium text-indigo-600 hover:text-indigo-700">
              {labels.legacyLink}
            </Link>
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              tab === key
                ? "bg-indigo-600 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <section className="space-y-6">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <OverviewCard label={labels.overview.healthyCustomers} value={overview.healthy_customers ?? 0} />
            <OverviewCard label={labels.overview.needsAttention} value={overview.needs_attention ?? 0} />
            <OverviewCard label={labels.overview.atRiskCustomers} value={overview.at_risk_customers ?? 0} />
            <OverviewCard label={labels.overview.newCustomers} value={overview.new_customers ?? 0} />
            <OverviewCard label={labels.overview.onboardingProgress} value={overview.onboarding_in_progress ?? 0} />
            <OverviewCard label={labels.overview.businessPackAdoption} value={overview.business_pack_adopted ?? 0} />
            <OverviewCard label={labels.overview.openRisks} value={overview.open_risks ?? 0} />
            <OverviewCard label={labels.overview.expansionOpportunities} value={overview.expansion_opportunities ?? 0} />
            <OverviewCard label={labels.overview.proactivePending} value={overview.proactive_pending ?? 0} />
          </dl>
          <div className="flex flex-wrap gap-3">
            <Link href="/platform/customer-success/onboarding" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              {labels.actions.viewOnboarding}
            </Link>
            <Link href="/platform/customer-success/playbooks" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
              {labels.actions.viewPlaybooks}
            </Link>
          </div>
        </section>
      ) : null}

      {tab === "customer_health" ? (
        <section className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-left text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3">{labels.health.customer}</th>
                <th className="px-4 py-3">{labels.health.status}</th>
                <th className="px-4 py-3">{labels.health.score}</th>
                <th className="px-4 py-3">{labels.health.adoption}</th>
              </tr>
            </thead>
            <tbody>
              {(center.customer_health ?? []).map((row) => (
                <tr key={row.customer_id} className="border-b border-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">{row.customer_name}</td>
                  <td className="px-4 py-3">
                    <StatusPill
                      label={labels.healthStatuses[row.health_status] ?? row.health_status}
                      className={HEALTH_STATUS_BADGES[row.health_status] ?? HEALTH_STATUS_BADGES.healthy}
                    />
                  </td>
                  <td className="px-4 py-3">{row.health_score}</td>
                  <td className="px-4 py-3">{row.adoption_score ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {tab === "onboarding" ? (
        <section className="space-y-4">
          {(center.onboarding ?? []).map((row) => (
            <div key={row.customer_id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-zinc-900">{row.customer_name}</p>
                <span className="text-sm text-zinc-600">{row.onboarding_pct}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">
                <div className="h-full rounded-full bg-indigo-600" style={{ width: `${row.onboarding_pct}%` }} />
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "guidance" ? (
        <section className="space-y-4">
          {(center.guidance ?? []).map((row) => (
            <div key={row.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase text-zinc-500">{row.customer_name} · {row.status}</p>
              <p className="font-medium text-zinc-900">{row.title}</p>
              {row.companion_message ? <p className="mt-1 text-sm text-zinc-600">{row.companion_message}</p> : null}
              {row.status !== "completed" ? (
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => void performAction({ action: "complete_guidance", id: row.id })}
                  className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {labels.actions.completeGuidance}
                </button>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "success_plans" ? (
        <section className="space-y-4">
          {(center.success_plans ?? []).map((plan) => (
            <div key={String(plan.id)} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase text-zinc-500">{String(plan.customer_name ?? "")}</p>
              <p className="font-medium text-zinc-900">{String(plan.objective ?? "")}</p>
              <p className="mt-1 text-sm text-zinc-600">{String(plan.owner ?? "")} · {String(plan.status ?? "")}</p>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "adoption" ? (
        <section className="space-y-4">
          {(center.business_pack_tracking ?? []).map((item) => (
            <div key={`${String(item.customer_id)}-${String(item.pack_key)}`} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase text-zinc-500">{String(item.customer_name ?? "")} · {String(item.stage ?? "")}</p>
              <p className="font-medium text-zinc-900">{String(item.pack_name ?? "")}</p>
              {item.usage_pct != null ? <p className="mt-1 text-sm text-zinc-600">{String(item.usage_pct)}% usage</p> : null}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "risks" ? (
        <section className="space-y-4">
          {(center.risks ?? []).map((row) => (
            <div key={row.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-zinc-900">{row.title}</p>
                <StatusPill
                  label={labels.severities[row.severity] ?? row.severity}
                  className={SEVERITY_BADGES[row.severity] ?? SEVERITY_BADGES.medium}
                />
              </div>
              <p className="mt-1 text-xs text-zinc-500">{row.customer_name} · {labels.riskTypes[row.risk_type] ?? row.risk_type}</p>
              {row.companion_recommendation ? <p className="mt-2 text-sm text-zinc-600">{row.companion_recommendation}</p> : null}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => void performAction({ action: "acknowledge_risk", id: row.id })}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50"
                >
                  {labels.actions.acknowledgeRisk}
                </button>
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => void performAction({ action: "resolve_risk", id: row.id })}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {labels.actions.resolveRisk}
                </button>
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {tab === "companion_insights" ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.companion.insights}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
              {companionInsights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.companion.pendingAssistance}</h2>
            <div className="mt-3 space-y-3">
              {pendingAssistance.map((item) => (
                <div key={String(item.id)} className="rounded-xl border border-zinc-100 p-3">
                  <p className="font-medium text-zinc-900">{String(item.title ?? "")}</p>
                  <p className="mt-1 text-sm text-zinc-600">{String(item.message ?? "")}</p>
                  <button
                    type="button"
                    disabled={busyId === String(item.id)}
                    onClick={() =>
                      void performAction({ action: "deliver_proactive", id: String(item.id) })
                    }
                    className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {labels.actions.deliverProactive}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {tab === "executive" ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.executive_dashboard ?? {}).map(([key, value]) => (
            <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
          ))}
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.reports.title}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {Object.entries(center.reports ?? {}).map(([key, value]) => (
              <div key={key}>
                <dt className="text-xs uppercase text-zinc-500">{key.replace(/_/g, " ")}</dt>
                <dd className="mt-1 text-sm text-zinc-900">
                  {Array.isArray(value) ? value.join(" · ") : String(value)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {center.audit_recent?.length ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-zinc-900">Audit</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600">
            {center.audit_recent.map((entry, i) => (
              <li key={`${entry.event_type}-${i}`}>
                {entry.summary}
                {entry.created_at ? ` · ${new Date(entry.created_at).toLocaleString()}` : ""}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.mobile_access?.supported ? (
        <p className="text-xs text-zinc-500">
          Mobile access supported — Customer Success Managers can review health, onboarding, risks, and opportunities on mobile.
        </p>
      ) : null}
    </div>
  );
}
