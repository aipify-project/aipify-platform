"use client";

import type { ActionImpactLabels, ImpactDashboardWidget } from "@/lib/action-center-impact";

type ActionImpactDashboardWidgetsProps = {
  widgets: ImpactDashboardWidget[];
  labels: ActionImpactLabels;
  onSelectAction: (id: string) => void;
};

const WIDGET_TITLE_KEYS: Record<string, keyof ActionImpactLabels["widgets"]> = {
  recommendedByImpact: "recommendedByImpact",
  highImpactOpportunities: "highImpactOpportunities",
  highRiskRecommendations: "highRiskRecommendations",
  recentlyValidatedOutcomes: "recentlyValidatedOutcomes",
  awaitingReview: "awaitingReview",
  executiveApproval: "executiveApproval",
};

export function ActionImpactDashboardWidgets({
  widgets,
  labels,
  onSelectAction,
}: ActionImpactDashboardWidgetsProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{labels.sections.widgets}</h2>
        <p className="mt-1 text-sm text-gray-600">{labels.centerSubtitle}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {widgets.map((widget) => {
          const titleKey = WIDGET_TITLE_KEYS[widget.id];
          const title = titleKey ? labels.widgets[titleKey] : widget.id;
          return (
            <article
              key={widget.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h3 className="font-semibold text-gray-900">{title}</h3>
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
                        {item.subtitle ? (
                          <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">{item.subtitle}</p>
                        ) : null}
                        {item.badge ? (
                          <span className="mt-1 inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-indigo-800">
                            {item.badge}
                          </span>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        {typeof item.score === "number" ? (
                          <span className="text-xs font-semibold tabular-nums text-indigo-700">
                            {item.score}
                          </span>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => onSelectAction(item.id)}
                          className="text-xs font-medium text-indigo-600 hover:underline"
                        >
                          {labels.widgets.viewAction}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
