"use client";

import { useState } from "react";
import {
  CertifiedSalesPartnerExamPanel,
  type CspExamLabels,
  type CspExamPhase,
} from "@/components/partners-portal/CertifiedSalesPartnerExamPanel";
import {
  CertifiedSalesPartnerLessonsPanel,
  type CspLessonsLabels,
} from "@/components/partners-portal/CertifiedSalesPartnerLessonsPanel";

export function CertifiedSalesPartnerTrainingClient({
  locale,
  lessonsLabels,
  examLabels,
}: {
  locale: string;
  lessonsLabels: CspLessonsLabels;
  examLabels: CspExamLabels;
}) {
  const [examPhase, setExamPhase] = useState<CspExamPhase>("idle");
  const [examOpen, setExamOpen] = useState(false);
  const examActive = examPhase === "starting" || examPhase === "in_progress" || examPhase === "submitting";

  return (
    <div className="space-y-6">
      <header className="overflow-hidden rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] shadow-sm">
        <div className="flex flex-col gap-5 bg-[linear-gradient(135deg,rgba(114,83,234,0.10),rgba(246,248,252,0.9))] px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- brand mark for academy hero */}
              <img
                src="/website-kompis/design-v1/brand/aipify-logo-dark.png"
                alt="Aipify"
                width={140}
                height={42}
                className="h-9 w-auto"
              />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#7253EA]">
              {lessonsLabels.eyebrow}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--aipify-text-primary)] sm:text-3xl">
              {lessonsLabels.heroTitle}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[color:var(--aipify-text-secondary)]">
              {lessonsLabels.heroBody}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] xl:items-start">
        <div className={examActive ? "pointer-events-none select-none xl:opacity-70" : undefined}>
          <CertifiedSalesPartnerLessonsPanel
            labels={lessonsLabels}
            locale={locale}
            examLocked={examActive}
            hideHero
            onStartExam={() => {
              setExamOpen(true);
              setExamPhase("idle");
            }}
          />
        </div>

        <aside
          id="csp-certification-exam"
          className="xl:sticky xl:top-4"
          aria-label={examLabels.title}
        >
          {examOpen || examPhase !== "idle" ? (
            <CertifiedSalesPartnerExamPanel
              labels={examLabels}
              locale={locale}
              autoStart
              compact
              onPhaseChange={setExamPhase}
            />
          ) : (
            <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">{examLabels.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--aipify-text-secondary)]">
                {examLabels.intro}
              </p>
              <button
                type="button"
                onClick={() => setExamOpen(true)}
                className="mt-5 inline-flex rounded-xl bg-[#7253EA] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5f42d1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--aipify-focus-ring)]"
              >
                {lessonsLabels.startExamCta}
              </button>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
