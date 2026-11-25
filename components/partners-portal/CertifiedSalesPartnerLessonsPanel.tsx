"use client";

import { useMemo, useState } from "react";
import { KOMPIS_WEB_LESSONS, pickLocale } from "@/lib/certified-sales-partner/academy";

export type CspLessonsLabels = {
  title: string;
  intro: string;
  eyebrow: string;
  heroTitle: string;
  heroBody: string;
  /** Template with {viewed} and {total} — neutral reading progress, not “completed”. */
  chapterProgress: string;
  /** Template with {number}. */
  lessonNumber: string;
  continueLesson: string;
  startExamCta: string;
  plannedCatalogNote: string;
  /** Shown while certification exam is active — chapter titles only, no lesson body. */
  examLockNote: string;
  viewedStatus: string;
  readingStatus: string;
};

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** Six Kompis Web lessons with desktop chapter nav and mobile-friendly progress. */
export function CertifiedSalesPartnerLessonsPanel({
  labels,
  locale,
  onStartExam,
  examLocked = false,
  hideHero = false,
}: {
  labels: CspLessonsLabels;
  locale: string;
  onStartExam?: () => void;
  /** When true, hide lesson body/explanations so the exam cannot be used as an open book. */
  examLocked?: boolean;
  /** Hero is rendered by the training shell when true. */
  hideHero?: boolean;
}) {
  const lessons = useMemo(
    () => KOMPIS_WEB_LESSONS.slice().sort((a, b) => a.order - b.order),
    [],
  );
  const [activeId, setActiveId] = useState(lessons[0]?.id ?? "lesson_01");
  const [viewed, setViewed] = useState<Record<string, boolean>>({ [lessons[0]?.id ?? "lesson_01"]: true });

  const activeIndex = Math.max(
    0,
    lessons.findIndex((lesson) => lesson.id === activeId),
  );
  const active = lessons[activeIndex] ?? lessons[0];
  const viewedCount = Object.keys(viewed).filter((id) => viewed[id]).length;

  function openLesson(id: string) {
    if (examLocked) {
      setActiveId(id);
      return;
    }
    setActiveId(id);
    setViewed((prev) => ({ ...prev, [id]: true }));
  }

  function continueNext() {
    const next = lessons[activeIndex + 1];
    if (next) openLesson(next.id);
  }

  return (
    <section
      className="overflow-hidden rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] shadow-sm"
      aria-labelledby="csp-lessons-title"
    >
      {!hideHero ? (
        <div className="border-b border-[color:var(--aipify-border)] bg-[linear-gradient(135deg,rgba(114,83,234,0.08),rgba(64,118,216,0.06))] px-6 py-6 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#7253EA]">{labels.eyebrow}</p>
          <h2
            id="csp-lessons-title"
            className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--aipify-text-primary)]"
          >
            {labels.heroTitle}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[color:var(--aipify-text-secondary)]">
            {labels.heroBody}
          </p>
        </div>
      ) : (
        <h2 id="csp-lessons-title" className="sr-only">
          {labels.title}
        </h2>
      )}

      <div className="border-b border-[color:var(--aipify-border)] px-6 py-4 sm:px-8">
        <p className="text-sm font-medium text-[color:var(--aipify-text-primary)]">
          {fill(labels.chapterProgress, { viewed: Math.min(viewedCount, lessons.length), total: lessons.length })}
        </p>
        <div
          className="mt-2 h-2 max-w-md overflow-hidden rounded-full bg-[#EEF1F6]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={lessons.length}
          aria-valuenow={Math.min(viewedCount, lessons.length)}
        >
          <div
            className="h-full rounded-full bg-[#7253EA] transition-all"
            style={{ width: `${(Math.min(viewedCount, lessons.length) / lessons.length) * 100}%` }}
          />
        </div>
        {examLocked ? (
          <p className="mt-3 rounded-xl border border-[#E2E7F0] bg-[#EEF4FF] px-3 py-2 text-sm text-[#245CC5]" role="status">
            {labels.examLockNote}
          </p>
        ) : null}
      </div>

      <div className="grid gap-0 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav
          aria-label={labels.title}
          className="border-b border-[color:var(--aipify-border)] bg-[#F6F8FC] p-4 lg:border-b-0 lg:border-r"
        >
          <ol className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {lessons.map((lesson) => {
              const selected = lesson.id === activeId;
              const hasViewed = Boolean(viewed[lesson.id]);
              return (
                <li key={lesson.id} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => openLesson(lesson.id)}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--aipify-focus-ring)] ${
                      selected
                        ? "bg-[#7253EA] text-white"
                        : "bg-white text-[color:var(--aipify-text-primary)] hover:bg-white/80 lg:bg-transparent lg:hover:bg-white/70"
                    }`}
                  >
                    <span className="block text-[10px] font-semibold uppercase tracking-wide opacity-80">
                      {fill(labels.lessonNumber, { number: lesson.order })}
                      {" · "}
                      {selected ? labels.readingStatus : hasViewed ? labels.viewedStatus : "—"}
                    </span>
                    <span className="mt-0.5 block font-semibold leading-snug">
                      {pickLocale(lesson.title, locale)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <article className="p-6 sm:p-8">
          {examLocked ? (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold tracking-tight text-[color:var(--aipify-text-primary)]">
                {active ? pickLocale(active.title, locale) : labels.title}
              </h3>
              <p className="text-sm leading-relaxed text-[color:var(--aipify-text-secondary)]">
                {labels.examLockNote}
              </p>
            </div>
          ) : active ? (
            <>
              <h3 className="text-lg font-semibold tracking-tight text-[color:var(--aipify-text-primary)]">
                {pickLocale(active.title, locale)}
              </h3>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-[color:var(--aipify-text-secondary)]">
                {active.body.map((paragraph, index) => (
                  <p key={`${active.id}-${index}`}>{pickLocale(paragraph, locale)}</p>
                ))}
                {active.containsPlannedCatalogFacts ? (
                  <p className="rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-canvas)] p-3 text-xs">
                    {labels.plannedCatalogNote}
                  </p>
                ) : null}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {activeIndex < lessons.length - 1 ? (
                  <button
                    type="button"
                    onClick={continueNext}
                    className="inline-flex rounded-xl bg-[#7253EA] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5f42d1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--aipify-focus-ring)]"
                  >
                    {labels.continueLesson}
                  </button>
                ) : onStartExam ? (
                  <button
                    type="button"
                    onClick={onStartExam}
                    className="inline-flex rounded-xl bg-[#7253EA] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5f42d1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--aipify-focus-ring)]"
                  >
                    {labels.startExamCta}
                  </button>
                ) : null}
              </div>
            </>
          ) : null}
          {!examLocked ? (
            <p className="mt-6 text-xs text-[color:var(--aipify-text-secondary)]">{labels.intro}</p>
          ) : null}
        </article>
      </div>
    </section>
  );
}
