"use client";

import { useState } from "react";
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
  onFeedback,
  onEscalate,
}: CompanionAnswerFeedbackProps) {
  const [feedback, setFeedback] = useState<CompanionAnswerFeedbackState>(initialFeedback);
  const [showReasons, setShowReasons] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [thanks, setThanks] = useState<string | null>(null);

  async function submitFeedback(
    feedbackType: CompanionAnswerFeedbackState,
    negativeReason?: NegativeReason,
  ) {
    if (!feedbackType || submitting) return;
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
      setFeedback(feedbackType);
      setThanks(
        feedbackType === "org_confirm" ? labels.feedbackOrgConfirmThanks : labels.feedbackThanks,
      );
      onFeedback?.(feedbackType, negativeReason);
    } catch {
      setThanks(null);
    } finally {
      setSubmitting(false);
      setShowReasons(false);
    }
  }

  const orgConfirmAllowed = canConfirmOrg && orgConfirmEligible;

  return (
    <div className="mt-4 space-y-3 border-t border-aipify-border pt-3">
      {sources.length > 0 ? (
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

      {feedback ? (
        <p className="text-xs text-aipify-text-secondary">{thanks ?? labels.feedbackThanks}</p>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={submitting}
            onClick={() => void submitFeedback("helpful")}
            className="rounded-lg border border-aipify-border px-3 py-1.5 text-xs font-medium text-aipify-text hover:bg-aipify-surface-muted disabled:opacity-60"
          >
            👍 {labels.feedbackHelpful}
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => setShowReasons(true)}
            className="rounded-lg border border-aipify-border px-3 py-1.5 text-xs font-medium text-aipify-text hover:bg-aipify-surface-muted disabled:opacity-60"
          >
            👎 {labels.feedbackNotHelpful}
          </button>
          {orgConfirmAllowed ? (
            <button
              type="button"
              disabled={submitting}
              onClick={() => void submitFeedback("org_confirm")}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-900 hover:bg-emerald-100 disabled:opacity-60"
            >
              ✅ {labels.feedbackOrgConfirm}
            </button>
          ) : canConfirmOrg && orgConfirmBlockedReason ? (
            <p className="text-xs text-amber-800">{orgConfirmBlockedReason}</p>
          ) : null}
        </div>
      )}

      {showReasons && !feedback ? (
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
