"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCommunityIntelligenceAdmin,
  type CommunityIntelligenceAdmin,
  type CommunityContribution,
} from "@/lib/aipify/community-intelligence";

type CommunityAdminPanelProps = {
  labels: Record<string, string>;
};

function QueueItem({
  item,
  labels,
  acting,
  onReview,
}: {
  item: CommunityContribution;
  labels: Record<string, string>;
  acting: string | null;
  onReview: (id: string, decision: string) => void;
}) {
  const isPending = item.status === "review" || item.status === "governance_check";

  return (
    <li className="rounded-lg border border-gray-200 bg-white p-4 text-sm shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium text-gray-900">{item.title}</p>
          <p className="mt-1 text-xs capitalize text-gray-500">
            {item.type_label ?? item.contribution_type?.replace(/_/g, " ")} · {item.status?.replace(/_/g, " ")}
            {item.governance_flag ? ` · ${labels.governanceFlag}` : ""}
          </p>
        </div>
        {item.source_module ? (
          <span className="text-xs text-gray-400">{item.source_module}</span>
        ) : null}
      </div>
      {isPending ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={acting === item.id}
            onClick={() => onReview(item.id, "publish")}
            className="rounded-md bg-violet-600 px-3 py-1 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {labels.publish}
          </button>
          <button
            type="button"
            disabled={acting === item.id}
            onClick={() => onReview(item.id, "escalate_governance")}
            className="rounded-md border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {labels.escalateGovernance}
          </button>
          <button
            type="button"
            disabled={acting === item.id}
            onClick={() => onReview(item.id, "reject")}
            className="rounded-md border border-red-200 px-3 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            {labels.reject}
          </button>
        </div>
      ) : null}
    </li>
  );
}

export function CommunityAdminPanel({ labels }: CommunityAdminPanelProps) {
  const [admin, setAdmin] = useState<CommunityIntelligenceAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/aipify/community-intelligence/admin");
    if (res.ok) {
      setAdmin(parseCommunityIntelligenceAdmin(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? labels.adminAccessRequired);
    }
    setLoading(false);
  }, [labels.adminAccessRequired]);

  useEffect(() => {
    void load();
  }, [load]);

  const reviewContribution = async (id: string, decision: string) => {
    setActing(id);
    await fetch(`/api/aipify/community-intelligence/contributions/${id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    setActing(null);
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/app/community" className="text-sm text-violet-600 hover:underline">
          {labels.backToHub}
        </Link>
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }
  if (!admin?.has_customer) return null;

  return (
    <div className="space-y-6">
      <Link href="/app/community" className="text-sm text-violet-600 hover:underline">
        {labels.backToHub}
      </Link>

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <h2 className="text-xs font-semibold uppercase text-violet-700">{labels.healthScore}</h2>
            <p className="mt-1 text-2xl font-bold text-violet-900">{admin.health_score ?? 0}/100</p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase text-violet-700">{labels.contributionScore}</h2>
            <p className="mt-1 text-2xl font-bold text-violet-900">{admin.contribution_score ?? 0}/100</p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase text-violet-700">{labels.pendingReviews}</h2>
            <p className="mt-1 text-2xl font-bold text-violet-900">{admin.pending_count ?? 0}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.pendingReviews}</h2>
        {admin.pending_reviews.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noPending}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {admin.pending_reviews.map((item) => (
              <QueueItem
                key={item.id}
                item={item}
                labels={labels}
                acting={acting}
                onReview={reviewContribution}
              />
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.contributionQueue}</h2>
        {admin.contribution_queue.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noQueue}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {admin.contribution_queue.map((item) => (
              <QueueItem
                key={item.id}
                item={item}
                labels={labels}
                acting={acting}
                onReview={reviewContribution}
              />
            ))}
          </ul>
        )}
      </section>

      {admin.governance_flags.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.governanceFlags}</h2>
          <ul className="mt-3 space-y-2">
            {admin.governance_flags.map((item) => (
              <li key={item.id} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                {item.title}
                <span className="ml-2 text-xs capitalize text-amber-700">{item.status?.replace(/_/g, " ")}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {admin.intelligence_trends.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.intelligenceTrends}</h2>
          <ul className="mt-3 space-y-1 text-sm text-gray-600">
            {admin.intelligence_trends.slice(0, 5).map((t, i) => (
              <li key={i}>
                Health {t.health_score} · Contribution {t.contribution_score}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
