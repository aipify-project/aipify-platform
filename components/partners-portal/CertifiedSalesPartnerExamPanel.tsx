"use client";

import { useCallback, useMemo, useState } from "react";
import {
  isPracticeExamPersistence,
  isRecordedExamAttempt,
  KOMPIS_WEB_LESSONS,
  pickLocale,
  type CspPublicExamQuestion,
} from "@/lib/certified-sales-partner/academy";

/**
 * Client-safe imports only: this panel never touches the answer key. Questions arrive from the
 * start route without answers and scoring happens on the server.
 */

export type CspExamLabels = {
  title: string;
  intro: string;
  start: string;
  starting: string;
  kompisBlocked: string;
  /** Template with {current} and {total}. */
  progress: string;
  /** Template with {count} and {total}. */
  answered: string;
  previous: string;
  next: string;
  submit: string;
  submitting: string;
  submitDisabledHint: string;
  questionRegion: string;
  passedTitle: string;
  passedBody: string;
  failedTitle: string;
  failedBody: string;
  passedBadge: string;
  failedBadge: string;
  /** Template with {correct}, {total} and {score}. */
  score: string;
  /** Template with {pass}. */
  passMark: string;
  reviewLessons: string;
  retake: string;
  practiceNotice: string;
  attemptRecorded: string;
  certificationRecorded: string;
  downloadCertificate: string;
  failClosed: string;
  error: string;
};

type ExamResultPayload = {
  passed: boolean;
  scorePct: number;
  correct: number;
  total: number;
  pass_score_pct?: number;
  backend_ready?: boolean;
  certification_persisted?: boolean;
  persistence_status?: string;
  attempt_recorded?: boolean;
  feedback?: { lessons_to_review?: string[] };
};

type StartPayload = {
  course_key: string;
  variantId: string;
  attemptIndex: number;
  questions: CspPublicExamQuestion[];
  total: number;
};

type Phase = "idle" | "starting" | "in_progress" | "submitting" | "result";

const COURSE_PRODUCT_KEY = "kompis_web";

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m8 12.5 2.8 2.8L16 9.5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 2.5 20h19L12 3Z" />
      <path d="M12 10v4.5M12 17.5v.01" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 4.5 6v5.5c0 4.4 3.1 8 7.5 9.5 4.4-1.5 7.5-5.1 7.5-9.5V6L12 3Z" />
      <path d="m9.5 12 1.8 1.8L14.8 10" />
    </svg>
  );
}

/**
 * One-question-at-a-time certification exam. Answers are retained while navigating, submission is
 * explicit, and the result never claims certification unless Core persisted it.
 */
export function CertifiedSalesPartnerExamPanel({ labels, locale }: { labels: CspExamLabels; locale: string }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [exam, setExam] = useState<StartPayload | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ExamResultPayload | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [nextAttempt, setNextAttempt] = useState(0);

  const questions = exam?.questions ?? [];
  const total = questions.length;
  const answeredCount = useMemo(() => questions.filter((q) => answers[q.id]).length, [questions, answers]);
  const allAnswered = total > 0 && answeredCount === total;

  const startExam = useCallback(
    async (attemptIndex: number) => {
      setPhase("starting");
      setMessage(null);
      setResult(null);
      try {
        const res = await fetch("/api/certified-sales-partner/academy/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_key: COURSE_PRODUCT_KEY, locale, attempt_index: attemptIndex }),
        });
        const data = (await res.json().catch(() => ({}))) as Partial<StartPayload> & { backend_ready?: boolean };
        if (res.status === 503 || data.backend_ready === false) {
          setMessage(labels.failClosed);
          setPhase("idle");
          return;
        }
        if (!res.ok || !Array.isArray(data.questions) || data.questions.length === 0) {
          setMessage(labels.error);
          setPhase("idle");
          return;
        }
        setExam(data as StartPayload);
        setAnswers({});
        setCurrent(0);
        setNextAttempt(attemptIndex + 1);
        setPhase("in_progress");
        try {
          const { trackAcademyStarted } = await import("@/lib/product-analytics/track");
          trackAcademyStarted(COURSE_PRODUCT_KEY);
        } catch {
          // Analytics must never block academy start.
        }
      } catch {
        setMessage(labels.error);
        setPhase("idle");
      }
    },
    [labels.error, labels.failClosed, locale],
  );

  async function submitExam() {
    if (!exam || !allAnswered) return;
    setPhase("submitting");
    setMessage(null);
    try {
      const res = await fetch("/api/certified-sales-partner/academy/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_key: exam.course_key,
          variant_id: exam.variantId,
          attempt_index: exam.attemptIndex,
          locale,
          answers: questions.map((q) => ({ questionId: q.id, selectedOptionId: answers[q.id] })),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as Partial<ExamResultPayload>;
      if (!res.ok || typeof data.passed !== "boolean" || typeof data.scorePct !== "number") {
        setMessage(labels.error);
        setPhase("in_progress");
        return;
      }
      setResult(data as ExamResultPayload);
      setPhase("result");
      try {
        const { trackAcademyExamCompleted } = await import("@/lib/product-analytics/track");
        trackAcademyExamCompleted(data.passed === true, COURSE_PRODUCT_KEY);
      } catch {
        // Analytics must never block exam submit.
      }
    } catch {
      setMessage(labels.error);
      setPhase("in_progress");
    }
  }

  const question = questions[current];
  const lessonsToReview = (result?.feedback?.lessons_to_review ?? [])
    .map((id) => KOMPIS_WEB_LESSONS.find((lesson) => lesson.id === id))
    .filter((lesson): lesson is (typeof KOMPIS_WEB_LESSONS)[number] => Boolean(lesson));

  return (
    <section
      className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm"
      aria-labelledby="csp-exam-title"
    >
      <h2 id="csp-exam-title" className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">
        {labels.title}
      </h2>

      <p
        className="mt-3 flex items-start gap-2 rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-canvas)] p-3 text-sm text-[color:var(--aipify-text-secondary)]"
        role="status"
      >
        <span className="mt-0.5 text-[color:var(--aipify-accent)]">
          <ShieldIcon />
        </span>
        <span>{labels.kompisBlocked}</span>
      </p>

      {phase === "idle" || phase === "starting" ? (
        <div className="mt-4 space-y-4">
          <p className="max-w-2xl text-sm text-[color:var(--aipify-text-secondary)]">{labels.intro}</p>
          <button
            type="button"
            onClick={() => void startExam(nextAttempt)}
            disabled={phase === "starting"}
            className="inline-flex rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white hover:bg-[color:var(--aipify-companion-purple-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--aipify-focus-ring)] disabled:opacity-60"
          >
            {phase === "starting" ? labels.starting : labels.start}
          </button>
        </div>
      ) : null}

      {(phase === "in_progress" || phase === "submitting") && question ? (
        <div className="mt-5 space-y-5">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <p className="font-semibold text-[color:var(--aipify-text-primary)]">
                {fill(labels.progress, { current: current + 1, total })}
              </p>
              <p className="text-[color:var(--aipify-text-secondary)]">
                {fill(labels.answered, { count: answeredCount, total })}
              </p>
            </div>
            <div
              className="mt-2 h-2 overflow-hidden rounded-full bg-[color:var(--aipify-surface-muted)]"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={total}
              aria-valuenow={current + 1}
              aria-label={fill(labels.progress, { current: current + 1, total })}
            >
              <div
                className="h-full rounded-full bg-[color:var(--aipify-companion-purple)] transition-all"
                style={{ width: `${((current + 1) / total) * 100}%` }}
              />
            </div>
          </div>

          <fieldset key={question.id} className="space-y-3" aria-label={labels.questionRegion}>
            <legend className="text-base font-semibold text-[color:var(--aipify-text-primary)]">
              {question.question}
            </legend>
            <div className="grid gap-2">
              {question.options.map((option) => {
                const selected = answers[question.id] === option.id;
                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition-colors ${
                      selected
                        ? "border-[color:var(--aipify-companion-purple)] bg-[color:var(--aipify-accent-soft)] text-[color:var(--aipify-text-primary)]"
                        : "border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] text-[color:var(--aipify-text-primary)] hover:bg-[color:var(--aipify-surface-subtle)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`csp-exam-${question.id}`}
                      value={option.id}
                      checked={selected}
                      disabled={phase === "submitting"}
                      onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: option.id }))}
                      className="mt-1 accent-[color:var(--aipify-companion-purple)]"
                    />
                    <span>{option.text}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrent((index) => Math.max(0, index - 1))}
              disabled={current === 0 || phase === "submitting"}
              className="inline-flex rounded-xl border border-[color:var(--aipify-border-strong)] bg-[color:var(--aipify-surface)] px-4 py-2 text-sm font-semibold text-[color:var(--aipify-text-primary)] disabled:opacity-50"
            >
              {labels.previous}
            </button>
            {current < total - 1 ? (
              <button
                type="button"
                onClick={() => setCurrent((index) => Math.min(total - 1, index + 1))}
                disabled={phase === "submitting"}
                className="inline-flex rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white hover:bg-[color:var(--aipify-companion-purple-hover)] disabled:opacity-60"
              >
                {labels.next}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void submitExam()}
                disabled={!allAnswered || phase === "submitting"}
                className="inline-flex rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white hover:bg-[color:var(--aipify-companion-purple-hover)] disabled:opacity-60"
              >
                {phase === "submitting" ? labels.submitting : labels.submit}
              </button>
            )}
          </div>
          {current === total - 1 && !allAnswered ? (
            <p className="text-sm text-[color:var(--aipify-text-secondary)]">{labels.submitDisabledHint}</p>
          ) : null}
        </div>
      ) : null}

      {phase === "result" && result ? (
        <div className="mt-5 space-y-4" aria-live="polite">
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 ${
              result.passed
                ? "border-teal-300 bg-teal-50 text-teal-900"
                : "border-orange-300 bg-orange-50 text-orange-900"
            }`}
            role="status"
          >
            {result.passed ? <CheckIcon /> : <AlertIcon />}
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide">
                {result.passed ? labels.passedBadge : labels.failedBadge}
              </p>
              <h3 className="text-base font-semibold">{result.passed ? labels.passedTitle : labels.failedTitle}</h3>
              <p className="text-sm">{result.passed ? labels.passedBody : labels.failedBody}</p>
              <p className="text-sm font-medium">
                {fill(labels.score, { correct: result.correct, total: result.total, score: result.scorePct })}
                {" · "}
                {fill(labels.passMark, { pass: result.pass_score_pct ?? 80 })}
              </p>
            </div>
          </div>

          {result.certification_persisted ? (
            <div className="space-y-2">
              <p
                className="flex items-start gap-2 rounded-xl border border-teal-300 bg-teal-50 p-3 text-sm text-teal-900"
                role="status"
              >
                <CheckIcon />
                <span>{labels.certificationRecorded}</span>
              </p>
              <a
                href={`/api/certified-sales-partner/academy/certificate?locale=${encodeURIComponent(locale)}`}
                className="inline-flex rounded-xl border border-[color:var(--aipify-border-strong)] bg-[color:var(--aipify-surface)] px-4 py-2 text-sm font-semibold text-[color:var(--aipify-companion-purple)]"
              >
                {labels.downloadCertificate}
              </a>
            </div>
          ) : isPracticeExamPersistence(result.certification_persisted, result.persistence_status) ? (
            // Practice only when Core could not confirm (unavailable / not ready / score mismatch).
            <p
              className="flex items-start gap-2 rounded-xl border border-orange-300 bg-orange-50 p-3 text-sm text-orange-900"
              role="status"
            >
              <AlertIcon />
              <span>{labels.practiceNotice}</span>
            </p>
          ) : isRecordedExamAttempt(
              result.certification_persisted,
              result.persistence_status,
              result.attempt_recorded,
            ) ? (
            // Core recorded a real attempt (e.g. not passed) — never label as practice.
            <p
              className="flex items-start gap-2 rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-canvas)] p-3 text-sm text-[color:var(--aipify-text-secondary)]"
              role="status"
            >
              <ShieldIcon />
              <span>{labels.attemptRecorded}</span>
            </p>
          ) : null}

          {!result.passed && lessonsToReview.length > 0 ? (
            <div className="text-sm text-[color:var(--aipify-text-secondary)]">
              <p className="font-semibold text-[color:var(--aipify-text-primary)]">{labels.reviewLessons}</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5">
                {lessonsToReview.map((lesson) => (
                  <li key={lesson.id}>{pickLocale(lesson.title, locale)}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => void startExam(nextAttempt)}
            className="inline-flex rounded-xl border border-[color:var(--aipify-border-strong)] bg-[color:var(--aipify-surface)] px-4 py-2 text-sm font-semibold text-[color:var(--aipify-text-primary)]"
          >
            {labels.retake}
          </button>
        </div>
      ) : null}

      {message ? (
        <p
          className="mt-4 flex items-start gap-2 rounded-xl border border-orange-300 bg-orange-50 p-3 text-sm text-orange-900"
          role="alert"
        >
          <AlertIcon />
          <span>{message}</span>
        </p>
      ) : null}
    </section>
  );
}
