"use client";

import { useId, useState } from "react";
import {
  AkIconCopy,
  AkIconThumbDown,
  AkIconThumbUp,
} from "@/components/embed/website-kompis-design-icons";
import {
  buildWebsiteKompisCopyPlainText,
  copyWebsiteKompisAnswerText,
  type WebsiteKompisAnswerFeedbackVote,
} from "@/lib/marketing/website-kompis-answer-feedback";
import { readOrCreateWebsiteKompisVisitorKey } from "@/lib/marketing/website-kompis-visitor-key";

export type WebsiteKompisAnswerActionLabels = {
  helpful: string;
  notHelpful: string;
  copy: string;
  copied: string;
  copyFailed: string;
  commentPrompt: string;
  commentPlaceholder: string;
  commentSkip: string;
  commentSend: string;
  saved: string;
  saveFailed: string;
  unavailable: string;
  clearVote: string;
  retry: string;
};

type WebsiteKompisAnswerActionsProps = {
  answerText: string;
  sources?: Array<{ title: string; href?: string | null }>;
  answerId?: string | null;
  feedbackPersistenceReady?: boolean;
  installId: string;
  domain: string;
  labels: WebsiteKompisAnswerActionLabels;
};

export function WebsiteKompisAnswerActions({
  answerText,
  sources,
  answerId,
  feedbackPersistenceReady = true,
  installId,
  domain,
  labels,
}: WebsiteKompisAnswerActionsProps) {
  const baseId = useId();
  const [vote, setVote] = useState<WebsiteKompisAnswerFeedbackVote | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");

  const votesEnabled =
    Boolean(answerId) && feedbackPersistenceReady !== false && Boolean(installId) && Boolean(domain);

  async function submitVote(
    nextVote: WebsiteKompisAnswerFeedbackVote | null,
    options?: { comment?: string; clear?: boolean },
  ) {
    if (!votesEnabled || submitting || !answerId) return;

    const previous = vote;
    setSubmitting(true);
    setError(null);
    setStatus(null);

    if (options?.clear) {
      setVote(null);
    } else if (nextVote) {
      setVote(nextVote);
    }

    try {
      const response = await fetch("/api/marketing/companion/answer-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answerId,
          installId,
          domain,
          visitorKey: readOrCreateWebsiteKompisVisitorKey(),
          vote: options?.clear ? undefined : nextVote,
          comment: options?.comment,
          clear: options?.clear === true,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        code?: string;
        vote?: WebsiteKompisAnswerFeedbackVote | null;
        cleared?: boolean;
      };

      if (!response.ok || payload.ok !== true) {
        setVote(previous);
        if (payload.code === "persistence_unavailable") {
          setError(labels.unavailable);
        } else {
          setError(payload.error?.trim() || labels.saveFailed);
        }
        return;
      }

      if (payload.cleared) {
        setVote(null);
        setShowComment(false);
        setStatus(labels.saved);
        return;
      }

      setVote(payload.vote ?? nextVote);
      setStatus(labels.saved);
    } catch {
      setVote(previous);
      setError(labels.saveFailed);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleHelpful() {
    if (!votesEnabled) {
      setError(labels.unavailable);
      return;
    }
    if (vote === "helpful") {
      await submitVote(null, { clear: true });
      return;
    }
    setShowComment(false);
    await submitVote("helpful");
  }

  async function handleNotHelpful() {
    if (!votesEnabled) {
      setError(labels.unavailable);
      return;
    }
    if (vote === "not_helpful") {
      await submitVote(null, { clear: true });
      return;
    }
    setShowComment(true);
    await submitVote("not_helpful");
  }

  async function handleCopy() {
    const plain = buildWebsiteKompisCopyPlainText({ answerText, sources });
    const result = await copyWebsiteKompisAnswerText(plain);
    if (result.ok) {
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2000);
      return;
    }
    setCopyState("failed");
    window.setTimeout(() => setCopyState("idle"), 2500);
  }

  return (
    <div className="ak-answer-actions">
      <div className="ak-answer-actions__row" role="group" aria-label={labels.copy}>
        {votesEnabled ? (
          <>
            <button
              type="button"
              className={`ak-action-icon${vote === "helpful" ? " is-selected is-helpful" : ""}`}
              aria-label={labels.helpful}
              title={labels.helpful}
              aria-pressed={vote === "helpful"}
              disabled={submitting}
              onClick={() => void handleHelpful()}
            >
              <AkIconThumbUp />
              <span className="ak-sr-only">{labels.helpful}</span>
            </button>
            <button
              type="button"
              className={`ak-action-icon${vote === "not_helpful" ? " is-selected is-not-helpful" : ""}`}
              aria-label={labels.notHelpful}
              title={labels.notHelpful}
              aria-pressed={vote === "not_helpful"}
              disabled={submitting}
              onClick={() => void handleNotHelpful()}
            >
              <AkIconThumbDown />
              <span className="ak-sr-only">{labels.notHelpful}</span>
            </button>
          </>
        ) : null}
        <button
          type="button"
          className={`ak-action-icon${copyState === "copied" ? " is-selected" : ""}`}
          aria-label={labels.copy}
          title={labels.copy}
          onClick={() => void handleCopy()}
        >
          <AkIconCopy />
          <span className="ak-sr-only">{labels.copy}</span>
        </button>
      </div>

      {copyState === "copied" ? (
        <p className="ak-answer-actions__status" role="status">
          {labels.copied}
        </p>
      ) : null}
      {copyState === "failed" ? (
        <p className="ak-answer-actions__error" role="alert">
          {labels.copyFailed}
        </p>
      ) : null}

      {showComment && vote === "not_helpful" ? (
        <div className="ak-answer-actions__comment">
          <label className="ak-answer-actions__comment-label" htmlFor={`${baseId}-comment`}>
            {labels.commentPrompt}
          </label>
          <textarea
            id={`${baseId}-comment`}
            className="ak-answer-actions__textarea"
            value={comment}
            onChange={(event) => setComment(event.target.value.slice(0, 500))}
            placeholder={labels.commentPlaceholder}
            rows={3}
            disabled={submitting}
          />
          <div className="ak-answer-actions__comment-row">
            <button
              type="button"
              className="ak-followup"
              disabled={submitting}
              onClick={() => {
                setShowComment(false);
                setComment("");
              }}
            >
              {labels.commentSkip}
            </button>
            <button
              type="button"
              className="ak-followup"
              disabled={submitting || !comment.trim()}
              onClick={() => void submitVote("not_helpful", { comment })}
            >
              {labels.commentSend}
            </button>
          </div>
        </div>
      ) : null}

      {status ? (
        <p className="ak-answer-actions__status" role="status">
          {status}
        </p>
      ) : null}
      {error ? (
        <div className="ak-answer-actions__error" role="alert">
          <span>{error}</span>
          {votesEnabled ? (
            <button
              type="button"
              className="ak-followup"
              disabled={submitting}
              onClick={() => {
                setError(null);
                if (vote) void submitVote(vote);
              }}
            >
              {labels.retry}
            </button>
          ) : null}
        </div>
      ) : null}

      {vote ? (
        <button
          type="button"
          className="ak-answer-actions__clear"
          disabled={submitting || !votesEnabled}
          onClick={() => void submitVote(null, { clear: true })}
        >
          {labels.clearVote}
        </button>
      ) : null}
    </div>
  );
}
