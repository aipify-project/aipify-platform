"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CALENDAR_PROVIDERS,
  OAUTH_PROVIDERS,
  parseCalendarCenter,
  type CalendarCenterBundle,
  type CalendarConnection,
} from "@/lib/context-engine";
import { formatDate } from "@/lib/i18n/format-date";

type CalendarDashboardPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    privacy: string;
    connect: string;
    disconnect: string;
    connecting: string;
    viewContext: string;
    sections: {
      connections: string;
      providers: string;
      activity: string;
      syncHistory: string;
      permissions: string;
    };
    providers: Record<string, string>;
    purposes: Record<string, string>;
    statuses: Record<string, string>;
    empty: string;
    internalNote: string;
  };
};

export function CalendarDashboardPanel({ locale, labels }: CalendarDashboardPanelProps) {
  const [center, setCenter] = useState<CalendarCenterBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/assistant/calendars");
    if (res.ok) {
      setCenter(parseCalendarCenter(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const connectedProviders = new Set(
    (center?.connections ?? []).map((c) => c.provider)
  );

  async function connectProvider(provider: string) {
    setConnecting(provider);
    setMessage(null);
    const res = await fetch("/api/assistant/calendars/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider }),
    });
    const data = await res.json();
    setConnecting(null);
    if (data.message) setMessage(data.message);
    await refresh();
  }

  async function disconnectConnection(conn: CalendarConnection) {
    if (conn.provider === "aipify_internal") return;
    await fetch("/api/assistant/calendars/disconnect", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ connection_id: conn.id }),
    });
    await refresh();
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <Link href="/app/assistant/context" className="text-sm text-indigo-600 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center?.privacy_note && (
          <p className="mt-2 rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-sm text-sky-900">
            {center.privacy_note}
          </p>
        )}
      </div>

      {message && (
        <p className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm text-indigo-900">
          {message}
        </p>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.connections}</h2>
        {Array.isArray(center?.connections) && center.connections.length > 0 ? (
          <ul className="mt-3 space-y-3">
            {center.connections.map((conn) => (
              <li
                key={conn.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-50 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">{conn.display_name}</p>
                  <p className="text-xs text-gray-500">
                    {labels.providers[conn.provider] ?? conn.provider} ·{" "}
                    {labels.purposes[conn.calendar_purpose] ?? conn.calendar_purpose} ·{" "}
                    {labels.statuses[conn.connection_status] ?? conn.connection_status}
                  </p>
                  {conn.provider === "aipify_internal" && (
                    <p className="mt-1 text-xs text-gray-500">{labels.internalNote}</p>
                  )}
                </div>
                {conn.provider !== "aipify_internal" && conn.connection_status !== "disconnected" && (
                  <button
                    type="button"
                    onClick={() => void disconnectConnection(conn)}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    {labels.disconnect}
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-500">{labels.empty}</p>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.providers}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {CALENDAR_PROVIDERS.filter((p) => p !== "aipify_internal").map((provider) => {
            const isConnected = connectedProviders.has(provider);
            const isOAuth = OAUTH_PROVIDERS.includes(provider);
            return (
              <button
                key={provider}
                type="button"
                disabled={isConnected || connecting === provider}
                onClick={() => void connectProvider(provider)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                title={isOAuth ? labels.connecting : undefined}
              >
                {connecting === provider
                  ? labels.connecting
                  : isConnected
                    ? `✓ ${labels.providers[provider] ?? provider}`
                    : labels.providers[provider] ?? provider}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-gray-500">
          {labels.sections.permissions}: OAuth authorization required for external providers.
        </p>
      </section>

      {Array.isArray(center?.recent_events) && center.recent_events.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.activity}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {center.recent_events.map((e) => (
              <li key={e.id} className="rounded-lg bg-gray-50 px-3 py-2">
                {e.title} — {formatDate(e.starts_at, locale)}
              </li>
            ))}
          </ul>
        </section>
      )}

      {Array.isArray(center?.sync_history) && center.sync_history.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.sections.syncHistory}</h2>
          <ul className="mt-3 space-y-2 text-xs text-gray-600">
            {center.sync_history.map((log) => (
              <li key={log.id} className="rounded-lg bg-gray-50 px-3 py-2">
                <span className="font-medium">{log.sync_status}</span> — {log.message}
                <span className="ml-2 text-gray-400">
                  {formatDate(log.created_at, locale)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link href="/app/assistant/context" className="text-sm text-indigo-600 hover:underline">
        {labels.viewContext}
      </Link>
    </div>
  );
}
