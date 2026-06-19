"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type {
  HubConnector,
  IntegrationHubCenter,
  IntegrationHubLabels,
  IntegrationHubTab,
  MarketplaceConnector,
} from "@/lib/integration-hub-operations";
import { parseIntegrationHubCenter } from "@/lib/integration-hub-operations/parse";

type Tab = IntegrationHubTab;

type Props = {
  labels: IntegrationHubLabels;
  initialTab?: Tab;
  titleOverride?: string;
  subtitleOverride?: string;
  visibleTabs?: Tab[];
};

function statusLabel(status: string | undefined, labels: IntegrationHubLabels): string {
  switch (status) {
    case "active":
      return labels.statusActive;
    case "connecting":
      return labels.statusConnecting;
    case "requires_attention":
      return labels.statusAttention;
    case "permission_required":
      return labels.statusPermission;
    case "disconnected":
      return labels.statusDisconnected;
    default:
      return status?.replace(/_/g, " ") ?? "";
  }
}

function healthLabel(status: string | undefined, labels: IntegrationHubLabels): string {
  switch (status) {
    case "healthy":
      return labels.healthHealthy;
    case "degraded":
      return labels.healthDegraded;
    case "critical":
      return labels.healthCritical;
    default:
      return status?.replace(/_/g, " ") ?? "";
  }
}

function ConnectorCard({
  connector,
  labels,
  onTest,
  onSync,
  busy,
}: {
  connector: HubConnector;
  labels: IntegrationHubLabels;
  onTest?: (id: string) => void;
  onSync?: (id: string) => void;
  busy?: boolean;
}) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase text-aipify-text-muted">{connector.category?.replace(/_/g, " ")}</p>
          <p className="font-medium text-aipify-text">{connector.connector_name}</p>
          {connector.provider ? <p className="text-xs text-aipify-text-muted">{connector.provider}</p> : null}
        </div>
        <span className="rounded-full bg-aipify-surface-muted px-2 py-0.5 text-xs text-aipify-text-secondary">
          {statusLabel(connector.status, labels)}
        </span>
      </div>
      {connector.data_access_scope ? (
        <p className="mt-2 text-xs text-aipify-text-secondary">Scope: {connector.data_access_scope}</p>
      ) : null}
      {connector.health_status ? (
        <p className="mt-1 text-xs text-aipify-text-muted">Health: {healthLabel(connector.health_status, labels)}</p>
      ) : null}
      {connector.last_sync_at ? (
        <p className="mt-1 text-xs text-aipify-text-muted">
          Last sync: {new Date(connector.last_sync_at).toLocaleString()}
          {connector.last_sync_status ? ` · ${connector.last_sync_status}` : ""}
        </p>
      ) : null}
      {connector.last_error ? <p className="mt-1 text-xs text-amber-700">{connector.last_error}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {onTest ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onTest(connector.id)}
            className={`${AipifyShellClasses.secondaryButton} text-xs`}
          >
            {labels.testConnection}
          </button>
        ) : null}
        {onSync ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onSync(connector.id)}
            className={`${AipifyShellClasses.secondaryButton} text-xs`}
          >
            {labels.startSync}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function MarketplaceCard({
  item,
  labels,
  onInstall,
  busy,
}: {
  item: MarketplaceConnector;
  labels: IntegrationHubLabels;
  onInstall: (key: string) => void;
  busy?: boolean;
}) {
  return (
    <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
      <p className="text-xs uppercase text-aipify-text-muted">{item.category?.replace(/_/g, " ")}</p>
      <p className="font-medium text-aipify-text">{item.connector_name}</p>
      {item.provider ? <p className="text-xs text-aipify-text-muted">{item.provider}</p> : null}
      {item.description ? <p className="mt-2 text-aipify-text-secondary">{item.description}</p> : null}
      <button
        type="button"
        disabled={busy}
        onClick={() => onInstall(item.connector_key)}
        className={`${AipifyShellClasses.primaryButton} mt-3 text-xs`}
      >
        {labels.installConnector}
      </button>
    </div>
  );
}

export function IntegrationHubPanel({
  labels,
  initialTab = "overview",
  titleOverride,
  subtitleOverride,
  visibleTabs,
}: Props) {
  const [center, setCenter] = useState<IntegrationHubCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HubConnector[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/integration-hub-operations");
    if (res.ok) setCenter(parseIntegrationHubCenter(await res.json()));
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
    await fetch("/api/app/integration-hub-operations/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  async function runSearch() {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/app/integration-hub-operations/search?q=${encodeURIComponent(searchQuery.trim())}`);
    if (res.ok) {
      const data = await res.json();
      setSearchResults(Array.isArray(data.results) ? data.results : []);
    }
    setBusy(false);
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
  const executive = center.executive_dashboard ?? {};
  const companion = center.companion_integration ?? {};
  const governance = center.connector_governance ?? {};
  const routes = center.routes ?? {};

  const allTabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "installed", label: labels.installed },
    { id: "marketplace", label: labels.marketplace },
    { id: "connected_systems", label: labels.connectedSystems },
    { id: "domains", label: labels.domains },
    { id: "api_keys", label: labels.apiKeys },
    { id: "webhooks", label: labels.webhooks },
    { id: "sync", label: labels.sync },
    { id: "reports", label: labels.reports },
    { id: "companion", label: labels.companion },
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
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="min-w-[200px] flex-1 rounded-md border border-aipify-border bg-white px-3 py-2 text-sm"
        />
        <button type="button" disabled={busy} onClick={() => void runSearch()} className={`${AipifyShellClasses.primaryButton} text-sm`}>
          {labels.searchHub}
        </button>
        <Link href={routes.search ?? "/app/search"} className={`${AipifyShellClasses.secondaryButton} text-sm`}>
          {labels.searchIntegration}
        </Link>
        <Link href={routes.mobile_api ?? "/app/integrations/mobile-api"} className={`${AipifyShellClasses.secondaryButton} text-sm`}>
          Mobile API
        </Link>
      </div>

      {searchResults.length > 0 ? (
        <section className="grid gap-3 sm:grid-cols-2">
          {searchResults.map((c) => (
            <ConnectorCard key={c.id} connector={c} labels={labels} />
          ))}
        </section>
      ) : null}

      <nav className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={tab === item.id ? `${AipifyShellClasses.primaryButton} text-sm` : `${AipifyShellClasses.secondaryButton} text-sm`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {tab === "overview" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                [labels.installedCount, overview.installed_count],
                [labels.activeCount, overview.active_count],
                [labels.marketplaceCount, overview.marketplace_count],
                [labels.criticalHealth, overview.critical_health_count],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className={`${AipifyShellClasses.surfaceCard} p-4`}>
                <p className="text-xs uppercase text-aipify-text-muted">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-aipify-text">{String(value ?? 0)}</p>
              </div>
            ))}
          </div>
          <section>
            <h2 className="mb-3 text-sm font-semibold text-aipify-text">{labels.healthMonitoring}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(center.health_monitoring ?? []).length === 0 ? (
                <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} />
              ) : (
                center.health_monitoring?.map((h) => (
                  <div key={`${h.connector_id}-${h.checked_at}`} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                    <p className="font-medium text-aipify-text">{h.connector_name}</p>
                    <p className="mt-1 text-xs text-aipify-text-muted">{healthLabel(h.health_status, labels)}</p>
                    {h.summary ? <p className="mt-1 text-aipify-text-secondary">{h.summary}</p> : null}
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      ) : null}

      {tab === "installed" ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(center.installed_connectors ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} />
          ) : (
            center.installed_connectors?.map((c) => (
              <ConnectorCard
                key={c.id}
                connector={c}
                labels={labels}
                busy={busy}
                onTest={(id) => void runAction("test_connection", { connector_id: id })}
                onSync={(id) => void runAction("start_sync", { connector_id: id, sync_target: "general" })}
              />
            ))
          )}
        </div>
      ) : null}

      {tab === "marketplace" ? (
        <>
          {Array.isArray(center.installation_workflow) ? (
            <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <h2 className="font-semibold text-aipify-text">{labels.installationWorkflow}</h2>
              <p className="mt-2 text-aipify-text-secondary">{center.installation_workflow.join(" → ")}</p>
            </div>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(center.marketplace ?? []).map((m) => (
              <MarketplaceCard
                key={m.connector_key}
                item={m}
                labels={labels}
                busy={busy}
                onInstall={(key) => void runAction("install_connector", { connector_key: key })}
              />
            ))}
          </div>
        </>
      ) : null}

      {tab === "connected_systems" ? (
        <div className="space-y-3">
          {(center.connected_systems ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} />
          ) : (
            center.connected_systems?.map((item) =>
              item.connector ? (
                <div key={item.connector.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                  <p className="font-medium text-aipify-text">{item.connector.connector_name}</p>
                  <p className="mt-1 text-xs text-aipify-text-muted">
                    {item.domain ?? "Organization-wide"}
                    {item.domain_status ? ` · ${item.domain_status}` : ""}
                  </p>
                </div>
              ) : null,
            )
          )}
        </div>
      ) : null}

      {tab === "domains" ? (
        <div className="space-y-3">
          {(center.domains ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} />
          ) : (
            center.domains?.map((d) => (
              <div key={d.domain_id ?? d.domain} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="font-medium text-aipify-text">{d.domain}</p>
                <p className="mt-1 text-xs text-aipify-text-muted">
                  {d.verification_status} · {d.connector_count ?? 0} connectors
                </p>
              </div>
            ))
          )}
          {Array.isArray(center.domain_intelligence) && center.domain_intelligence.length > 0 ? (
            <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <h3 className="font-semibold text-aipify-text">{labels.domainIntelligence}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-aipify-text-secondary">
                {center.domain_intelligence.map((d) => (
                  <li key={d.domain}>
                    {d.domain}: {Array.isArray(d.connectors) ? d.connectors.join(", ") : "—"}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {tab === "api_keys" ? (
        <div className="space-y-3">
          {(center.api_keys ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} />
          ) : (
            center.api_keys?.map((k) => (
              <div key={k.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="font-medium text-aipify-text">{k.key_name}</p>
                <p className="mt-1 text-xs text-aipify-text-muted">
                  {k.key_prefix}… · {k.status} · {k.usage_count ?? 0} uses
                </p>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "webhooks" ? (
        <div className="space-y-3">
          {(center.webhooks ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} />
          ) : (
            center.webhooks?.map((w) => (
              <div key={w.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="font-medium text-aipify-text">{w.webhook_name}</p>
                <p className="mt-1 text-xs text-aipify-text-muted">
                  {w.source} → {w.destination} · {w.status}
                </p>
                {w.failure_count != null && w.failure_count > 0 ? (
                  <p className="mt-1 text-xs text-amber-700">{w.failure_count} failures</p>
                ) : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "sync" ? (
        <div className="space-y-3">
          {(center.sync_history ?? []).length === 0 ? (
            <PlatformEmptyState title={labels.noItems} message={labels.emptyHint} />
          ) : (
            center.sync_history?.map((s) => (
              <div key={s.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="font-medium text-aipify-text">
                  {s.connector_name} · {s.sync_target}
                </p>
                <p className="mt-1 text-xs text-aipify-text-muted">
                  {s.status} · {s.records_processed ?? 0} records
                  {s.duration_ms ? ` · ${s.duration_ms}ms` : ""}
                </p>
                {s.started_at ? (
                  <p className="mt-1 text-xs text-aipify-text-muted">{new Date(s.started_at).toLocaleString()}</p>
                ) : null}
                {s.error_message ? <p className="mt-1 text-xs text-amber-700">{s.error_message}</p> : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "reports" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(center.reports ?? {}).map(([key, value]) => (
            <div key={key} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
              <p className="text-xs uppercase text-aipify-text-muted">{key.replace(/_/g, " ")}</p>
              <p className="mt-1 font-medium text-aipify-text">
                {typeof value === "object" ? JSON.stringify(value) : String(value ?? "—")}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "companion" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.companionIntegration}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-aipify-text-secondary">
              {Array.isArray(companion.prompts) ? companion.prompts.map((p) => <li key={String(p)}>{String(p)}</li>) : null}
            </ul>
          </div>
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.connectorGovernance}</h2>
            {Array.isArray(governance.displays) ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-aipify-text-secondary">
                {governance.displays.map((d) => (
                  <li key={String(d)}>{String(d)}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.executiveDashboard}</h2>
            {Array.isArray(executive.companion_recommendations) ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-aipify-text-secondary">
                {executive.companion_recommendations.map((h) => (
                  <li key={String(h)}>{String(h)}</li>
                ))}
              </ul>
            ) : null}
          </div>
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
