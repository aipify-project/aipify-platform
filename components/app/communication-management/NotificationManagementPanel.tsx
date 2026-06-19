"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseNotificationManagementCenter,
  type CommNotification,
  type NotificationManagementCenter,
  type NotificationManagementLabels,
} from "@/lib/communication-management";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

export function NotificationManagementPanel({ labels }: { labels: NotificationManagementLabels }) {
  const [center, setCenter] = useState<NotificationManagementCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/notifications-center");
    if (res.ok) setCenter(parseNotificationManagementCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function markRead(id: string) {
    setBusy(true);
    await fetch("/api/app/communications/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type: "mark_read", payload: { notification_id: id } }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) return <div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /></div>;
  if (!center?.found) return <AipifyModuleAccessDenied message={labels.accessDenied} />;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        {center.communications_route ? (
          <Link href={center.communications_route} className="mt-3 inline-block text-sm text-indigo-700 hover:underline">{labels.communicationsLink}</Link>
        ) : null}
      </div>

      {center.overview ? (
        <div className="grid gap-3 grid-cols-3">
          <StatCard label={labels.unread} value={center.overview.unread} highlight="indigo" />
          <StatCard label={labels.critical} value={center.overview.critical} highlight="amber" />
          <StatCard label={labels.attentionRequired} value={center.overview.attention_required} />
        </div>
      ) : null}

      <NotificationList notifications={center.notifications ?? []} labels={labels} busy={busy} onMarkRead={(id) => void markRead(id)} />
    </div>
  );
}

function NotificationList({ notifications, labels, busy, onMarkRead }: { notifications: CommNotification[]; labels: NotificationManagementLabels; busy: boolean; onMarkRead: (id: string) => void }) {
  if (notifications.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="font-medium text-gray-900">{labels.noNotifications}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.noNotificationsHint}</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <div key={n.id} className={`rounded-xl border p-4 ${n.read_at ? "border-gray-200 bg-white" : "border-indigo-100 bg-indigo-50/30"}`}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs text-gray-500">{n.notification_type} · {labels.priority}: {n.priority}{n.source ? ` · ${n.source}` : ""}</p>
              <p className="mt-1 font-medium text-gray-900">{n.summary}</p>
              <p className="mt-1 text-xs text-gray-500">{new Date(n.created_at).toLocaleString()}</p>
            </div>
            {!n.read_at ? (
              <button type="button" disabled={busy} onClick={() => onMarkRead(n.id)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white">{labels.markRead}</button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: "indigo" | "amber" }) {
  const cls = highlight === "indigo" ? "border-indigo-100 bg-indigo-50/40" : highlight === "amber" ? "border-amber-100 bg-amber-50/40" : "border-gray-200 bg-white";
  return (
    <div className={`rounded-xl border p-4 ${cls}`}>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
