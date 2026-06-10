import type { WeeklyExecutiveDigest } from "@/lib/platform/types";

type WeeklyExecutiveDigestCardProps = {
  digest: WeeklyExecutiveDigest;
  labels: {
    title: string;
    newCustomers: string;
    supportRequests: string;
    aiResolved: string;
    revenueGrowth: string;
    supportEscalations: string;
    trialsExpiring: string;
    recommendations: string;
  };
};

export default function WeeklyExecutiveDigestCard({
  digest,
  labels,
}: WeeklyExecutiveDigestCardProps) {
  const items = [
    { label: labels.newCustomers, value: String(digest.new_customers) },
    { label: labels.supportRequests, value: String(digest.support_requests) },
    { label: labels.aiResolved, value: String(Math.round(digest.ai_resolved)) },
    {
      label: labels.revenueGrowth,
      value: `${digest.revenue_growth_pct >= 0 ? "+" : ""}${digest.revenue_growth_pct}%`,
    },
    { label: labels.supportEscalations, value: String(digest.support_escalations ?? 0) },
    { label: labels.trialsExpiring, value: String(digest.trials_expiring) },
    { label: labels.recommendations, value: String(digest.recommendations) },
  ];

  return (
    <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/40 via-white to-indigo-50/20 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl bg-white/90 px-4 py-3 ring-1 ring-violet-100"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="mt-1 text-xl font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
