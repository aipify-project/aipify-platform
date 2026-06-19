"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { DEVELOPER_SETTINGS_ROUTE } from "@/lib/install/experience";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import {
  parseInstallDiscoveryCenter,
  type ConnectedSystem,
  type InstallDiscoveryCenter,
  type InstallDiscoveryLabels,
} from "@/lib/install-discovery";

type Tab =
  | "overview"
  | "connected_systems"
  | "discovery_results"
  | "data_sources"
  | "import_center"
  | "permissions"
  | "recommendations"
  | "installation_status";

const DATA_DOMAINS = ["inventory", "products", "customers", "orders", "employees"] as const;

const SYNC_HEALTH_STYLE: Record<string, string> = {
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  warning: "bg-amber-50 text-amber-900 ring-amber-200",
  error: "bg-red-50 text-red-900 ring-red-200",
  unknown: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  paused: "bg-sky-50 text-sky-900 ring-sky-200",
};

type Props = {
  labels: InstallDiscoveryLabels;
  initialTab?: Tab;
};

export function InstallDiscoveryCenterPanel({ labels, initialTab = "overview" }: Props) {
  const [center, setCenter] = useState<InstallDiscoveryCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>("inventory");
  const [selectedSource, setSelectedSource] = useState<string>("shopify");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/install-discovery");
    if (res.ok) setCenter(parseInstallDiscoveryCenter(await res.json()));
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
    await fetch("/api/app/install-discovery/action", {
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
  const connected = center.connected_systems ?? [];
  const catalog = center.connection_catalog ?? [];
  const discovery = center.discovery_results ?? [];
  const dataSources = center.data_sources ?? [];
  const imports = center.import_jobs ?? [];
  const permissions = center.permissions ?? [];
  const recommendations = center.recommendations ?? [];
  const installStatus = center.installation_status ?? {};

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "connected_systems", label: labels.connectedSystems },
    { id: "discovery_results", label: labels.discoveryResults },
    { id: "data_sources", label: labels.dataSources },
    { id: "import_center", label: labels.importCenter },
    { id: "permissions", label: labels.permissions },
    { id: "recommendations", label: labels.recommendations },
    { id: "installation_status", label: labels.installationStatus },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-aipify-text">{labels.title}</h1>
          <p className="mt-1 text-sm text-aipify-text-secondary">{labels.subtitle}</p>
          {center.principle ? <p className="mt-2 text-xs text-aipify-text-muted">{center.principle}</p> : null}
        </div>
        <Link href={DEVELOPER_SETTINGS_ROUTE} className={AipifyShellClasses.secondaryButton}>
          {labels.developerSettings}
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

      {tab === "overview" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              [labels.connectedCount, overview.connected_systems],
              [labels.discoveryProgress, `${overview.completion_percentage ?? installStatus.completion_percentage ?? 0}%`],
              [labels.pendingRecommendations, overview.pending_recommendations],
              [labels.pendingPermissions, overview.pending_permissions],
              [labels.activeImports, overview.active_imports],
              [labels.syncIssues, overview.sync_health_issues],
            ] as [string, string | number][]
          ).map(([label, value]) => (
            <div key={String(label)} className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs text-aipify-text-muted">{label}</p>
              <p className="mt-1 text-xl font-semibold text-aipify-text">{value ?? "—"}</p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "connected_systems" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} p-4`}>
            <p className="mb-3 text-sm font-medium text-aipify-text">{labels.connectSystem}</p>
            <div className="flex flex-wrap gap-2">
              {catalog.slice(0, 12).map((item) => (
                <button
                  key={item.system_key}
                  type="button"
                  disabled={busy}
                  onClick={() => void runAction("connect_system", { system_key: item.system_key })}
                  className={AipifyShellClasses.secondaryButton}
                >
                  {item.system_name}
                </button>
              ))}
            </div>
          </div>
          {connected.length === 0 ? (
            <PlatformEmptyState title={labels.noConnections} message={labels.noConnectionsHint} />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {connected.map((sys: ConnectedSystem) => (
                <div key={sys.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-aipify-text">{sys.system_name}</h3>
                      <p className="text-aipify-text-secondary">{sys.connection_method.replace(/_/g, " ")}</p>
                      <p className="text-aipify-text-muted">{sys.auth_status.replace(/_/g, " ")} · {sys.sync_mode}</p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${SYNC_HEALTH_STYLE[sys.sync_health] ?? SYNC_HEALTH_STYLE.unknown}`}
                    >
                      {sys.sync_health}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void runAction("trigger_sync", { connected_system_id: sys.id })}
                      className={AipifyShellClasses.primaryButton}
                    >
                      {labels.triggerSync}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void runAction("disconnect_system", { connected_system_id: sys.id })}
                      className={AipifyShellClasses.secondaryButton}
                    >
                      {labels.disconnectSystem}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "discovery_results" ? (
        <div className="space-y-4">
          <button type="button" disabled={busy} onClick={() => void runAction("run_discovery")} className={AipifyShellClasses.primaryButton}>
            {labels.runDiscovery}
          </button>
          {discovery.length === 0 ? (
            <PlatformEmptyState title={labels.noDiscovery} message={labels.noConnectionsHint} />
          ) : (
            <div className="grid gap-3">
              {discovery.map((d) => (
                <div key={String(d.id)} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <p className="text-xs text-aipify-text-muted">{String(d.discovery_type ?? "").replace(/_/g, " ")}</p>
                  <h3 className="font-semibold text-aipify-text">{String(d.entity_label ?? d.entity_key ?? "")}</h3>
                  <p className="text-aipify-text-secondary">
                    {String(d.confidence_score ?? 0)}% · {String(d.status ?? "").replace(/_/g, " ")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {tab === "data_sources" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-3`}>
            <select value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)} className={AipifyShellClasses.input}>
              {DATA_DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <select value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)} className={AipifyShellClasses.input}>
              {catalog.map((c) => (
                <option key={c.system_key} value={c.system_key}>
                  {c.system_name}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                const item = catalog.find((c) => c.system_key === selectedSource);
                void runAction("set_data_source", {
                  data_domain: selectedDomain,
                  source_system_key: selectedSource,
                  source_system_name: item?.system_name ?? selectedSource,
                  connection_method: item?.connection_method ?? "manual_setup",
                });
              }}
              className={AipifyShellClasses.primaryButton}
            >
              {labels.setDataSource}
            </button>
          </div>
          <p className="text-sm text-aipify-text-muted">{labels.whereManaged}</p>
          <div className="grid gap-3">
            {dataSources.map((s) => (
              <div key={String(s.id)} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <h3 className="font-semibold text-aipify-text">{String(s.data_domain ?? "").replace(/_/g, " ")}</h3>
                <p className="text-aipify-text-secondary">{String(s.source_system_name ?? "")}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "import_center" ? (
        <div className="space-y-4">
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              void runAction("start_import", { file_name: "import.csv", file_format: "csv", target_domain: "products" })
            }
            className={AipifyShellClasses.primaryButton}
          >
            {labels.startImport}
          </button>
          <div className="grid gap-3">
            {imports.map((job) => (
              <div key={String(job.id)} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted">{String(job.job_number ?? "")}</p>
                <h3 className="font-semibold text-aipify-text">{String(job.file_name ?? "")}</h3>
                <p className="text-aipify-text-secondary">
                  {String(job.file_format ?? "").toUpperCase()} · {String(job.status ?? "").replace(/_/g, " ")}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.status === "uploaded" ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void runAction("analyze_import", { import_job_id: job.id })}
                      className={AipifyShellClasses.secondaryButton}
                    >
                      {labels.analyzeImport}
                    </button>
                  ) : null}
                  {["mapping", "review"].includes(String(job.status)) ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void runAction("complete_import", { import_job_id: job.id, imported_count: job.row_count })}
                      className={AipifyShellClasses.primaryButton}
                    >
                      {labels.completeImport}
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "permissions" ? (
        <div className="grid gap-3">
          {permissions.map((perm) => (
            <div key={String(perm.id)} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <h3 className="font-semibold text-aipify-text">{String(perm.permission_label ?? perm.permission_key ?? "")}</h3>
              <p className="text-aipify-text-secondary">
                {String(perm.risk_level ?? "")} · {String(perm.review_status ?? "").replace(/_/g, " ")}
              </p>
              {perm.review_status === "pending" ? (
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void runAction("grant_permission", { permission_id: perm.id })}
                    className={AipifyShellClasses.primaryButton}
                  >
                    {labels.grantPermission}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void runAction("revoke_permission", { permission_id: perm.id })}
                    className={AipifyShellClasses.secondaryButton}
                  >
                    {labels.revokePermission}
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {tab === "recommendations" ? (
        <div className="grid gap-3">
          {recommendations.map((rec) => (
            <div key={String(rec.id)} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <h3 className="font-semibold text-aipify-text">{String(rec.recommendation_label ?? rec.recommendation_key ?? "")}</h3>
              {rec.rationale ? <p className="text-aipify-text-secondary">{String(rec.rationale)}</p> : null}
              {rec.status === "pending" ? (
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void runAction("accept_recommendation", { recommendation_id: rec.id })}
                    className={AipifyShellClasses.primaryButton}
                  >
                    {labels.acceptRecommendation}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void runAction("defer_recommendation", { recommendation_id: rec.id })}
                    className={AipifyShellClasses.secondaryButton}
                  >
                    {labels.deferRecommendation}
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {tab === "installation_status" ? (
        <div className={`${AipifyShellClasses.surfaceCard} space-y-3 p-4 text-sm`}>
          <p>
            Status: {String(installStatus.status ?? overview.installation_status ?? "pending").replace(/_/g, " ")}
          </p>
          <p>Step: {String(installStatus.current_step ?? overview.current_step ?? "welcome").replace(/_/g, " ")}</p>
          <p>
            Progress: {String(installStatus.completion_percentage ?? overview.completion_percentage ?? 0)}%
          </p>
          {installStatus.system_type ? <p>Platform: {String(installStatus.system_type)}</p> : null}
          {installStatus.domain ? <p>Domain: {String(installStatus.domain)}</p> : null}
          {Array.isArray(reports.missing_data_domains) && (reports.missing_data_domains as string[]).length > 0 ? (
            <p>
              {labels.missingData}: {(reports.missing_data_domains as string[]).join(", ")}
            </p>
          ) : null}
        </div>
      ) : null}

      {center.audit_recent && center.audit_recent.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-aipify-text">{labels.auditLog}</h2>
          <ul className={`${AipifyShellClasses.surfaceCard} divide-y divide-aipify-border text-sm`}>
            {center.audit_recent.map((entry, i) => (
              <li key={`${entry.action}-${i}`} className="px-4 py-2 text-aipify-text-secondary">
                {entry.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
