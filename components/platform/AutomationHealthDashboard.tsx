import type { AutomationHealthSummary } from "@/lib/platform/executive-intelligence";
import type { PlatformAutomation } from "@/lib/platform/types";

type AutomationHealthDashboardProps = {
  summary: AutomationHealthSummary;
  labels: {
    title: string;
    total: string;
    successRate: string;
    avgExecution: string;
    warnings: string;
    failures: string;
    upcoming: string;
    needsAttention: string;
    statusLabels: Record<string, string>;
  };
};

export default function AutomationHealthDashboard({
  summary,
  labels,
}: AutomationHealthDashboardProps) {
  const metrics = [
    { label: labels.total, value: String(summary.total) },
    { label: labels.successRate, value: `${summary.successRate}%` },
    { label: labels.avgExecution, value: `${summary.avgExecutionMs} ms` },
    { label: labels.warnings, value: String(summary.warnings) },
    { label: labels.failures, value: String(summary.failures) },
    { label: labels.upcoming, value: String(summary.upcoming) },
  ];

  return (
    <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/40 via-white to-indigo-50/20 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl bg-white/90 px-4 py-3 ring-1 ring-violet-100"
          >
            <p className="text-sm text-gray-500">{metric.label}</p>
            <p className="mt-1 text-xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>
      {summary.needsAttention.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-semibold text-amber-700">{labels.needsAttention}</p>
          <ul className="mt-2 space-y-1">
            {summary.needsAttention.map((automation: PlatformAutomation) => (
              <li key={automation.id} className="text-sm text-gray-700">
                {automation.name} —{" "}
                {labels.statusLabels[automation.status] ?? automation.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
