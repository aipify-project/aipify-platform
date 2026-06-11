"use client";

import { useCallback, useEffect, useState } from "react";
import {
  parseAiEthicsResponsibleUseEngineDashboard,
  type AiEthicsResponsibleUseEngineDashboard,
  type AiUseCaseRecord,
} from "@/lib/aipify/ai-ethics-responsible-use-engine";

type Props = { labels: Record<string, string> };

function badgeClass(value?: string) {
  switch (value) {
    case "approved":
    case "low":
      return "bg-emerald-100 text-emerald-800";
    case "proposed":
    case "medium":
      return "bg-amber-100 text-amber-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "critical":
    case "restricted":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function AiEthicsResponsibleUseEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<AiEthicsResponsibleUseEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/ai-ethics-responsible-use-engine/dashboard");
    if (res.ok) setDashboard(parseAiEthicsResponsibleUseEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const useCaseAction = async (useCaseId: string, action: "approve" | "restrict") => {
    setBusyId(useCaseId);
    setActionError(null);
    const res = await fetch(`/api/aipify/ai-ethics-responsible-use-engine/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ use_case_id: useCaseId }),
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

      {dashboard.explainability_requirements && (
        <JsonSection title={labels.explainabilityRequirements} data={dashboard.explainability_requirements} />
      )}

      {dashboard.prohibited_examples && dashboard.prohibited_examples.length > 0 && (
        <JsonSection title={labels.prohibitedExamples} data={dashboard.prohibited_examples} />
      )}

      {dashboard.approved_use_cases && dashboard.approved_use_cases.length > 0 && (
        <UseCaseSection title={labels.approvedUseCases} useCases={dashboard.approved_use_cases} labels={labels}
          onRestrict={(id) => void useCaseAction(id, "restrict")} busyId={busyId} showRestrict />
      )}

      {dashboard.proposed_use_cases && dashboard.proposed_use_cases.length > 0 && (
        <UseCaseSection title={labels.proposedUseCases} useCases={dashboard.proposed_use_cases} labels={labels}
          onApprove={(id) => void useCaseAction(id, "approve")} busyId={busyId} showApprove />
      )}

      {dashboard.restricted_use_cases && dashboard.restricted_use_cases.length > 0 && (
        <UseCaseSection title={labels.restrictedUseCases} useCases={dashboard.restricted_use_cases} labels={labels}
          onApprove={(id) => void useCaseAction(id, "approve")} busyId={busyId} showApprove />
      )}

      {dashboard.review_schedules && dashboard.review_schedules.length > 0 && (
        <JsonSection title={labels.reviewSchedules} data={dashboard.review_schedules} />
      )}

      {dashboard.oversight_trends && (
        <JsonSection title={labels.oversightTrends} data={dashboard.oversight_trends} />
      )}

      {dashboard.integration_notes && (
        <JsonSection title={labels.integrationNotes} data={dashboard.integration_notes} />
      )}
    </div>
  );
}

function UseCaseSection({
  title, useCases, labels, onApprove, onRestrict, busyId, showApprove, showRestrict,
}: {
  title: string;
  useCases: AiUseCaseRecord[];
  labels: Record<string, string>;
  onApprove?: (id: string) => void;
  onRestrict?: (id: string) => void;
  busyId: string | null;
  showApprove?: boolean;
  showRestrict?: boolean;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <div className="mt-3 space-y-3">
        {useCases.map((uc) => (
          <div key={uc.id} className="rounded-lg border border-gray-200 p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium text-gray-800">{uc.use_case_name}</span>
              <div className="flex gap-1">
                <span className={`rounded-full px-2 py-0.5 text-xs uppercase ${badgeClass(uc.risk_level)}`}>
                  {uc.risk_level}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${badgeClass(uc.status)}`}>
                  {uc.status}
                </span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500 capitalize">{uc.category?.replace(/_/g, " ")}</p>
            {uc.risk_level === "critical" ? (
              <p className="mt-1 text-xs text-rose-700">{labels.criticalNote}</p>
            ) : (
              <div className="mt-2 flex gap-2">
                {showApprove && uc.id && onApprove && (
                  <button type="button" disabled={busyId === uc.id}
                    onClick={() => onApprove(uc.id!)}
                    className="rounded border border-emerald-200 px-2 py-1 text-xs text-emerald-800 disabled:opacity-50">
                    {labels.approve}
                  </button>
                )}
                {showRestrict && uc.id && onRestrict && (
                  <button type="button" disabled={busyId === uc.id}
                    onClick={() => onRestrict(uc.id!)}
                    className="rounded border border-rose-200 px-2 py-1 text-xs text-rose-800 disabled:opacity-50">
                    {labels.restrict}
                  </button>
                )}
              </div>
            )}
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
