"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parseEventCenter, type EventCenter } from "@/lib/organizational-event-bus-engine/parse";
import type { Oeb591Section } from "@/lib/organizational-event-bus-engine/config";
import { oeb591SectionToRpc } from "@/lib/organizational-event-bus-engine/config";
import type { buildEventCenterLabels } from "@/lib/organizational-event-bus-engine/labels";

type Labels = ReturnType<typeof buildEventCenterLabels>;

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

function signalLabel(labels: Labels, signalClass: unknown): string {
  const key = String(signalClass ?? "information") as keyof Labels["signalClass"];
  return labels.signalClass[key] ?? String(signalClass);
}

export function EventCenterPanel({
  labels,
  activeSection,
}: {
  labels: Labels;
  activeSection: Oeb591Section;
}) {
  const [center, setCenter] = useState<EventCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = oeb591SectionToRpc(activeSection);
    const res = await fetch(`/api/organizational-event-bus/center?section=${rpcSection}`);
    if (res.ok) setCenter(parseEventCenter(await res.json()));
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
        <p className="rounded-2xl border border-teal-100 bg-teal-50/60 px-5 py-4 text-sm text-teal-950">
          {center.principle}
        </p>
      ) : null}

      {(activeSection === "overview" || activeSection === "reports") && (
        <section className="rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-600">{labels.executiveDashboard}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label={labels.executive.positiveSignals} value={exec.positive_signals ?? 0} />
            <StatCard label={labels.executive.riskSignals} value={exec.risk_signals ?? 0} />
            <StatCard label={labels.executive.criticalSignals} value={exec.critical_signals ?? 0} />
            <StatCard label={labels.executive.growthSignals} value={exec.growth_signals ?? 0} />
            <StatCard label={labels.executive.revenueSignals} value={exec.revenue_signals ?? 0} />
          </div>
        </section>
      )}

      {activeSection === "overview" && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label={labels.stats.registryEvents} value={stats.registry_events ?? 0} />
          <StatCard label={labels.stats.openSignals} value={stats.open_signals ?? 0} />
          <StatCard label={labels.stats.openAlerts} value={stats.open_alerts ?? 0} />
          <StatCard label={labels.stats.activeSubscriptions} value={stats.active_subscriptions ?? 0} />
          <StatCard label={labels.stats.eventSources} value={stats.event_sources ?? 0} />
        </section>
      )}

      {activeSection === "overview" && (center.companion_recommendations?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
          {(center.companion_recommendations ?? []).map((rec, i) => (
            <ItemCard
              key={i}
              title={String(rec.signal_title ?? "Insight")}
              summary={String(rec.recommendation ?? "")}
            />
          ))}
        </section>
      )}

      {activeSection === "overview" && (center.business_packs?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.businessPackSignals}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {(center.business_packs ?? []).map((pack) => (
              <ItemCard
                key={String(pack.pack_key)}
                title={String(pack.pack_title)}
                summary={String(pack.summary ?? "")}
                badge={`${String(pack.events_count ?? 0)} events · ${String(pack.signals_count ?? 0)} signals`}
              />
            ))}
          </div>
        </section>
      )}

      {activeSection === "liveActivity" && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.liveActivity}</h3>
          {(center.live_activity ?? []).length === 0 ? (
            <p className="text-sm text-zinc-600">{labels.noRecords}</p>
          ) : (
            (center.live_activity ?? []).map((item) => (
              <ItemCard
                key={String(item.event_key)}
                title={String(item.event_title ?? item.event_type)}
                summary={String(item.summary ?? "")}
                badge={signalLabel(labels, item.severity)}
                extra={
                  item.occurred_at ? (
                    <p className="mt-1 text-xs text-zinc-500">{String(item.occurred_at)}</p>
                  ) : null
                }
              />
            ))
          )}
        </section>
      )}

      {activeSection === "signals" && (
        <section className="space-y-6">
          <div className="grid gap-3">
            {(center.signals ?? []).length === 0 ? (
              <p className="text-sm text-zinc-600">{labels.noRecords}</p>
            ) : (
              (center.signals ?? []).map((s) => (
                <ItemCard
                  key={String(s.signal_key)}
                  title={String(s.signal_title)}
                  summary={String(s.companion_recommendation || s.pattern_summary || s.summary || "")}
                  badge={signalLabel(labels, s.signal_class)}
                  extra={
                    s.source_event_count != null ? (
                      <p className="mt-1 text-xs text-zinc-500">
                        {String(s.source_event_count)} source events
                      </p>
                    ) : null
                  }
                />
              ))
            )}
          </div>
          {(center.correlations ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.correlations}</h3>
              {(center.correlations ?? []).map((c) => (
                <div key={String(c.correlation_key)} className="rounded-xl border border-teal-100 bg-white p-4 shadow-sm">
                  <p className="font-semibold text-zinc-900">{String(c.correlation_title)}</p>
                  {Array.isArray(c.chain_steps) && (
                    <ol className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
                      {(c.chain_steps as string[]).map((step, i) => (
                        <li key={step} className="flex items-center gap-2">
                          {i > 0 ? <span>↓</span> : null}
                          <span className="rounded bg-teal-50 px-2 py-1">{step}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                  <p className="mt-2 text-sm text-zinc-600">{String(c.outcome_summary || c.summary || "")}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "alerts" && (
        <section className="space-y-6">
          <div className="grid gap-3">
            {(center.alerts ?? []).length === 0 ? (
              <p className="text-sm text-zinc-600">{labels.noRecords}</p>
            ) : (
              (center.alerts ?? []).map((a) => (
                <ItemCard
                  key={String(a.alert_key)}
                  title={String(a.alert_title)}
                  summary={String(a.summary ?? "")}
                  badge={`${String(a.alert_channel ?? "")} · ${signalLabel(labels, a.severity)}`}
                />
              ))
            )}
          </div>
          {center.alert_orchestration && Object.keys(center.alert_orchestration).length > 0 && (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <h3 className="font-semibold text-zinc-900">{labels.alertOrchestration}</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm text-zinc-700">
                {Object.entries(center.alert_orchestration).map(([channel, enabled]) => (
                  <li key={channel} className="rounded-full bg-white px-3 py-1 ring-1 ring-zinc-200">
                    {channel}: {enabled === true ? "on" : String(enabled)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {activeSection === "subscriptions" && (
        <section className="grid gap-3">
          {(center.subscriptions ?? []).length === 0 ? (
            <p className="text-sm text-zinc-600">{labels.noRecords}</p>
          ) : (
            (center.subscriptions ?? []).map((s) => (
              <ItemCard
                key={String(s.subscription_key)}
                title={String(s.subscription_title)}
                summary={String(s.summary ?? "")}
                badge={String(s.event_category ?? "")}
                extra={
                  Array.isArray(s.delivery_channels) ? (
                    <p className="mt-1 text-xs text-zinc-500">
                      {(s.delivery_channels as string[]).join(" · ")}
                    </p>
                  ) : null
                }
              />
            ))
          )}
        </section>
      )}

      {activeSection === "sources" && (
        <section className="grid gap-3 sm:grid-cols-2">
          {(center.sources ?? []).length === 0 ? (
            <p className="text-sm text-zinc-600">{labels.noRecords}</p>
          ) : (
            (center.sources ?? []).map((s) => (
              <ItemCard
                key={String(s.source_key)}
                title={String(s.source_title)}
                summary={String(s.summary ?? "")}
                badge={`${String(s.events_emitted ?? 0)} events · ${String(s.source_type ?? "")}`}
              />
            ))
          )}
        </section>
      )}

      {activeSection === "history" && (
        <section className="grid gap-3 sm:grid-cols-2">
          {(center.history ?? []).length === 0 ? (
            <p className="text-sm text-zinc-600">{labels.noRecords}</p>
          ) : (
            (center.history ?? []).map((h) => (
              <ItemCard
                key={String(h.history_key)}
                title={String(h.history_title)}
                summary={String(h.summary ?? "")}
                badge={`${String(h.record_count ?? 0)} records · ${String(h.history_type ?? "")}`}
              />
            ))
          )}
        </section>
      )}

      {activeSection === "reports" && (
        <section className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.signalBriefing}</h3>
            {Object.entries(center.reports ?? {}).map(([key, prompt]) => (
              <ItemCard key={key} title={String(prompt)} summary="" badge={key.replace(/_/g, " ")} />
            ))}
          </div>
          {(center.audit_recent ?? []).length > 0 && (
            <div className="space-y-3">
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
            </div>
          )}
          {center.mobile_access && (
            <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-4">
              <h3 className="font-semibold text-zinc-900">{labels.mobileAccess}</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm text-zinc-700">
                {Object.entries(center.mobile_access).map(([cap, enabled]) => (
                  <li key={cap} className="rounded-full bg-white px-3 py-1 ring-1 ring-teal-100">
                    {cap.replace(/_/g, " ")}: {enabled === true ? "✓" : "—"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {activeSection === "overview" && (center.registry ?? []).length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.eventRegistry}</h3>
          {(center.registry ?? []).slice(0, 6).map((e) => (
            <ItemCard
              key={String(e.event_key)}
              title={String(e.event_type ?? "").replace(/_/g, " ")}
              summary={String(e.summary ?? "")}
              badge={`${String(e.event_source ?? "")} · ${signalLabel(labels, e.severity)}`}
            />
          ))}
        </section>
      )}
    </div>
  );
}
