"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  ACTION_STATUS_BADGES,
  ACTIVITY_STATUS_BADGES,
  ALERT_PRIORITY_BADGES,
  DEPARTMENT_STATUS_BADGES,
  HEADQUARTERS_TABS,
  METRIC_TREND_BADGES,
  PULSE_STATUS_BADGES,
  WAR_ROOM_STATUS_BADGES,
  parseHeadquartersCenter,
  type HeadquartersCenter,
  type HeadquartersLabels,
  type HeadquartersTab,
} from "@/lib/customer-headquarters-operations";

type Props = {
  labels: HeadquartersLabels;
  backHref: string;
  initialTab?: HeadquartersTab;
  visibleTabs?: HeadquartersTab[];
  titleOverride?: string;
  showWarRoom?: boolean;
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
              item.department_title ?? item.activity_title ?? item.action_title
                ?? item.alert_title ?? item.metric_title ?? item.pulse_area
                ?? item.meeting_title ?? item.coordination_title ?? item.war_room_title
                ?? item.title ?? i
            )}
          </p>
          {item.summary ? <p className="mt-1 text-zinc-600">{String(item.summary)}</p> : null}
          <div className="mt-2 flex flex-wrap gap-1">
            {item.department_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${DEPARTMENT_STATUS_BADGES[String(item.department_status)] ?? DEPARTMENT_STATUS_BADGES.active}`}>
                {String(item.department_status)}
              </span>
            ) : null}
            {item.activity_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${ACTIVITY_STATUS_BADGES[String(item.activity_status)] ?? ACTIVITY_STATUS_BADGES.live}`}>
                {String(item.activity_status)}
              </span>
            ) : null}
            {item.action_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${ACTION_STATUS_BADGES[String(item.action_status)] ?? ACTION_STATUS_BADGES.open}`}>
                {String(item.action_status)}
              </span>
            ) : null}
            {item.priority ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${ALERT_PRIORITY_BADGES[String(item.priority)] ?? ALERT_PRIORITY_BADGES.moderate}`}>
                {String(item.priority)}
              </span>
            ) : null}
            {item.pulse_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${PULSE_STATUS_BADGES[String(item.pulse_status)] ?? PULSE_STATUS_BADGES.strong}`}>
                {String(item.pulse_status)}
              </span>
            ) : null}
            {item.war_room_status ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${WAR_ROOM_STATUS_BADGES[String(item.war_room_status)] ?? WAR_ROOM_STATUS_BADGES.standby}`}>
                {String(item.war_room_status)}
              </span>
            ) : null}
            {item.metric_trend ? (
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${METRIC_TREND_BADGES[String(item.metric_trend)] ?? METRIC_TREND_BADGES.stable}`}>
                {String(item.metric_trend)}
              </span>
            ) : null}
            {item.health_score != null ? (
              <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{String(item.health_score)}</span>
            ) : null}
            {item.metric_value != null ? (
              <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">{String(item.metric_value)}</span>
            ) : null}
            {item.owner_name ? (
              <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">{String(item.owner_name)}</span>
            ) : null}
          </div>
        </div>
      ))}
    </>
  );
}

export function HeadquartersPanel({ labels, backHref, initialTab = "overview", visibleTabs, titleOverride, showWarRoom }: Props) {
  const tabs = visibleTabs ?? HEADQUARTERS_TABS;
  const [center, setCenter] = useState<HeadquartersCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<HeadquartersTab>(initialTab);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/headquarters-operations");
    if (res.ok) setCenter(parseHeadquartersCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  const runAction = useCallback(async (action_type: string, payload: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      const res = await fetch("/api/app/headquarters-operations/action", {
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
  const operations = center.operations_room ?? {};
  const executive = center.executive_room ?? {};
  const companion = center.companion ?? {};
  const directorPrompts = (companion.operations_director_prompts as string[]) ?? [];
  const assistantPrompts = (companion.headquarters_assistant_prompts as string[]) ?? [];
  const recommendations = (center.reports?.companion_recommendations as Record<string, unknown>[]) ?? [];
  const execRecommendations = (executive.companion_recommendations as Record<string, unknown>[]) ?? [];

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
        <button type="button" disabled={busy} onClick={() => void runAction("refresh_headquarters")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {labels.actions.refreshHeadquarters}
        </button>
        <button type="button" disabled={busy} onClick={() => void runAction("generate_briefing")}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50">
          {labels.actions.generateBriefing}
        </button>
        <Link href="/app/headquarters/operations" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openOperations}</Link>
        <Link href="/app/headquarters/executive" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openExecutive}</Link>
        <Link href="/app/headquarters/war-room" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openWarRoom}</Link>
        <Link href="/app/executive-copilot" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">{labels.actions.openExecutiveCopilot}</Link>
        {showWarRoom ? (
          <button type="button" disabled={busy} onClick={() => void runAction("activate_war_room")}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
            {labels.actions.activateWarRoom}
          </button>
        ) : null}
      </div>

      {showWarRoom && (center.war_room ?? []).length ? (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <h2 className="font-semibold text-red-900">{labels.warRoomTitle}</h2>
          <div className="mt-4"><JsonList items={center.war_room ?? []} /></div>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {tabs.map((key) => (
          <button key={key} type="button" onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${tab === key ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"}`}>
            {labels.tabs[key]}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <OverviewCard label={labels.overview.organizationHealth} value={Number(overview.organization_health ?? 0)} />
          <OverviewCard label={labels.overview.revenueHealth} value={Number(overview.revenue_health ?? 0)} />
          <OverviewCard label={labels.overview.operationalHealth} value={Number(overview.operational_health ?? 0)} />
          <OverviewCard label={labels.overview.customerHealth} value={Number(overview.customer_health ?? 0)} />
          <OverviewCard label={labels.overview.partnerHealth} value={Number(overview.partner_health ?? 0)} />
          <OverviewCard label={labels.overview.riskHealth} value={Number(overview.risk_health ?? 0)} />
          <OverviewCard label={labels.overview.companionHealth} value={Number(overview.companion_health ?? 0)} />
          <OverviewCard label={labels.overview.organizationPulse} value={Number(overview.organization_pulse ?? 0)} />
          <OverviewCard label={labels.overview.activeAlerts} value={Number(overview.active_alerts ?? 0)} />
          <OverviewCard label={labels.overview.pendingApprovals} value={Number(overview.pending_approvals ?? 0)} />
          <OverviewCard label={labels.overview.liveStatus} value={String(overview.live_status ?? "operational")} />
        </dl>
      ) : null}

      {tab === "operations_room" ? (
        <section className="space-y-6">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <OverviewCard label={labels.operations.activeProjects} value={Number(operations.active_projects ?? 0)} />
            <OverviewCard label={labels.operations.pendingTasks} value={Number(operations.pending_tasks ?? 0)} />
            <OverviewCard label={labels.operations.criticalIssues} value={Number(operations.critical_issues ?? 0)} />
          </dl>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.liveActivityFeed}</h2>
            <div className="mt-4"><JsonList items={(operations.live_activity_feed as Record<string, unknown>[]) ?? center.live_activity ?? []} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.actionCoordinationBoard}</h2>
            <div className="mt-4"><JsonList items={center.actions ?? []} /></div>
          </div>
          <JsonList items={center.metrics ?? []} />
        </section>
      ) : null}

      {tab === "executive_room" ? (
        <section className="space-y-6">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <OverviewCard label={labels.executive.strategicHealth} value={Number(executive.strategic_health ?? 0)} />
            <OverviewCard label={labels.executive.majorRisks} value={Number(executive.major_risks ?? 0)} />
            <OverviewCard label={labels.executive.futureReadiness} value={Number(executive.future_readiness ?? 0)} />
          </dl>
          <p className="text-sm text-zinc-600">{String(executive.revenue_forecast ?? "")}</p>
          <JsonList items={execRecommendations} />
        </section>
      ) : null}

      {tab === "departments" ? (
        <section><JsonList items={center.departments ?? []} /></section>
      ) : null}

      {tab === "live_activity" ? (
        <section><JsonList items={center.live_activity ?? []} /></section>
      ) : null}

      {tab === "approvals" ? (
        <section><JsonList items={(center.actions ?? []).filter((a) => a.approval_required)} /></section>
      ) : null}

      {tab === "alerts" ? (
        <section className="space-y-3">
          {(center.alerts ?? []).map((alert) => (
            <div key={String(alert.alert_key)}>
              <JsonList items={[alert]} />
              {alert.alert_status === "active" ? (
                <button type="button" disabled={busy}
                  onClick={() => void runAction("acknowledge_alert", { alert_key: alert.alert_key })}
                  className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">
                  {labels.actions.acknowledgeAlert}
                </button>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {tab === "companion" ? (
        <section className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.operationsDirector}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
              {directorPrompts.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-zinc-900">{labels.sections.headquartersAssistant}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
              {assistantPrompts.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
        </section>
      ) : null}

      {tab === "reports" ? (
        <section className="space-y-6">
          <JsonList items={recommendations} />
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.organizationalPulse}</h2>
            <div className="mt-4"><JsonList items={center.pulse ?? []} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.meetingCommandCenter}</h2>
            <div className="mt-4"><JsonList items={center.meetings ?? []} /></div>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900">{labels.sections.crossDepartmentCoordination}</h2>
            <div className="mt-4"><JsonList items={center.coordination ?? []} /></div>
          </div>
        </section>
      ) : null}

      {center.executive_dashboard ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.executive_dashboard).map(([key, value]) => (
            <OverviewCard key={key} label={key.replace(/_/g, " ")} value={String(value)} />
          ))}
        </section>
      ) : null}

      {(center.audit_recent ?? []).length ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-zinc-900">{labels.sections.audit}</h2>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600">
            {(center.audit_recent ?? []).map((entry, i) => (
              <li key={i}>{entry.summary || entry.event_type}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
