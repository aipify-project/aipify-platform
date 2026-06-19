"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type {
  CompanionDevice,
  CompanionPresenceOperationsCenter,
  CompanionPresenceOperationsLabels,
  CompanionPresenceOperationsTab,
} from "@/lib/companion-presence-operations";
import { parseCompanionPresenceOperationsCenter } from "@/lib/companion-presence-operations/parse";

type Tab = CompanionPresenceOperationsTab;

type Props = {
  labels: CompanionPresenceOperationsLabels;
  initialTab?: Tab;
  titleOverride?: string;
  subtitleOverride?: string;
  visibleTabs?: Tab[];
};

function DeviceCard({
  device,
  labels,
  onRevoke,
  busy,
}: {
  device: CompanionDevice;
  labels: CompanionPresenceOperationsLabels;
  onRevoke?: (id: string) => void;
  busy?: boolean;
}) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <p className="text-xs uppercase text-aipify-text-muted">{device.device_type} · {device.platform}</p>
      <p className="font-medium text-aipify-text">{device.device_label}</p>
      {device.device_status ? <p className="mt-1 text-xs text-aipify-text-muted">Status: {device.device_status}</p> : null}
      {device.app_version ? <p className="text-xs text-aipify-text-muted">v{device.app_version}</p> : null}
      {onRevoke && device.device_status === "active" ? (
        <button type="button" disabled={busy} onClick={() => onRevoke(device.id)} className={`${AipifyShellClasses.secondaryButton} mt-3 text-xs`}>
          {labels.revokeDevice}
        </button>
      ) : null}
    </div>
  );
}

function ListSection({ title, items }: { title: string; items: unknown[] }) {
  if (!items.length) return null;
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <h2 className="font-semibold text-aipify-text">{title}</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-aipify-text-secondary">
        {items.map((item) => <li key={String(item)}>{String(item)}</li>)}
      </ul>
    </div>
  );
}

export function CompanionPresenceOperationsPanel({ labels, initialTab = "overview", titleOverride, subtitleOverride, visibleTabs }: Props) {
  const [center, setCenter] = useState<CompanionPresenceOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CompanionDevice[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/companion-presence-operations");
    if (res.ok) setCenter(parseCompanionPresenceOperationsCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/companion-presence-operations/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  async function runSearch() {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    setBusy(true);
    const res = await fetch(`/api/app/companion-presence-operations/search?q=${encodeURIComponent(searchQuery.trim())}`);
    if (res.ok) {
      const data = await res.json();
      setSearchResults(Array.isArray(data.results) ? data.results : []);
    }
    setBusy(false);
  }

  if (loading && !center) {
    return <div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /></div>;
  }
  if (!center?.found) return <AipifyModuleAccessDenied message={labels.accessDenied} />;

  const overview = center.overview ?? {};
  const presence = center.presence_engine ?? {};
  const desktop = center.desktop_companion ?? {};
  const mobile = center.mobile_companion ?? {};
  const executive = center.executive_dashboard ?? {};
  const identity = center.companion_identity ?? {};
  const assistant = center.companion_intelligence ?? {};
  const routes = center.routes ?? {};
  const presenceRing = (presence.presence_ring ?? {}) as Record<string, unknown>;
  const desktopPresence = (presence.desktop_presence ?? {}) as Record<string, unknown>;

  const allTabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "desktop_companion", label: labels.desktopCompanion },
    { id: "mobile_companion", label: labels.mobileCompanion },
    { id: "presence", label: labels.presence },
    { id: "notifications", label: labels.notifications },
    { id: "memory", label: labels.memory },
    { id: "preferences", label: labels.preferences },
    { id: "devices", label: labels.devices },
    { id: "executive", label: labels.executive },
  ];
  const tabs = visibleTabs ? allTabs.filter((t) => visibleTabs.includes(t.id)) : allTabs;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold text-aipify-text">{titleOverride ?? labels.title}</h1>
        <p className="mt-1 text-sm text-aipify-text-secondary">{subtitleOverride ?? labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-xs text-aipify-text-muted">{center.principle}</p> : null}
      </header>

      <div className={`${AipifyShellClasses.surfaceCard} flex flex-wrap gap-2 p-3`}>
        <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={labels.searchPlaceholder} className="min-w-[200px] flex-1 rounded-md border border-aipify-border bg-white px-3 py-2 text-sm" />
        <button type="button" disabled={busy} onClick={() => void runSearch()} className={`${AipifyShellClasses.primaryButton} text-sm`}>{labels.searchDevices}</button>
        <Link href={routes.desktop_client ?? "/app/command-center/connect"} className={`${AipifyShellClasses.secondaryButton} text-sm`}>{labels.desktopCompanion}</Link>
      </div>

      {searchResults.length > 0 ? (
        <section className="grid gap-3 sm:grid-cols-2">
          {searchResults.map((d) => <DeviceCard key={d.id} device={d} labels={labels} />)}
        </section>
      ) : null}

      <nav className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button key={item.id} type="button" onClick={() => setTab(item.id)} className={tab === item.id ? `${AipifyShellClasses.primaryButton} text-sm` : `${AipifyShellClasses.secondaryButton} text-sm`}>{item.label}</button>
        ))}
      </nav>

      {tab === "overview" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {([[labels.deviceCount, overview.device_count], [labels.desktopDevices, overview.desktop_devices], [labels.mobileDevices, overview.mobile_devices], [labels.approvalsWaiting, overview.approvals_waiting], [labels.presenceStatus, overview.presence_status]] as const).map(([label, value]) => (
              <div key={label} className={`${AipifyShellClasses.surfaceCard} p-4`}>
                <p className="text-xs uppercase text-aipify-text-muted">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-aipify-text">{String(value ?? "—")}</p>
              </div>
            ))}
          </div>
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.companionIdentity}</h2>
            <p className="mt-2 text-aipify-text-secondary">
              {String(identity.symbol ?? "")} · {String(identity.color ?? "")} · {String(identity.presence_ring ?? "")}
            </p>
          </div>
        </>
      ) : null}

      {tab === "desktop_companion" ? (
        <div className="space-y-4">
          <ListSection title={labels.desktopCompanion} items={Array.isArray(desktop.capabilities) ? desktop.capabilities as string[] : []} />
          <ListSection title="Desktop modes" items={Array.isArray(desktop.modes) ? desktop.modes as string[] : []} />
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.commandPalette}</h2>
            <p className="mt-2 text-aipify-text-secondary">
              {Array.isArray((desktop.command_palette as Record<string, unknown>)?.shortcuts) ? ((desktop.command_palette as Record<string, unknown>).shortcuts as string[]).join(" · ") : "CMD+K · CTRL+K"}
            </p>
            <ListSection title="" items={Array.isArray((desktop.command_palette as Record<string, unknown>)?.examples) ? ((desktop.command_palette as Record<string, unknown>).examples as string[]) : []} />
          </div>
          <ListSection title={labels.offlineSupport} items={Array.isArray(desktop.offline_support) ? desktop.offline_support as string[] : []} />
        </div>
      ) : null}

      {tab === "mobile_companion" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <p className="text-aipify-text-secondary">{mobile.mobile_access_first ? "Mobile Access first. Full Mobile Companion later." : ""}</p>
          </div>
          <ListSection title={labels.mobileCompanion} items={Array.isArray(mobile.supports) ? mobile.supports as string[] : []} />
          <ListSection title="Platforms" items={Array.isArray(mobile.platforms) ? mobile.platforms as string[] : []} />
        </div>
      ) : null}

      {tab === "presence" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.presenceRing}</h2>
            <p className="mt-2 text-aipify-text-secondary">Current: {String(presenceRing.current ?? "available")}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {Object.entries(presenceRing).filter(([k]) => k !== "current").map(([k, v]) => (
                <p key={k} className="text-xs text-aipify-text-muted">{k.replace(/_/g, " ")}: {String(v)}</p>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(desktopPresence).map(([k, v]) => (
              <div key={k} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs uppercase text-aipify-text-muted">{k.replace(/_/g, " ")}</p>
                <p className="mt-1 text-xl font-semibold text-aipify-text">{String(v)}</p>
              </div>
            ))}
          </div>
          <ListSection title="Companion messages" items={Array.isArray(presence.companion_messages) ? presence.companion_messages as string[] : []} />
          <ListSection title="Suggestions" items={Array.isArray(presence.suggestions) ? presence.suggestions as string[] : []} />
          {center.meeting_awareness && Object.keys(center.meeting_awareness).length > 0 ? (
            <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <h2 className="font-semibold text-aipify-text">{labels.meetingAwareness}</h2>
              <p className="mt-2 text-aipify-text-secondary">
                {String(center.meeting_awareness.next_meeting ?? "")} — starts in {String(center.meeting_awareness.starts_in_minutes ?? "—")} min
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {tab === "notifications" ? (
        <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
          <h2 className="font-semibold text-aipify-text">{labels.notificationAwareness}</h2>
          <ListSection title="" items={Array.isArray(center.notifications?.respects) ? center.notifications.respects as string[] : []} />
        </div>
      ) : null}

      {tab === "memory" ? (
        <div className="space-y-4">
          <ListSection title={labels.companionMemory} items={Array.isArray(center.companion_memory?.favorite_searches) ? center.companion_memory.favorite_searches as string[] : []} />
          <ListSection title="Preferred modules" items={Array.isArray(center.companion_memory?.preferred_modules) ? center.companion_memory.preferred_modules as string[] : []} />
          {(center.offline_cache ?? []).length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-aipify-text">{labels.offlineSupport}</h2>
                <button type="button" disabled={busy} onClick={() => void runAction("sync_offline")} className={`${AipifyShellClasses.primaryButton} text-xs`}>{labels.syncOffline}</button>
              </div>
              {center.offline_cache?.map((c) => (
                <div key={c.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <p className="font-medium text-aipify-text">{c.title} · {c.sync_status}</p>
                  {c.content_summary ? <p className="mt-1 text-aipify-text-secondary">{c.content_summary}</p> : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {tab === "preferences" ? (
        <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
          <h2 className="font-semibold text-aipify-text">{labels.preferences}</h2>
          <p className="mt-2 text-aipify-text-secondary">Desktop mode: {String(center.preferences?.desktop_mode ?? "sidebar")}</p>
          <p className="text-aipify-text-secondary">Role mode: {String(center.preferences?.companion_role_mode ?? "auto")}</p>
          <p className="text-aipify-text-secondary">Home view: {String(center.companion_memory?.preferred_home_view ?? "overview")}</p>
        </div>
      ) : null}

      {tab === "devices" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {(center.devices ?? []).length === 0 ? <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} /> : center.devices?.map((d) => (
            <DeviceCard key={d.id} device={d} labels={labels} busy={busy} onRevoke={(id) => void runAction("revoke_device", { device_id: id })} />
          ))}
        </div>
      ) : null}

      {tab === "executive" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.executiveDashboard}</h2>
            <p className="mt-2 text-aipify-text-secondary">
              Adoption: {String(executive.companion_adoption_pct ?? "—")}% · Desktop: {String(executive.desktop_usage_pct ?? "—")}% · Mobile: {String(executive.mobile_usage_pct ?? "—")}%
            </p>
            {Array.isArray(executive.companion_recommendations) ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-aipify-text-secondary">
                {executive.companion_recommendations.map((h) => <li key={String(h)}>{String(h)}</li>)}
              </ul>
            ) : null}
          </div>
          <ListSection title={labels.roleExperience} items={Array.isArray(center.role_experience?.executive) ? (center.role_experience?.executive as string[]) : []} />
          <ListSection title={labels.companionIntelligence} items={Array.isArray(assistant.prompts) ? assistant.prompts as string[] : []} />
          <ListSection title={labels.companionStore} items={Array.isArray(center.companion_store?.future) ? (center.companion_store?.future as string[]) : []} />
        </div>
      ) : null}

      {(center.audit_recent ?? []).length > 0 ? (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.auditLog}</h2>
          <div className="space-y-2">
            {center.audit_recent?.map((entry) => (
              <div key={`${entry.action}-${entry.created_at}`} className={`${AipifyShellClasses.surfaceCard} p-3 text-xs text-aipify-text-secondary`}>
                <span className="font-medium text-aipify-text">{entry.action}</span> — {entry.summary}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
