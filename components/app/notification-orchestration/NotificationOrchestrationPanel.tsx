"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import {
  parseNotificationOrchestrationCenter,
  type ExecutiveAlertItem,
  type NotificationItem,
  type NotificationOrchestrationCenter,
  type NotificationOrchestrationLabels,
} from "@/lib/notification-orchestration";
import { resolveAppPortalAccessMessage } from "@/lib/tenant/app-portal-access-messages";

type Tab =
  | "overview"
  | "inbox"
  | "unread"
  | "priority"
  | "approvals"
  | "tasks"
  | "system_alerts"
  | "settings"
  | "history";

const PRIORITY_STYLE: Record<string, string> = {
  low: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  normal: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  important: "bg-sky-50 text-sky-900 ring-sky-200",
  high: "bg-amber-50 text-amber-900 ring-amber-200",
  critical: "bg-red-50 text-red-900 ring-red-200",
  emergency: "bg-red-100 text-red-950 ring-red-300",
};

type Props = {
  labels: NotificationOrchestrationLabels;
  initialTab?: Tab;
  executiveOnly?: boolean;
};

export function NotificationOrchestrationPanel({
  labels,
  initialTab = "overview",
  executiveOnly = false,
}: Props) {
  const [center, setCenter] = useState<NotificationOrchestrationCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(executiveOnly ? "overview" : initialTab);
  const [busy, setBusy] = useState(false);
  const [frequency, setFrequency] = useState("instant");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/notification-orchestration");
    if (res.ok) {
      const parsed = parseNotificationOrchestrationCenter(await res.json());
      setCenter(parsed);
      if (parsed?.preferences?.frequency) setFrequency(parsed.preferences.frequency);
    } else {
      const body = (await res.json()) as { access_state?: string; error?: string };
      setCenter({
        found: false,
        access_state: body.access_state,
        error: body.error,
      } as NotificationOrchestrationCenter);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!executiveOnly) setTab(initialTab);
  }, [initialTab, executiveOnly]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/notification-orchestration/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!center?.found) {
    const message = resolveAppPortalAccessMessage(center?.access_state, {
      accessDenied: labels.accessDenied,
      organizationMissing: labels.organizationMissing,
      subscriptionRequired: labels.subscriptionRequired,
      permissionMissing: labels.permissionMissing,
      entitlementMissing: labels.entitlementMissing,
    });
    return <AipifyModuleAccessDenied message={message} />;
  }

  const overview = center.overview ?? {};
  const reports = center.reports ?? {};
  const approvalsRoute = center.routes?.approvals ?? "/app/approvals";
  const communicationsRoute = center.routes?.communications ?? "/app/communications";

  const tabs: { id: Tab; label: string }[] = executiveOnly
    ? [{ id: "overview", label: labels.executiveAlerts }]
    : [
        { id: "overview", label: labels.overview },
        { id: "inbox", label: labels.inbox },
        { id: "unread", label: labels.unread },
        { id: "priority", label: labels.priority },
        { id: "approvals", label: labels.approvals },
        { id: "tasks", label: labels.tasks },
        { id: "system_alerts", label: labels.systemAlerts },
        { id: "settings", label: labels.settings },
        { id: "history", label: labels.history },
      ];

  const listForTab = (): NotificationItem[] => {
    if (tab === "inbox") return center.inbox ?? [];
    if (tab === "unread") return center.unread ?? [];
    if (tab === "priority") return center.priority ?? [];
    if (tab === "tasks") return center.tasks ?? [];
    if (tab === "system_alerts") return center.system_alerts ?? [];
    return center.inbox ?? [];
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold text-aipify-text">
          {executiveOnly ? labels.executiveAlerts : labels.title}
        </h1>
        <p className="mt-1 text-sm text-aipify-text-secondary">{labels.subtitle}</p>
        <p className="mt-2 text-xs text-aipify-text-muted">{center.principle ?? labels.principle}</p>
        {center.philosophy ? <p className="mt-1 text-xs text-aipify-text-muted">{center.philosophy}</p> : null}
        <p className="mt-1 text-xs text-aipify-text-muted">{labels.mobileReady}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href={approvalsRoute} className={AipifyShellClasses.link}>
            {labels.openApprovals}
          </Link>
          <Link href={communicationsRoute} className={AipifyShellClasses.link}>
            {labels.openCommunications}
          </Link>
        </div>
      </header>

      {!executiveOnly ? (
        <nav className="flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={
                tab === item.id
                  ? `${AipifyShellClasses.primaryButton} text-sm`
                  : `${AipifyShellClasses.secondaryButton} text-sm`
              }
            >
              {item.label}
            </button>
          ))}
        </nav>
      ) : null}

      {(tab === "overview" || executiveOnly) && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              [labels.unreadCount, overview.unread],
              [labels.criticalCount, overview.critical],
              [labels.attentionRequired, overview.attention_required],
              [labels.pendingApprovals, overview.pending_approvals],
              [labels.executiveAlerts, overview.executive_alerts],
              [labels.taskNotifications, overview.task_notifications],
              [labels.securityAlerts, overview.security_alerts],
            ] as [string, string | number][]
          ).map(([label, value]) => (
            <div key={String(label)} className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs text-aipify-text-muted">{label}</p>
              <p className="mt-1 text-xl font-semibold text-aipify-text">{value ?? "—"}</p>
            </div>
          ))}
        </div>
      )}

      {(tab === "overview" || executiveOnly) && (center.executive_alerts?.length ?? 0) > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-aipify-text">{labels.executiveAlerts}</h2>
          {(center.executive_alerts ?? []).map((a: ExecutiveAlertItem) => (
            <div key={a.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="text-xs text-aipify-text-muted">{a.alert_number}</p>
              <h3 className="font-semibold text-aipify-text">{a.title}</h3>
              <p className="text-aipify-text-secondary">{a.summary}</p>
              <PriorityBadge priority={a.priority} />
              {a.status === "active" ? (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void runAction("acknowledge_executive_alert", { alert_id: a.id })}
                    className={AipifyShellClasses.primaryButton}
                  >
                    {labels.acknowledgeAlert}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void runAction("resolve_executive_alert", { alert_id: a.id })}
                    className={AipifyShellClasses.secondaryButton}
                  >
                    {labels.resolveAlert}
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      {["inbox", "unread", "priority", "tasks", "system_alerts"].includes(tab) ? (
        <NotificationList
          items={listForTab()}
          labels={labels}
          busy={busy}
          onMarkRead={(id) => void runAction("mark_read", { notification_id: id })}
        />
      ) : null}

      {tab === "approvals" ? (
        <div className="space-y-3">
          {(center.approvals ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.approvals} message={labels.emptyHint} />
          ) : (
            (center.approvals ?? []).map((a, i) => (
              <div key={i} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="font-semibold text-aipify-text">{String(a.title ?? "Approval")}</p>
                <p className="text-aipify-text-secondary">{String(a.approval_type ?? "")}</p>
              </div>
            ))
          )}
          <Link href={approvalsRoute} className={`inline-block ${AipifyShellClasses.primaryButton}`}>
            {labels.openApprovals}
          </Link>
        </div>
      ) : null}

      {tab === "settings" ? (
        <div className={`${AipifyShellClasses.surfaceCard} space-y-4 p-4`}>
          <label className="block text-sm">
            <span className="text-aipify-text-secondary">{labels.frequency}</span>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className={`mt-1 w-full ${AipifyShellClasses.input}`}
            >
              <option value="instant">Instant</option>
              <option value="hourly_digest">Hourly digest</option>
              <option value="daily_digest">Daily digest</option>
              <option value="weekly_digest">Weekly digest</option>
              <option value="critical_only">Critical only</option>
            </select>
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={() => void runAction("update_preferences", { frequency })}
            className={AipifyShellClasses.primaryButton}
          >
            {labels.savePreferences}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void runAction("generate_digest", { digest_type: "daily", summary: "Daily summary" })}
            className={AipifyShellClasses.secondaryButton}
          >
            {labels.generateDigest}
          </button>
        </div>
      ) : null}

      {tab === "history" ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <ReportMetric label={labels.notificationVolume} value={reports.notification_volume_30d} />
            <ReportMetric label={labels.readRate} value={reports.read_rate_pct} />
            <ReportMetric label={labels.digestsGenerated} value={reports.digests_generated} />
          </div>
          {(center.history ?? []).map((h, i) => (
            <div key={i} className={`${AipifyShellClasses.surfaceCard} p-3 text-sm`}>
              <p className="text-aipify-text">{String(h.summary ?? "")}</p>
              <p className="text-xs text-aipify-text-muted">{String(h.delivery_status ?? "")}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const style = PRIORITY_STYLE[priority] ?? PRIORITY_STYLE.normal;
  return (
    <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${style}`}>{priority}</span>
  );
}

function NotificationList({
  items,
  labels,
  busy,
  onMarkRead,
}: {
  items: NotificationItem[];
  labels: NotificationOrchestrationLabels;
  busy: boolean;
  onMarkRead: (id: string) => void;
}) {
  if (items.length === 0) {
    return <PlatformEmptyState title={labels.noNotifications} message={labels.emptyHint} />;
  }
  return (
    <div className="space-y-3">
      {items.map((n) => (
        <div
          key={n.id}
          className={`${AipifyShellClasses.surfaceCard} p-4 text-sm ${n.read_at ? "" : "ring-1 ring-sky-200"}`}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs text-aipify-text-muted">{n.notification_type.replace(/_/g, " ")}</p>
              <p className="font-semibold text-aipify-text">{n.summary}</p>
              <PriorityBadge priority={n.priority} />
            </div>
            {!n.read_at ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => onMarkRead(n.id)}
                className={AipifyShellClasses.primaryButton}
              >
                {labels.markRead}
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportMetric({ label, value }: { label: string; value: unknown }) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4`}>
      <p className="text-xs text-aipify-text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold text-aipify-text">{value != null ? String(value) : "—"}</p>
    </div>
  );
}
