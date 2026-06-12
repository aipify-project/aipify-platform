"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  COMPANION_STATE_ANIMATION,
  type CompanionPresenceBundle,
  type CompanionPresenceState,
  resolveCompanionDeviceId,
} from "@/lib/presence/companion-presence";

export type CompanionPresenceLabels = {
  ariaIndicator: string;
  ariaPanel: string;
  ariaClose: string;
  ariaCollapse: string;
  ariaExpand: string;
  states: Record<CompanionPresenceState, string>;
  sinceLastLogin: string;
  tasks: string;
  approvals: string;
  notifications: string;
  askAipify: string;
  privacyNote: string;
  quietMode: string;
  quietModeOff: string;
  acknowledgeCritical: string;
  loading: string;
  newSinceLogin: string;
  unresolvedApprovals: string;
};

type CompanionPresenceIndicatorProps = {
  labels: CompanionPresenceLabels;
};

function AipifyCompanionMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-violet-400 text-lg font-bold text-white shadow-lg ${className}`}
      aria-hidden="true"
    >
      A
    </span>
  );
}

export default function CompanionPresenceIndicator({
  labels,
}: CompanionPresenceIndicatorProps) {
  const [bundle, setBundle] = useState<CompanionPresenceBundle | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loading, setLoading] = useState(true);

  const state: CompanionPresenceState = bundle?.current_state ?? "idle";
  const style = COMPANION_STATE_ANIMATION[state];
  const stateLabel = labels.states[state];

  const loadBundle = useCallback(async () => {
    const res = await fetch("/api/presence/companion/state");
    if (res.ok) {
      const data = (await res.json()) as CompanionPresenceBundle;
      setBundle(data);
      setCollapsed(data.user_preferences?.indicator_collapsed ?? false);
    }
    setLoading(false);
  }, []);

  const sendHeartbeat = useCallback(async () => {
    await fetch("/api/presence/companion/heartbeat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        device_id: resolveCompanionDeviceId(),
        connection_status: "online",
        metadata: { surface: "customer_app" },
      }),
    });
    await loadBundle();
  }, [loadBundle]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    void sendHeartbeat();
  }, [sendHeartbeat]);

  useEffect(() => {
    const intervalMs = (bundle?.heartbeat_interval_seconds ?? 60) * 1000;
    const id = window.setInterval(() => void sendHeartbeat(), intervalMs);
    return () => window.clearInterval(id);
  }, [sendHeartbeat, bundle?.heartbeat_interval_seconds]);

  const counts = bundle?.counts;
  const since = bundle?.since_last_login as Record<string, unknown> | undefined;

  const sinceSummary = useMemo(() => {
    if (!since || since.available === false) return null;
    const parts: string[] = [];
    const approvals = Number(since.unresolved_approvals ?? 0);
    const support = Number(since.new_support_cases ?? 0);
    if (approvals > 0) {
      parts.push(labels.unresolvedApprovals.replace("{count}", String(approvals)));
    }
    if (support > 0) {
      parts.push(labels.newSinceLogin.replace("{count}", String(support)));
    }
    return parts.length > 0 ? parts.join(" · ") : null;
  }, [since, labels]);

  async function toggleQuietMode() {
    const enabled = !(bundle?.user_preferences?.quiet_mode_enabled ?? false);
    await fetch("/api/presence/companion/state", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quiet_mode_enabled: enabled }),
    });
    await loadBundle();
  }

  async function acknowledgeCritical() {
    await fetch("/api/presence/companion/state", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acknowledge_critical: true }),
    });
    await loadBundle();
  }

  async function toggleCollapsed(next: boolean) {
    setCollapsed(next);
    setPanelOpen(!next);
    await fetch("/api/presence/companion/state", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ indicator_collapsed: next }),
    });
  }

  if (!bundle?.has_organization || bundle.indicator_enabled === false) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6 lg:bottom-8"
      data-companion-presence
    >
      {panelOpen && !collapsed && (
        <div
          role="dialog"
          aria-label={labels.ariaPanel}
          className="pointer-events-auto w-[min(100vw-2rem,20rem)] rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur-md"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                {stateLabel}
              </p>
              {loading ? (
                <p className="mt-1 text-sm text-gray-500">{labels.loading}</p>
              ) : null}
            </div>
            <button
              type="button"
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              aria-label={labels.ariaClose}
              onClick={() => setPanelOpen(false)}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {sinceSummary ? (
            <div className="mt-3 rounded-lg bg-indigo-50 px-3 py-2">
              <p className="text-xs font-medium text-indigo-800">{labels.sinceLastLogin}</p>
              <p className="mt-1 text-sm text-indigo-700">{sinceSummary}</p>
            </div>
          ) : null}

          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {(bundle.org_settings?.show_task_counts ?? true) && (
              <li className="flex justify-between">
                <span>{labels.tasks}</span>
                <span className="font-medium">{counts?.open_tasks ?? 0}</span>
              </li>
            )}
            {(bundle.org_settings?.show_approval_counts ?? true) && (
              <li className="flex justify-between">
                <span>{labels.approvals}</span>
                <span className="font-medium">{counts?.pending_approvals ?? 0}</span>
              </li>
            )}
            {(bundle.org_settings?.show_notification_counts ?? true) && (
              <li className="flex justify-between">
                <span>{labels.notifications}</span>
                <span className="font-medium">{counts?.unread_notifications ?? 0}</span>
              </li>
            )}
          </ul>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={bundle.links?.ask_aipify ?? "/app/assistant"}
              className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:from-indigo-700 hover:to-violet-700"
            >
              {labels.askAipify}
            </Link>
            <button
              type="button"
              onClick={() => void toggleQuietMode()}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              {bundle.user_preferences?.quiet_mode_enabled
                ? labels.quietModeOff
                : labels.quietMode}
            </button>
            {state === "critical_alert" &&
              (bundle.org_settings?.critical_alert_requires_ack ?? true) && (
                <button
                  type="button"
                  onClick={() => void acknowledgeCritical()}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                >
                  {labels.acknowledgeCritical}
                </button>
              )}
          </div>

          <p className="mt-3 text-xs text-gray-500">{labels.privacyNote}</p>
        </div>
      )}

      <div className="pointer-events-auto flex items-center gap-2">
        <button
          type="button"
          className="rounded-full border border-gray-200 bg-white/90 px-2 py-1 text-xs text-gray-600 shadow-sm hover:bg-gray-50"
          aria-label={collapsed ? labels.ariaExpand : labels.ariaCollapse}
          onClick={() => void toggleCollapsed(!collapsed)}
        >
          {collapsed ? "◉" : "−"}
        </button>
        <button
          type="button"
          className="group relative h-14 w-14 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
          aria-expanded={panelOpen && !collapsed}
          aria-label={`${labels.ariaIndicator} — ${stateLabel}`}
          onClick={() => {
            if (collapsed) {
              void toggleCollapsed(false);
            } else {
              setPanelOpen((open) => !open);
            }
          }}
        >
          <span
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${style.ring} blur-md ${
              reducedMotion ? "" : "animate-aipify-orb-glow"
            }`}
            aria-hidden="true"
          />
          <span
            className={`relative flex h-14 w-14 overflow-hidden rounded-full ring-4 ring-white/90 ${
              reducedMotion ? "" : style.animation
            }`}
          >
            <AipifyCompanionMark />
          </span>
        </button>
      </div>
    </div>
  );
}
