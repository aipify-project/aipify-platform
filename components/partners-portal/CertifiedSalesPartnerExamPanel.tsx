"use client";

import { useState, type FormEvent } from "react";

export type CspExamLabels = {
  title: string;
  courseId: string;
  answersJson: string;
  submit: string;
  kompisBlocked: string;
  failClosed: string;
  error: string;
  passed: string;
  failed: string;
};

/**
 * Exam submit UI — answers JSON is temporary admin/dev input until Core serves question banks.
 * Client score is never trusted; server scores via API.
 */
export function CertifiedSalesPartnerExamPanel({ labels }: { labels: CspExamLabels }) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    const fd = new FormData(e.currentTarget);
    let answers: unknown = [];
    try {
      answers = JSON.parse(String(fd.get("answers_json") ?? "[]"));
    } catch {
      setMessage(labels.error);
      setPending(false);
      return;
    }
    try {
      const res = await fetch("/api/certified-sales-partner/academy/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: String(fd.get("course_id") ?? ""),
          answers,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        backend_ready?: boolean;
        passed?: boolean;
        scorePct?: number;
        kompis_help?: { allowed?: boolean };
      };
      if (res.status === 503 || data.backend_ready === false) {
        setMessage(labels.failClosed);
        return;
      }
      if (!res.ok) {
        setMessage(data.error ?? labels.error);
        return;
      }
      setMessage(
        data.passed
          ? `${labels.passed} (${data.scorePct ?? "—"}%)`
          : `${labels.failed} (${data.scorePct ?? "—"}%)`,
      );
    } catch {
      setMessage(labels.error);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm">
      <h2 className="text-lg font-semibold">{labels.title}</h2>
      <p className="mt-2 rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-canvas)] p-3 text-sm" role="status">
        {labels.kompisBlocked}
      </p>
      <form className="mt-4 grid max-w-xl gap-3" onSubmit={onSubmit}>
        <label className="text-sm">
          <span className="font-medium">{labels.courseId}</span>
          <input name="course_id" required className="mt-1 w-full rounded-xl border px-3 py-2" />
        </label>
        <label className="text-sm">
          <span className="font-medium">{labels.answersJson}</span>
          <textarea
            name="answers_json"
            rows={5}
            required
            className="mt-1 w-full rounded-xl border px-3 py-2 font-mono text-xs"
            defaultValue='[{"questionId":"q1","selectedOptionId":"a"}]'
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {labels.submit}
        </button>
      </form>
      {message ? (
        <p className="mt-4 text-sm text-[color:var(--aipify-text-secondary)]" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
