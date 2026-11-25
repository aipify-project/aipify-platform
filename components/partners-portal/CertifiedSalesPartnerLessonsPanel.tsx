import { KOMPIS_WEB_LESSONS, pickLocale } from "@/lib/certified-sales-partner/academy";

export type CspLessonsLabels = {
  title: string;
  intro: string;
  /** Template with {number}. */
  lessonNumber: string;
  plannedCatalogNote: string;
};

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** Lists the six Kompis Web lessons in the active locale. Pure presentation — no answers here. */
export function CertifiedSalesPartnerLessonsPanel({ labels, locale }: { labels: CspLessonsLabels; locale: string }) {
  const lessons = KOMPIS_WEB_LESSONS.slice().sort((a, b) => a.order - b.order);
  return (
    <section
      className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm"
      aria-labelledby="csp-lessons-title"
    >
      <h2 id="csp-lessons-title" className="text-lg font-semibold text-[color:var(--aipify-text-primary)]">
        {labels.title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[color:var(--aipify-text-secondary)]">{labels.intro}</p>
      <ol className="mt-4 grid gap-3">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <details className="group rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface-subtle)] p-4">
              <summary className="flex cursor-pointer list-none flex-wrap items-baseline gap-x-3 gap-y-1 text-[color:var(--aipify-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--aipify-focus-ring)]">
                <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-companion-purple)]">
                  {fill(labels.lessonNumber, { number: lesson.order })}
                </span>
                <span className="text-base font-semibold">{pickLocale(lesson.title, locale)}</span>
              </summary>
              <div className="mt-3 space-y-3 text-sm text-[color:var(--aipify-text-secondary)]">
                {lesson.body.map((paragraph, index) => (
                  <p key={`${lesson.id}-${index}`}>{pickLocale(paragraph, locale)}</p>
                ))}
                {lesson.containsPlannedCatalogFacts ? (
                  <p className="rounded-lg border border-[color:var(--aipify-border)] bg-[color:var(--aipify-canvas)] p-2 text-xs">
                    {labels.plannedCatalogNote}
                  </p>
                ) : null}
              </div>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
