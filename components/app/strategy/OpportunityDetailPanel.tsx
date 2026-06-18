"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseOpportunityDetail, type OpportunityDetail } from "@/lib/aipify/strategy";

type OpportunityDetailPanelProps = {
  opportunityId: string;
  labels: Record<string, string>;
};

export function OpportunityDetailPanel({ opportunityId, labels }: OpportunityDetailPanelProps) {
  const [detail, setDetail] = useState<OpportunityDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/strategy/opportunities/${opportunityId}`);
    if (res.ok) setDetail(parseOpportunityDetail(await res.json()));
    setLoading(false);
  }, [opportunityId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!detail) return <div className="text-sm text-gray-600">{labels.notFound}</div>;

  const opp = detail.opportunity;

  return (
    <div className="space-y-6">
      <Link href="/app/strategy" className="text-sm font-medium text-violet-800 hover:underline">
        {labels.back}
      </Link>

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-xl font-bold text-gray-900">{opp.title}</h2>
        <p className="mt-2 text-sm capitalize text-gray-600">
          {opp.category?.replace(/_/g, " ")} · {opp.horizon_label ?? opp.horizon}
        </p>
        <p className="mt-4 text-sm text-gray-800">{opp.description}</p>
        {opp.expected_value ? (
          <p className="mt-3 text-sm text-violet-900">
            {labels.expectedValue}: {opp.expected_value}
          </p>
        ) : null}
        <p className="mt-2 text-xs text-violet-800">{labels.humanLeadership}</p>
      </section>

      {detail.recommendations.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.recommendationsSection}</h3>
          <ul className="mt-3 space-y-3">
            {detail.recommendations.map((rec) => (
              <li key={rec.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
                <p className="font-medium">{rec.summary}</p>
                {rec.expected_benefits ? (
                  <p className="mt-1 text-xs text-gray-600">{rec.expected_benefits}</p>
                ) : null}
                {rec.potential_risks ? (
                  <p className="mt-1 text-xs text-amber-800">
                    {labels.potentialRisks}: {rec.potential_risks}
                  </p>
                ) : null}
                {Array.isArray(rec.next_steps) && rec.next_steps.length > 0 ? (
                  <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
                    {(rec.next_steps as string[]).map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
