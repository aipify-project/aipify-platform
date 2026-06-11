"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseEnterpriseDeploymentCard, type EnterpriseDeploymentCard } from "@/lib/aipify/enterprise";

type EnterpriseDeploymentCardProps = {
  labels: Record<string, string>;
};

export function EnterpriseDeploymentCard({ labels }: EnterpriseDeploymentCardProps) {
  const [card, setCard] = useState<EnterpriseDeploymentCard | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/enterprise/card");
    if (res.ok) setCard(parseEnterpriseDeploymentCard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading || !card?.has_customer) return null;

  return (
    <section className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-700">{labels.title}</p>
          <h2 className="mt-1 text-lg font-semibold capitalize text-gray-900">
            {card.deployment_mode?.replace(/_/g, " ") ?? labels.cloudSaas}
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            {labels.agentsOnline}: {card.agents_online ?? 0} · {labels.jobsQueued}: {card.jobs_queued ?? 0}
          </p>
          <p className="mt-1 text-xs text-indigo-600">{card.privacy_note}</p>
        </div>
        <Link href="/app/enterprise" className="text-sm font-medium text-indigo-700 hover:underline">
          {labels.open}
        </Link>
      </div>
    </section>
  );
}
