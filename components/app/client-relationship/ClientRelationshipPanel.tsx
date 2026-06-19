"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseClientRelationshipCenter,
  type ClientRelationshipCenter,
} from "@/lib/client-relationship-engine/parse";
import type { Crm611Section } from "@/lib/client-relationship-engine/config";
import { crm611SectionToRpc } from "@/lib/client-relationship-engine/config";
import type { buildClientRelationshipLabels } from "@/lib/client-relationship-engine/labels";

type Labels = ReturnType<typeof buildClientRelationshipLabels>;

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
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-700">
            {badge.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
      {extra}
    </div>
  );
}

function healthBandClass(status?: string) {
  if (status === "healthy") return "text-emerald-700 bg-emerald-50 ring-emerald-200";
  if (status === "attention_required") return "text-amber-800 bg-amber-50 ring-amber-200";
  return "text-red-800 bg-red-50 ring-red-200";
}

function PhaseReuseCard({ data, note }: { data?: Record<string, unknown>; note: string }) {
  if (!data || Object.keys(data).length === 0) return null;
  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-sm text-indigo-950">
      <p className="font-medium">
        Phase {String(data.reuse_phase ?? data.phase ?? "")} —{" "}
        {String(data.note ?? note)}
      </p>
      {data.route ? (
        <p className="mt-1 text-xs text-indigo-700">Route: {String(data.route)}</p>
      ) : null}
    </div>
  );
}

function sectionRows(center: ClientRelationshipCenter, section: Crm611Section): Record<string, unknown>[] {
  switch (section) {
    case "clients":
      return center.clients ?? [];
    case "journeys":
      return [...(center.journey_stages ?? []), ...(center.journey_events ?? [])];
    case "rebooking":
      return [
        ...(center.rebooking_rules ?? []),
        ...(center.rebooking_queue ?? []),
        ...(center.recurring_agreements ?? []),
      ];
    case "retention":
      return center.retention_cases ?? [];
    case "loyalty":
      return [...(center.loyalty_accounts ?? []), ...(center.loyalty_redemptions ?? [])];
    case "referrals":
      return center.referrals ?? [];
    case "campaigns":
      return center.campaigns ?? [];
    case "feedback":
      return center.feedback ?? [];
    case "serviceRecovery":
      return center.recovery_cases ?? [];
    case "consent":
      return center.communications ?? [];
    case "automation":
      return center.automations ?? [];
    default:
      return [];
  }
}

export function ClientRelationshipPanel({ labels, activeSection }: { labels: Labels; activeSection: Crm611Section }) {
  const [center, setCenter] = useState<ClientRelationshipCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = crm611SectionToRpc(activeSection);
    const res = await fetch(`/api/client-relationships/center?section=${rpcSection}`);
    if (res.ok) setCenter(parseClientRelationshipCenter(await res.json()));
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
        <button
          type="button"
          onClick={() => void load()}
          className="mt-4 rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium hover:bg-amber-100"
        >
          {labels.refresh}
        </button>
      </div>
    );
  }

  const sectionTitle = labels.sections[activeSection] ?? labels.title;
  const stats = center.stats ?? {};
  const healthBand =
    labels.healthBand[center.health_status as keyof typeof labels.healthBand] ??
    center.health_status_label;
  const rows = sectionRows(center, activeSection);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{sectionTitle}</h2>
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
        <p className="rounded-2xl border border-violet-100 bg-violet-50/60 px-5 py-4 text-sm text-violet-950">
          {center.principle}
        </p>
      ) : null}

      {(activeSection === "overview" || activeSection === "reports") && (
        <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase text-zinc-500">{labels.healthScore}</p>
              <p className="mt-1 text-4xl font-bold text-violet-900">{center.health_score ?? 0}</p>
              <span
                className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${healthBandClass(center.health_status)}`}
              >
                {healthBand}
              </span>
            </div>
            <StatCard label={labels.stats.activeClients} value={stats.active_clients ?? 0} />
            <StatCard label={labels.stats.pendingRebooking} value={stats.pending_rebooking ?? 0} />
            <StatCard label={labels.stats.openRecovery} value={stats.open_recovery ?? 0} />
          </div>
        </section>
      )}

      {activeSection === "overview" && (center.companion_recommendations?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
          {(center.companion_recommendations ?? []).map((rec, i) => (
            <ItemCard
              key={i}
              title={String(rec.client_label ?? labels.companionAdvisor)}
              summary={String(rec.recommendation ?? "")}
              badge={String(rec.health_status ?? "")}
            />
          ))}
        </section>
      )}

      {activeSection === "memberships" && (
        <PhaseReuseCard data={center.memberships} note={labels.phaseReuseNote} />
      )}
      {activeSection === "packages" && (
        <PhaseReuseCard data={center.packages} note={labels.phaseReuseNote} />
      )}
      {activeSection === "rebooking" && center.waiting_list && (
        <PhaseReuseCard data={center.waiting_list} note={labels.phaseReuseNote} />
      )}

      {activeSection === "reports" && center.reports && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label={labels.stats.activeClients} value={String(center.reports.client_count ?? 0)} />
          <StatCard
            label={labels.stats.loyaltyAccounts}
            value={String(center.reports.loyalty_total_points ?? 0)}
          />
          <StatCard
            label={labels.sections.referrals}
            value={String(center.reports.referral_qualified ?? 0)}
          />
          <StatCard
            label="Sections"
            value={String(center.reports.sections_implemented ?? center.section_count ?? 0)}
          />
        </section>
      )}

      {rows.length > 0 ? (
        <section className="space-y-3">
          {rows.map((row, i) => {
            const title = String(
              row.client_label ??
                row.rule_title ??
                row.case_title ??
                row.stage_title ??
                row.event_title ??
                row.account_key ??
                row.campaign_title ??
                row.feedback_key ??
                row.recovery_title ??
                row.automation_title ??
                row.referral_key ??
                row.queue_key ??
                row.title ??
                `Record ${i + 1}`
            );
            const badge = String(
              row.lifecycle_status ??
                row.queue_status ??
                row.case_status ??
                row.stage_status ??
                row.tier_key ??
                row.campaign_status ??
                row.sentiment ??
                row.recovery_status ??
                row.delivery_status ??
                row.qualification_status ??
                ""
            );
            return (
              <ItemCard
                key={i}
                title={title}
                summary={String(row.summary ?? "")}
                badge={badge || undefined}
              />
            );
          })}
        </section>
      ) : activeSection !== "overview" &&
        activeSection !== "memberships" &&
        activeSection !== "packages" &&
        activeSection !== "reports" ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-600">
          {labels.noRecords}
        </div>
      ) : null}

      {activeSection === "overview" && (center.integrations?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">Integrations</h3>
          {(center.integrations ?? []).map((item, i) => (
            <ItemCard
              key={i}
              title={String(item.integration_title ?? "")}
              summary={String(item.summary ?? "")}
              badge={String(item.integration_status ?? "")}
            />
          ))}
        </section>
      )}

      <p className="text-xs text-zinc-500">{labels.humanReviewRequired}</p>
    </div>
  );
}
