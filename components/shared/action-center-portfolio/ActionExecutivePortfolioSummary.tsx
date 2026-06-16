"use client";

import type {
  ExecutivePriorityView,
  PortfolioHealthSummary,
  PortfolioRiskAnalysis,
  StrategicInitiativePortfolioLabels,
} from "@/lib/action-center-portfolio";

type Props = {
  healthSummary?: PortfolioHealthSummary;
  executivePriority?: ExecutivePriorityView;
  riskAnalysis?: PortfolioRiskAnalysis;
  labels: StrategicInitiativePortfolioLabels;
  onSelectInitiative: (id: string) => void;
};

function InitiativeMiniList({
  title,
  items,
  labels,
  onSelect,
}: {
  title: string;
  items: Array<{ id: string; title: string }>;
  labels: StrategicInitiativePortfolioLabels;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-violet-100 bg-white/70 p-4">
      <h4 className="text-sm font-semibold text-violet-950">{title}</h4>
      {items.length === 0 ? (
        <p className="mt-2 text-xs text-gray-500">{labels.widgets.empty}</p>
      ) : (
        <ul className="mt-2 space-y-1">
          {items.slice(0, 5).map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className="text-left text-xs text-indigo-600 hover:underline"
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ActionExecutivePortfolioSummary({
  healthSummary,
  executivePriority,
  riskAnalysis,
  labels,
  onSelectInitiative,
}: Props) {
  return (
    <div className="space-y-4">
      {healthSummary ? (
        <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5">
          <h2 className="font-semibold text-violet-950">{labels.executive.healthSummary}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 text-sm">
            <div>
              <dt className="text-violet-800">{labels.healthSummary.onTrack}</dt>
              <dd className="text-2xl font-semibold tabular-nums">{healthSummary.on_track}</dd>
            </div>
            <div>
              <dt className="text-violet-800">{labels.healthSummary.atRisk}</dt>
              <dd className="text-2xl font-semibold">{healthSummary.at_risk}</dd>
            </div>
            <div>
              <dt className="text-violet-800">{labels.healthSummary.blocked}</dt>
              <dd className="text-2xl font-semibold">{healthSummary.blocked}</dd>
            </div>
            <div>
              <dt className="text-violet-800">{labels.healthSummary.overdue}</dt>
              <dd className="text-2xl font-semibold">{healthSummary.overdue}</dd>
            </div>
            <div>
              <dt className="text-violet-800">{labels.healthSummary.completed}</dt>
              <dd className="text-2xl font-semibold">{healthSummary.completed}</dd>
            </div>
          </dl>
        </section>
      ) : null}

      {riskAnalysis ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5">
          <h2 className="font-semibold text-amber-950">{labels.riskAnalysis.title}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 text-sm">
            <div>
              <dt className="text-amber-800">{labels.riskAnalysis.highRiskConcentration}</dt>
              <dd className="text-xl font-semibold">{riskAnalysis.high_risk_concentration}</dd>
            </div>
            <div>
              <dt className="text-amber-800">{labels.riskAnalysis.unresolvedBlockers}</dt>
              <dd className="text-xl font-semibold">{riskAnalysis.unresolved_blockers}</dd>
            </div>
            <div>
              <dt className="text-amber-800">{labels.riskAnalysis.missingOwners}</dt>
              <dd className="text-xl font-semibold">{riskAnalysis.missing_owners}</dd>
            </div>
            <div>
              <dt className="text-amber-800">{labels.riskAnalysis.unclearOutcomes}</dt>
              <dd className="text-xl font-semibold">{riskAnalysis.unclear_outcomes}</dd>
            </div>
            <div>
              <dt className="text-amber-800">{labels.riskAnalysis.lowConfidence}</dt>
              <dd className="text-xl font-semibold">{riskAnalysis.low_confidence}</dd>
            </div>
          </dl>
        </section>
      ) : null}

      {executivePriority ? (
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-5">
          <h2 className="font-semibold text-indigo-950">{labels.sections.executive}</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
            <InitiativeMiniList
              title={labels.executive.topStrategic}
              items={executivePriority.top_strategic ?? []}
              labels={labels}
              onSelect={onSelectInitiative}
            />
            <InitiativeMiniList
              title={labels.executive.highestRisk}
              items={executivePriority.highest_risk ?? []}
              labels={labels}
              onSelect={onSelectInitiative}
            />
            <InitiativeMiniList
              title={labels.executive.highestValue}
              items={executivePriority.highest_value ?? []}
              labels={labels}
              onSelect={onSelectInitiative}
            />
            <InitiativeMiniList
              title={labels.executive.mostDelayed}
              items={executivePriority.most_delayed ?? []}
              labels={labels}
              onSelect={onSelectInitiative}
            />
            <InitiativeMiniList
              title={labels.executive.executiveDecisions}
              items={executivePriority.executive_decisions ?? []}
              labels={labels}
              onSelect={onSelectInitiative}
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}
