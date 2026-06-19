"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseAosCenter,
  healthBandEmoji,
  type AosCenter,
} from "@/lib/aos-center-engine/parse";
import type { Aos599Section } from "@/lib/aos-center-engine/config";
import { aos599SectionToRpc } from "@/lib/aos-center-engine/config";
import type { buildAosCenterLabels } from "@/lib/aos-center-engine/labels";

type Labels = ReturnType<typeof buildAosCenterLabels>;

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

function ItemGrid({
  title,
  items,
  titleKey,
  badgeKey,
  summaryKey,
}: {
  title: string;
  items: Record<string, unknown>[];
  titleKey: string;
  badgeKey?: string;
  summaryKey?: string;
}) {
  if (!items.length) {
    return null;
  }
  return (
    <section className="space-y-3">
      <h3 className="font-semibold text-zinc-900">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, idx) => {
          const keyField = Object.keys(item).find((k) => k.endsWith("_key"));
          return (
          <ItemCard
            key={keyField ? String(item[keyField]) : idx}
            title={String(item[titleKey] ?? "")}
            summary={summaryKey ? String(item[summaryKey] ?? "") : undefined}
            badge={badgeKey ? String(item[badgeKey] ?? "") : undefined}
          />
          );
        })}
      </div>
    </section>
  );
}

export function AosCenterPanel({
  labels,
  activeSection,
}: {
  labels: Labels;
  activeSection: Aos599Section;
}) {
  const [center, setCenter] = useState<AosCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = aos599SectionToRpc(activeSection);
    const res = await fetch(`/api/aos-center/center?section=${rpcSection}`);
    if (res.ok) setCenter(parseAosCenter(await res.json()));
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
  const healthBand = String(exec.org_health_band ?? "healthy");

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
        <p className="rounded-2xl border border-violet-100 bg-violet-50/70 px-5 py-4 text-sm text-violet-950">
          {center.principle}
        </p>
      ) : null}

      {(activeSection === "overview" || activeSection === "reports") && (
        <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-600">
            {labels.executiveDashboard}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label={labels.executive.connectedModules} value={exec.connected_modules ?? 0} />
            <StatCard
              label={labels.executive.orgHealthScore}
              value={`${healthBandEmoji(healthBand)} ${exec.org_health_score ?? 0}`}
            />
            <StatCard label={labels.executive.activeSignals} value={exec.active_signals ?? 0} />
            <StatCard label={labels.executive.crossModuleChains} value={exec.cross_module_chains ?? 0} />
            <StatCard label={labels.executive.unifiedEntities} value={exec.unified_entities ?? 0} />
            <StatCard label={labels.executive.searchDomains} value={exec.search_domains ?? 0} />
          </div>
        </section>
      )}

      {activeSection === "overview" && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label={labels.stats.orgDimensions} value={stats.org_dimensions ?? 0} />
            <StatCard label={labels.stats.entities} value={stats.entities ?? 0} />
            <StatCard label={labels.stats.healthDimensions} value={stats.health_dimensions ?? 0} />
            <StatCard label={labels.stats.intelligenceSignals} value={stats.intelligence_signals ?? 0} />
            <StatCard label={labels.stats.orchestrationLayers} value={stats.orchestration_layers ?? 0} />
            <StatCard label={labels.stats.reportTypes} value={stats.report_types ?? 0} />
          </section>
          {(center.organizational_health?.length ?? 0) > 0 && (
            <section className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.organizationalHealthScore}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {(center.organizational_health ?? []).map((h) => (
                  <ItemCard
                    key={String(h.health_key)}
                    title={String(h.health_title ?? "")}
                    summary={String(h.summary ?? "")}
                    badge={`${healthBandEmoji(String(h.health_band))} ${String(h.health_score ?? 0)}`}
                  />
                ))}
              </div>
            </section>
          )}
          {(center.companion_recommendations?.length ?? 0) > 0 && (
            <section className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
              {(center.companion_recommendations ?? []).map((rec, i) => (
                <ItemCard
                  key={i}
                  title={String(rec.signal_title ?? "Insight")}
                  summary={String(rec.recommendation ?? "")}
                  badge={String(rec.signal_type ?? "")}
                />
              ))}
            </section>
          )}
          {center.maturity_checkpoint && (
            <section className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
              <h3 className="font-semibold text-zinc-900">{labels.maturityCheckpoint}</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm text-zinc-700">
                {Object.entries(center.maturity_checkpoint).map(([key, enabled]) => (
                  <li key={key} className="rounded-full bg-white px-3 py-1 ring-1 ring-emerald-100">
                    {key.replace(/_/g, " ")}: {enabled ? "✓" : "—"}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {activeSection === "organization" && (
        <section className="space-y-6">
          <ItemGrid
            title={labels.unifiedOrgModel}
            items={center.org_dimensions ?? []}
            titleKey="dimension_title"
            badgeKey="dimension_type"
            summaryKey="summary"
          />
          <ItemGrid
            title={labels.unifiedEntityEngine}
            items={center.entities ?? []}
            titleKey="entity_title"
            badgeKey="entity_type"
            summaryKey="relationship_summary"
          />
        </section>
      )}

      {activeSection === "operations" && (
        <section className="space-y-6">
          <ItemGrid
            title={labels.globalSearchEngine}
            items={center.search_domains ?? []}
            titleKey="domain_title"
            badgeKey="domain_type"
            summaryKey="summary"
          />
          <ItemGrid
            title={labels.crossModuleIntelligence}
            items={center.cross_module_chains ?? []}
            titleKey="chain_title"
            badgeKey="chain_stage"
            summaryKey="summary"
          />
          <ItemGrid
            title={labels.digitalTwinConnections}
            items={center.twin_connections ?? []}
            titleKey="connection_title"
            badgeKey="connection_domain"
            summaryKey="summary"
          />
        </section>
      )}

      {activeSection === "companion" && (
        <section className="space-y-6">
          <ItemGrid
            title={labels.companionOrchestration}
            items={center.orchestration ?? []}
            titleKey="orchestration_title"
            badgeKey="orchestration_type"
            summaryKey="summary"
          />
          <ItemGrid
            title={labels.globalContextEngine}
            items={center.global_context ?? []}
            titleKey="context_title"
            badgeKey="context_type"
            summaryKey="summary"
          />
          <ItemGrid
            title={labels.executiveOperatingModel}
            items={center.executive_questions ?? []}
            titleKey="question_text"
            badgeKey="question_type"
            summaryKey="summary"
          />
        </section>
      )}

      {activeSection === "intelligence" && (
        <section className="space-y-6">
          <ItemGrid
            title={labels.organizationalAwareness}
            items={center.awareness_states ?? []}
            titleKey="state_title"
            badgeKey="state_type"
            summaryKey="summary"
          />
          <ItemGrid
            title={labels.crossModuleIntelligence}
            items={center.cross_module_chains ?? []}
            titleKey="chain_title"
            badgeKey="chain_stage"
            summaryKey="summary"
          />
          {(center.organizational_health?.length ?? 0) > 0 && (
            <ItemGrid
              title={labels.organizationalHealthScore}
              items={center.organizational_health ?? []}
              titleKey="health_title"
              badgeKey="health_band"
              summaryKey="summary"
            />
          )}
        </section>
      )}

      {activeSection === "businessPacks" && (
        <ItemGrid
          title={labels.businessPackOrchestration}
          items={center.business_pack_links ?? []}
          titleKey="pack_title"
          badgeKey="shared_capability"
          summaryKey="summary"
        />
      )}

      {activeSection === "signals" && (
        <ItemGrid
          title={labels.platformIntelligenceBus}
          items={center.intelligence_bus ?? []}
          titleKey="signal_title"
          badgeKey="signal_type"
          summaryKey="summary"
        />
      )}

      {activeSection === "governance" && (
        <section className="space-y-6">
          <ItemGrid
            title={labels.companionOrchestration}
            items={(center.orchestration ?? []).filter((o) =>
              ["governance", "executive_mode", "command_center", "event_bus"].includes(String(o.orchestration_type))
            )}
            titleKey="orchestration_title"
            badgeKey="orchestration_type"
            summaryKey="summary"
          />
          {(center.audit_recent?.length ?? 0) > 0 && (
            <section className="space-y-3">
              <h3 className="font-semibold text-zinc-900">Audit</h3>
              {(center.audit_recent ?? []).map((entry, i) => (
                <ItemCard
                  key={i}
                  title={String(entry.event_type ?? "")}
                  summary={String(entry.summary ?? "")}
                  extra={
                    entry.created_at ? (
                      <p className="mt-1 text-xs text-zinc-500">{String(entry.created_at)}</p>
                    ) : null
                  }
                />
              ))}
            </section>
          )}
        </section>
      )}

      {activeSection === "reports" && (
        <section className="space-y-6">
          <ItemGrid
            title={labels.globalReportingEngine}
            items={center.report_types ?? []}
            titleKey="report_title"
            badgeKey="report_type"
            summaryKey="summary"
          />
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.executiveOperatingModel}</h3>
            {Object.entries(center.reports ?? {}).map(([key, prompt]) => (
              <ItemCard key={key} title={String(prompt)} badge={key.replace(/_/g, " ")} />
            ))}
          </div>
          <ItemGrid
            title={labels.businessOsApi}
            items={center.api_capabilities ?? []}
            titleKey="capability_title"
            badgeKey="capability_type"
            summaryKey="summary"
          />
          {center.mobile_access && (
            <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
              <h3 className="font-semibold text-zinc-900">{labels.mobileAccess}</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm text-zinc-700">
                {Object.entries(center.mobile_access).map(([cap, enabled]) => (
                  <li key={cap} className="rounded-full bg-white px-3 py-1 ring-1 ring-violet-100">
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
