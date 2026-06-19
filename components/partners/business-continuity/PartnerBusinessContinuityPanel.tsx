"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import type { AipifyStatusKind } from "@/lib/design/status-system";
import {
  partnerBc607SectionToRpc,
  type PartnerBc607Section,
} from "@/lib/business-continuity-engine/config";
import {
  parsePartnerBusinessContinuityCenter,
  type PartnerBusinessContinuityCenter,
} from "@/lib/business-continuity-engine/parse";
import type { buildPartnerBusinessContinuityLabels } from "@/lib/business-continuity-engine/labels";

type Labels = ReturnType<typeof buildPartnerBusinessContinuityLabels>;

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function statusKeyToKind(statusKey?: string): AipifyStatusKind {
  if (statusKey === "verified" || statusKey === "operational") return "verified";
  return "information";
}

export function PartnerBusinessContinuityPanel({
  labels,
  activeSection,
}: {
  labels: Labels;
  activeSection: PartnerBc607Section;
}) {
  const [center, setCenter] = useState<PartnerBusinessContinuityCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const section = partnerBc607SectionToRpc(activeSection);
    const res = await fetch(`/api/partners/business-continuity/center?section=${section}`);
    if (res.ok) setCenter(parsePartnerBusinessContinuityCenter(await res.json()));
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

  const showPortfolio = activeSection === "overview" || activeSection === "portfolio";
  const showCommission = activeSection === "overview" || activeSection === "commission";
  const showCommunications = activeSection === "overview" || activeSection === "communications";
  const showReports = activeSection === "overview" || activeSection === "reports";

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

      {center.customer_ownership_note ? (
        <p className="rounded-2xl border border-amber-100 bg-amber-50/70 px-5 py-4 text-sm text-amber-950">
          {center.customer_ownership_note}
        </p>
      ) : null}

      {center.principle ? (
        <p className="rounded-2xl border border-violet-100 bg-violet-50/70 px-5 py-4 text-sm text-violet-950">
          {center.principle}
        </p>
      ) : null}

      {center.continuity_status?.status_label ? (
        <AipifyStatusBadge
          kind={statusKeyToKind(center.continuity_status.status_key)}
          label={center.continuity_status.status_label}
        />
      ) : null}

      {activeSection === "overview" && (
        <>
          <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-600">
              {labels.executiveDashboard}
            </h3>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label={labels.executive.readinessScore} value={exec.readiness_score ?? "—"} />
              <StatCard label={labels.executive.portfolioCustomers} value={exec.portfolio_customers ?? "—"} />
              <StatCard label={labels.executive.commissionProtected} value={exec.commission_protected ?? "—"} />
              <StatCard label={labels.executive.referralsPreserved} value={exec.referrals_preserved ?? "—"} />
            </dl>
          </section>

          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label={labels.stats.portfolioSegments} value={stats.portfolio_segments ?? 0} />
            <StatCard label={labels.stats.commissionProtections} value={stats.commission_protections ?? 0} />
            <StatCard label={labels.stats.referralContinuity} value={stats.referral_continuity ?? 0} />
            <StatCard label={labels.stats.communications} value={stats.communications ?? 0} />
          </dl>

          {center.companion_recommendations?.length ? (
            <section className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.companionRecommendations}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {center.companion_recommendations.map((rec, idx) => (
                  <div key={idx} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                    <p className="font-semibold text-zinc-900">{String(rec.title ?? "")}</p>
                    <p className="mt-2 text-sm text-zinc-600">{String(rec.reason ?? "")}</p>
                    {rec.href ? (
                      <Link href={String(rec.href)} className="mt-3 inline-block text-sm font-medium text-violet-700 hover:underline">
                        View →
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}

      {showPortfolio && center.portfolio_continuity?.length ? (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.groups.portfolioContinuity}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {center.portfolio_continuity.map((item, idx) => (
              <div key={idx} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="font-semibold text-zinc-900">{String(item.portfolio_title ?? "")}</p>
                <p className="mt-1 text-xs text-zinc-500">{String(item.customer_count ?? 0)} customers</p>
                {typeof item.summary === "string" ? <p className="mt-2 text-sm text-zinc-600">{item.summary}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {showCommission && (
        <>
          {center.commission_protection?.length ? (
            <section className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.groups.commissionProtection}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {center.commission_protection.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                    <p className="font-semibold text-zinc-900">{String(item.protection_title ?? "")}</p>
                    {typeof item.summary === "string" ? (
                      <p className="mt-2 text-sm text-zinc-600">{item.summary}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          {center.referral_continuity?.length ? (
            <section className="space-y-3">
              <h3 className="font-semibold text-zinc-900">{labels.groups.referralContinuity}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {center.referral_continuity.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                    <p className="font-semibold text-zinc-900">{String(item.referral_title ?? "")}</p>
                    {typeof item.summary === "string" ? (
                      <p className="mt-2 text-sm text-zinc-600">{item.summary}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}

      {showCommunications && center.communications?.length ? (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.groups.communications}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {center.communications.map((item, idx) => (
              <div key={idx} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="font-semibold text-zinc-900">{String(item.communication_title ?? "")}</p>
                {typeof item.summary === "string" ? <p className="mt-2 text-sm text-zinc-600">{item.summary}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {showReports && center.reports?.length ? (
        <section className="space-y-3">
          <h3 className="font-semibold text-zinc-900">{labels.groups.reports}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {center.reports.map((item, idx) => (
              <div key={idx} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="font-semibold text-zinc-900">{String(item.report_title ?? "")}</p>
                {typeof item.summary === "string" ? <p className="mt-2 text-sm text-zinc-600">{item.summary}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
