"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import {
  parseMobileApiIntegrationCenter,
  type MobileApiChannel,
  type MobileApiDeliveryLog,
  type MobileApiEventRule,
  type MobileApiIntegrationCenter,
  type MobileApiIntegrationLabels,
  type MobileApiPendingSend,
} from "@/lib/mobile-api-integration";

type Tab =
  | "overview"
  | "channels"
  | "control_rules"
  | "event_rules"
  | "approvals"
  | "test_mode"
  | "payload_mapping"
  | "reports"
  | "history";

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  testing: "bg-sky-50 text-sky-900 ring-sky-200",
  active: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  disabled: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  failed: "bg-red-50 text-red-900 ring-red-200",
};

type Props = {
  labels: MobileApiIntegrationLabels;
  initialTab?: Tab;
};

export function MobileApiIntegrationPanel({ labels, initialTab = "overview" }: Props) {
  const [center, setCenter] = useState<MobileApiIntegrationCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [endpointUrl, setEndpointUrl] = useState("");
  const [selectedChannelId, setSelectedChannelId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/mobile-api-integration");
    if (res.ok) setCenter(parseMobileApiIntegrationCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/mobile-api-integration/action", {
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
    return <AipifyModuleAccessDenied message={labels.accessDenied} />;
  }

  const overview = center.overview ?? {};
  const reports = center.reports ?? {};
  const settings = center.settings ?? {};
  const channels = center.channels ?? [];
  const eventRules = center.event_rules ?? [];
  const pendingSends = center.pending_sends ?? [];
  const deliveryHistory = center.delivery_history ?? [];
  const notificationsRoute = center.routes?.notifications ?? "/app/notifications";
  const pauseNonCritical = Boolean(overview.pause_non_critical ?? settings.pause_non_critical);

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "channels", label: labels.channels },
    { id: "control_rules", label: labels.controlRules },
    { id: "event_rules", label: labels.eventRules },
    { id: "approvals", label: labels.approvals },
    { id: "test_mode", label: labels.testMode },
    { id: "payload_mapping", label: labels.payloadMapping },
    { id: "reports", label: labels.reports },
    { id: "history", label: labels.history },
  ];

  function renderChannelCard(channel: MobileApiChannel) {
    return (
      <div key={channel.id} className={`${AipifyShellClasses.surfaceCard} space-y-2 p-4`}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-medium text-aipify-text">{channel.name}</p>
            <p className="text-xs text-aipify-text-muted">
              {channel.provider} · {channel.channel_type}
            </p>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-xs ring-1 ${STATUS_STYLE[channel.status] ?? STATUS_STYLE.draft}`}>
            {channel.status}
          </span>
        </div>
        {channel.endpoint_url ? (
          <p className="truncate text-xs text-aipify-text-secondary">{channel.endpoint_url}</p>
        ) : null}
        <p className="text-xs text-aipify-text-muted">
          {labels.rateLimits}: {channel.rate_limit_per_hour}/hr · {channel.daily_limit}/day
        </p>
        {channel.last_test_status ? (
          <p className="text-xs text-aipify-text-muted">
            {labels.lastTestResult}: {channel.last_test_status}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            disabled={busy}
            onClick={() => void runAction("test_channel", { channel_id: channel.id })}
            className={`${AipifyShellClasses.secondaryButton} text-xs`}
          >
            {labels.testChannel}
          </button>
          {channel.last_test_status === "success" && channel.status !== "active" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void runAction("activate_channel", { channel_id: channel.id })}
              className={`${AipifyShellClasses.primaryButton} text-xs`}
            >
              {labels.activateChannel}
            </button>
          ) : null}
          {channel.status !== "disabled" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void runAction("disable_channel", { channel_id: channel.id })}
              className={`${AipifyShellClasses.secondaryButton} text-xs`}
            >
              {labels.disableChannel}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold text-aipify-text">{labels.title}</h1>
        <p className="mt-1 text-sm text-aipify-text-secondary">{labels.subtitle}</p>
        <p className="mt-2 text-xs text-aipify-text-muted">{center.principle ?? labels.principle}</p>
        {center.philosophy ? <p className="mt-1 text-xs text-aipify-text-muted">{center.philosophy}</p> : null}
        <Link href={notificationsRoute} className={`mt-3 inline-block text-sm ${AipifyShellClasses.link}`}>
          {labels.openNotifications}
        </Link>
      </header>

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

      {tab === "overview" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                [labels.activeChannels, overview.active_channels],
                [labels.testingChannels, overview.testing_channels],
                [labels.pendingApprovals, overview.pending_approvals],
                [labels.sent30d, overview.sent_30d],
                [labels.suppressed30d, overview.suppressed_30d],
                [labels.failed30d, overview.failed_30d],
              ] as [string, string | number][]
            ).map(([label, value]) => (
              <div key={String(label)} className={`${AipifyShellClasses.surfaceCard} p-4`}>
                <p className="text-xs text-aipify-text-muted">{label}</p>
                <p className="mt-1 text-xl font-semibold text-aipify-text">{value ?? "—"}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {pauseNonCritical ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => void runAction("resume_non_critical")}
                className={`${AipifyShellClasses.primaryButton} text-sm`}
              >
                {labels.resumeNonCritical}
              </button>
            ) : (
              <button
                type="button"
                disabled={busy}
                onClick={() => void runAction("pause_non_critical")}
                className={`${AipifyShellClasses.secondaryButton} text-sm`}
              >
                {labels.pauseNonCritical}
              </button>
            )}
          </div>
        </>
      )}

      {tab === "channels" && (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} space-y-3 p-4`}>
            <p className="text-sm font-medium text-aipify-text">{labels.createChannel}</p>
            <input
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder={labels.channelName}
              className={AipifyShellClasses.input}
            />
            <input
              value={endpointUrl}
              onChange={(e) => setEndpointUrl(e.target.value)}
              placeholder={labels.endpointUrl}
              className={AipifyShellClasses.input}
            />
            <button
              type="button"
              disabled={busy || !channelName.trim()}
              onClick={() => {
                void runAction("create_channel", { name: channelName.trim(), endpoint_url: endpointUrl.trim() || null });
                setChannelName("");
                setEndpointUrl("");
              }}
              className={`${AipifyShellClasses.primaryButton} text-sm`}
            >
              {labels.createChannel}
            </button>
          </div>
          {channels.length === 0 ? (
            <PlatformEmptyState title={labels.noChannels} message={labels.emptyHint} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">{channels.map(renderChannelCard)}</div>
          )}
        </div>
      )}

      {tab === "control_rules" && (
        <div className={`${AipifyShellClasses.surfaceCard} space-y-4 p-4`}>
          <p className="text-sm font-medium text-aipify-text">{labels.controlRules}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-aipify-text-muted">{labels.quietHours}</p>
              <p className="text-sm text-aipify-text">
                {settings.default_quiet_hours_start ?? "18:00"} – {settings.default_quiet_hours_end ?? "08:00"}
              </p>
            </div>
            <div>
              <p className="text-xs text-aipify-text-muted">{labels.priorityFiltering}</p>
              <p className="text-sm text-aipify-text">
                Low → digest · Critical/Emergency → immediate + escalation bypass
              </p>
            </div>
            <div>
              <p className="text-xs text-aipify-text-muted">{labels.fallbackRules}</p>
              <p className="text-sm text-aipify-text">
                Email: {settings.fallback_to_email ? "yes" : "no"} · In-app:{" "}
                {settings.fallback_to_in_app ? "yes" : "no"} · Max retries: {settings.max_retries ?? 3}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void runAction("update_settings", {
                emergency_bypass_enabled: true,
                fallback_to_email: true,
                fallback_to_in_app: true,
              })
            }
            className={`${AipifyShellClasses.primaryButton} text-sm`}
          >
            {labels.saveSettings}
          </button>
        </div>
      )}

      {tab === "event_rules" && (
        <div className="space-y-3">
          {(center.default_event_keys ?? []).slice(0, 8).map((eventKey) => {
            const rule = eventRules.find((r: MobileApiEventRule) => r.event_key === eventKey);
            return (
              <div key={eventKey} className={`${AipifyShellClasses.surfaceCard} flex flex-wrap items-center justify-between gap-2 p-3`}>
                <div>
                  <p className="text-sm font-medium text-aipify-text">{eventKey}</p>
                  <p className="text-xs text-aipify-text-muted">
                    {rule ? `${labels.status}: ${rule.enabled ? "enabled" : "disabled"}` : "Not configured"}
                  </p>
                </div>
                {channels[0] ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      void runAction("update_event_rules", {
                        channel_id: channels[0].id,
                        event_key: eventKey,
                        enabled: true,
                        min_priority: "normal",
                      })
                    }
                    className={`${AipifyShellClasses.secondaryButton} text-xs`}
                  >
                    Enable
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {tab === "approvals" && (
        <div className="space-y-3">
          {pendingSends.length === 0 ? (
            <PlatformEmptyState title={labels.noPendingApprovals} message={labels.emptyHint} />
          ) : (
            pendingSends.map((item: MobileApiPendingSend) => (
              <div key={item.id} className={`${AipifyShellClasses.surfaceCard} space-y-2 p-4`}>
                <p className="font-medium text-aipify-text">{item.title}</p>
                <p className="text-xs text-aipify-text-muted">
                  {item.event_key} · {item.priority}
                </p>
                {item.message ? <p className="text-sm text-aipify-text-secondary">{item.message}</p> : null}
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void runAction("approve_pending_send", { pending_send_id: item.id })}
                    className={`${AipifyShellClasses.primaryButton} text-xs`}
                  >
                    {labels.approveBroadcast}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void runAction("reject_pending_send", { pending_send_id: item.id })}
                    className={`${AipifyShellClasses.secondaryButton} text-xs`}
                  >
                    {labels.rejectBroadcast}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "test_mode" && (
        <div className="space-y-4">
          <p className="text-sm text-aipify-text-secondary">{labels.testMode}</p>
          {channels.length === 0 ? (
            <PlatformEmptyState title={labels.noChannels} message={labels.emptyHint} />
          ) : (
            channels.map(renderChannelCard)
          )}
        </div>
      )}

      {tab === "payload_mapping" && (
        <div className={`${AipifyShellClasses.surfaceCard} space-y-3 p-4`}>
          <p className="text-sm font-medium text-aipify-text">{labels.payloadMapping}</p>
          <p className="text-xs text-aipify-text-muted">{(center.payload_fields ?? []).join(" · ")}</p>
          <select
            value={selectedChannelId}
            onChange={(e) => setSelectedChannelId(e.target.value)}
            className={AipifyShellClasses.input}
          >
            <option value="">{labels.channels}</option>
            {channels.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={busy || !selectedChannelId}
            onClick={() =>
              void runAction("update_payload_mapping", {
                channel_id: selectedChannelId,
                payload_mapping: {
                  recipient_id: "employee_id",
                  title: "title",
                  message: "message",
                  deep_link: "deep_link",
                },
              })
            }
            className={`${AipifyShellClasses.primaryButton} text-sm`}
          >
            {labels.saveSettings}
          </button>
        </div>
      )}

      {tab === "reports" && (
        <div className="grid gap-4 sm:grid-cols-3">
          {(
            [
              [labels.sent30d, reports.sent_30d],
              [labels.suppressed30d, reports.suppressed_30d],
              [labels.failed30d, reports.failed_30d],
            ] as [string, string | number][]
          ).map(([label, value]) => (
            <div key={String(label)} className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs text-aipify-text-muted">{label}</p>
              <p className="mt-1 text-xl font-semibold text-aipify-text">{value ?? "—"}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-2">
          {deliveryHistory.length === 0 ? (
            <PlatformEmptyState title={labels.history} message={labels.emptyHint} />
          ) : (
            deliveryHistory.map((log: MobileApiDeliveryLog) => (
              <div key={log.id} className={`${AipifyShellClasses.surfaceCard} p-3`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-aipify-text">{log.summary ?? log.event_key}</p>
                  <span className="text-xs text-aipify-text-muted">{log.delivery_status}</span>
                </div>
                {log.suppression_reason ? (
                  <p className="text-xs text-aipify-text-muted">{log.suppression_reason}</p>
                ) : null}
              </div>
            ))
          )}
        </div>
      )}

      {(center.audit_recent ?? []).length > 0 ? (
        <section className={`${AipifyShellClasses.surfaceCard} p-4`}>
          <h2 className="text-sm font-medium text-aipify-text">{labels.auditLog}</h2>
          <ul className="mt-3 space-y-2">
            {(center.audit_recent ?? []).slice(0, 8).map((entry) => (
              <li key={`${entry.action}-${entry.created_at}`} className="text-xs text-aipify-text-secondary">
                {entry.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
