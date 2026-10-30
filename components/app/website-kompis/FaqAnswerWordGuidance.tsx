"use client";

import { AipifyDesignColors } from "@/lib/design/light-enterprise-theme";
import { getFaqAnswerWordGuidance } from "@/lib/website-kompis-faq/answer-word-guidance";

export type FaqAnswerWordGuidanceLabels = {
  remaining: string;
  warning: string;
  over: string;
  progressAria: string;
};

type FaqAnswerWordGuidanceProps = {
  answer: string;
  labels: FaqAnswerWordGuidanceLabels;
};

function fillTemplate(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export function FaqAnswerWordGuidance({ answer, labels }: FaqAnswerWordGuidanceProps) {
  const guidance = getFaqAnswerWordGuidance(answer);
  const statusText =
    guidance.tone === "over"
      ? fillTemplate(labels.over, { count: guidance.overBy, target: guidance.target })
      : guidance.tone === "warning"
        ? fillTemplate(labels.warning, {
            count: guidance.remaining,
            used: guidance.wordCount,
            target: guidance.target,
          })
        : fillTemplate(labels.remaining, {
            count: guidance.remaining,
            used: guidance.wordCount,
            target: guidance.target,
          });

  const statusClass =
    guidance.tone === "over"
      ? "text-amber-800"
      : guidance.tone === "warning"
        ? "text-slate-700"
        : "text-slate-500";

  const ariaLabel = fillTemplate(labels.progressAria, {
    count: guidance.wordCount,
    target: guidance.target,
  });

  return (
    <div className="mt-2 space-y-1.5" data-testid="faq-answer-word-guidance">
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={guidance.target}
        aria-valuenow={Math.min(guidance.wordCount, guidance.target)}
        aria-label={ariaLabel}
        className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
      >
        <div
          className="h-full rounded-full transition-[width] duration-150 ease-out"
          style={{
            width: `${Math.round(guidance.progressRatio * 1000) / 10}%`,
            backgroundColor: AipifyDesignColors.companionPurple,
          }}
        />
      </div>
      <p className={`text-xs leading-snug ${statusClass}`}>{statusText}</p>
    </div>
  );
}
