"use client";

import type { ExecutionCoordinationLabels, ExecutionDashboardWidget } from "@/lib/action-center-execution";

type Props = {
  widgets: ExecutionDashboardWidget[];
  labels: ExecutionCoordinationLabels;
  onSelectAction: (id: string) => void;
};

export function ActionExecutionDashboardWidgets({ widgets, labels, onSelectAction }: Props) {
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
                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2"
                  >
                    <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
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
