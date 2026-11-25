"use client";

import { useMemo, useState } from "react";
import { KOMPIS_WEB_LESSONS, pickLocale } from "@/lib/certified-sales-partner/academy";

export type CspLessonsLabels = {
  title: string;
  intro: string;
  eyebrow: string;
  heroTitle: string;
  heroBody: string;
  /** Template with {completed} and {total}. */
  chapterProgress: string;
  /** Template with {number}. */
  lessonNumber: string;
  continueLesson: string;
  startExamCta: string;
  plannedCatalogNote: string;
};

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** Six Kompis Web lessons with desktop chapter nav and mobile-friendly progress. */
export function CertifiedSalesPartnerLessonsPanel({
  labels,
  locale,
  onStartExam,
}: {
  labels: CspLessonsLabels;
  locale: string;
  onStartExam?: () => void;
}) {
  const lessons = useMemo(
    () => KOMPIS_WEB_LESSONS.slice().sort((a, b) => a.order - b.order),
    [],
  );
  const [activeId, setActiveId] = useState(lessons[0]?.id ?? "lesson_01");
  const [opened, setOpened] = useState<Record<string, boolean>>({ [lessons[0]?.id ?? "lesson_01"]: true });

  const activeIndex = Math.max(
    0,
    lessons.findIndex((lesson) => lesson.id === activeId),
  );
  const active = lessons[activeIndex] ?? lessons[0];
  const completedCount = Object.keys(opened).filter((id) => opened[id]).length;

  function openLesson(id: string) {
    setActiveId(id);
    setOpened((prev) => ({ ...prev, [id]: true }));
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
      <div className="border-b border-[color:var(--aipify-border)] bg-[linear-gradient(135deg,rgba(114,83,234,0.08),rgba(64,118,216,0.06))] px-6 py-6 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-companion-purple)]">
          {labels.eyebrow}
        </p>
        <h2 id="csp-lessons-title" className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--aipify-text-primary)]">
          {labels.heroTitle}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[color:var(--aipify-text-secondary)]">
          {labels.heroBody}
        </p>
        <p className="mt-4 text-sm font-medium text-[color:var(--aipify-text-primary)]">
          {fill(labels.chapterProgress, { completed: Math.min(completedCount, lessons.length), total: lessons.length })}
        </p>
        <div
          className="mt-2 h-2 max-w-md overflow-hidden rounded-full bg-white/70"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={lessons.length}
          aria-valuenow={Math.min(completedCount, lessons.length)}
        >
          <div
            className="h-full rounded-full bg-[color:var(--aipify-companion-purple)] transition-all"
            style={{ width: `${(Math.min(completedCount, lessons.length) / lessons.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav
          aria-label={labels.title}
          className="border-b border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface-subtle)] p-4 lg:border-b-0 lg:border-r"
        >
          <ol className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {lessons.map((lesson) => {
              const selected = lesson.id === activeId;
              return (
                <li key={lesson.id} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => openLesson(lesson.id)}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--aipify-focus-ring)] ${
                      selected
                        ? "bg-[color:var(--aipify-companion-purple)] text-white"
                        : "bg-white text-[color:var(--aipify-text-primary)] hover:bg-white/80 lg:bg-transparent lg:hover:bg-white/70"
                    }`}
                  >
                    <span className="block text-[10px] font-semibold uppercase tracking-wide opacity-80">
                      {fill(labels.lessonNumber, { number: lesson.order })}
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
          {active ? (
            <>
              <h3 className="text-lg font-semibold tracking-tight text-[color:var(--aipify-text-primary)]">
                {pickLocale(active.title, locale)}
              </h3>
              <div className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed text-[color:var(--aipify-text-secondary)]">
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
                    className="inline-flex rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[color:var(--aipify-companion-purple-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--aipify-focus-ring)]"
                  >
                    {labels.continueLesson}
                  </button>
                ) : onStartExam ? (
                  <button
                    type="button"
                    onClick={onStartExam}
                    className="inline-flex rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[color:var(--aipify-companion-purple-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--aipify-focus-ring)]"
                  >
                    {labels.startExamCta}
                  </button>
                ) : null}
              </div>
            </>
          ) : null}
          <p className="mt-6 text-xs text-[color:var(--aipify-text-secondary)]">{labels.intro}</p>
        </article>
      </div>
    </section>
  );
}
