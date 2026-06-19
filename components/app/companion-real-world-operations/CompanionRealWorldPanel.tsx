"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  APPROVAL_LEVEL_BADGES,
  BOOKING_STATUS_BADGES,
  REAL_WORLD_TABS,
  parseCompanionRealWorldCenter,
  type CompanionRealWorldCenter,
  type CompanionRealWorldLabels,
  type CompanionRealWorldTab,
  type RealWorldApproval,
  type RealWorldBooking,
} from "@/lib/customer-companion-real-world-operations";

type Props = {
  labels: CompanionRealWorldLabels;
  backHref: string;
  initialTab?: CompanionRealWorldTab;
  visibleTabs?: CompanionRealWorldTab[];
  titleOverride?: string;
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
              item.service_title ?? item.delivery_title ?? item.execution_title ??
                item.provider_name ?? item.rule_title ?? item.location_title ??
                item.pack_title ?? item.title ?? i
            )}
          </p>
          {(item.summary ?? item.outcome_summary ?? item.destination_label) ? (
            <p className="mt-1 text-zinc-600">
              {String(item.summary ?? item.outcome_summary ?? item.destination_label)}
            </p>
          ) : null}
          {item.service_category ? (
            <p className="mt-1 text-xs text-zinc-500">{String(item.service_category)}</p>
          ) : null}
          {item.estimated_cost_nok != null ? (
            <p className="mt-1 text-xs text-zinc-500">{String(item.estimated_cost_nok)} NOK</p>
          ) : null}
          {item.booking_status ? (
            <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${BOOKING_STATUS_BADGES[String(item.booking_status)] ?? BOOKING_STATUS_BADGES.pending}`}>
              {String(item.booking_status)}
            </span>
          ) : null}
          {item.approval_level ? (
            <span className={`mt-2 ml-1 inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${APPROVAL_LEVEL_BADGES[String(item.approval_level)] ?? APPROVAL_LEVEL_BADGES.manager}`}>
              {String(item.approval_level)}
            </span>
          ) : null}
        </div>
      ))}
    </>
  );
}

function ApprovalCard({
  item, labels, busy, onApprove, onDeny,
}: {
  item: RealWorldApproval;
  labels: CompanionRealWorldLabels;
  busy: boolean;
  onApprove: (key: string) => void;
  onDeny: (key: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="font-medium text-zinc-900">{item.approval_title}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      <p className="mt-2 text-xs text-zinc-500">
        {item.approval_level} · {item.approval_status}
        {item.cost_threshold_nok != null ? ` · ${item.cost_threshold_nok} NOK` : ""}
      </p>
      {item.approval_status === "pending" ? (
        <div className="mt-3 flex gap-2">
          <button type="button" disabled={busy} onClick={() => onApprove(item.approval_key)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
            {labels.actions.approveService}
          </button>
          <button type="button" disabled={busy} onClick={() => onDeny(item.approval_key)}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium disabled:opacity-50">
            {labels.actions.denyService}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function BookingCard({
  item, labels, busy, onConfirm, onCancel,
}: {
  item: RealWorldBooking;
  labels: CompanionRealWorldLabels;
  busy: boolean;
  onConfirm: (key: string) => void;
  onCancel: (key: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="font-medium text-zinc-900">{item.service_title}</p>
      {item.summary ? <p className="mt-1 text-sm text-zinc-600">{item.summary}</p> : null}
      <p className="mt-2 text-xs text-zinc-500">
        {item.provider_name} · {item.location_label} · {item.booking_status}
        {item.estimated_cost_nok != null ? ` · ${item.estimated_cost_nok} NOK` : ""}
      </p>
      {item.booking_status === "pending" || item.booking_status === "requires_review" ? (
        <div className="mt-3 flex gap-2">
          <button type="button" disabled={busy} onClick={() => onConfirm(item.booking_key)}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
            {labels.actions.confirmBooking}
          </button>
          <button type="button" disabled={busy} onClick={() => onCancel(item.booking_key)}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium disabled:opacity-50">
            {labels.actions.cancelBooking}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function CompanionRealWorldPanel({
  labels, backHref, initialTab = "overview", visibleTabs, titleOverride,
}: Props) {
  const tabs = visibleTabs ?? REAL_WORLD_TABS;
  const [center, setCenter] = useState<CompanionRealWorldCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<CompanionRealWorldTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/companion-real-world-operations");
    if (res.ok) setCenter(parseCompanionRealWorldCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/companion-real-world-operations/action", {
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
  const costGovernance = (center.integrations?.cost_governance as Record<string, unknown>[]) ?? [];
  const locations = (center.integrations?.location_awareness as Record<string, unknown>[]) ?? [];
  const workflow = (center.integrations?.action_workflow as string[]) ?? [];
  const coordinatorPrompts = (center.integrations?.service_coordinator_prompts as string[]) ?? [];
  const businessPacks = (center.integrations?.business_pack_links as Record<string, unknown>[]) ?? [];
  const serviceHistory = (center.reports?.service_history as Record<string, unknown>[]) ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{titleOverride ?? labels.title}</h1>
        <p className="mt-2 max-w-3xl text-zinc-600">{labels.subtitle}</p>
        <p className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm text-zinc-800">{center.principle}</p>
        {center.philosophy ? <p className="mt-3 text-sm text-zinc-600">{center.philosophy}</p> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_coordination")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshCoordination}
        </button>
        <Link href="/app/companion/bookings" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openBookings}</Link>
        <Link href="/app/companion/ecosystem" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openEcosystem}</Link>
        <Link href="/app/companion/governance" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openGovernance}</Link>
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
          <OverviewCard label={labels.overview.activeRequests} value={Number(overview.active_requests ?? 0)} />
          <OverviewCard label={labels.overview.pendingApprovals} value={Number(overview.pending_approvals ?? 0)} />
          <OverviewCard label={labels.overview.upcomingBookings} value={Number(overview.upcoming_bookings ?? 0)} />
          <OverviewCard label={labels.overview.activeExecutions} value={Number(overview.active_executions ?? 0)} />
          <OverviewCard label={labels.overview.activeDeliveries} value={Number(overview.active_deliveries ?? 0)} />
          <OverviewCard label={labels.overview.totalServiceCost} value={`${Number(overview.total_service_cost_nok ?? 0)} NOK`} />
          <OverviewCard label={labels.overview.completedServices} value={Number(overview.completed_services ?? 0)} />
        </dl>
      ) : null}

      {tab === "requests" ? <section className="space-y-3"><JsonList items={center.requests ?? []} /></section> : null}

      {tab === "approvals" ? (
        <section className="space-y-3">
          {(center.approvals ?? []).map((item) => (
            <ApprovalCard key={item.approval_key} item={item} labels={labels} busy={busy}
              onApprove={(key) => void runAction("approve_service", { approval_key: key })}
              onDeny={(key) => void runAction("deny_service", { approval_key: key })} />
          ))}
        </section>
      ) : null}

      {tab === "providers" ? <section className="space-y-3"><JsonList items={center.providers ?? []} /></section> : null}

      {tab === "bookings" ? (
        <section className="space-y-3">
          {(center.bookings ?? []).map((item) => (
            <BookingCard key={item.booking_key} item={item} labels={labels} busy={busy}
              onConfirm={(key) => void runAction("confirm_booking", { booking_key: key })}
              onCancel={(key) => void runAction("cancel_booking", { booking_key: key })} />
          ))}
        </section>
      ) : null}

      {tab === "deliveries" ? <section className="space-y-3"><JsonList items={center.deliveries ?? []} /></section> : null}
      {tab === "executions" ? <section className="space-y-3"><JsonList items={center.executions ?? []} /></section> : null}

      {tab === "reports" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.serviceHistory}</h2>
            <div className="mt-4"><JsonList items={serviceHistory} /></div>
          </section>
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.costGovernance}</h2>
            <div className="mt-4"><JsonList items={costGovernance} /></div>
          </section>
        </div>
      ) : null}

      {tab === "executive" ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.executive_dashboard ?? {}).map(([key, value]) => (
            <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
          ))}
          <div className="col-span-full grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-zinc-900">{labels.sections.actionWorkflow}</h2>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-zinc-600">
                {workflow.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-zinc-900">{labels.sections.serviceCoordinator}</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
                {coordinatorPrompts.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-zinc-900">{labels.sections.locationAwareness}</h2>
              <div className="mt-4"><JsonList items={locations} /></div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-zinc-900">{labels.sections.businessPackIntegration}</h2>
              <div className="mt-4"><JsonList items={businessPacks} /></div>
            </div>
            <div className="col-span-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-zinc-900">{labels.sections.approvalMatrix}</h2>
              <p className="mt-2 text-sm text-zinc-600">
                {String((center.integrations?.approval_matrix as Record<string, unknown>)?.multi_step_example ?? "")}
              </p>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
