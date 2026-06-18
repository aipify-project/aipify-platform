"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parsePartnerSuccessEngineDashboard,
  type PartnerRecord,
  type PartnerSuccessEngineDashboard,
} from "@/lib/aipify/partner-success-engine";

type Props = { labels: Record<string, string> };

export function PartnerSuccessEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<PartnerSuccessEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [partnerType, setPartnerType] = useState("implementation_partner");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/partner-success-engine/dashboard");
    if (res.ok) {
      setDashboard(parsePartnerSuccessEngineDashboard(await res.json()));
    }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const createPartner = async () => {
    if (!partnerName.trim()) return;
    setCreating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/partner-success-engine/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partner_name: partnerName.trim(),
        partner_type: partnerType,
        status: "prospect",
        primary_contact: { metadata_only: true },
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.createFailed);
    } else {
      setPartnerName("");
      await load();
    }
    setCreating(false);
  };

  const exportManifest = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/partner-success-engine/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.exportFailed);
    }
    setExporting(false);
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const sections = dashboard.sections ?? {};
  const partners = dashboard.partners ?? [];
  const opportunities = sections.opportunities ?? [];
  const risks = sections.risks ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/customer-success-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.customerSuccess}
        </Link>
        <Link href="/app/enterprise-deployment-device-rollout-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.enterpriseDeployment}
        </Link>
        <Link href="/app/change-management-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.changeManagement}
        </Link>
      </div>

      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        <p className="mt-2 text-xs text-teal-700">{labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded border border-teal-300 px-3 py-1 text-xs text-teal-800 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportManifest()}
        >
          {exporting ? labels.exporting : labels.exportManifest}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.customerHealth}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.customer_health_score ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.activePartners}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.active_partners ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.avgAdoption}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.avg_adoption_score ?? 0)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">{labels.highRenewalRisk}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.high_renewal_risk ?? 0)}</p>
        </div>
      </div>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.createPartner}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            className="rounded border border-gray-300 px-2 py-1 text-sm"
            placeholder={labels.partnerNamePlaceholder}
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
          />
          <select
            className="rounded border border-gray-300 px-2 py-1 text-sm"
            value={partnerType}
            onChange={(e) => setPartnerType(e.target.value)}
          >
            <option value="implementation_partner">{labels.typeImplementation}</option>
            <option value="consultant">{labels.typeConsultant}</option>
            <option value="reseller">{labels.typeReseller}</option>
            <option value="msp">{labels.typeMsp}</option>
            <option value="onboarding_specialist">{labels.typeOnboarding}</option>
            <option value="enterprise_advisor">{labels.typeAdvisor}</option>
          </select>
          <button
            type="button"
            className="rounded border border-teal-300 px-3 py-1 text-xs text-teal-800 disabled:opacity-50"
            disabled={creating || !partnerName.trim()}
            onClick={() => void createPartner()}
          >
            {creating ? labels.creating : labels.createPartnerButton}
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.partners}</h3>
        {partners.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noPartners}</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {partners.map((partner: PartnerRecord) => (
              <li key={String(partner.id)} className="rounded border border-gray-100 px-3 py-2">
                <span className="font-medium">{partner.partner_name}</span>
                <span className="ml-2 text-xs text-gray-500">
                  {partner.partner_type} · {partner.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.opportunities}</h3>
        {opportunities.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noOpportunities}</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {opportunities.map((item, idx) => (
              <li key={String(item.partner_name ?? idx)} className="rounded border border-teal-100 bg-teal-50/30 p-3">
                <div className="font-medium">{String(item.partner_name ?? "")}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {String(item.opportunity ?? "")} · {labels.adoption}: {String(item.adoption_score ?? 0)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.risks}</h3>
        {risks.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noRisks}</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {risks.map((item, idx) => (
              <li key={String(item.partner_name ?? idx)} className="rounded border border-amber-100 bg-amber-50/30 p-3">
                <div className="font-medium">{String(item.partner_name ?? "")}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {labels.renewalReadiness}: {String(item.renewal_readiness ?? "")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {dashboard.principles && dashboard.principles.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {dashboard.principles.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </section>
      )}

      {dashboard.integration_summaries && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationSummaries}</h3>
          <pre className="mt-2 overflow-x-auto text-xs text-gray-600">
            {JSON.stringify(dashboard.integration_summaries, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
