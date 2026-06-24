"use client";

import { useEffect, useState } from "react";
import type {
  CompanionAnswerFeedbackState,
  CompanionAnswerSource,
  CompanionExperienceLabels,
} from "@/lib/app/companion/types";

type NegativeReason =
  | "wrong_info"
  | "outdated"
  | "misunderstood"
  | "wrong_link"
  | "too_vague"
  | "other";

type CompanionAnswerFeedbackProps = {
  labels: CompanionExperienceLabels;
  conversationId: string;
  messageId: string;
  question: string;
  answerSummary: string;
  sources: CompanionAnswerSource[];
  routeContext: string;
  locale: string;
  canConfirmOrg: boolean;
  orgConfirmEligible?: boolean;
  orgConfirmBlockedReason?: string;
  initialFeedback?: CompanionAnswerFeedbackState;
  showSupportEscalation?: boolean;
  hideSourcesToggle?: boolean;
  onFeedback?: (feedback: CompanionAnswerFeedbackState, reason?: NegativeReason) => void;
  onEscalate?: () => void;
};

const REASONS: Array<{ id: NegativeReason; label: string }> = [
  { id: "wrong_info", label: "feedbackReasonWrongInfo" },
  { id: "outdated", label: "feedbackReasonOutdated" },
  { id: "misunderstood", label: "feedbackReasonMisunderstood" },
  { id: "wrong_link", label: "feedbackReasonWrongLink" },
  { id: "too_vague", label: "feedbackReasonTooVague" },
  { id: "other", label: "feedbackReasonOther" },
];

function feedbackButtonClass(selected: boolean): string {
  const base =
    "rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:opacity-60";
  if (selected) {
    return `${base} border-aipify-companion bg-violet-50 text-aipify-companion ring-1 ring-aipify-companion/30`;
  }
  return `${base} border-aipify-border text-aipify-text hover:bg-aipify-surface-muted`;
}

export function CompanionAnswerFeedback({
  labels,
  conversationId,
  messageId,
  question,
  answerSummary,
  sources,
  routeContext,
  locale,
  canConfirmOrg,
  orgConfirmEligible = true,
  orgConfirmBlockedReason,
  initialFeedback = null,
  showSupportEscalation = false,
  hideSourcesToggle = false,
  onFeedback,
  onEscalate,
}: CompanionAnswerFeedbackProps) {
  const [feedback, setFeedback] = useState<CompanionAnswerFeedbackState>(initialFeedback);
  const [showReasons, setShowReasons] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    setFeedback(initialFeedback ?? null);
  }, [initialFeedback, messageId]);

  async function submitFeedback(
    feedbackType: CompanionAnswerFeedbackState,
    negativeReason?: NegativeReason,
  ) {
    if (!feedbackType || submitting) return;

    const previous = feedback;
    setFeedback(feedbackType);
    setSubmitError(false);
    setSubmitting(true);

    try {
      const res = await fetch("/api/aipify/companion/answer-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          message_id: messageId,
          question,
          answer_summary: answerSummary,
          sources,
          route_context: routeContext,
          language: locale,
          feedback_type: feedbackType,
          negative_reason: negativeReason ?? null,
        }),
      });
      if (!res.ok) throw new Error("feedback failed");
      onFeedback?.(feedbackType, negativeReason);
    } catch {
      setFeedback(previous);
      setSubmitError(true);
    } finally {
      setSubmitting(false);
      setShowReasons(false);
    }
  }

  const orgConfirmAllowed = canConfirmOrg && orgConfirmEligible;

  return (
    <div className="mt-4 space-y-3 border-t border-aipify-border pt-3">
      {sources.length > 0 && !hideSourcesToggle ? (
        <div>
          <button
            type="button"
            onClick={() => setShowSources((v) => !v)}
            className="text-xs font-medium text-aipify-companion hover:underline"
            aria-expanded={showSources}
          >
            {showSources ? labels.sourcesHide : labels.sourcesShow}
          </button>
          {showSources ? (
            <ul className="mt-2 space-y-1 rounded-lg bg-aipify-surface-muted/60 px-3 py-2 text-xs text-aipify-text-secondary">
              {sources.map((source) => (
                <li key={source.id}>
                  <span>{source.label}</span>
                  {source.meta ? (
                    <span className="mt-0.5 block text-[11px] text-aipify-text-muted">{source.meta}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={submitting}
          aria-pressed={feedback === "helpful"}
          onClick={() => void submitFeedback("helpful")}
          className={feedbackButtonClass(feedback === "helpful")}
        >
          👍 {labels.feedbackHelpful}
        </button>
        <button
          type="button"
          disabled={submitting}
          aria-pressed={feedback === "not_helpful"}
          onClick={() => setShowReasons(true)}
          className={feedbackButtonClass(feedback === "not_helpful")}
        >
          👎 {labels.feedbackNotHelpful}
        </button>
        {orgConfirmAllowed ? (
          <button
            type="button"
            disabled={submitting}
            aria-pressed={feedback === "org_confirm"}
            onClick={() => void submitFeedback("org_confirm")}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:opacity-60 ${
              feedback === "org_confirm"
                ? "border-emerald-400 bg-emerald-100 text-emerald-950 ring-1 ring-emerald-300"
                : "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
            }`}
          >
            ✅ {labels.feedbackOrgConfirm}
          </button>
        ) : canConfirmOrg && orgConfirmBlockedReason ? (
          <p className="text-xs text-amber-800">{orgConfirmBlockedReason}</p>
        ) : null}
      </div>

      {feedback ? (
        <p className="text-xs text-aipify-text-secondary">
          {feedback === "org_confirm" ? labels.feedbackOrgConfirmThanks : labels.feedbackThanks}
        </p>
      ) : null}

      {submitError ? (
        <p className="text-xs text-rose-800">{labels.queue.syncError}</p>
      ) : null}

      {showReasons ? (
        <div className="rounded-lg border border-aipify-border bg-aipify-surface-muted/40 p-3">
          <p className="text-xs font-medium text-aipify-text">{labels.feedbackReasonTitle}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {REASONS.map((reason) => (
              <button
                key={reason.id}
                type="button"
                disabled={submitting}
                onClick={() => void submitFeedback("not_helpful", reason.id)}
                className="rounded-full border border-aipify-border bg-white px-3 py-1 text-xs text-aipify-text hover:border-violet-200 hover:bg-violet-50 disabled:opacity-60"
              >
                {labels[reason.label as keyof CompanionExperienceLabels] as string}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {showSupportEscalation || feedback === "not_helpful" ? (
        <div className="rounded-lg border border-amber-100 bg-amber-50/50 px-3 py-2">
          <p className="text-xs text-amber-950">{labels.supportEscalationHint}</p>
          {onEscalate ? (
            <button
              type="button"
              onClick={onEscalate}
              className="mt-2 text-xs font-medium text-aipify-companion hover:underline"
            >
              {labels.createSupportRequest}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
