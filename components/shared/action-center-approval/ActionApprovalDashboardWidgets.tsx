"use client";

import type { ApprovalDashboardWidget, ApprovalDelegationLabels } from "@/lib/action-center-approval";

type ActionApprovalDashboardWidgetsProps = {
  widgets: ApprovalDashboardWidget[];
  labels: ApprovalDelegationLabels;
  onSelectAction: (id: string) => void;
  riskLabels: Record<string, string>;
};

const SLA_STYLES: Record<string, string> = {
  on_track: "bg-emerald-50 text-emerald-800",
  approaching_deadline: "bg-amber-50 text-amber-800",
  overdue: "bg-rose-50 text-rose-800",
  escalated: "bg-violet-50 text-violet-800",
};

export function ActionApprovalDashboardWidgets({
  widgets,
  labels,
  onSelectAction,
  riskLabels,
}: ActionApprovalDashboardWidgetsProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">{labels.sections.widgets}</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {widgets.map((widget) => (
          <article key={widget.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900">{labels.widgets[widget.titleKey]}</h3>
            {widget.items.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">{labels.widgets.empty}</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {widget.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium uppercase">
                          {riskLabels[item.risk_level] ?? item.risk_level}
                        </span>
                        {item.sla_status ? (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${SLA_STYLES[item.sla_status] ?? ""}`}
                          >
                            {labels.sla.statuses[item.sla_status]}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectAction(item.id)}
                      className="shrink-0 text-xs font-medium text-indigo-600 hover:underline"
                    >
                      {labels.widgets.viewAction}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
