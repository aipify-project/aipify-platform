"use client";

import type { PortfolioDashboardWidget, StrategicInitiativePortfolioLabels } from "@/lib/action-center-portfolio";

type Props = {
  widgets: PortfolioDashboardWidget[];
  labels: StrategicInitiativePortfolioLabels;
  onSelectInitiative: (id: string) => void;
};

const HEALTH_STYLE: Record<string, string> = {
  on_track: "bg-emerald-100 text-emerald-800",
  at_risk: "bg-amber-100 text-amber-800",
  blocked: "bg-rose-100 text-rose-800",
  overdue: "bg-orange-100 text-orange-800",
  completed: "bg-sky-100 text-sky-800",
};

export function ActionPortfolioDashboardWidgets({ widgets, labels, onSelectInitiative }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">{labels.sections.dashboard}</h2>
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
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.category ? (
                          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-800">
                            {labels.categories[item.category]}
                          </span>
                        ) : null}
                        {item.portfolio_health ? (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${HEALTH_STYLE[item.portfolio_health] ?? ""}`}
                          >
                            {labels.health[item.portfolio_health]}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectInitiative(item.id)}
                      className="shrink-0 text-xs font-medium text-indigo-600 hover:underline"
                    >
                      {labels.widgets.viewInitiative}
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
