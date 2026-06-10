import type { SupportAiPerformance } from "@/lib/platform/executive-intelligence";

type SupportAiPerformancePanelProps = {
  performance: SupportAiPerformance;
  labels: {
    title: string;
    subtitle: string;
    requestsToday: string;
    resolvedByAi: string;
    escalatedCases: string;
    avgResponseTime: string;
    satisfactionScore: string;
    escalationReasons: string;
    seconds: string;
    percent: string;
    noReasons: string;
  };
};

export default function SupportAiPerformancePanel({
  performance,
  labels,
}: SupportAiPerformancePanelProps) {
  const metrics = [
    { label: labels.requestsToday, value: String(performance.requestsToday) },
    { label: labels.resolvedByAi, value: String(performance.resolvedByAi) },
    { label: labels.escalatedCases, value: String(performance.escalatedCases) },
    {
      label: labels.avgResponseTime,
      value: `${performance.avgResponseTimeSeconds} ${labels.seconds}`,
    },
    {
      label: labels.satisfactionScore,
      value: `${performance.satisfactionScore}${labels.percent}`,
    },
  ];

  return (
    <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/50 via-white to-indigo-50/30 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
      <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl bg-white/90 px-4 py-3 ring-1 ring-violet-100"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {metric.label}
            </p>
            <p className="mt-2 text-xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <p className="text-sm font-semibold text-gray-700">{labels.escalationReasons}</p>
        {performance.escalationReasons.length === 0 ? (
          <p className="mt-1 text-sm text-gray-500">{labels.noReasons}</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {performance.escalationReasons.map((reason) => (
              <li key={reason} className="text-sm text-gray-600">
                • {reason}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
