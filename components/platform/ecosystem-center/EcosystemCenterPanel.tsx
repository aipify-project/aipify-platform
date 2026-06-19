"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  ep601SectionToRpc,
  parseEcosystemCenter,
  type Ep601Section,
  type EcosystemCenter,
} from "@/lib/ecosystem-center-engine";
import type { buildEcosystemCenterLabels } from "@/lib/ecosystem-center-engine/labels";

type Labels = ReturnType<typeof buildEcosystemCenterLabels>;

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function ItemCard({
  title,
  summary,
  badge,
}: {
  title: string;
  summary?: string;
  badge?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-gray-900">{title}</p>
        {badge ? (
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-700">
            {badge.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {summary ? <p className="mt-2 text-sm text-gray-600">{summary}</p> : null}
    </div>
  );
}

export function EcosystemCenterPanel({
  labels,
  activeSection,
}: {
  labels: Labels;
  activeSection: Ep601Section;
}) {
  const [center, setCenter] = useState<EcosystemCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = ep601SectionToRpc(activeSection);
    const res = await fetch(`/api/platform/ecosystem-center/center?section=${rpcSection}`);
    if (res.ok) setCenter(parseEcosystemCenter(await res.json()));
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

  const exec = center.executive_dashboard ?? {};
  const stats = center.stats ?? {};
  const sectionItems = getSectionItems(center, activeSection);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{labels.sections[activeSection]}</h2>
          {center.privacy_note ? <p className="mt-1 text-xs text-gray-500">{center.privacy_note}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {labels.refresh}
        </button>
      </div>

      {center.principle ? (
        <p className="rounded-2xl border border-violet-100 bg-violet-50/70 px-5 py-4 text-sm text-violet-950">
          {center.principle}
        </p>
      ) : null}

      {(activeSection === "overview" || activeSection === "reports") && Object.keys(exec).length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.executiveDashboard}</h3>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(exec).map(([key, value]) => (
              <StatCard key={key} label={key.replace(/_/g, " ")} value={value} />
            ))}
          </dl>
        </section>
      )}

      {Object.keys(stats).length > 0 && (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(stats).map(([key, value]) => (
            <StatCard key={key} label={key.replace(/_/g, " ")} value={value} />
          ))}
        </dl>
      )}

      {(center.companion_recommendations ?? []).length > 0 && activeSection === "overview" && (
        <section className="space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.companionRecommendations}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {center.companion_recommendations!.map((item, idx) => (
              <ItemCard
                key={String(item.key ?? idx)}
                title={String(item.observation ?? "")}
                summary={String(item.recommendation ?? "")}
                badge={String(item.key ?? "")}
              />
            ))}
          </div>
        </section>
      )}

      {sectionItems.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.records}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {sectionItems.slice(0, 24).map((item, idx) => (
              <ItemCard
                key={String(item.id ?? idx)}
                title={item.title}
                summary={item.summary}
                badge={item.badge}
              />
            ))}
          </div>
        </section>
      )}

      {(center.rows ?? []).length > 0 && sectionItems.length === 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">{labels.records}</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {(center.rows ?? []).slice(0, 25).map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {String(row.title ?? row.customer_name ?? "—")}
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-600">{String(row.status ?? "—")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === "reports" && center.reports && Object.keys(center.reports).length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.reports}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(center.reports).map(([key, value]) => (
              <ItemCard key={key} title={key.replace(/_/g, " ")} summary={value} />
            ))}
          </div>
        </section>
      )}

      {(center.audit_recent ?? []).length > 0 && (activeSection === "overview" || activeSection === "reports") && (
        <section className="space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.auditRecent}</h3>
          <div className="space-y-2">
            {(center.audit_recent ?? []).slice(0, 10).map((entry, idx) => (
              <div key={idx} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <span className="font-medium capitalize">{String(entry.event_type ?? "").replace(/_/g, " ")}</span>
                {" — "}
                {String(entry.summary ?? "")}
              </div>
            ))}
          </div>
        </section>
      )}

      {sectionItems.length === 0 && !(center.rows ?? []).length && activeSection !== "overview" && activeSection !== "reports" && (
        <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
          {labels.noRecords}
        </p>
      )}
    </div>
  );
}

function getSectionItems(
  center: EcosystemCenter,
  section: Ep601Section
): Array<{ id: string; title: string; summary?: string; badge?: string }> {
  switch (section) {
    case "providers":
      return (center.providers ?? []).map((p) => ({
        id: String(p.provider_id),
        title: String(p.provider_name ?? p.company_name),
        summary: `${p.country ?? ""} · ${p.published_packs ?? 0} packs`,
        badge: String(p.verification_level ?? p.provider_status),
      }));
    case "businessPacks":
      return (center.pack_publications ?? []).map((p) => ({
        id: String(p.pack_key),
        title: String(p.pack_title),
        summary: String(p.review_notes ?? ""),
        badge: String(p.publication_status),
      }));
    case "certifications":
      return (center.certifications ?? []).map((c) => ({
        id: `${c.provider_id}-${c.certification_type}`,
        title: String(c.certification_type),
        summary: String(c.summary ?? ""),
        badge: String(c.certification_status),
      }));
    case "marketplace":
    case "governance":
      return (center.marketplace_governance ?? []).map((g) => ({
        id: String(g.requirement_key),
        title: String(g.requirement_title),
        summary: String(g.summary ?? ""),
        badge: String(g.requirement_domain ?? g.requirement_status),
      }));
    case "reviews":
      return (center.reviews ?? []).map((r, idx) => ({
        id: String(r.pack_key ?? r.provider_id ?? idx),
        title: String(r.review_summary ?? r.provider_id),
        summary: r.pilot_customer ? `Pilot: ${r.pilot_customer}` : undefined,
        badge: String(r.review_rating ?? r.review_status),
      }));
    case "revenue":
      return [
        ...(center.provider_revenue ?? []).map((r, idx) => ({
          id: `rev-${idx}`,
          title: `${r.provider_id} — ${r.revenue_type}`,
          summary: `${r.amount} ${r.currency}`,
          badge: String(r.period_label),
        })),
        ...(center.revenue_sharing ?? []).map((s) => ({
          id: String(s.share_key),
          title: String(s.share_title),
          summary: String(s.summary ?? ""),
          badge: `Provider ${s.provider_share_pct}%`,
        })),
      ];
    default:
      return [];
  }
}
