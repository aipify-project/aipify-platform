"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppVisualClasses } from "@/lib/design/app-visual-system";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import type { WebsiteKompisKnowledgeLabels } from "@/lib/website-kompis-knowledge/labels";
import type { WebsiteKompisKnowledgeSummary } from "@/lib/website-kompis-knowledge/load-summary";

export type KnowledgeCenterSection = "faq" | "pages" | "documents" | "followUp";

type WebsiteKompisKnowledgeCenterPanelProps = {
  labels: WebsiteKompisKnowledgeLabels;
  summary: WebsiteKompisKnowledgeSummary;
  faqPanel: ReactNode;
};

function formatWhen(value: string | null): string {
  if (!value) return "—";
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(parsed));
  } catch {
    return "—";
  }
}

function SectionButton({
  active,
  onClick,
  title,
  meta,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  meta: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[5.5rem] flex-col items-start rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)] ${
        active
          ? "border-[var(--app-border-accent)] bg-[var(--app-primary-soft)] shadow-[var(--app-shadow-card)]"
          : "border-[var(--app-border)] bg-[var(--app-card)] hover:border-[var(--app-border-accent)]"
      }`}
      aria-current={active ? "true" : undefined}
    >
      <span className="text-base font-semibold text-[var(--app-text)]">{title}</span>
      <span className="mt-1 text-sm text-[var(--app-text-muted)]">{meta}</span>
    </button>
  );
}

export function WebsiteKompisKnowledgeCenterPanel({
  labels,
  summary,
  faqPanel,
}: WebsiteKompisKnowledgeCenterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const raw = searchParams.get("section");
  const section: KnowledgeCenterSection =
    raw === "pages" || raw === "documents" || raw === "followUp" || raw === "faq"
      ? raw
      : "faq";

  function setSection(next: KnowledgeCenterSection) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "faq") params.delete("section");
    else params.set("section", next);
    // Preserve suggestQuestion flow from job 64 when landing on FAQ
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const faqMeta = summary.faqLoadOk
    ? `${summary.faq.published} ${labels.counts.published} · ${summary.faq.draft} ${labels.counts.draft}`
    : labels.counts.unavailable;

  const followUpCount = summary.faq.draft + summary.feedbackNeedsReview;

  return (
    <div className="space-y-6">
      <div className={`${AppVisualClasses.card} space-y-2 text-sm`}>
        <p className="text-[var(--app-text)]">{labels.neverAutoPublish}</p>
        <p className="text-[var(--app-text-muted)]">{labels.bedriftNotMixed}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SectionButton
          active={section === "faq"}
          onClick={() => setSection("faq")}
          title={labels.sections.faq}
          meta={faqMeta}
        />
        <SectionButton
          active={section === "pages"}
          onClick={() => setSection("pages")}
          title={labels.sections.pages}
          meta={labels.counts.unavailable}
        />
        <SectionButton
          active={section === "documents"}
          onClick={() => setSection("documents")}
          title={labels.sections.documents}
          meta={labels.counts.unavailable}
        />
        <SectionButton
          active={section === "followUp"}
          onClick={() => setSection("followUp")}
          title={labels.sections.followUp}
          meta={
            summary.faqLoadOk || summary.feedbackPersistenceReady
              ? String(followUpCount)
              : labels.counts.unavailable
          }
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`${FOUNDATION_NAV_BINDINGS.kompisWebFaq}?create=1`}
          className="inline-flex rounded-[var(--app-radius-md)] bg-[image:var(--app-primary-gradient)] px-3 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
        >
          {labels.createFaq}
        </Link>
        <Link
          href={`${FOUNDATION_NAV_BINDINGS.kompisWebFaq}?section=followUp`}
          className="inline-flex rounded-[var(--app-radius-md)] border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 text-sm font-medium text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
        >
          {labels.reviewDrafts}
        </Link>
        <Link
          href={`${FOUNDATION_NAV_BINDINGS.kompisWebQa}?vote=not_helpful`}
          className="inline-flex rounded-[var(--app-radius-md)] border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 text-sm font-medium text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
        >
          {labels.openFeedback}
        </Link>
        <Link
          href={FOUNDATION_NAV_BINDINGS.kompisWebConnection}
          className="inline-flex rounded-[var(--app-radius-md)] border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 text-sm font-medium text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
        >
          {labels.openConnection}
        </Link>
      </div>

      {section === "faq" ? (
        <section className="space-y-3" aria-labelledby="wk-kc-faq">
          <div>
            <h2 id="wk-kc-faq" className="text-lg font-semibold text-[var(--app-text)]">
              {labels.sections.faq}
            </h2>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">{labels.sectionHints.faq}</p>
            {summary.faqLoadOk ? (
              <p className="mt-2 text-sm text-[var(--app-text-muted)]">
                {labels.counts.published}: {summary.faq.published} · {labels.counts.draft}:{" "}
                {summary.faq.draft} · {labels.counts.archived}: {summary.faq.archived} ·{" "}
                {labels.counts.lastUpdated}: {formatWhen(summary.faq.lastUpdatedAt)}
              </p>
            ) : null}
          </div>
          {faqPanel}
        </section>
      ) : null}

      {section === "pages" ? (
        <section className={`${AppVisualClasses.card} space-y-2`} aria-labelledby="wk-kc-pages">
          <h2 id="wk-kc-pages" className="text-lg font-semibold text-[var(--app-text)]">
            {labels.pagesUnavailableTitle}
          </h2>
          <p className="text-sm text-[var(--app-text-muted)]">{labels.sectionHints.pages}</p>
          <p className="text-sm text-[var(--app-text-muted)]">{labels.pagesUnavailableBody}</p>
          <Link
            href={FOUNDATION_NAV_BINDINGS.kompisWebConnection}
            className="inline-flex text-sm font-medium text-[var(--app-primary-blue)] hover:text-[var(--app-primary)]"
          >
            {labels.openConnection}
          </Link>
        </section>
      ) : null}

      {section === "documents" ? (
        <section className={`${AppVisualClasses.card} space-y-2`} aria-labelledby="wk-kc-docs">
          <h2 id="wk-kc-docs" className="text-lg font-semibold text-[var(--app-text)]">
            {labels.documentsUnavailableTitle}
          </h2>
          <p className="text-sm text-[var(--app-text-muted)]">{labels.sectionHints.documents}</p>
          <p className="text-sm text-[var(--app-text-muted)]">{labels.documentsUnavailableBody}</p>
        </section>
      ) : null}

      {section === "followUp" ? (
        <section className="space-y-4" aria-labelledby="wk-kc-followup">
          <div>
            <h2 id="wk-kc-followup" className="text-lg font-semibold text-[var(--app-text)]">
              {labels.sections.followUp}
            </h2>
            <p className="mt-1 text-sm text-[var(--app-text-muted)]">{labels.sectionHints.followUp}</p>
          </div>
          {followUpCount === 0 ? (
            <div className={AppVisualClasses.card}>
              <p className="font-medium text-[var(--app-text)]">{labels.followUpEmptyTitle}</p>
              <p className="mt-1 text-sm text-[var(--app-text-muted)]">{labels.followUpEmptyBody}</p>
            </div>
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {summary.faq.draft > 0 ? (
                <li className={AppVisualClasses.card}>
                  <p className="text-sm font-medium text-[var(--app-text)]">{labels.followUpDrafts}</p>
                  <p className="mt-1 text-2xl font-semibold text-[var(--app-pending)]">
                    {summary.faq.draft}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSection("faq")}
                    className="mt-3 text-sm font-medium text-[var(--app-primary-blue)] hover:text-[var(--app-primary)]"
                  >
                    {labels.openFaqEditor}
                  </button>
                </li>
              ) : null}
              {summary.feedbackNeedsReview > 0 ? (
                <li className={AppVisualClasses.card}>
                  <p className="text-sm font-medium text-[var(--app-text)]">{labels.followUpFeedback}</p>
                  <p className="mt-1 text-2xl font-semibold text-[var(--app-pending)]">
                    {summary.feedbackNeedsReview}
                  </p>
                  <Link
                    href={`${FOUNDATION_NAV_BINDINGS.kompisWebQa}?vote=not_helpful`}
                    className="mt-3 inline-flex text-sm font-medium text-[var(--app-primary-blue)] hover:text-[var(--app-primary)]"
                  >
                    {labels.openFeedback}
                  </Link>
                </li>
              ) : null}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  );
}
