"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseMemoryCenter,
  filterMemoriesByClass,
  type MemoryCenter,
} from "@/lib/companion-memory-center-engine/parse";
import type { Cmri594Section } from "@/lib/companion-memory-center-engine/config";
import { cmri594SectionToRpc } from "@/lib/companion-memory-center-engine/config";
import type { buildCompanionMemoryCenterLabels } from "@/lib/companion-memory-center-engine/labels";

type Labels = ReturnType<typeof buildCompanionMemoryCenterLabels>;

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

export function CompanionMemoryCenterPanel({
  labels,
  activeSection,
}: {
  labels: Labels;
  activeSection: Cmri594Section;
}) {
  const [center, setCenter] = useState<MemoryCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = cmri594SectionToRpc(activeSection);
    const res = await fetch(`/api/companion-memory-center/center?section=${rpcSection}`);
    if (res.ok) setCenter(parseMemoryCenter(await res.json()));
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
  const memories = center.memories ?? [];

  const renderMemories = (items: Record<string, unknown>[]) =>
    items.length === 0 ? (
      <p className="text-sm text-zinc-600">{labels.noRecords}</p>
    ) : (
      items.map((m) => (
        <ItemCard
          key={String(m.memory_key)}
          title={String(m.memory_title)}
          summary={String(m.summary ?? "")}
          badge={`${String(m.memory_class ?? "")} · ${String(m.retention_type ?? "")}`}
        />
      ))
    );

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
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-600">{labels.executiveDashboard}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label={labels.executive.upcomingMilestones} value={exec.upcoming_milestones ?? 0} />
            <StatCard label={labels.executive.openFollowUps} value={exec.open_follow_ups ?? 0} />
            <StatCard label={labels.executive.relationshipCount} value={exec.relationship_count ?? 0} />
            <StatCard label={labels.executive.avgRelationshipHealth} value={exec.avg_relationship_health ?? 0} />
            <StatCard label={labels.executive.pendingReviews} value={exec.pending_reviews ?? 0} />
            <StatCard label={labels.executive.commitments} value={exec.commitments ?? 0} />
          </div>
        </section>
      )}

      {activeSection === "overview" && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label={labels.stats.memories} value={stats.memories ?? 0} />
          <StatCard label={labels.stats.preferences} value={stats.preferences ?? 0} />
          <StatCard label={labels.stats.relationships} value={stats.relationships ?? 0} />
          <StatCard label={labels.stats.importantDates} value={stats.important_dates ?? 0} />
          <StatCard label={labels.stats.followUps} value={stats.follow_ups ?? 0} />
          <StatCard label={labels.stats.contextItems} value={stats.context_items ?? 0} />
        </section>
      )}

      {activeSection === "overview" && (center.companion_recommendations?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
          {(center.companion_recommendations ?? []).map((rec, i) => (
            <ItemCard
              key={i}
              title={String(rec.follow_up_title ?? "Insight")}
              summary={String(rec.recommendation ?? "")}
            />
          ))}
        </section>
      )}

      {activeSection === "personalMemory" && (
        <section className="space-y-6">
          <div className="grid gap-3">{renderMemories(filterMemoriesByClass(memories, "personal"))}</div>
          {(center.context ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.contextMemory}</h3>
              {(center.context ?? []).map((c) => (
                <ItemCard key={String(c.context_key)} title={String(c.context_title)} summary={String(c.summary ?? "")} badge={String(c.context_type ?? "")} />
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "organizationMemory" && (
        <section className="space-y-6">
          <div className="grid gap-3">
            {renderMemories([
              ...filterMemoriesByClass(memories, "organizational"),
              ...filterMemoriesByClass(memories, "operational"),
              ...filterMemoriesByClass(memories, "knowledge"),
            ])}
          </div>
          {(center.important_dates ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.importantDates}</h3>
              {(center.important_dates ?? []).map((d) => (
                <ItemCard
                  key={String(d.date_key)}
                  title={String(d.date_title)}
                  summary={String(d.summary ?? "")}
                  badge={String(d.date_type ?? "")}
                  extra={d.occurs_at ? <p className="mt-1 text-xs text-zinc-500">{String(d.occurs_at)}</p> : null}
                />
              ))}
            </div>
          )}
          {(center.integrations ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.organizationalIntegration}</h3>
              {(center.integrations ?? []).map((i) => (
                <ItemCard key={String(i.integration_key)} title={String(i.integration_title)} summary={String(i.summary ?? "")} badge={String(i.engine_name ?? "")} />
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "preferences" && (
        <section className="grid gap-3 sm:grid-cols-2">
          {(center.preferences ?? []).length === 0 ? (
            <p className="text-sm text-zinc-600">{labels.noRecords}</p>
          ) : (
            (center.preferences ?? []).map((p) => (
              <ItemCard
                key={String(p.preference_key)}
                title={String(p.preference_title)}
                summary={String(p.summary ?? p.preference_value ?? "")}
                badge={String(p.preference_category ?? "")}
              />
            ))
          )}
        </section>
      )}

      {activeSection === "relationships" && (
        <section className="space-y-6">
          <div className="grid gap-3">
            {(center.relationships ?? []).map((r) => (
              <ItemCard
                key={String(r.relationship_key)}
                title={String(r.relationship_title)}
                summary={String(r.summary ?? "")}
                badge={`${String(r.relationship_type ?? "")} · ${String(r.health_score ?? 0)}`}
              />
            ))}
          </div>
          {(center.follow_ups ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.followUpMemory}</h3>
              {(center.follow_ups ?? []).map((f) => (
                <ItemCard
                  key={String(f.follow_up_key)}
                  title={String(f.follow_up_title)}
                  summary={String(f.summary ?? "")}
                  badge={String(f.follow_up_status ?? "")}
                  extra={f.due_at ? <p className="mt-1 text-xs text-zinc-500">{String(f.due_at)}</p> : null}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeSection === "permissions" && (
        <section className="space-y-6">
          <div className="grid gap-3">
            {(center.permissions ?? []).map((p) => (
              <ItemCard
                key={String(p.permission_key)}
                title={String(p.permission_title)}
                summary={String(p.summary ?? "")}
                badge={`${String(p.privacy_level ?? "")} · remember ${p.can_remember ? "yes" : "no"}`}
                extra={
                  p.retention_days != null ? (
                    <p className="mt-1 text-xs text-zinc-500">Retention: {String(p.retention_days)} days</p>
                  ) : null
                }
              />
            ))}
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.memoryClassification}</h3>
            {memories.slice(0, 5).map((m) => (
              <ItemCard key={String(m.memory_key)} title={String(m.memory_title)} badge={String(m.memory_class ?? "")} />
            ))}
          </div>
        </section>
      )}

      {activeSection === "reviews" && (
        <section className="grid gap-3">
          {(center.reviews ?? []).map((r) => (
            <ItemCard
              key={String(r.review_key)}
              title={String(r.review_title)}
              summary={String(r.summary ?? "")}
              badge={`${String(r.review_action ?? "")} · ${String(r.review_status ?? "")}`}
            />
          ))}
        </section>
      )}

      {activeSection === "reports" && (
        <section className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-900">{labels.relationshipAdvisor}</h3>
            {Object.entries(center.reports ?? {}).map(([key, prompt]) => (
              <ItemCard key={key} title={String(prompt)} badge={key.replace(/_/g, " ")} />
            ))}
          </div>
          {(center.business_packs ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.businessPackIntegration}</h3>
              {(center.business_packs ?? []).map((pack) => (
                <ItemCard
                  key={String(pack.pack_key)}
                  title={String(pack.pack_title)}
                  summary={String(pack.summary ?? "")}
                  badge={`${String(pack.relationships_count ?? 0)} relationships · ${String(pack.milestones_count ?? 0)} milestones`}
                />
              ))}
            </div>
          )}
          {(center.audit_recent ?? []).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-zinc-900">Audit</h3>
              {(center.audit_recent ?? []).map((entry, i) => (
                <ItemCard
                  key={i}
                  title={String(entry.event_type ?? "")}
                  summary={String(entry.summary ?? "")}
                  extra={entry.created_at ? <p className="mt-1 text-xs text-zinc-500">{String(entry.created_at)}</p> : null}
                />
              ))}
            </div>
          )}
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

      {activeSection === "overview" && memories.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.memoryClassification}</h3>
          <div className="grid gap-3 sm:grid-cols-2">{renderMemories(memories.slice(0, 4))}</div>
        </section>
      )}

      {activeSection === "overview" && (center.business_packs?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.businessPackIntegration}</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {(center.business_packs ?? []).map((pack) => (
              <ItemCard key={String(pack.pack_key)} title={String(pack.pack_title)} summary={String(pack.summary ?? "")} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
