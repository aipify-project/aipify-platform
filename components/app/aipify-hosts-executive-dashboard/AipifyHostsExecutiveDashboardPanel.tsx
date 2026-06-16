"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseAipifyHostsExecutiveDashboard,
  parseAipifyHostsExecutiveDashboardActionResult,
  type HostsExecutiveDashboard,
  type HostsExecutiveWidgetKey,
} from "@/lib/aipify/aipify-hosts-executive-dashboard";

type Props = { labels: Record<string, string> };

function labelFor(labels: Record<string, string>, prefix: string, key: string): string {
  return labels[`${prefix}_${key}`] ?? key.replace(/_/g, " ");
}

function severityClass(severity: string): string {
  const map: Record<string, string> = {
    critical: "border-red-200 bg-red-50/60",
    high: "border-amber-200 bg-amber-50/60",
    medium: "border-sky-200 bg-sky-50/60",
  };
  return map[severity] ?? "border-gray-200 bg-white";
}

function healthBadge(level: string): string {
  const map: Record<string, string> = {
    excellent: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    good: "bg-sky-50 text-sky-800 ring-sky-200",
    attention_required: "bg-amber-50 text-amber-900 ring-amber-200",
    critical: "bg-red-50 text-red-800 ring-red-200",
  };
  return map[level] ?? "bg-gray-100 text-gray-700 ring-gray-200";
}

function MetricCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

function WidgetShell({
  id,
  title,
  collapsed,
  onToggle,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  labels,
  children,
}: {
  id: string;
  title: string;
  collapsed: boolean;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  labels: Record<string, string>;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-4">
        <button type="button" onClick={onToggle} className="text-left text-base font-semibold text-gray-900">
          {title} {collapsed ? "+" : "−"}
        </button>
        <div className="flex gap-2">
          <button type="button" disabled={!canMoveUp} onClick={onMoveUp} className="rounded border border-gray-200 px-2 py-1 text-xs disabled:opacity-40">{labels.moveUp}</button>
          <button type="button" disabled={!canMoveDown} onClick={onMoveDown} className="rounded border border-gray-200 px-2 py-1 text-xs disabled:opacity-40">{labels.moveDown}</button>
        </div>
      </div>
      {!collapsed && <div className="p-5">{children}</div>}
    </section>
  );
}

export function AipifyHostsExecutiveDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<HostsExecutiveDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [widgetOrder, setWidgetOrder] = useState<HostsExecutiveWidgetKey[]>([]);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const res = await fetch("/api/aipify/aipify-hosts/executive-dashboard/dashboard");
    if (res.ok) {
      const parsed = parseAipifyHostsExecutiveDashboard(await res.json());
      setDashboard(parsed);
      if (parsed) {
        const order = (parsed.widget_preferences.widget_order.length > 0
          ? parsed.widget_preferences.widget_order
          : parsed.default_widgets) as HostsExecutiveWidgetKey[];
        setWidgetOrder(order);
        setCollapsed(parsed.widget_preferences.collapsed ?? {});
      }
    } else {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const savePreferences = async (order: HostsExecutiveWidgetKey[], collapsedMap: Record<string, boolean>) => {
    setBusy(true);
    const res = await fetch("/api/aipify/aipify-hosts/executive-dashboard/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action_type: "save_widget_preferences",
        preferences: { widget_order: order, collapsed: collapsedMap },
      }),
    });
    const result = parseAipifyHostsExecutiveDashboardActionResult(await res.json());
    setBusy(false);
    if (result.success) setActionMessage(result.summary ?? labels.preferencesSaved);
  };

  const moveWidget = (key: HostsExecutiveWidgetKey, direction: -1 | 1) => {
    const idx = widgetOrder.indexOf(key);
    if (idx < 0) return;
    const next = idx + direction;
    if (next < 0 || next >= widgetOrder.length) return;
    const copy = [...widgetOrder];
    [copy[idx], copy[next]] = [copy[next], copy[idx]];
    setWidgetOrder(copy);
    void savePreferences(copy, collapsed);
  };

  const toggleCollapsed = (key: HostsExecutiveWidgetKey) => {
    const next = { ...collapsed, [key]: !collapsed[key] };
    setCollapsed(next);
    void savePreferences(widgetOrder, next);
  };

  const widgetContent = useMemo(() => {
    if (!dashboard) return {} as Record<HostsExecutiveWidgetKey, ReactNode>;

    const s = dashboard.executive_summary;
    const fmt = (n: number) => (Number.isInteger(n) ? n : n.toFixed(1));

    return {
      executive_summary: (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <MetricCard label={labels.activeProperties} value={s.active_properties} />
          <MetricCard label={labels.occupancyRate} value={`${fmt(s.occupancy_rate)}%`} />
          <MetricCard label={labels.revenueThisMonth} value={s.revenue_this_month.toLocaleString()} />
          <MetricCard label={labels.openIncidents} value={s.open_incidents} />
          <MetricCard label={labels.guestSatisfaction} value={fmt(s.guest_satisfaction_score)} />
          <MetricCard label={labels.openApprovals} value={s.open_approvals} />
        </dl>
      ),
      requires_attention: dashboard.requires_attention.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noAttentionItems}</p>
      ) : (
        <ul className="space-y-2">
          {dashboard.requires_attention.map((item, i) => (
            <li key={`${item.type}-${i}`} className={`rounded-lg border px-4 py-3 ${severityClass(item.severity)}`}>
              <Link href={item.link} className="text-sm font-medium text-gray-900 hover:text-indigo-800">{item.label}</Link>
            </li>
          ))}
        </ul>
      ),
      notifications: dashboard.notifications.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noNotifications}</p>
      ) : (
        <ul className="space-y-2">
          {dashboard.notifications.map((n, i) => (
            <li key={`${n.type}-${i}`} className="rounded-lg border border-gray-200 px-4 py-3 text-sm">
              <span className="font-medium text-gray-900">{n.title}</span>
              {n.message && <span className="text-gray-600"> — {n.message}</span>}
            </li>
          ))}
        </ul>
      ),
      todays_operations: (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard label={labels.arrivalsToday} value={dashboard.todays_operations.arrivals_today} />
          <MetricCard label={labels.departuresToday} value={dashboard.todays_operations.departures_today} />
          <MetricCard label={labels.cleaningToday} value={dashboard.todays_operations.cleaning_tasks_today} />
          <MetricCard label={labels.maintenanceToday} value={dashboard.todays_operations.maintenance_tasks_today} />
          <MetricCard label={labels.pendingGuestRequests} value={dashboard.todays_operations.pending_guest_requests} />
        </dl>
      ),
      property_health: (
        <div className="space-y-4">
          <dl className="grid gap-4 sm:grid-cols-4">
            <MetricCard label={labelFor(labels, "healthLevel", "excellent")} value={dashboard.property_health.excellent} />
            <MetricCard label={labelFor(labels, "healthLevel", "good")} value={dashboard.property_health.good} />
            <MetricCard label={labelFor(labels, "healthLevel", "attention_required")} value={dashboard.property_health.attention_required} />
            <MetricCard label={labelFor(labels, "healthLevel", "critical")} value={dashboard.property_health.critical} />
          </dl>
          {dashboard.property_health.properties.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr><th className="px-4 py-3">{labels.property}</th><th className="px-4 py-3">{labels.score}</th><th className="px-4 py-3">{labels.status}</th><th className="px-4 py-3">{labels.actions}</th></tr>
                </thead>
                <tbody>
                  {dashboard.property_health.properties.map((p) => (
                    <tr key={p.property_id} className="border-t border-gray-100">
                      <td className="px-4 py-3 font-medium">{p.property}</td>
                      <td className="px-4 py-3">{p.overall_score}%</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs ring-1 ${healthBadge(p.score_level)}`}>{labelFor(labels, "healthLevel", p.score_level)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/app/aipify-hosts/property-health?property=${p.property_id}`} className="text-xs font-medium text-indigo-700">{labels.viewHealthDetails}</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ),
      financial_snapshot: (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label={labels.revenueThisMonth} value={dashboard.financial_snapshot.revenue_this_month.toLocaleString()} />
          <MetricCard label={labels.upcomingPayouts} value={dashboard.financial_snapshot.upcoming_payouts.toLocaleString()} />
          <MetricCard label={labels.outstandingExpenses} value={dashboard.financial_snapshot.outstanding_expenses.toLocaleString()} />
          <MetricCard label={labels.estimatedNet} value={dashboard.financial_snapshot.estimated_net_position.toLocaleString()} />
        </dl>
      ),
      upcoming_events: dashboard.upcoming_events.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noUpcomingEvents}</p>
      ) : (
        <ul className="space-y-2">
          {dashboard.upcoming_events.map((e) => (
            <li key={e.id} className="rounded-lg border border-gray-200 px-4 py-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-gray-900">{e.title}</span>
                <span className="text-xs text-gray-500">{e.event_date}</span>
              </div>
              <p className="mt-1 text-gray-600">{e.property} · {labelFor(labels, "eventType", e.event_type)}</p>
              {e.summary && <p className="mt-1 text-xs text-gray-500">{e.summary}</p>}
            </li>
          ))}
        </ul>
      ),
      quick_actions: (
        <div className="flex flex-wrap gap-3">
          {dashboard.quick_actions.map((a) => (
            <Link key={a.key} href={a.route} className="inline-flex rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-100">
              {labelFor(labels, "quickAction", a.key)}
            </Link>
          ))}
        </div>
      ),
    };
  }, [dashboard, labels]);

  if (loading && !dashboard) return <AipifyLoader label={labels.loading} centered fullPage />;

  if (error || !dashboard) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6">
        <p className="text-sm font-medium text-indigo-950">{dashboard.positioning}</p>
        <p className="mt-2 text-xs text-indigo-900">{labels.governanceNote}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/app/aipify-hosts" className="inline-flex rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-50">{labels.backToHosts}</Link>
          <Link href="/app/aipify-hosts/knowledge" className="inline-flex rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-50">{labels.viewKnowledge}</Link>
        </div>
      </section>

      {actionMessage && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">{actionMessage}</p>
      )}

      {widgetOrder.map((key, idx) => (
        <WidgetShell
          key={key}
          id={key}
          title={labelFor(labels, "widget", key)}
          collapsed={Boolean(collapsed[key])}
          onToggle={() => toggleCollapsed(key)}
          onMoveUp={() => moveWidget(key, -1)}
          onMoveDown={() => moveWidget(key, 1)}
          canMoveUp={idx > 0 && !busy}
          canMoveDown={idx < widgetOrder.length - 1 && !busy}
          labels={labels}
        >
          {widgetContent[key]}
        </WidgetShell>
      ))}
    </div>
  );
}
