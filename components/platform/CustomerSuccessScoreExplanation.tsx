"use client";

import {
  buildSuccessScoreFactors,
  detectExpansionOpportunities,
  type ExpansionOpportunity,
  type SuccessScoreFactor,
} from "@/lib/platform/intelligence-engine";
import type { CustomerIntelligenceFoundation } from "@/lib/platform/intelligence-foundation";
import type { CustomerMasterDetail } from "@/lib/platform/types";

type CustomerSuccessScoreExplanationProps = {
  detail: CustomerMasterDetail;
  intelligence: CustomerIntelligenceFoundation;
  score: number;
  labels: {
    title: string;
    basedOn: string;
    expansionTitle: string;
    eligible: string;
    notEligible: string;
    factorLabels: Record<string, string>;
    weightLabels: Record<string, string>;
    expansionLabels: Record<string, string>;
  };
};

export default function CustomerSuccessScoreExplanation({
  detail,
  intelligence,
  score,
  labels,
}: CustomerSuccessScoreExplanationProps) {
  const factors = buildSuccessScoreFactors(detail, intelligence, {
    supportVolume: labels.factorLabels.supportVolume,
    installationHealth: labels.factorLabels.installationHealth,
    automationAdoption: labels.factorLabels.automationAdoption,
    billingStability: labels.factorLabels.billingStability,
    onboardingCompletion: labels.factorLabels.onboardingCompletion,
    weightHigh: labels.weightLabels.high,
    weightMedium: labels.weightLabels.medium,
  });

  const expansions = detectExpansionOpportunities(detail, labels.expansionLabels);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {labels.title}
        </h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">
          {score}
          <span className="text-base font-normal text-gray-500"> / 100</span>
        </p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          {labels.basedOn}
        </p>
        <ul className="mt-3 space-y-2">
          {factors.map((factor) => (
            <FactorRow key={factor.key} factor={factor} />
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {labels.expansionTitle}
        </h3>
        <ul className="mt-4 space-y-2">
          {expansions.map((item) => (
            <ExpansionRow
              key={item.key}
              item={item}
              eligibleLabel={labels.eligible}
              notEligibleLabel={labels.notEligible}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}

function FactorRow({ factor }: { factor: SuccessScoreFactor }) {
  return (
    <li className="flex items-center justify-between gap-3 text-sm">
      <span className="text-gray-700">{factor.label}</span>
      <div className="flex items-center gap-2">
        <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-violet-500"
            style={{ width: `${factor.score}%` }}
          />
        </div>
        <span className="w-8 text-right font-semibold text-gray-900">{factor.score}</span>
      </div>
    </li>
  );
}

function ExpansionRow({
  item,
  eligibleLabel,
  notEligibleLabel,
}: {
  item: ExpansionOpportunity;
  eligibleLabel: string;
  notEligibleLabel: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2 text-sm">
      <span className="text-gray-800">{item.label}</span>
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
          item.eligible
            ? "bg-emerald-50 text-emerald-700"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {item.eligible ? eligibleLabel : notEligibleLabel}
      </span>
    </li>
  );
}
