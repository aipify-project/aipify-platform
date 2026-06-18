"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { formatExecutiveMetric, formatOverviewMetric } from "@/lib/ui/overview-metrics";
import {
  parseLegalComplianceCaseOperationsCenter,
  type LegalComplianceCaseOperationsCenter,
} from "@/lib/aipify/legal-compliance-case-operations-pack";

type Props = { labels: Record<string, string> };

export function LegalComplianceCaseOperationsPackDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<LegalComplianceCaseOperationsCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [caseTitle, setCaseTitle] = useState("");
  const [caseType, setCaseType] = useState("contract_review");
  const [priority, setPriority] = useState("normal");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/legal-compliance-case-operations-pack/dashboard");
    if (res.ok) {
      setCenter(parseLegalComplianceCaseOperationsCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const createCase = async () => {
    if (!caseTitle.trim()) return;
    setCreating(true);
    setActionError(null);
    const res = await fetch("/api/aipify/legal-compliance-case-operations-pack/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create_case",
        case_title: caseTitle.trim(),
        case_type: caseType,
        priority,
        case_status: "open",
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.createFailed);
    } else {
      setCaseTitle("");
      await load();
    }
    setCreating(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found || !center.has_access) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-medium">{labels.accessRequiredTitle}</p>
        <p className="mt-2 text-sm">{center?.error ?? labels.accessRequiredBody}</p>
      </div>
    );
  }

  const overview = center.overview ?? {};
  const ops = center.operations ?? {};

  return (
    <div className="space-y-6">
      {center.disclaimer ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          {center.disclaimer}
        </div>
      ) : null}

      {center.governance_note ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          {center.governance_note}
        </div>
      ) : null}

      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricCases, formatOverviewMetric(overview.active_cases)],
            [labels.metricClients, formatOverviewMetric(overview.clients)],
            [labels.metricContracts, formatOverviewMetric(overview.contracts)],
            [labels.metricReviews, formatOverviewMetric(overview.compliance_reviews)],
            [labels.metricDeadlines, formatOverviewMetric(overview.upcoming_deadlines)],
            [labels.metricDocActivity, formatOverviewMetric(overview.document_activity)],
            [labels.metricCompliance, formatExecutiveMetric(overview.compliance_status)],
            [labels.metricHealth, formatOverviewMetric(overview.legal_health_score)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.operationsTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            [labels.openCases, ops.cases_route],
            [labels.openClients, ops.clients_route],
            [labels.openContracts, ops.contracts_route],
            [labels.openCompliance, ops.compliance_route],
            [labels.openDocuments, ops.documents_route],
            [labels.openGovernance, ops.governance_route],
            [labels.openExecutive, center.executive_dashboard?.executive_route as string],
          ].map(([label, href]) =>
            href ? (
              <Link
                key={String(label)}
                href={href}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400"
              >
                {label}
              </Link>
            ) : null
          )}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.casesTitle}</h2>
        {(center.cases ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noCases}</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(center.cases ?? []).map((c) => (
              <li key={c.id} className="flex justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <span>
                  <span className="font-medium text-gray-900">{c.case_title}</span>
                  <span className="ml-2 text-gray-500">{c.case_number}</span>
                </span>
                <span className="text-gray-600">{c.case_status}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder={labels.caseTitlePlaceholder}
            value={caseTitle}
            onChange={(e) => setCaseTitle(e.target.value)}
          />
          <select
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={caseType}
            onChange={(e) => setCaseType(e.target.value)}
          >
            <option value="contract_review">{labels.typeContractReview}</option>
            <option value="corporate_law">{labels.typeCorporate}</option>
            <option value="compliance">{labels.typeCompliance}</option>
            <option value="litigation_support">{labels.typeLitigation}</option>
          </select>
          <select
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">{labels.priorityLow}</option>
            <option value="normal">{labels.priorityNormal}</option>
            <option value="high">{labels.priorityHigh}</option>
            <option value="critical">{labels.priorityCritical}</option>
          </select>
          <button
            type="button"
            disabled={creating}
            onClick={() => void createCase()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {creating ? labels.creating : labels.addCase}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.contractsTitle}</h2>
        {(center.contracts ?? []).length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noContracts}</p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {(center.contracts ?? []).slice(0, 10).map((ct) => (
              <li key={ct.id} className="flex justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span>{ct.contract_name}</span>
                <span>{ct.contract_status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
        <div className="mt-4 space-y-4">
          {(center.advisor_signals ?? []).map((sig) => (
            <article key={sig.id} className="rounded-lg bg-gray-50 p-4">
              <p className="font-medium text-gray-900">{sig.observation}</p>
              {sig.recommendation ? (
                <p className="mt-2 text-sm font-medium text-gray-800">
                  {labels.recommendation}: {sig.recommendation}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <p className="text-sm text-gray-500">
        {center.privacy_note}{" "}
        <Link href={center.industry_packs_route ?? "/app/industry-packs"} className="underline">
          {labels.industryPacksLink}
        </Link>
      </p>
    </div>
  );
}
