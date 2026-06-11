"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseMarketplacePartnerEcosystemFoundationEngineDashboard,
  type MarketplacePartnerEcosystemFoundationEngineDashboard,
  type PartnerRecord,
} from "@/lib/aipify/marketplace-partner-ecosystem-foundation-engine";

type Props = { labels: Record<string, string> };

function badgeClass(value?: string) {
  switch (value) {
    case "approved":
    case "certified":
    case "excellent":
      return "bg-emerald-100 text-emerald-800";
    case "pending":
    case "registered":
      return "bg-amber-100 text-amber-800";
    case "suspended":
      return "bg-rose-100 text-rose-800";
    case "strategic":
    case "advanced":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function MarketplacePartnerEcosystemFoundationEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<MarketplacePartnerEcosystemFoundationEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/marketplace-partner-ecosystem-foundation-engine/dashboard");
    if (res.ok) setDashboard(parseMarketplacePartnerEcosystemFoundationEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const partnerAction = async (partnerId: string, action: "approve" | "suspend" | "recertify") => {
    setBusyId(partnerId);
    setActionError(null);
    const res = await fetch(`/api/aipify/marketplace-partner-ecosystem-foundation-engine/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partner_id: partnerId }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setBusyId(null);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">{labels.summary}</p>
        <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(summary, null, 2)}</pre>
      </div>

      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => <li key={pr}>{pr}</li>)}
          </ul>
        </section>
      )}

      {dashboard.approved_partners && dashboard.approved_partners.length > 0 && (
        <PartnerSection title={labels.approvedPartners} partners={dashboard.approved_partners} labels={labels}
          onSuspend={(id) => void partnerAction(id, "suspend")} onRecertify={(id) => void partnerAction(id, "recertify")}
          busyId={busyId} showSuspend showRecertify />
      )}

      {dashboard.pending_partners && dashboard.pending_partners.length > 0 && (
        <PartnerSection title={labels.pendingPartners} partners={dashboard.pending_partners} labels={labels}
          onApprove={(id) => void partnerAction(id, "approve")} busyId={busyId} showApprove />
      )}

      {dashboard.offerings && dashboard.offerings.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.offerings}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.offerings.map((item, idx) => {
              const offering = item.offering as Record<string, unknown> | undefined;
              return (
                <div key={String(offering?.id ?? idx)} className="rounded-lg border border-gray-200 p-3 text-sm">
                  <p className="font-medium text-gray-800">{String(offering?.title ?? "")}</p>
                  <p className="mt-1 text-gray-600">{String(offering?.description ?? "")}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className={`rounded-full px-2 py-0.5 uppercase ${badgeClass(String(offering?.offering_type))}`}>
                      {String(offering?.offering_type ?? "")}
                    </span>
                    <span className="text-gray-500">{item.partner_name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {dashboard.certification_breakdown && (
        <JsonSection title={labels.certificationStatus} data={dashboard.certification_breakdown} />
      )}

      {dashboard.quality_indicators && (
        <JsonSection title={labels.qualityIndicators} data={dashboard.quality_indicators} />
      )}

      {dashboard.integration_notes && (
        <JsonSection title={labels.integrationNotes} data={dashboard.integration_notes} />
      )}
    </div>
  );
}

function PartnerSection({
  title, partners, labels, onApprove, onSuspend, onRecertify, busyId, showApprove, showSuspend, showRecertify,
}: {
  title: string;
  partners: PartnerRecord[];
  labels: Record<string, string>;
  onApprove?: (id: string) => void;
  onSuspend?: (id: string) => void;
  onRecertify?: (id: string) => void;
  busyId: string | null;
  showApprove?: boolean;
  showSuspend?: boolean;
  showRecertify?: boolean;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <div className="mt-3 space-y-3">
        {partners.map((partner) => (
          <div key={partner.id} className="rounded-lg border border-gray-200 p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium text-gray-800">{partner.partner_name}</span>
              <div className="flex gap-1">
                <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(partner.status)}`}>
                  {partner.status}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(partner.certification_level)}`}>
                  {partner.certification_level}
                </span>
              </div>
            </div>
            {partner.website ? <p className="mt-1 text-xs text-gray-500">{partner.website}</p> : null}
            <div className="mt-2 flex gap-2">
              {showApprove && partner.id && onApprove && (
                <button type="button" disabled={busyId === partner.id}
                  onClick={() => onApprove(partner.id!)}
                  className="rounded border border-emerald-200 px-2 py-1 text-xs text-emerald-800 disabled:opacity-50">
                  {labels.approve}
                </button>
              )}
              {showSuspend && partner.id && onSuspend && (
                <button type="button" disabled={busyId === partner.id}
                  onClick={() => onSuspend(partner.id!)}
                  className="rounded border border-rose-200 px-2 py-1 text-xs text-rose-800 disabled:opacity-50">
                  {labels.suspend}
                </button>
              )}
              {showRecertify && partner.id && onRecertify && (
                <button type="button" disabled={busyId === partner.id}
                  onClick={() => onRecertify(partner.id!)}
                  className="rounded border border-indigo-200 px-2 py-1 text-xs text-indigo-800 disabled:opacity-50">
                  {labels.recertify}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function JsonSection({ title, data }: { title: string; data: unknown }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}
