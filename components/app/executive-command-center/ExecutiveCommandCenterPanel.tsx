"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseExecutiveCommandCenter,
  type ExecutiveCommandCenter,
} from "@/lib/executive-command-center-engine/parse";
import type { Ecc590Section } from "@/lib/executive-command-center-engine/config";
import { ecc590SectionToRpc } from "@/lib/executive-command-center-engine/config";
import type { buildExecutiveCommandCenterLabels } from "@/lib/executive-command-center-engine/labels";

type Labels = ReturnType<typeof buildExecutiveCommandCenterLabels>;

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

function priorityLabel(labels: Labels, priority: unknown): string {
  const key = String(priority ?? "information") as keyof Labels["priority"];
  return labels.priority[key] ?? String(priority);
}

export function ExecutiveCommandCenterPanel({
  labels,
  activeSection,
}: {
  labels: Labels;
  activeSection: Ecc590Section;
}) {
  const [center, setCenter] = useState<ExecutiveCommandCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = ecc590SectionToRpc(activeSection);
    const res = await fetch(`/api/executive-command-center/center?section=${rpcSection}`);
    if (res.ok) setCenter(parseExecutiveCommandCenter(await res.json()));
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
  const riskAlerts = (center.alerts ?? []).filter((a) =>
    ["customer_risk", "revenue_decline", "security", "compliance"].includes(String(a.alert_type))
  );
  const approvalActions = (center.actions ?? []).filter((a) => String(a.action_type) === "approval");
  const allActions = center.actions ?? [];

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
        <p className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-indigo-950">
          {center.principle}
        </p>
      ) : null}

      {(activeSection === "overview" || activeSection === "performance") && (
        <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-6 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <p className="text-xs font-medium uppercase text-zinc-500">{labels.overallHealthScore}</p>
              <p className="mt-1 text-4xl font-bold text-indigo-900">{center.overall_health_score ?? 0}</p>
            </div>
            <StatCard label={labels.stats.sinceLastLoginItems} value={stats.since_last_login_items ?? 0} />
            <StatCard label={labels.stats.openAlerts} value={stats.open_alerts ?? 0} />
            <StatCard label={labels.stats.pendingActions} value={stats.pending_actions ?? 0} />
            <StatCard label={labels.stats.criticalItems} value={stats.critical_items ?? 0} />
          </div>
        </section>
      )}

      {activeSection === "overview" && (center.companion_recommendations?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
          {(center.companion_recommendations ?? []).map((rec, i) => (
            <ItemCard
              key={i}
              title={String(rec.alert_title ?? "Insight")}
              summary={String(rec.recommendation ?? "")}
            />
          ))}
        </section>
      )}

      {activeSection === "overview" && (center.business_packs?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.businessPackSignals}</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {(center.business_packs ?? []).map((pack) => (
              <ItemCard
                key={String(pack.pack_key)}
                title={String(pack.pack_title)}
                summary={String(pack.summary ?? "")}
                badge={`${String(pack.events_count ?? 0)} events · ${String(pack.alerts_count ?? 0)} alerts`}
              />
            ))}
          </div>
        </section>
      )}

      {activeSection === "sinceLastLogin" && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.sinceLastLogin}</h3>
          {(center.since_last_login ?? []).length === 0 ? (
            <p className="text-sm text-zinc-600">{labels.noRecords}</p>
          ) : (
            (center.since_last_login ?? []).map((item) => (
              <ItemCard
                key={String(item.item_key)}
                title={`${String(item.item_count ?? 1)} — ${String(item.item_title)}`}
                summary={String(item.summary ?? "")}
                badge={priorityLabel(labels, item.priority)}
              />
            ))
          )}
          {(center.timeline ?? []).length > 0 && (
            <>
              <h3 className="pt-4 font-semibold text-zinc-900">{labels.organizationalTimeline}</h3>
              {(center.timeline ?? []).map((evt) => (
                <ItemCard
                  key={String(evt.event_key)}
                  title={String(evt.event_title)}
                  summary={String(evt.summary ?? "")}
                  badge={String(evt.event_type ?? "")}
                  extra={
                    evt.occurred_at ? (
                      <p className="mt-1 text-xs text-zinc-500">{String(evt.occurred_at)}</p>
                    ) : null
                  }
                />
              ))}
            </>
          )}
        </section>
      )}

      {activeSection === "alerts" && (
        <section className="grid gap-3">
          {(center.alerts ?? []).length === 0 ? (
            <p className="text-sm text-zinc-600">{labels.noRecords}</p>
          ) : (
            (center.alerts ?? []).map((a) => (
              <ItemCard
                key={String(a.alert_key)}
                title={String(a.alert_title)}
                summary={String(a.companion_recommendation || a.summary || "")}
                badge={priorityLabel(labels, a.priority)}
              />
            ))
          )}
        </section>
      )}

      {activeSection === "approvals" && (
        <section className="grid gap-3">
          {approvalActions.length === 0 && allActions.length === 0 ? (
            <p className="text-sm text-zinc-600">{labels.noRecords}</p>
          ) : (
            (approvalActions.length > 0 ? approvalActions : allActions).map((a) => (
              <ItemCard
                key={String(a.action_key)}
                title={String(a.action_title)}
                summary={String(a.summary ?? "")}
                badge={priorityLabel(labels, a.priority)}
                extra={
                  a.record_href ? (
                    <Link href={String(a.record_href)} className="mt-3 inline-block text-sm font-medium text-indigo-700 hover:underline">
                      Open
                    </Link>
                  ) : null
                }
              />
            ))
          )}
        </section>
      )}

      {activeSection === "risks" && (
        <section className="grid gap-3">
          {riskAlerts.length === 0 && (center.health ?? []).length === 0 ? (
            <p className="text-sm text-zinc-600">{labels.noRecords}</p>
          ) : (
            <>
              {riskAlerts.map((a) => (
                <ItemCard
                  key={String(a.alert_key)}
                  title={String(a.alert_title)}
                  summary={String(a.companion_recommendation || a.summary || "")}
                  badge={priorityLabel(labels, a.priority)}
                />
              ))}
              {(center.health ?? [])
                .filter((h) => Number(h.health_score) < 80)
                .map((h) => (
                  <ItemCard
                    key={String(h.health_key)}
                    title={String(h.health_title)}
                    summary={String(h.summary ?? "")}
                    badge={`${String(h.health_score ?? 0)} · ${String(h.health_status ?? "")}`}
                  />
                ))}
            </>
          )}
        </section>
      )}

      {activeSection === "opportunities" && (
        <section className="grid gap-3">
          {(center.opportunities ?? []).length === 0 ? (
            <p className="text-sm text-zinc-600">{labels.noRecords}</p>
          ) : (
            (center.opportunities ?? []).map((o) => (
              <ItemCard
                key={String(o.opportunity_key)}
                title={String(o.opportunity_title)}
                summary={String(o.recommendation || o.summary || "")}
                badge={priorityLabel(labels, o.priority)}
              />
            ))
          )}
        </section>
      )}

      {activeSection === "performance" && (
        <section className="grid gap-3 sm:grid-cols-2">
          {(center.health ?? []).length === 0 ? (
            <p className="text-sm text-zinc-600">{labels.noRecords}</p>
          ) : (
            (center.health ?? []).map((h) => (
              <ItemCard
                key={String(h.health_key)}
                title={String(h.health_title)}
                summary={String(h.summary ?? "")}
                badge={`${String(h.health_score ?? 0)} · ${String(h.health_status ?? "")}`}
              />
            ))
          )}
        </section>
      )}

      {activeSection === "companionBriefing" && (
        <section className="space-y-6">
          {(center.briefings ?? []).map((b) => (
            <div key={String(b.briefing_key)} className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-zinc-900">{String(b.briefing_title)}</h3>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium uppercase text-zinc-500">{labels.briefing.revenue}</dt>
                  <dd className="mt-1 text-sm text-zinc-700">{String(b.revenue_summary ?? "")}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-zinc-500">{labels.briefing.customer}</dt>
                  <dd className="mt-1 text-sm text-zinc-700">{String(b.customer_summary ?? "")}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-zinc-500">{labels.briefing.risk}</dt>
                  <dd className="mt-1 text-sm text-zinc-700">{String(b.risk_summary ?? "")}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-zinc-500">{labels.briefing.operational}</dt>
                  <dd className="mt-1 text-sm text-zinc-700">{String(b.operational_summary ?? "")}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-zinc-500">{labels.briefing.growth}</dt>
                  <dd className="mt-1 text-sm text-zinc-700">{String(b.growth_summary ?? "")}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-zinc-500">{labels.briefing.companion}</dt>
                  <dd className="mt-1 text-sm text-zinc-700">{String(b.companion_recommendations ?? "")}</dd>
                </div>
              </dl>
            </div>
          ))}

          {(center.board_reports ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.boardReadyReports}</h3>
              {(center.board_reports ?? []).map((r) => (
                <ItemCard
                  key={String(r.report_key)}
                  title={String(r.report_title)}
                  summary={String(r.summary ?? "")}
                  badge={String(r.report_type ?? "")}
                />
              ))}
            </div>
          )}

          {(center.command_prompts ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.commandMode}</h3>
              <ul className="flex flex-wrap gap-2">
                {(center.command_prompts ?? []).map((prompt) => (
                  <li key={prompt} className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-700">
                    {prompt}
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
