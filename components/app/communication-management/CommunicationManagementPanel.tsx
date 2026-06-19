"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseCommunicationManagementCenter,
  type CommAnnouncement,
  type CommMessage,
  type CommunicationManagementCenter,
  type CommunicationManagementLabels,
} from "@/lib/communication-management";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";

type Tab = "inbox" | "announcements" | "directMessages" | "notifications" | "approvals" | "activity" | "history";

function MessageRow({ msg, labels, onMarkRead, onArchive }: { msg: CommMessage; labels: CommunicationManagementLabels; onMarkRead?: (id: string) => void; onArchive?: (id: string) => void }) {
  return (
    <div className={`rounded-xl border p-4 ${msg.read_at ? "border-gray-200 bg-white" : "border-indigo-100 bg-indigo-50/30"}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-700">{msg.message_type}</span>
            <span className="rounded-full bg-sky-50 px-2 py-0.5 font-medium text-sky-800">{msg.priority}</span>
            {!msg.read_at ? <span className="rounded-full bg-indigo-100 px-2 py-0.5 font-medium text-indigo-800">{labels.unread}</span> : null}
          </div>
          <h3 className="mt-1 font-semibold text-gray-900">{msg.subject}</h3>
          {msg.body ? <p className="mt-1 text-sm text-gray-600 line-clamp-2">{msg.body}</p> : null}
          <p className="mt-2 text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!msg.read_at && onMarkRead ? (
            <button type="button" onClick={() => onMarkRead(msg.id)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white">{labels.markRead}</button>
          ) : null}
          {onArchive ? (
            <button type="button" onClick={() => onArchive(msg.id)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700">{labels.archive}</button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function CommunicationManagementPanel({ labels }: { labels: CommunicationManagementLabels }) {
  const [center, setCenter] = useState<CommunicationManagementCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("inbox");
  const [busy, setBusy] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [announceTitle, setAnnounceTitle] = useState("");
  const [announceBody, setAnnounceBody] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/communications");
    if (res.ok) setCenter(parseCommunicationManagementCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/communications/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) return <div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /></div>;
  if (!center?.found) return <AipifyModuleAccessDenied message={labels.accessDenied} />;

  const tabs: { key: Tab; label: string }[] = [
    { key: "inbox", label: labels.inbox },
    { key: "announcements", label: labels.announcements },
    { key: "directMessages", label: labels.directMessages },
    { key: "notifications", label: labels.notifications },
    { key: "approvals", label: labels.approvals },
    { key: "activity", label: labels.activityFeed },
    { key: "history", label: labels.history },
  ];

  const routes = center.routes;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{center.principle}</p> : null}
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {routes?.notifications ? <Link href={routes.notifications} className="text-indigo-700 hover:underline">{labels.notificationsLink}</Link> : null}
          {routes?.approvals ? <Link href={routes.approvals} className="text-indigo-700 hover:underline">{labels.approvalsLink}</Link> : null}
          {routes?.activity ? <Link href={routes.activity} className="text-indigo-700 hover:underline">{labels.activityLink}</Link> : null}
        </div>
      </div>

      {center.overview ? (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          <StatCard label={labels.unread} value={center.overview.unread_messages} highlight="indigo" />
          <StatCard label={labels.notifications} value={center.overview.unread_notifications} />
          <StatCard label={labels.pendingApprovals} value={center.overview.pending_approvals} highlight="amber" />
          <StatCard label={labels.announcements} value={center.overview.announcements} />
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={labels.searchPlaceholder} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        <button type="button" disabled={busy || !searchQuery.trim()} onClick={() => void fetch(`/api/app/communications/search?q=${encodeURIComponent(searchQuery)}`)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.search}</button>
      </div>

      <div className="-mx-1 flex gap-1 overflow-x-auto border-b border-gray-200 pb-2 sm:flex-wrap">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ${tab === t.key ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>{t.label}</button>
        ))}
      </div>

      {tab === "inbox" ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h2 className="text-lg font-semibold text-gray-900">{labels.sendMessage}</h2>
            <div className="mt-3 space-y-3">
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={labels.subject} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder={labels.body} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <button type="button" disabled={busy || !subject.trim()} onClick={() => void runAction("send_message", { subject, body }).then(() => { setSubject(""); setBody(""); })} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.save}</button>
            </div>
          </div>
          <MessageList messages={center.inbox ?? []} labels={labels} onMarkRead={(id) => void runAction("mark_read", { message_id: id })} onArchive={(id) => void runAction("archive_message", { message_id: id })} />
        </div>
      ) : null}

      {tab === "directMessages" ? (
        <MessageList messages={center.direct_messages ?? []} labels={labels} onMarkRead={(id) => void runAction("mark_read", { message_id: id })} />
      ) : null}

      {tab === "announcements" ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h2 className="text-lg font-semibold text-gray-900">{labels.publishAnnouncement}</h2>
            <div className="mt-3 space-y-3">
              <input value={announceTitle} onChange={(e) => setAnnounceTitle(e.target.value)} placeholder={labels.announcementTitle} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <textarea value={announceBody} onChange={(e) => setAnnounceBody(e.target.value)} placeholder={labels.body} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <button type="button" disabled={busy || !announceTitle.trim()} onClick={() => void runAction("create_announcement", { title: announceTitle, body: announceBody }).then(() => { setAnnounceTitle(""); setAnnounceBody(""); })} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{labels.publishAnnouncement}</button>
            </div>
          </div>
          <AnnouncementList items={center.announcements ?? []} />
        </div>
      ) : null}

      {tab === "notifications" ? (
        <div className="space-y-2">
          {(center.notifications_preview ?? []).map((n) => (
            <div key={n.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs text-gray-500">{n.notification_type} · {n.priority}</p>
              <p className="mt-1 font-medium text-gray-900">{n.summary}</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "approvals" ? (
        <div className="space-y-2">
          {(center.approvals_preview ?? []).map((a) => (
            <div key={a.approval_id} className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
              <p className="text-xs text-indigo-700">{a.approval_type}</p>
              <p className="font-medium text-gray-900">{a.title}</p>
            </div>
          ))}
          {routes?.approvals ? <Link href={routes.approvals} className="inline-block text-sm text-indigo-700 hover:underline">{labels.approvalsLink}</Link> : null}
        </div>
      ) : null}

      {tab === "activity" ? (
        <div className="space-y-2">
          {(center.activity_preview ?? []).map((a) => (
            <div key={a.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs text-gray-500">{a.activity_type}</p>
              <p className="font-medium text-gray-900">{a.summary}</p>
            </div>
          ))}
          {routes?.activity ? <Link href={routes.activity} className="inline-block text-sm text-indigo-700 hover:underline">{labels.activityLink}</Link> : null}
        </div>
      ) : null}

      {tab === "history" ? (
        <MessageList messages={[...(center.inbox ?? []), ...(center.direct_messages ?? [])]} labels={labels} />
      ) : null}
    </div>
  );
}

function MessageList({ messages, labels, onMarkRead, onArchive }: { messages: CommMessage[]; labels: CommunicationManagementLabels; onMarkRead?: (id: string) => void; onArchive?: (id: string) => void }) {
  if (messages.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="font-medium text-gray-900">{labels.noMessages}</p>
        <p className="mt-1 text-sm text-gray-600">{labels.noMessagesHint}</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {messages.map((m) => <MessageRow key={m.id} msg={m} labels={labels} onMarkRead={onMarkRead} onArchive={onArchive} />)}
    </div>
  );
}

function AnnouncementList({ items }: { items: CommAnnouncement[] }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-3">
      {items.map((a) => (
        <div key={a.id} className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="font-semibold text-gray-900">{a.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{a.body}</p>
          <p className="mt-2 text-xs text-gray-500">{a.scope} · {new Date(a.created_at).toLocaleString()}</p>
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
