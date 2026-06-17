"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseEnvironmentCenter,
  parseEnvironmentRecommendations,
  parseLocalServices,
  parseNetworkStatus,
  parseProjectLocationHealth,
  parseStorageHealth,
  type EnvironmentCenter,
  type EnvironmentRecommendation,
  type LocalServices,
  type NetworkStatus,
  type ProjectLocationHealth,
  type StorageHealth,
} from "@/lib/companion-device-environment";

type Props = {
  labels: Record<string, string>;
};

export function CompanionDeviceEnvironmentPanel({ labels }: Props) {
  const [center, setCenter] = useState<EnvironmentCenter | null>(null);
  const [storage, setStorage] = useState<StorageHealth | null>(null);
  const [project, setProject] = useState<ProjectLocationHealth | null>(null);
  const [network, setNetwork] = useState<NetworkStatus | null>(null);
  const [services, setServices] = useState<LocalServices | null>(null);
  const [recommendations, setRecommendations] = useState<EnvironmentRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [centerRes, storageRes, projectRes, networkRes, recRes] = await Promise.all([
        fetch("/api/desktop/environment"),
        fetch("/api/desktop/environment/storage"),
        fetch("/api/desktop/environment/project"),
        fetch("/api/desktop/environment/network"),
        fetch("/api/desktop/environment/recommendations"),
      ]);

      if (!centerRes.ok) {
        setError(true);
        setLoading(false);
        return;
      }

      const parsedCenter = parseEnvironmentCenter(await centerRes.json());
      setCenter(parsedCenter);

      if (parsedCenter?.environment_enabled) {
        if (storageRes.ok) {
          const s = await storageRes.json();
          setStorage(parseStorageHealth(s.storage ?? s));
        }
        if (projectRes.ok) {
          const p = await projectRes.json();
          setProject(parseProjectLocationHealth(p.project ?? p));
        }
        if (networkRes.ok) {
          const n = await networkRes.json();
          setNetwork(parseNetworkStatus(n.network ?? n));
          setServices(parseLocalServices(n.local_services ?? n));
        }
        if (recRes.ok) {
          setRecommendations(parseEnvironmentRecommendations(await recRes.json())?.recommendations ?? []);
        }
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const runScan = async () => {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/desktop/environment/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_info_approved: true,
        file_locations_approved: true,
        local_network_approved: true,
        running_processes_approved: true,
        project_folders_approved: true,
      }),
    });
    if (res.ok) {
      setMessage(labels.scanComplete);
      await load();
    } else {
      setMessage(labels.actionFailed);
    }
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-3">
        <AipifyLoader centered />
        <p className="sr-only">{labels.loading}</p>
      </div>
    );
  }

  if (error || !center) {
    return (
      <PlatformEmptyState
        title={labels.errorTitle}
        message={labels.errorMessage}
        primaryAction={{ label: labels.retry, onClick: () => void load() }}
      />
    );
  }

  if (center.empty_state || !center.environment_enabled) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <Header labels={labels} workspaceHref={center.cross_link_phase344} />
        <PlatformEmptyState
          title={labels.emptyTitle}
          message={labels.emptyMessage}
          primaryAction={{ label: labels.runCheck, onClick: () => void runScan() }}
        />
        <p className="text-sm text-slate-600">{center.permission_text || labels.permissionText}</p>
      </div>
    );
  }

  const statusBanner = center.warning_state ? labels.warningTitle : labels.successTitle;

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <Header labels={labels} workspaceHref={center.cross_link_phase344} />

      <section
        className={`rounded-2xl border p-6 ${
          center.warning_state
            ? "border-amber-200 bg-amber-50/60"
            : "border-emerald-200 bg-emerald-50/60"
        }`}
      >
        <p className="text-sm font-medium text-slate-900">{statusBanner}</p>
        <p className="mt-2 text-sm text-slate-700">{center.positioning}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">{labels.deviceOverview}</h2>
        <dl className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
          <Metric label="Device" value={center.device_overview.device_name} />
          <Metric label="Platform" value={center.device_overview.platform} />
          <Metric label="OS" value={center.device_overview.os_version} />
          <Metric label="Architecture" value={center.device_overview.architecture} />
          <Metric label={labels.availableDisk} value={center.device_overview.memory} />
          <Metric label={labels.usedDisk} value={center.device_overview.disk} />
          <Metric label="User" value={center.device_overview.active_user} />
          <Metric label="Companion" value={center.device_overview.companion_version} />
          <Metric label="Last scan" value={center.device_overview.last_scan_at ? new Date(center.device_overview.last_scan_at).toLocaleString() : "—"} />
        </dl>
      </section>

      {storage ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{labels.storageHealth}</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-700">{storage.summary}</p>
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <Metric label={labels.availableDisk} value={storage.available_disk} />
              <Metric label={labels.usedDisk} value={storage.used_disk} />
              <Metric label={labels.cacheSize} value={storage.cache_size} />
              <Metric label={labels.buildArtifacts} value={storage.build_artifact_size} />
            </dl>
            {storage.warnings.length > 0 ? (
              <ul className="mt-4 space-y-1 text-sm text-amber-800">
                {storage.warnings.map((w) => (
                  <li key={w}>• {w}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}

      {project ? (
        <>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">{labels.projectLocation}</h2>
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
              <p>{project.message}</p>
              <dl className="mt-4 grid gap-2 sm:grid-cols-2">
                <Metric label={labels.currentPath} value={project.current_project_path} />
                <Metric label="Risk" value={project.location_risk} />
              </dl>
              {project.risky_locations_detected.length > 0 ? (
                <ul className="mt-3 space-y-1 text-amber-800">
                  {project.risky_locations_detected.map((r) => (
                    <li key={r}>• {r}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">{labels.developmentEnvironment}</h2>
            <dl className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
              <Metric label={labels.gitStatus} value={project.git_status} />
              <Metric label={labels.nodeVersion} value={project.node_version} />
              <Metric label={labels.npmVersion} value={project.npm_version} />
              <Metric label={labels.devServer} value={project.next_dev_status} />
              <Metric label={labels.localhost} value={project.localhost_status} />
              <Metric label={labels.typecheck} value={project.typecheck_status} />
              <Metric label={labels.lint} value={project.lint_status} />
            </dl>
          </section>
        </>
      ) : null}

      {network ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{labels.networkStatus}</h2>
          <dl className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
            <Metric label="Status" value={network.online ? labels.online : labels.offline} />
            <Metric label={labels.networkName} value={network.network_name} />
            <Metric label={labels.localIp} value={network.local_ip} />
            <Metric label={labels.internetReachable} value={network.internet_reachable ? "✓" : "—"} />
            <Metric label={labels.localhostReachable} value={network.localhost_reachable ? "✓" : "—"} />
            <Metric label={labels.apiReachable} value={network.api_reachable ? "✓" : "—"} />
          </dl>
        </section>
      ) : null}

      {services ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{labels.localServices}</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm">
            <p>
              {labels.devServerRunning}: {services.dev_server_running ? `port ${services.dev_server_port}` : "—"}
            </p>
            <p className="mt-1">
              {labels.databaseTunnel}: {services.database_tunnel_running ? "✓" : "—"}
            </p>
            <p className="mt-1">
              {labels.supabaseLocal}: {services.supabase_local_status}
            </p>
            {services.background_processes.length > 0 ? (
              <ul className="mt-3 space-y-1 text-slate-600">
                {services.background_processes.map((p) => (
                  <li key={p.name}>
                    {p.name} — {p.status}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}

      {center.checklist.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{labels.checklistTitle}</h2>
          <ul className="space-y-2">
            {center.checklist.map((item) => (
              <li key={item.check_key} className="flex justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm">
                <span className="font-medium text-slate-900">{item.check_label}</span>
                <span className="text-slate-500">
                  {labels[`check_${item.check_status}`] ?? item.check_status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {recommendations.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{labels.recommendationsTitle}</h2>
          <p className="text-xs text-slate-500">{labels.noAutomaticFixes}</p>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <article key={rec.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">{rec.title}</h3>
                  <span className="text-xs text-slate-500">
                    {labels[`severity_${rec.severity}`] ?? rec.severity}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-700">{rec.message}</p>
                {rec.action_label ? (
                  <p className="mt-2 text-xs font-medium text-indigo-700">{rec.action_label}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">{labels.permissionsTitle}</h2>
        <p className="mt-2 text-sm text-slate-600">{center.permission_text || labels.permissionText}</p>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          <PermissionRow label={labels.systemInfo} enabled={center.permissions.system_info_approved} />
          <PermissionRow label={labels.fileLocations} enabled={center.permissions.file_locations_approved} />
          <PermissionRow label={labels.localNetwork} enabled={center.permissions.local_network_approved} />
          <PermissionRow label={labels.runningProcesses} enabled={center.permissions.running_processes_approved} />
          <PermissionRow label={labels.projectFolders} enabled={center.permissions.project_folders_approved} />
        </ul>
        <p className="mt-4 text-xs text-slate-500">{center.privacy_note || labels.privacyNote}</p>
      </section>

      {center.recent_events.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">{labels.eventLogTitle}</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            {center.recent_events.map((ev) => (
              <li key={ev.id} className="rounded-lg border border-slate-100 px-3 py-2">
                {ev.summary}
                <span className="ml-2 text-xs text-slate-400">{ev.event_type}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">{labels.faqTitle}</h2>
        <dl className="mt-4 space-y-4 text-sm text-slate-700">
          <div>
            <dt className="font-medium text-slate-900">{labels.faqWhatIs}</dt>
            <dd className="mt-1">{labels.faqWhatIsAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">{labels.faqAutoChange}</dt>
            <dd className="mt-1">{labels.faqAutoChangeAnswer}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-900">{labels.faqLocation}</dt>
            <dd className="mt-1">{labels.faqLocationAnswer}</dd>
          </div>
        </dl>
      </section>

      <div className="flex gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => void runScan()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {labels.runCheck}
        </button>
      </div>

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}

function Header({ labels, workspaceHref }: { labels: Record<string, string>; workspaceHref?: string }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <Link href="/app/desktop" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          ← {labels.backToDesktop}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">{labels.title}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">{labels.subtitle}</p>
      </div>
      {workspaceHref ? (
        <Link
          href={workspaceHref}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {labels.workspaceLink}
        </Link>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 font-medium text-slate-900">{value || "—"}</dd>
    </div>
  );
}

function PermissionRow({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <li className="flex items-center justify-between">
      <span>{label}</span>
      <span className={enabled ? "text-emerald-700" : "text-slate-400"}>{enabled ? "✓" : "—"}</span>
    </li>
  );
}
