"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parseIntegrationCenter, type IntegrationCenter } from "@/lib/integration-center-engine/parse";
import type { Oih592Section } from "@/lib/integration-center-engine/config";
import { oih592SectionToRpc } from "@/lib/integration-center-engine/config";
import type { buildIntegrationCenterLabels } from "@/lib/integration-center-engine/labels";

type Labels = ReturnType<typeof buildIntegrationCenterLabels>;

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function ItemCard({
  title,
  summary,
  badge,
  extra,
}: {
  title: string;
  summary?: string;
  badge?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{title}</p>
        {badge ? (
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-700">
            {badge.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
      {extra}
    </div>
  );
}

function healthLabel(labels: Labels, status: unknown): string {
  const key = String(status ?? "healthy") as keyof Labels["healthStatus"];
  return labels.healthStatus[key] ?? String(status);
}

export function IntegrationCenterPanel({
  labels,
  activeSection,
}: {
  labels: Labels;
  activeSection: Oih592Section;
}) {
  const [center, setCenter] = useState<IntegrationCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = oih592SectionToRpc(activeSection);
    const res = await fetch(`/api/integration-center/center?section=${rpcSection}`);
    if (res.ok) setCenter(parseIntegrationCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.empty}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  const stats = center.stats ?? {};
  const exec = center.executive_dashboard ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{labels.sections[activeSection]}</h2>
          {center.privacy_note ? <p className="mt-1 text-xs text-zinc-500">{center.privacy_note}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {labels.refresh}
        </button>
      </div>

      {center.principle ? (
        <p className="rounded-2xl border border-sky-100 bg-sky-50/60 px-5 py-4 text-sm text-sky-950">{center.principle}</p>
      ) : null}

      {(activeSection === "overview" || activeSection === "reports") && (
        <section className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/80 to-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-600">{labels.executiveDashboard}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label={labels.executive.connectedApps} value={exec.connected_apps ?? 0} />
            <StatCard label={labels.executive.healthyConnections} value={exec.healthy_connections ?? 0} />
            <StatCard label={labels.executive.failedConnections} value={exec.failed_connections ?? 0} />
            <StatCard label={labels.executive.attentionRequired} value={exec.attention_required ?? 0} />
            <StatCard label={labels.executive.permissionRisks} value={exec.permission_risks ?? 0} />
          </div>
        </section>
      )}

      {activeSection === "overview" && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label={labels.stats.connectedApps} value={stats.connected_apps ?? 0} />
          <StatCard label={labels.stats.availableApps} value={stats.available_apps ?? 0} />
          <StatCard label={labels.stats.activeApiKeys} value={stats.active_api_keys ?? 0} />
          <StatCard label={labels.stats.capabilities} value={stats.capabilities ?? 0} />
          <StatCard label={labels.stats.openHealthIssues} value={stats.open_health_issues ?? 0} />
        </section>
      )}

      {activeSection === "overview" && (center.companion_recommendations?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
          {(center.companion_recommendations ?? []).map((rec, i) => (
            <ItemCard
              key={i}
              title={String(rec.health_title ?? "Insight")}
              summary={String(rec.recommendation ?? "")}
            />
          ))}
        </section>
      )}

      {activeSection === "overview" && (center.business_packs?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.businessPackIntegration}</h3>
          {(center.business_packs ?? []).map((pack) => (
            <ItemCard
              key={String(pack.pack_key)}
              title={String(pack.pack_title)}
              summary={String(pack.summary ?? "")}
              badge={Array.isArray(pack.integrations) ? (pack.integrations as string[]).join(" · ") : ""}
            />
          ))}
        </section>
      )}

      {activeSection === "connectedApps" && (
        <section className="grid gap-3">
          {(center.connected_apps ?? []).length === 0 ? (
            <p className="text-sm text-zinc-600">{labels.noRecords}</p>
          ) : (
            (center.connected_apps ?? []).map((app) => (
              <ItemCard
                key={String(app.app_key)}
                title={String(app.app_name)}
                summary={String(app.permissions_summary || app.summary || "")}
                badge={`${String(app.app_status ?? "")} · ${healthLabel(labels, app.health_status)}`}
                extra={
                  <p className="mt-1 text-xs text-zinc-500">
                    {String(app.owner_label ?? "")}
                    {app.last_sync_at ? ` · Last sync: ${String(app.last_sync_at)}` : ""}
                  </p>
                }
              />
            ))
          )}
        </section>
      )}

      {activeSection === "availableApps" && (
        <section className="space-y-6">
          {(center.marketplace_categories ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium uppercase text-zinc-500">{labels.marketplaceFoundation}:</span>
              {(center.marketplace_categories ?? []).map((cat) => (
                <span key={cat} className="rounded-full bg-sky-50 px-3 py-1 text-xs capitalize text-sky-800">
                  {cat}
                </span>
              ))}
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {(center.available_apps ?? []).map((app) => (
              <ItemCard
                key={String(app.app_key)}
                title={String(app.app_name)}
                summary={String(app.summary ?? "")}
                badge={`${String(app.app_category ?? "")} · ${String(app.install_method ?? "")}`}
              />
            ))}
          </div>
          <p className="text-sm text-zinc-600">
            <Link href="/app/integrations/marketplace" className="font-medium text-sky-700 hover:underline">
              Legacy marketplace
            </Link>
          </p>
        </section>
      )}

      {activeSection === "apiKeys" && (
        <section className="grid gap-3">
          {(center.api_keys ?? []).map((key) => (
            <ItemCard
              key={String(key.key_key)}
              title={String(key.key_name)}
              summary={String(key.summary ?? "")}
              badge={String(key.key_status ?? "")}
              extra={
                <>
                  <p className="mt-1 font-mono text-xs text-zinc-500">{String(key.key_prefix ?? "")}••••</p>
                  {Array.isArray(key.permissions) ? (
                    <p className="mt-1 text-xs text-zinc-500">{(key.permissions as string[]).join(", ")}</p>
                  ) : null}
                </>
              }
            />
          ))}
        </section>
      )}

      {activeSection === "permissions" && (
        <section className="space-y-6">
          <div className="grid gap-3">
            {(center.permissions ?? []).map((perm) => (
              <ItemCard
                key={String(perm.permission_key)}
                title={String(perm.permission_title)}
                summary={String(perm.summary ?? "")}
                badge={[
                  perm.read_access ? "read" : null,
                  perm.write_access ? "write" : null,
                  perm.approval_required ? "approval" : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ))}
          </div>
          {(center.capabilities ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.actionCapabilities}</h3>
              {(center.capabilities ?? []).map((cap) => (
                <ItemCard
                  key={String(cap.capability_key)}
                  title={String(cap.capability_title)}
                  summary={String(cap.summary ?? "")}
                  badge={cap.approval_required ? "approval required" : "available"}
                />
              ))}
            </div>
          )}
          {(center.external_actions ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.externalActionGovernance}</h3>
              {(center.external_actions ?? []).map((act) => (
                <ItemCard
                  key={String(act.action_key)}
                  title={String(act.action_title)}
                  summary={String(act.summary ?? "")}
                  badge={String(act.governance_level ?? "")}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "logs" && (
        <section className="grid gap-3">
          {(center.logs ?? []).map((log) => (
            <ItemCard
              key={String(log.log_key)}
              title={String(log.log_title)}
              summary={String(log.summary ?? "")}
              badge={`${String(log.log_type ?? "")} · ${String(log.log_status ?? "")}`}
              extra={log.occurred_at ? <p className="mt-1 text-xs text-zinc-500">{String(log.occurred_at)}</p> : null}
            />
          ))}
        </section>
      )}

      {activeSection === "health" && (
        <section className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {(center.health ?? []).map((h) => (
              <ItemCard
                key={String(h.health_key)}
                title={String(h.health_title)}
                summary={String(h.summary ?? "")}
                badge={healthLabel(labels, h.connection_status)}
                extra={
                  <p className="mt-1 text-xs text-zinc-500">
                    Auth: {String(h.auth_status ?? "")} · Sync: {String(h.sync_status ?? "")}
                    {Number(h.api_errors) > 0 ? ` · ${String(h.api_errors)} API errors` : ""}
                  </p>
                }
              />
            ))}
          </div>
          {(center.sync ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.dataSyncEngine}</h3>
              {(center.sync ?? []).map((s) => (
                <ItemCard
                  key={String(s.sync_key)}
                  title={String(s.sync_title)}
                  summary={String(s.summary ?? "")}
                  badge={`${String(s.sync_mode ?? "")} · ${String(s.sync_status ?? "")}`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "reports" && (
        <section className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.integrationAdvisor}</h3>
            {Object.entries(center.reports ?? {}).map(([key, prompt]) => (
              <ItemCard key={key} title={String(prompt)} badge={key.replace(/_/g, " ")} />
            ))}
          </div>
          {center.mobile_access && (
            <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-4">
              <h3 className="font-semibold text-zinc-900">{labels.mobileAccess}</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm text-zinc-700">
                {Object.entries(center.mobile_access).map(([cap, enabled]) => (
                  <li key={cap} className="rounded-full bg-white px-3 py-1 ring-1 ring-sky-100">
                    {cap.replace(/_/g, " ")}: {enabled === true ? "✓" : "—"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
