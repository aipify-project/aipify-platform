"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseOwnerDetail, type OwnerDetailResponse, type ResponsibilitiesLabels } from "@/lib/app-portal/responsibilities";

type Props = { userId: string; labels: ResponsibilitiesLabels };

export function OwnerDetailPanel({ userId, labels }: Props) {
  const [data, setData] = useState<OwnerDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/responsibilities/owners/${userId}`);
    if (res.ok) setData(parseOwnerDetail(await res.json()));
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[30vh] flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
        <p className="mt-4 text-sm text-slate-600">{labels.loading}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">{labels.notFound}</p>
        <Link href="/app/organization/responsibilities" className="text-sm text-indigo-700 hover:underline">← {labels.back}</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/app/organization/responsibilities" className="text-sm font-medium text-indigo-700 hover:underline">← {labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{labels.owner.title}: {data.user_name}</h1>
        <p className="mt-1 text-sm text-slate-600">{labels.owner.workload}: {labels.workload[data.workload_indicator]} ({data.workload_total})</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label={labels.owner.owned} value={data.owned_responsibilities.length} />
        <Metric label={labels.owner.backup} value={data.backup_responsibilities.length} />
        <Metric label={labels.owner.approvals} value={data.pending_approvals} />
        <Metric label={labels.owner.support} value={data.open_support_requests} />
      </section>

      <ListSection title={labels.owner.owned} items={data.owned_responsibilities.map((r) => ({ id: r.id, label: r.title, href: `/app/organization/responsibilities/${r.id}` }))} />
      <ListSection title={labels.owner.backup} items={data.backup_responsibilities.map((r) => ({ id: r.id, label: r.title, href: `/app/organization/responsibilities/${r.id}` }))} />
      <ListSection title={labels.owner.followUps} items={data.assigned_follow_ups.map((f) => ({ id: f.id, label: f.title, href: `/app/operations/follow-ups/${f.id}` }))} />
      <ListSection title={labels.owner.goals} items={data.assigned_goals.map((g) => ({ id: g.id, label: g.title, href: `/app/operations/goals/${g.id}` }))} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function ListSection({ title, items }: { title: string; items: Array<{ id: string; label: string; href: string }> }) {
  if (items.length === 0) return null;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <ul className="mt-3 space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.id}><Link href={item.href} className="text-indigo-700 hover:underline">{item.label}</Link></li>
        ))}
      </ul>
    </section>
  );
}
